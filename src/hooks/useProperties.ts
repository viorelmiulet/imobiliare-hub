import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Property } from '@/types/property';

export const useProperties = (complexId: string) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          clients (
            name
          )
        `)
        .eq('complex_id', complexId);

      if (error) throw error;
      
      // Transform from database format to Property format
      const transformedData = (data || []).map(row => ({
        id: row.id,
        client_id: row.client_id,
        clientName: row.clients?.name,
        ...(row.data as Record<string, any>)
      }));
      
      setProperties(transformedData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Eroare la încărcarea proprietăților');
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (property: Property) => {
    try {
      const { id, client_id, clientName, ...data } = property;
      
      const { error } = await supabase
        .from('properties')
        .insert({
          complex_id: complexId,
          client_id: client_id || null,
          data: data
        });

      if (error) throw error;
      
      await fetchProperties();
      await updateComplexStats();
      toast.success('Proprietate adăugată cu succes');
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Eroare la adăugarea proprietății');
    }
  };

  const updateProperty = async (property: Property) => {
    try {
      const { id, client_id, clientName, ...data } = property;
      
      const { error } = await supabase
        .from('properties')
        .update({ 
          data,
          client_id: client_id || null
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchProperties();
      await updateComplexStats();
      toast.success('Proprietate actualizată cu succes');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Eroare la actualizarea proprietății');
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProperties();
      await updateComplexStats();
      toast.success('Proprietate ștearsă cu succes');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Eroare la ștergerea proprietății');
    }
  };

  const updateComplexStats = async () => {
    try {
      // Fetch all properties to calculate stats
      const { data, error } = await supabase
        .from('properties')
        .select('data')
        .eq('complex_id', complexId);

      if (error) throw error;

      const total = data?.length || 0;
      const available = data?.filter(p => {
        const propertyData = p.data as Record<string, any>;
        const status = propertyData.status || propertyData.Status || 'disponibil';
        return status.toLowerCase() === 'disponibil';
      }).length || 0;

      await supabase
        .from('complexes')
        .update({
          total_properties: total,
          available_properties: available
        })
        .eq('id', complexId);
    } catch (error) {
      console.error('Error updating complex stats:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [complexId]);

  return {
    properties,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchProperties,
  };
};
