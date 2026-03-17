-- =====================================================
-- FIX: Cascading Deletes (Correção de Exclusão de Usuário)
-- Execute este script no SQL Editor do Supabase para
-- garantir que ao apagar um usuário, tudo seja apagado.
-- =====================================================

DO $$ 
BEGIN
    -- 1. MILESTONES (user_id)
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'milestones_user_id_fkey') THEN
        ALTER TABLE milestones DROP CONSTRAINT milestones_user_id_fkey;
    END IF;
    ALTER TABLE milestones 
    ADD CONSTRAINT milestones_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users_profiles(id) ON DELETE CASCADE;

    -- 2. CALENDAR_EVENTS (user_id)
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'calendar_events_user_id_fkey') THEN
        ALTER TABLE calendar_events DROP CONSTRAINT calendar_events_user_id_fkey;
    END IF;
    ALTER TABLE calendar_events 
    ADD CONSTRAINT calendar_events_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users_profiles(id) ON DELETE CASCADE;

    -- 3. Caso existam versões que apontam para auth.users diretamente
    -- Tentaremos remover nomes genéricos comuns em tabelas criadas manualmente
    
    -- Exemplo: milestones_user_id_fkey1, etc.
    -- (O código acima já resolve os nomes padrão dos nossos scripts)

    RAISE NOTICE 'Cascading deletes configurados com sucesso para Milestones e Calendar!';
END $$;
