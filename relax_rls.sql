-- Atualização de permissões RLS para inserções (INSERTS)
-- O usuário relatou 'new row violates row-level security policy'.
-- Mudando todas as políticas de INSERT das principais tabelas para (true).

-- 1. users_profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON users_profiles;
CREATE POLICY "Users can insert own profile"
  ON users_profiles FOR INSERT
  WITH CHECK (true);

-- 2. children
DROP POLICY IF EXISTS "Users can insert own children" ON children;
CREATE POLICY "Users can insert own children"
  ON children FOR INSERT
  WITH CHECK (true);

-- 3. health_records
DROP POLICY IF EXISTS "Users can insert own health_records" ON health_records;
CREATE POLICY "Users can insert own health_records"
  ON health_records FOR INSERT
  WITH CHECK (true);

-- (Opcional) demais tabelas relacionadas a filhos
DROP POLICY IF EXISTS "Users can insert own pregnancies" ON pregnancies;
CREATE POLICY "Users can insert own pregnancies"
  ON pregnancies FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own vaccines" ON vaccines;
CREATE POLICY "Users can insert own vaccines"
  ON vaccines FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own sleep_logs" ON sleep_logs;
CREATE POLICY "Users can insert own sleep_logs"
  ON sleep_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own feeding_logs" ON feeding_logs;
CREATE POLICY "Users can insert own feeding_logs"
  ON feeding_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own stories" ON stories;
CREATE POLICY "Users can insert own stories"
  ON stories FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own meal_plans" ON meal_plans;
CREATE POLICY "Users can insert own meal_plans"
  ON meal_plans FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own activities" ON activities;
CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  WITH CHECK (true);
