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
  'Comision'?: string | number;
  'COMISION'?: string | number;
  [key: string]: any;
}

const parsePrice = (value: string | number | undefined): number => {
  if (value === undefined || value === null || value === '') return 0;
  let str = String(value).trim();
  // Remove currency symbols and spaces
  str = str.replace(/[€\s]/g, '');
  // Detect decimal separator by the rightmost separator
  const lastComma = str.lastIndexOf(',');
  const lastDot = str.lastIndexOf('.');
  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      // comma is decimal, dots are thousands
      str = str.replace(/\./g, '');
      const parts = str.split(',');
      const dec = parts.pop();
      str = parts.join('') + '.' + (dec ?? '0');
    } else {
      // dot is decimal, commas are thousands
      str = str.replace(/,/g, '');
    }
  } else if (lastComma !== -1) {
    // only comma present, treat as decimal
    str = str.replace(/,/g, '.');
  } else {
    // only dots or plain number
    // remove thousands separators if any ambiguous
    const matches = str.match(/\./g);
    if (matches && matches.length > 1) {
      str = str.replace(/\./g, '');
    }
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

const parseArea = (value: string | number | undefined): number => {
  if (value === undefined || value === null || value === '') return 0;
  // replace comma decimal with dot
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

const extractPrice = (row: RawProperty): number => {
  const knownKeys = [
    'Pret', 'Preț', 'PRET', 'Pret EUR', 'Preț EUR', 'PRET EUR',
    'Pret Credit', 'Pret Cash'
  ];
  for (const key of knownKeys) {
    if (row[key] !== undefined) {
      const v = parsePrice(row[key]);
      if (v) return v;
    }
  }
  for (const key in row) {
    if (/pret/i.test(key)) {
      const v = parsePrice((row as any)[key]);
      if (v) return v;
    }
  }
  return 0;
};

const extractArea = (row: RawProperty): number => {
  const knownKeys = ['Suprafata Utila', 'Suprafață Utilă', 'mpUtili', 'mp', 'MP'];
  for (const key of knownKeys) {
    if (row[key] !== undefined) {
      const v = parseArea(row[key]);
      if (v) return v;
    }
  }
  for (const key in row) {
    if (/(supraf|mp)/i.test(key)) {
      const v = parseArea((row as any)[key]);
      if (v) return v;
    }
  }
  return 0;
};

const extractCommission = (row: RawProperty): number => {
  const knownKeys = [
    'Comision',
    'COMISION',
    'comision'
  ];
  
  for (const key of knownKeys) {
    const val = row[key];
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      return parsePrice(val);
    }
  }
  
  // Try case-insensitive search for 'comision'
  for (const key in row) {
    if (key.toLowerCase().includes('comision')) {
      const val = row[key];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        return parsePrice(val);
      }
    }
  }
  
  return 0;
};

const determineStatus = (row: RawProperty): string => {
  const client = String(row.Client || '').trim().toLowerCase();
  const agent = String(row.Agent || '').trim().toLowerCase();
  const observatii = String((row as any).Observatii || (row as any)['Observații'] || '').trim().toLowerCase();
  
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
    const response = await fetch('/data/viilor33-data.xlsx');
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
        
        const suprafata = extractArea(row);
        const pret = extractPrice(row);
        const comision = extractCommission(row);
        
        console.log(`Processing AP ${nrAp}: suprafata=${suprafata}, pret=${pret}, comision=${comision}`);
        
        // Skip only if both are missing
        if (suprafata === 0 && pret === 0) return;
        
        const property = {
          corp: `BLOC ${corp}`,
          etaj: currentFloor,
          nrAp: nrAp,
          suprafata: suprafata,
          pret: pret,
          Comision: comision > 0 ? `${comision}€` : '',
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
