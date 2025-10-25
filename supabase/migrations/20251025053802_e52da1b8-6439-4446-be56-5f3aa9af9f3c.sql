-- Create storage bucket for Excel files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'excel-imports',
  'excel-imports',
  false,
  20971520, -- 20MB limit
  ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
);

-- Allow anyone to upload Excel files
CREATE POLICY "Allow Excel uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'excel-imports');

-- Allow anyone to read their uploaded files
CREATE POLICY "Allow reading Excel files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'excel-imports');