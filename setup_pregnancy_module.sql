-- ==============================================================================
-- 🤰 MAMÃE APP — DIÁRIO DE GESTAÇÃO (MIGRATION SCRIPT)
-- ==============================================================================

-- 1. MODIFICAR A TABELA EXISTENTE 'pregnancies' ================================
-- Adicionando os novos campos necessários sem quebrar os dados atuais.
ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS conception_date DATE;
ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS discovery_date DATE;
ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS test_photo_url TEXT;
ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed'));
ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS year_label TEXT;

-- 2. CRIAR TABELA 'pregnancy_diary_entries' ===================================
CREATE TABLE IF NOT EXISTS pregnancy_diary_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pregnancy_id UUID NOT NULL REFERENCES pregnancies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    emotional_note TEXT,
    symptoms JSONB DEFAULT '[]'::jsonb,
    belly_photo_url TEXT,
    first_movement_date DATE,
    first_movement_note TEXT,
    cravings TEXT,
    aversions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    -- Uma entrada por semana por gestação
    UNIQUE(pregnancy_id, week_number)
);

-- 3. CRIAR TABELA 'prenatal_appointments' =====================================
CREATE TABLE IF NOT EXISTS prenatal_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pregnancy_id UUID NOT NULL REFERENCES pregnancies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    doctor_name TEXT,
    appointment_type TEXT NOT NULL,
    notes TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. CRIAR TABELA 'birth_plans' ================================================
CREATE TABLE IF NOT EXISTS birth_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pregnancy_id UUID NOT NULL REFERENCES pregnancies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
    answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    -- Apenas um plano por gestação
    UNIQUE(pregnancy_id) 
);

-- ==============================================================================
-- POLÍTICAS DE SEGURANÇA (RLS - ROW LEVEL SECURITY)
-- ==============================================================================

-- Habilitar RLS nas tabelas novas
ALTER TABLE pregnancy_diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE prenatal_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE birth_plans ENABLE ROW LEVEL SECURITY;
-- Certificar-se que a 'pregnancies' está habilitada 
ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;

---------------------------------------------------------------------------------
-- Políticas para 'pregnancies' (Garantir que read/write é apenas do dono)
DROP POLICY IF EXISTS "Usuários podem ver suas próprias gestações" ON pregnancies;
CREATE POLICY "Usuários podem ver suas próprias gestações" ON pregnancies FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir suas próprias gestações" ON pregnancies;
CREATE POLICY "Usuários podem inserir suas próprias gestações" ON pregnancies FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias gestações" ON pregnancies;
CREATE POLICY "Usuários podem atualizar suas próprias gestações" ON pregnancies FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem excluir suas próprias gestações" ON pregnancies;
CREATE POLICY "Usuários podem excluir suas próprias gestações" ON pregnancies FOR DELETE USING (auth.uid() = user_id);

---------------------------------------------------------------------------------
-- Políticas para 'pregnancy_diary_entries'
CREATE POLICY "Ver próprio diário" ON pregnancy_diary_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Inserir próprio diário" ON pregnancy_diary_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprio diário" ON pregnancy_diary_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Excluir próprio diário" ON pregnancy_diary_entries FOR DELETE USING (auth.uid() = user_id);

---------------------------------------------------------------------------------
-- Políticas para 'prenatal_appointments'
CREATE POLICY "Ver próprias consultas" ON prenatal_appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Inserir próprias consultas" ON prenatal_appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprias consultas" ON prenatal_appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Excluir próprias consultas" ON prenatal_appointments FOR DELETE USING (auth.uid() = user_id);

---------------------------------------------------------------------------------
-- Políticas para 'birth_plans'
CREATE POLICY "Ver próprio plano de parto" ON birth_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Inserir próprio plano de parto" ON birth_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprio plano de parto" ON birth_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Excluir próprio plano de parto" ON birth_plans FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- STORAGE BUCKETS (Lixeiras virtuais para arquivos)
-- ==============================================================================
-- (OPCIONAL: Criar via SQL se for no Supabase Postgres direto. Se falhar, execute via painel).
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('pregnancy-photos', 'pregnancy-photos', true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('prenatal-files', 'prenatal-files', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- RLS para 'pregnancy-photos'
DROP POLICY IF EXISTS "Allow authenticated uploads pregnancy photos" ON storage.objects;
CREATE POLICY "Allow authenticated uploads pregnancy photos" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'pregnancy-photos');
DROP POLICY IF EXISTS "Allow public read pregnancy photos" ON storage.objects;
CREATE POLICY "Allow public read pregnancy photos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'pregnancy-photos');

-- RLS para 'prenatal-files'
DROP POLICY IF EXISTS "Allow authenticated uploads prenatal files" ON storage.objects;
CREATE POLICY "Allow authenticated uploads prenatal files" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'prenatal-files');
DROP POLICY IF EXISTS "Allow public read prenatal files" ON storage.objects;
CREATE POLICY "Allow public read prenatal files" ON storage.objects FOR SELECT TO public USING (bucket_id = 'prenatal-files');
