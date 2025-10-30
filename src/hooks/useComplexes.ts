import { useState, useEffect, useCallback } from 'react';
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
  column_schema?: string[];
}

export const useComplexes = () => {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplexes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('complexes')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Map the data to ensure column_schema is properly typed
      const mappedData = (data || []).map(complex => ({
        ...complex,
        column_schema: Array.isArray(complex.column_schema) 
          ? complex.column_schema as string[]
          : []
      }));
      
      setComplexes(mappedData);
    } catch (error) {
      console.error('Error fetching complexes:', error);
      toast.error('Eroare la încărcarea complexurilor');
    } finally {
      setLoading(false);
    }
  }, []);

  const addComplex = useCallback(async (complex: Omit<Complex, 'total_properties' | 'available_properties'>) => {
    try {
      const { error } = await supabase
        .from('complexes')
        .insert({
          id: complex.id,
          name: complex.name,
          location: complex.location,
          description: complex.description,
          image: complex.image,
          commission_type: complex.commission_type || 'percentage',
          commission_value: complex.commission_value || 0,
          total_properties: 0,
          available_properties: 0,
        });

      if (error) throw error;
      
      await fetchComplexes();
      toast.success('Complex creat cu succes');
    } catch (error) {
      console.error('Error adding complex:', error);
      toast.error('Eroare la crearea complexului');
      throw error;
    }
  }, [fetchComplexes]);

  const updateComplex = useCallback(async (id: string, updates: Partial<Complex>) => {
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
  }, [fetchComplexes]);

  const deleteComplex = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('complexes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchComplexes();
      toast.success('Complex șters cu succes');
    } catch (error) {
      console.error('Error deleting complex:', error);
      toast.error('Eroare la ștergerea complexului');
      throw error;
    }
  }, [fetchComplexes]);

  useEffect(() => {
    fetchComplexes();
  }, []);

  return {
    complexes,
    loading,
    addComplex,
    updateComplex,
    deleteComplex,
    refetch: fetchComplexes,
  };
};
