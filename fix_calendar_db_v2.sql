-- =====================================================
-- FIX: Consolidação do Calendário e Vacinas
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. Garantir colunas essenciais em 'calendar_events'
DO $$ 
BEGIN
    -- Se a tabela não existir, criar com o esquema completo
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'calendar_events') THEN
        CREATE TABLE calendar_events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
            child_id UUID REFERENCES children(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            event_date DATE NOT NULL,
            type TEXT DEFAULT 'reminder',
            color TEXT DEFAULT '#D8B4FE',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    ELSE
        -- Se existir, adicionar colunas faltantes
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'calendar_events' AND column_name = 'type') THEN
            ALTER TABLE calendar_events ADD COLUMN type TEXT DEFAULT 'reminder';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'calendar_events' AND column_name = 'description') THEN
            ALTER TABLE calendar_events ADD COLUMN description TEXT;
        END IF;

        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'calendar_events' AND column_name = 'user_id') THEN
            -- Caso bizarro de tabela sem user_id
            ALTER TABLE calendar_events ADD COLUMN user_id UUID REFERENCES users_profiles(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 2. Garantir permissões de RLS para 'calendar_events'
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can view own calendar_events" ON calendar_events;
CREATE POLICY "Users can manage their own calendar events" ON calendar_events FOR ALL USING (auth.uid() = user_id);

-- 3. Verificação de Chave Estrangeira em 'vaccines'
-- (Apenas para garantir que a relação é identificável pelo PostgREST)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'vaccines_child_id_fkey') THEN
        ALTER TABLE vaccines ADD CONSTRAINT vaccines_child_id_fkey FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE;
    END IF;
END $$;

RAISE NOTICE 'Esquema de calendário consolidado com sucesso!';
