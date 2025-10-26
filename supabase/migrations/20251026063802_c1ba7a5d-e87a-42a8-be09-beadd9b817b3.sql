-- Add organization field to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS organization TEXT;