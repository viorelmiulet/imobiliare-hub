import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface RawProperty {
  'Nr. ap.'?: string | number;
  'Suprafata Utila'?: string | number;
  'Pret'?: string | number;
  'Client'?: string;
  'Agent'?: string;
  'Observatii'?: string;
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
    
    // Process each sheet (Corp 1 and Corp 2)
    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
      corp = sheetIndex + 1;
      const sheet = workbook.Sheets[sheetName];
      const jsonData: RawProperty[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      
      console.log(`Processing Corp ${corp} with ${jsonData.length} rows`);
      
      jsonData.forEach((row) => {
        const nrAp = String(row['Nr. ap.'] || '').trim();
        
        // Check if this is a floor marker
        if (nrAp && ['D', 'P', 'E1', 'E2', 'E3'].includes(nrAp.toUpperCase())) {
          currentFloor = nrAp.toUpperCase();
          console.log(`Floor marker found: ${currentFloor}`);
          return;
        }
        
        // Skip rows without apartment number
        if (!nrAp || nrAp === '') return;
        
        const suprafata = parseArea(row['Suprafata Utila']);
        const pret = parsePrice(row['Pret']);
        
        // Skip if no valid data
        if (suprafata === 0 && pret === 0) return;
        
        const property = {
          corp: `CORP ${corp}`,
          etaj: currentFloor,
          nrAp: nrAp,
          suprafata: suprafata,
          pret: pret,
          client: String(row.Client || '').trim(),
          agent: String(row.Agent || '').trim(),
          observatii: String(row.Observatii || '').trim(),
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
