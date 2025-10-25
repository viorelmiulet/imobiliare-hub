import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface RawProperty {
  'Nr. ap.'?: string | number;
  'Suprafata Utila'?: string | number;
  'Suprafață Utilă'?: string | number;
  'Pret'?: string | number;
  'Preț'?: string | number;
  'PRET'?: string | number;
  'Client'?: string;
  'Agent'?: string;
  'Observatii'?: string;
  'Observații'?: string;
  [key: string]: any;
}

const parsePrice = (value: string | number | undefined): number => {
  if (!value) return 0;
  const str = String(value).replace(/[€\s]/g, '').replace(/,/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

const parseArea = (value: string | number | undefined): number => {
  if (!value) return 0;
  const num = parseFloat(String(value).replace(/,/g, '.'));
  return isNaN(num) ? 0 : num;
};

const normalizeFloor = (floor: string): string => {
  const upperFloor = floor.toUpperCase().trim();
  if (upperFloor === 'D') return 'DEMISOL';
  if (upperFloor === 'P') return 'PARTER';
  if (upperFloor === 'E1') return 'ETAJ 1';
  if (upperFloor === 'E2') return 'ETAJ 2';
  if (upperFloor === 'E3') return 'ETAJ 3';
  return upperFloor;
};

const determineStatus = (row: RawProperty): string => {
  const client = String(row.Client || '').trim().toLowerCase();
  const agent = String(row.Agent || '').trim().toLowerCase();
  const observatii = String(row.Observatii || '').trim().toLowerCase();
  
  if (client && client !== '' && !client.includes('disponibil')) {
    return 'vandut';
  }
  if (observatii.includes('rezervat') || agent.includes('rezervat')) {
    return 'rezervat';
  }
  return 'disponibil';
};

export const importViilor33Data = async () => {
  try {
    console.log('Starting Viilor 33 data import...');
    
    // Fetch Excel file
    const response = await fetch('/src/data/viilor33-data.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const properties: any[] = [];
    let currentFloor = '';
    let corp = 1;
    
    // Process each sheet (Bloc 8 and Bloc 9)
    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
      corp = sheetIndex + 8; // Bloc 8 and Bloc 9
      const sheet = workbook.Sheets[sheetName];
      const jsonData: RawProperty[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      
      console.log(`Processing Bloc ${corp} with ${jsonData.length} rows`);
      
      jsonData.forEach((row) => {
        const nrAp = String(row['Nr. ap.'] || '').trim();
        
        // Check if this is a floor marker
        if (nrAp && ['D', 'P', 'E1', 'E2', 'E3'].includes(nrAp.toUpperCase())) {
          currentFloor = normalizeFloor(nrAp);
          console.log(`Floor marker found: ${currentFloor}`);
          return;
        }
        
        // Skip rows without apartment number
        if (!nrAp || nrAp === '') return;
        
        // Try multiple column name variations for area
        const suprafata = parseArea(row['Suprafata Utila'] || row['Suprafață Utilă']);
        
        // Try multiple column name variations for price
        const pret = parsePrice(row['Pret'] || row['Preț'] || row['PRET']);
        
        console.log(`Processing AP ${nrAp}: suprafata=${suprafata}, pret=${pret}`);
        
        // Skip if no valid data (must have at least area)
        if (suprafata === 0) return;
        
        const property = {
          corp: `BLOC ${corp}`,
          etaj: currentFloor,
          nrAp: nrAp,
          suprafata: suprafata,
          pret: pret,
          client: String(row.Client || '').trim(),
          agent: String(row.Agent || '').trim(),
          observatii: String(row.Observatii || row['Observații'] || '').trim(),
          status: determineStatus(row)
        };
        
        properties.push(property);
        console.log(`Added property: ${property.corp} - ${property.etaj} - AP ${property.nrAp}`);
      });
    });
    
    console.log(`Total properties to import: ${properties.length}`);
    
    // Delete existing properties for this complex
    console.log('Deleting existing properties...');
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('complex_id', 'complex-viilor33');
    
    if (deleteError) {
      console.error('Error deleting existing properties:', deleteError);
      throw deleteError;
    }
    
    // Insert new properties
    console.log('Inserting new properties...');
    const { error: insertError } = await supabase
      .from('properties')
      .insert(
        properties.map(prop => ({
          complex_id: 'complex-viilor33',
          data: prop,
          client_id: null
        }))
      );
    
    if (insertError) {
      console.error('Error inserting properties:', insertError);
      throw insertError;
    }
    
    // Update complex stats
    const available = properties.filter(p => p.status === 'disponibil').length;
    
    console.log('Updating complex statistics...');
    const { error: statsError } = await supabase
      .from('complexes')
      .update({
        total_properties: properties.length,
        available_properties: available
      })
      .eq('id', 'complex-viilor33');
    
    if (statsError) {
      console.error('Error updating stats:', statsError);
      throw statsError;
    }
    
    console.log(`Import completed successfully! ${properties.length} properties imported.`);
    return { success: true, count: properties.length };
    
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};
