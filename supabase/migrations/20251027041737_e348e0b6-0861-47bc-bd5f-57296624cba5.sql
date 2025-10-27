-- Allow public (unauthenticated) users to view complexes
CREATE POLICY "Public users can view all complexes"
ON public.complexes
FOR SELECT
TO anon
USING (true);

-- Allow public (unauthenticated) users to view properties but without client details
CREATE POLICY "Public users can view all properties"
ON public.properties
FOR SELECT
TO anon
USING (true);

-- Ensure clients table remains protected (no public access)
-- The existing RLS policies already restrict access to authenticated users only