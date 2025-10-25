-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'manager', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create user_complex_access table
CREATE TABLE public.user_complex_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  complex_id TEXT REFERENCES public.complexes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, complex_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_complex_access ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
$$;

-- Security definer function to check if user has access to a complex
CREATE OR REPLACE FUNCTION public.has_complex_access(_user_id UUID, _complex_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_complex_access
    WHERE user_id = _user_id AND complex_id = _complex_id
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_complex_access
CREATE POLICY "Users can view their own access"
  ON public.user_complex_access FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all access"
  ON public.user_complex_access FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all access"
  ON public.user_complex_access FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for complexes
DROP POLICY IF EXISTS "Allow public read access to complexes" ON public.complexes;
DROP POLICY IF EXISTS "Allow public update to complexes" ON public.complexes;
DROP POLICY IF EXISTS "Allow public delete from complexes" ON public.complexes;
DROP POLICY IF EXISTS "Allow public insert to complexes" ON public.complexes;

CREATE POLICY "Users can view complexes they have access to"
  ON public.complexes FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_complex_access(auth.uid(), id)
  );

CREATE POLICY "Managers and admins can update complexes"
  ON public.complexes FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR
    (public.get_user_role(auth.uid()) = 'manager' AND public.has_complex_access(auth.uid(), id))
  );

CREATE POLICY "Only admins can insert complexes"
  ON public.complexes FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete complexes"
  ON public.complexes FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for properties
DROP POLICY IF EXISTS "Allow public read access to properties" ON public.properties;
DROP POLICY IF EXISTS "Allow public update to properties" ON public.properties;
DROP POLICY IF EXISTS "Allow public delete from properties" ON public.properties;
DROP POLICY IF EXISTS "Allow public insert to properties" ON public.properties;

CREATE POLICY "Users can view properties in their complexes"
  ON public.properties FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_complex_access(auth.uid(), complex_id)
  );

CREATE POLICY "Managers and admins can update properties"
  ON public.properties FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR
    (public.get_user_role(auth.uid()) = 'manager' AND public.has_complex_access(auth.uid(), complex_id))
  );

CREATE POLICY "Managers and admins can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    (public.get_user_role(auth.uid()) = 'manager' AND public.has_complex_access(auth.uid(), complex_id))
  );

CREATE POLICY "Managers and admins can delete properties"
  ON public.properties FOR DELETE
  USING (
    public.has_role(auth.uid(), 'admin') OR
    (public.get_user_role(auth.uid()) = 'manager' AND public.has_complex_access(auth.uid(), complex_id))
  );

-- Update RLS policies for clients
DROP POLICY IF EXISTS "Allow public read access to clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public update to clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public delete from clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public insert to clients" ON public.clients;

CREATE POLICY "Authenticated users can view all clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers and admins can manage clients"
  ON public.clients FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.get_user_role(auth.uid()) = 'manager'
  );

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();