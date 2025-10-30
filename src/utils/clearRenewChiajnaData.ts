import { supabase } from "@/integrations/supabase/client";

export const clearRenewChiajnaData = async () => {
  try {
    // Delete all properties for Renew Chiajna complex
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('complex_id', 'complex-3');

    if (deleteError) {
      console.error('Error deleting properties:', deleteError);
      throw deleteError;
    }

    // Update complex stats to 0
    const { error: updateError } = await supabase
      .from('complexes')
      .update({
        total_properties: 0,
        available_properties: 0
      })
      .eq('id', 'complex-3');

    if (updateError) {
      console.error('Error updating complex stats:', updateError);
      throw updateError;
    }

    return {
      success: true,
      message: 'Toate datele au fost șterse din Renew Chiajna'
    };
  } catch (error) {
    console.error('Error clearing Renew Chiajna data:', error);
    throw error;
  }
};
