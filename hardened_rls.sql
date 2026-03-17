-- =====================================================
-- MamãeApp — Hardened RLS (Segurança Reforçada)
-- Execute este script no SQL Editor do Supabase para
-- fechar todas as brechas de acesso público.
-- =====================================================

-- 1. users_profiles: O usuário só pode inserir/ver/editar o próprio UUID
DROP POLICY IF EXISTS "Users can insert own profile" ON users_profiles;
CREATE POLICY "Users can insert own profile"
  ON users_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. children: Só pode inserir se o user_id for o seu próprio
DROP POLICY IF EXISTS "Users can insert own children" ON children;
CREATE POLICY "Users can insert own children"
  ON children FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. pregnancies: Só pode inserir o próprio perfil
DROP POLICY IF EXISTS "Users can insert own pregnancies" ON pregnancies;
CREATE POLICY "Users can insert own pregnancies"
  ON pregnancies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. health_records: Só pode inserir se o filho pertencer ao usuário logado
DROP POLICY IF EXISTS "Users can insert own health_records" ON health_records;
CREATE POLICY "Users can insert own health_records"
  ON health_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children 
      WHERE children.id = health_records.child_id 
      AND children.user_id = auth.uid()
    )
  );

-- 5. vaccines: Proteção vinculada ao child_id
DROP POLICY IF EXISTS "Users can insert own vaccines" ON vaccines;
CREATE POLICY "Users can insert own vaccines"
  ON vaccines FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children 
      WHERE children.id = vaccines.child_id 
      AND children.user_id = auth.uid()
    )
  );

-- 6. sleep_logs: Proteção vinculada ao child_id
DROP POLICY IF EXISTS "Users can insert own sleep_logs" ON sleep_logs;
CREATE POLICY "Users can insert own sleep_logs"
  ON sleep_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children 
      WHERE children.id = sleep_logs.child_id 
      AND children.user_id = auth.uid()
    )
  );

-- 7. feeding_logs: Proteção vinculada ao child_id
DROP POLICY IF EXISTS "Users can insert own feeding_logs" ON feeding_logs;
CREATE POLICY "Users can insert own feeding_logs"
  ON feeding_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children 
      WHERE children.id = feeding_logs.child_id 
      AND children.user_id = auth.uid()
    )
  );

-- 8. stories: Proteção por user_id
DROP POLICY IF EXISTS "Users can insert own stories" ON stories;
CREATE POLICY "Users can insert own stories"
  ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 9. meal_plans: Proteção vinculada ao child_id
DROP POLICY IF EXISTS "Users can insert own meal_plans" ON meal_plans;
CREATE POLICY "Users can insert own meal_plans"
  ON meal_plans FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children 
      WHERE children.id = meal_plans.child_id 
      AND children.user_id = auth.uid()
    )
  );

-- 10. activities: Proteção vinculada ao child_id
DROP POLICY IF EXISTS "Users can insert own activities" ON activities;
CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children 
      WHERE children.id = activities.child_id 
      AND children.user_id = auth.uid()
    )
  );
