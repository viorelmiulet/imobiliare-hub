import * as XLSX from 'xlsx';
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/property";

const parsePrice = (price: string | number | undefined): number => {
  if (!price) return 0;
  if (typeof price === 'number') return price;
  const cleanedPrice = price.toString().replace(/,/g, '').replace(/\s/g, '');
  return parseFloat(cleanedPrice) || 0;
};

const determineStatus = (nume: string): "disponibil" | "rezervat" | "vandut" => {
  const numeText = (nume || "").toLowerCase().trim();
  
  if (numeText === "rezervat" || numeText.includes("rezervat")) {
    return "rezervat";
  }
  if (numeText && numeText !== "") {
    return "vandut";
  }
  return "disponibil";
};

export const importEurocasaScara6Data = async () => {
  try {
    const response = await fetch('/data/eurocasa-scara6-data.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // Find the header row (the one with ETAJ, NR AP, etc.)
    let headerRowIndex = -1;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row[0] === 'ETAJ' && row[1] === 'NR AP') {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      throw new Error('Nu s-a găsit capul de tabel');
    }

    const headers = jsonData[headerRowIndex];
    console.log('Headers found:', headers);

    // First, check if complex exists, if not create it
    const complexId = 'eurocasa-scara6';
    const { data: existingComplex } = await supabase
      .from('complexes')
      .select('*')
      .eq('id', complexId)
      .single();

    if (!existingComplex) {
      const { error: complexError } = await supabase
        .from('complexes')
        .insert({
          id: complexId,
          name: 'Eurocasa Scara 6',
          location: 'București',
          description: 'Complex rezidențial Eurocasa Scara 6',
          total_properties: 0,
          available_properties: 0,
          image: '/images/eurocasa-scara-6.webp',
          column_schema: [
            { key: "etaj", label: "Etaj", type: "text" },
            { key: "nrAp", label: "Nr. Apartament", type: "text" },
            { key: "tipCom", label: "Tip Compartiment", type: "text" },
            { key: "mpUtili", label: "Suprafață (mp)", type: "number" },
            { key: "pretCuTva", label: "Preț Credit", type: "number" },
            { key: "avans50", label: "Avans 50%", type: "number" },
            { key: "avans80", label: "Avans 80%", type: "number" },
            { key: "nume", label: "Nume Client", type: "text" },
            { key: "agent", label: "Agent", type: "text" },
            { key: "status", label: "Status", type: "status" }
          ]
        });

      if (complexError) {
        console.error('Error creating complex:', complexError);
        throw complexError;
      }
    }

    // Delete existing properties for this complex
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('complex_id', complexId);

    if (deleteError) {
      console.error('Error deleting existing properties:', deleteError);
    }

    const properties: Property[] = [];
    let currentEtaj = '';

    // Process data rows (skip header row and process the rest)
    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      // Skip empty rows
      const hasData = row.some(cell => cell !== undefined && cell !== null && cell !== '');
      if (!hasData) continue;

      // Update current floor if we find a floor indicator
      if (row[0] && typeof row[0] === 'string' && 
          (row[0].includes('DEMISOL') || row[0].includes('PARTER') || row[0].includes('ETAJ'))) {
        currentEtaj = row[0].trim();
        continue; // Skip this row as it's just a floor marker
      }

      // Process property row (only if we have an apartment number)
      if (row[1]) { // NR AP column
        const creditValue = parsePrice(row[4]);
        const avans50Value = parsePrice(row[5]);
        const avans80Value = parsePrice(row[6]);
        
        const property: Property = {
          id: `es6-${i}`,
          etaj: currentEtaj,
          nrAp: row[1]?.toString() || '',
          tipCom: row[2]?.toString() || '',
          mpUtili: parsePrice(row[3]), // Changed from suprafata to mpUtili for consistency
          pretCuTva: creditValue || avans50Value || avans80Value, // Use credit if available, otherwise fallback to avans values
          credit: creditValue,
          avans50: avans50Value,
          avans80: avans80Value,
          nume: row[7]?.toString() || '',
          agent: row[8]?.toString() || '',
          status: determineStatus(row[7]?.toString() || '')
        };

        properties.push(property);
      }
    }

    console.log(`Processed ${properties.length} properties`);

    // Insert properties in batches
    const batchSize = 50;
    for (let i = 0; i < properties.length; i += batchSize) {
      const batch = properties.slice(i, i + batchSize);
      const formattedBatch = batch.map(prop => ({
        complex_id: complexId,
        data: prop
      }));

      const { error: insertError } = await supabase
        .from('properties')
        .insert(formattedBatch);

      if (insertError) {
        console.error('Error inserting batch:', insertError);
        throw insertError;
      }
    }

    // Update complex stats
    const availableCount = properties.filter(p => p.status === "disponibil").length;
    const { error: updateError } = await supabase
      .from('complexes')
      .update({
        total_properties: properties.length,
        available_properties: availableCount
      })
      .eq('id', complexId);

    if (updateError) {
      console.error('Error updating complex stats:', updateError);
    }

    return {
      success: true,
      count: properties.length,
      available: availableCount
    };
  } catch (error) {
    console.error('Error importing Eurocasa Scara 6 data:', error);
    throw error;
  }
};
