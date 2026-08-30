-- Crear bucket público para productos (si no existe)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Borrar políticas viejas si existieran para evitar conflictos
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Políticas para permitir a todos ver las imágenes (SELECT)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

-- Políticas para permitir solo al admin modificar imágenes (INSERT, UPDATE, DELETE)
CREATE POLICY "Admin users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'products' AND 
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'email') = 'fjborrazas3@gmail.com'
);

CREATE POLICY "Admin users can update" 
ON storage.objects FOR UPDATE 
WITH CHECK (
    bucket_id = 'products' AND 
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'email') = 'fjborrazas3@gmail.com'
);

CREATE POLICY "Admin users can delete" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'products' AND 
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'email') = 'fjborrazas3@gmail.com'
);
