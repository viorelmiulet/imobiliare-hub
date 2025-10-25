-- Function to check if a user has access to a client
-- A user has access to a client if they have access to any complex where this client has properties
CREATE OR REPLACE FUNCTION public.has_client_access(_user_id uuid, _client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.client_id = _client_id
    AND (
      -- User is admin
      public.has_role(_user_id, 'admin'::app_role)
      -- OR user has access to the complex where this client has properties
      OR public.has_complex_access(_user_id, p.complex_id)
    )
  )
$$;

-- Drop existing policies on clients table
DROP POLICY IF EXISTS "Authenticated users can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Managers and admins can manage clients" ON public.clients;

-- New policy: Users can only view clients they have access to
CREATE POLICY "Users can view clients with complex access"
ON public.clients
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_client_access(auth.uid(), id)
);

-- New policy: Managers and admins can insert clients (but managers will only see them if they have properties in their complexes)
CREATE POLICY "Managers and admins can insert clients"
ON public.clients
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.get_user_role(auth.uid()) = 'manager'::app_role
);

-- New policy: Users can only update clients they have access to
CREATE POLICY "Users can update clients with complex access"
ON public.clients
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_client_access(auth.uid(), id)
);

-- New policy: Users can only delete clients they have access to
CREATE POLICY "Users can delete clients with complex access"
ON public.clients
FOR DELETE
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_client_access(auth.uid(), id)
);