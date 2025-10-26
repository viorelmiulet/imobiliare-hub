import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  organization?: string;
  created_at?: string;
  updated_at?: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Eroare la încărcarea clienților');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .insert(client);

      if (error) throw error;
      
      await fetchClients();
      toast.success('Client adăugat cu succes');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Eroare la adăugarea clientului');
      throw error;
    }
  };

  const updateClient = async (id: string, client: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', id);

      if (error) throw error;
      
      await fetchClients();
      toast.success('Client actualizat cu succes');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Eroare la actualizarea clientului');
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchClients();
      toast.success('Client șters cu succes');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Eroare la ștergerea clientului');
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
};
