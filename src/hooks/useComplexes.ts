import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Complex {
  id: string;
  name: string;
  location: string;
  description: string;
  total_properties: number;
  available_properties: number;
  image?: string;
  commission_type?: 'fixed' | 'percentage';
  commission_value?: number;
}

export const useComplexes = () => {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplexes = async () => {
    try {
      const { data, error } = await supabase
        .from('complexes')
        .select('*')
        .order('name');

      if (error) throw error;
      setComplexes(data || []);
    } catch (error) {
      console.error('Error fetching complexes:', error);
      toast.error('Eroare la încărcarea complexurilor');
    } finally {
      setLoading(false);
    }
  };

  const updateComplex = async (id: string, updates: Partial<Complex>) => {
    try {
      const { error } = await supabase
        .from('complexes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchComplexes();
      toast.success('Complex actualizat cu succes');
    } catch (error) {
      console.error('Error updating complex:', error);
      toast.error('Eroare la actualizarea complexului');
    }
  };

  useEffect(() => {
    fetchComplexes();
  }, []);

  return {
    complexes,
    loading,
    updateComplex,
    refetch: fetchComplexes,
  };
};
