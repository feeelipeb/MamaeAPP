-- Políticas de Segurança (RLS) para o Storage (Upload de Fotos)

-- 1. Remove políticas anteriores se existirem (para evitar duplicatas)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- 2. Permite inserção (upload) de arquivos no bucket 'children-photos'
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'children-photos');

-- 3. Permite leitura (visualização) de arquivos do bucket 'children-photos'
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'children-photos');

-- 4. Permite atualização de arquivos do bucket 'children-photos'
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'children-photos');

-- 5. Permite exclusão de arquivos do bucket 'children-photos'
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'children-photos');
