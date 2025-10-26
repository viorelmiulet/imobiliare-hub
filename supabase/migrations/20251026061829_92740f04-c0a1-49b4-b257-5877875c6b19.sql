-- Add commission type enum
CREATE TYPE public.commission_type AS ENUM ('fixed', 'percentage');

-- Add commission fields to complexes table
ALTER TABLE public.complexes
ADD COLUMN commission_type public.commission_type DEFAULT 'percentage',
ADD COLUMN commission_value numeric DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN public.complexes.commission_type IS 'Type of commission: fixed (suma fixa) or percentage (procent)';
COMMENT ON COLUMN public.complexes.commission_value IS 'Commission value: amount in EUR for fixed, percentage for percentage type';