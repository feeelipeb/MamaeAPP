-- =====================================================
-- FIX: Atualizar Constraints de Status de Gestação
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. Remover a restrição antiga que limitava a 'active' e 'completed'
ALTER TABLE pregnancies 
DROP CONSTRAINT IF EXISTS pregnancies_status_check;

-- 2. Adicionar a nova restrição incluindo o status 'cancelled'
ALTER TABLE pregnancies 
ADD CONSTRAINT pregnancies_status_check 
CHECK (status IN ('active', 'completed', 'cancelled'));

-- 3. (Opcional) Garantir que o valor padrão seja 'active'
ALTER TABLE pregnancies 
ALTER COLUMN status SET DEFAULT 'active';
