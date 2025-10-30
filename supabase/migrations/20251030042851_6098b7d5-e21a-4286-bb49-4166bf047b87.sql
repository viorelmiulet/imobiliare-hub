-- Add column_schema to complexes table to store Excel column structure
ALTER TABLE public.complexes 
ADD COLUMN IF NOT EXISTS column_schema JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.complexes.column_schema IS 'Stores the Excel column headers for this complex';