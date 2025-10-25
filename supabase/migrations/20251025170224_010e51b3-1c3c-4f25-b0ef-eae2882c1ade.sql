-- Add client_id column to properties table
ALTER TABLE public.properties 
ADD COLUMN client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_properties_client_id ON public.properties(client_id);