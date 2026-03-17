-- =====================================================
-- MamãeApp — Hardened Storage RLS
-- Protege fotos e avatares restringindo acesso ao dono.
-- =====================================================

-- 1. BUCKET: avatars (O usuário só mexe na própria foto)
-- Nota: Para uploads de avatares, o caminho costuma ser 'id_do_usuario/file.png'
DROP POLICY IF EXISTS "Avatars: Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Avatars: Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Avatars: Allow authenticated updates" ON storage.objects;
CREATE POLICY "Avatars: Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Avatars: Allow authenticated deletes" ON storage.objects;
CREATE POLICY "Avatars: Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. BUCKET: children-photos (O usuário só mexe nas fotos dos próprios filhos)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'children-photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'children-photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'children-photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. LEITURA (SELECT) continua pública para facilitar exibição de fotos
-- mas limitada a buckets conhecidos.
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('avatars', 'children-photos'));
