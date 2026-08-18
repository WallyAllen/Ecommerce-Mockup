-- Crear bucket público para productos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true);

-- Políticas para permitir a todos ver las imágenes
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'products' AND auth.role() = 'authenticated');
