-- Create complexes table
CREATE TABLE public.complexes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  total_properties INTEGER DEFAULT 0,
  available_properties INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complex_id TEXT NOT NULL REFERENCES public.complexes(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_complex_id ON public.properties(complex_id);
CREATE INDEX idx_properties_data ON public.properties USING GIN(data);

-- Enable Row Level Security
ALTER TABLE public.complexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to complexes"
  ON public.complexes
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to properties"
  ON public.properties
  FOR SELECT
  USING (true);

-- Create policies for public write access (can be restricted later with authentication)
CREATE POLICY "Allow public insert to complexes"
  ON public.complexes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to complexes"
  ON public.complexes
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete from complexes"
  ON public.complexes
  FOR DELETE
  USING (true);

CREATE POLICY "Allow public insert to properties"
  ON public.properties
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to properties"
  ON public.properties
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete from properties"
  ON public.properties
  FOR DELETE
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_complexes_updated_at
  BEFORE UPDATE ON public.complexes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();