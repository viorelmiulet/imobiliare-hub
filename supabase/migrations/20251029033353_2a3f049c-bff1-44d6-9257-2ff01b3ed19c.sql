-- Create storage bucket for property plans
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-plans', 'property-plans', true);

-- Create RLS policies for property plans bucket
CREATE POLICY "Anyone can view property plans"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-plans');

CREATE POLICY "Authenticated users can upload property plans"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-plans' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update property plans"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-plans' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete property plans"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-plans' 
  AND auth.role() = 'authenticated'
);