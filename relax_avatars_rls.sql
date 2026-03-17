-- Políticas de Segurança (RLS) para o Storage (Upload de Avatares)

-- 1. Remove políticas anteriores do bucket avatars se existirem
DROP POLICY IF EXISTS "Avatars: Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: Allow authenticated deletes" ON storage.objects;

-- 2. Permite inserção (upload) de arquivos no bucket 'avatars'
CREATE POLICY "Avatars: Allow authenticated uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'avatars');

-- 3. Permite leitura (visualização) de arquivos do bucket 'avatars'
CREATE POLICY "Avatars: Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 4. Permite atualização de arquivos do bucket 'avatars'
CREATE POLICY "Avatars: Allow authenticated updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'avatars');

-- 5. Permite exclusão de arquivos do bucket 'avatars'
CREATE POLICY "Avatars: Allow authenticated deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'avatars');
