import * as XLSX from 'xlsx';
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/property";

const parsePrice = (price: string | number | undefined): number => {
  if (!price) return 0;
  if (typeof price === 'number') return price;
  const cleanedPrice = price.toString().replace(/€/g, '').replace(/,/g, '').replace(/\s/g, '');
  return parseFloat(cleanedPrice) || 0;
};

const determineStatus = (client: string): "disponibil" | "rezervat" | "vandut" => {
  const clientText = (client || "").trim();
  
  if (clientText && clientText !== "") {
    return "vandut";
  }
  return "disponibil";
};

export const importRenewChiajna2Data = async () => {
  try {
    const response = await fetch('/data/renew-chiajna-2.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // Find the header row
    let headerRowIndex = -1;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row[0] === 'Nr. ap.') {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      throw new Error('Nu s-a găsit capul de tabel');
    }

    const properties: Property[] = [];
    let currentEtaj = '';

    // Process data rows
    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      // Skip empty rows
      const hasData = row.some(cell => cell !== undefined && cell !== null && cell !== '');
      if (!hasData) continue;

      // Check if this is an etaj marker (P, E1, E2, etc.)
      const firstCell = row[0]?.toString().trim();
      if (firstCell && (firstCell === 'P' || firstCell.match(/^E\d+$/))) {
        currentEtaj = firstCell === 'P' ? 'PARTER' : `ETAJ ${firstCell.substring(1)}`;
        continue;
      }

      // Process property row (only if we have an apartment number)
      if (row[0]) {
        const nrAp = row[0]?.toString() || '';
        const tipApartament = row[1]?.toString() || '';
        const suprafata = parseFloat(row[2]?.toString() || '0');
        const pretCredit = parsePrice(row[3]);
        const pretCash = parsePrice(row[4]);
        const client = row[5]?.toString() || '';
        const agent = row[6]?.toString() || '';
        const comision = row[7]?.toString() || '';
        const observatii = row[8]?.toString() || '';

        const property: Property = {
          id: `rc2-${i}`,
          etaj: currentEtaj,
          nrAp: nrAp,
          tipCom: tipApartament,
          mpUtili: suprafata,
          pretCuTva: pretCredit,
          pretCash: pretCash,
          nume: client,
          agent: agent,
          comision: comision,
          observatii: observatii,
          status: determineStatus(client)
        };

        properties.push(property);
      }
    }

    console.log(`Processed ${properties.length} properties`);

    // Delete existing properties for Renew Chiajna
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('complex_id', 'complex-3');

    if (deleteError) {
      console.error('Error deleting existing properties:', deleteError);
    }

    // Insert properties in batches
    const batchSize = 50;
    for (let i = 0; i < properties.length; i += batchSize) {
      const batch = properties.slice(i, i + batchSize);
      const formattedBatch = batch.map(prop => ({
        complex_id: 'complex-3',
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
      .eq('id', 'complex-3');

    if (updateError) {
      console.error('Error updating complex stats:', updateError);
    }

    return {
      success: true,
      count: properties.length,
      available: availableCount
    };
  } catch (error) {
    console.error('Error importing Renew Chiajna 2 data:', error);
    throw error;
  }
};
