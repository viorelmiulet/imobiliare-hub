-- Create enum for access levels
CREATE TYPE public.access_level AS ENUM ('read', 'write');

-- Add access_level column to user_complex_access
ALTER TABLE public.user_complex_access 
ADD COLUMN access_level public.access_level NOT NULL DEFAULT 'read';

-- Create function to check write access to a complex
CREATE OR REPLACE FUNCTION public.has_write_access(_user_id uuid, _complex_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_complex_access
    WHERE user_id = _user_id 
      AND complex_id = _complex_id
      AND access_level = 'write'
  )
$$;

-- Update properties RLS policies for more granular access
DROP POLICY IF EXISTS "Managers and admins can update properties" ON public.properties;
DROP POLICY IF EXISTS "Managers and admins can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Managers and admins can delete properties" ON public.properties;

CREATE POLICY "Users with write access can update properties" 
ON public.properties 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_write_access(auth.uid(), complex_id)
);

CREATE POLICY "Users with write access can insert properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_write_access(auth.uid(), complex_id)
);

CREATE POLICY "Users with write access can delete properties" 
ON public.properties 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_write_access(auth.uid(), complex_id)
);

-- Update complexes RLS policies
DROP POLICY IF EXISTS "Managers and admins can update complexes" ON public.complexes;

CREATE POLICY "Users with write access can update complexes" 
ON public.complexes 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_write_access(auth.uid(), id)
);