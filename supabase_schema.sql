-- =====================================================
-- MamãeApp — Supabase Database Schema
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. users_profiles
CREATE TABLE IF NOT EXISTS users_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT DEFAULT 'free'
);

ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON users_profiles FOR DELETE
  USING (auth.uid() = id);


-- 2. children
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE,
  gender TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own children"
  ON children FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own children"
  ON children FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own children"
  ON children FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own children"
  ON children FOR DELETE
  USING (auth.uid() = user_id);


-- 3. pregnancies
CREATE TABLE IF NOT EXISTS pregnancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  due_date DATE,
  current_week INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pregnancies"
  ON pregnancies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pregnancies"
  ON pregnancies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pregnancies"
  ON pregnancies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pregnancies"
  ON pregnancies FOR DELETE
  USING (auth.uid() = user_id);


-- 4. health_records
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  recorded_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health_records"
  ON health_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = health_records.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own health_records"
  ON health_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = health_records.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own health_records"
  ON health_records FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = health_records.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own health_records"
  ON health_records FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = health_records.child_id AND children.user_id = auth.uid()
    )
  );


-- 5. vaccines
CREATE TABLE IF NOT EXISTS vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  scheduled_date DATE,
  applied_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vaccines"
  ON vaccines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = vaccines.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own vaccines"
  ON vaccines FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = vaccines.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own vaccines"
  ON vaccines FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = vaccines.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own vaccines"
  ON vaccines FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = vaccines.child_id AND children.user_id = auth.uid()
    )
  );


-- 6. sleep_logs
CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  sleep_start TIMESTAMPTZ NOT NULL,
  sleep_end TIMESTAMPTZ,
  quality TEXT,
  notes TEXT
);

ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sleep_logs"
  ON sleep_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = sleep_logs.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own sleep_logs"
  ON sleep_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = sleep_logs.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own sleep_logs"
  ON sleep_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = sleep_logs.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own sleep_logs"
  ON sleep_logs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = sleep_logs.child_id AND children.user_id = auth.uid()
    )
  );


-- 7. feeding_logs
CREATE TABLE IF NOT EXISTS feeding_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  feeding_type TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  duration_minutes INT,
  notes TEXT
);

ALTER TABLE feeding_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feeding_logs"
  ON feeding_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = feeding_logs.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own feeding_logs"
  ON feeding_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = feeding_logs.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own feeding_logs"
  ON feeding_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = feeding_logs.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own feeding_logs"
  ON feeding_logs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = feeding_logs.child_id AND children.user_id = auth.uid()
    )
  );


-- 8. stories
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  is_favorite BOOLEAN DEFAULT FALSE
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stories"
  ON stories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stories"
  ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories"
  ON stories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories"
  ON stories FOR DELETE
  USING (auth.uid() = user_id);


-- 9. meal_plans
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  week_start DATE,
  plan_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meal_plans"
  ON meal_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = meal_plans.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own meal_plans"
  ON meal_plans FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = meal_plans.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own meal_plans"
  ON meal_plans FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = meal_plans.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own meal_plans"
  ON meal_plans FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = meal_plans.child_id AND children.user_id = auth.uid()
    )
  );


-- 10. activities
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  age_range TEXT,
  category TEXT,
  completed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = activities.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = activities.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = activities.child_id AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = activities.child_id AND children.user_id = auth.uid()
    )
  );


-- =====================================================
-- MIGRATION: Perfil & Planos
-- Execute este bloco APÓS o schema principal
-- =====================================================

-- 11. Adicionar colunas de perfil ao users_profiles
ALTER TABLE users_profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;


-- 12. subscriptions — registro de pagamentos via webhook
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'free',
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role inserts via webhook (no RLS restriction for insert)
CREATE POLICY "Service can insert subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (true);


-- 13. Função para processar webhook de pagamento
-- Chamada via Supabase Edge Function ou API REST com service_role key
CREATE OR REPLACE FUNCTION process_payment_webhook(
  p_email TEXT,
  p_plan_type TEXT DEFAULT 'premium',
  p_raw_payload JSONB DEFAULT '{}'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Buscar usuário pelo email
  SELECT id INTO v_user_id FROM users_profiles WHERE email = p_email;
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error', 'User not found', 'email', p_email);
  END IF;

  -- Calcular expiração (30 dias a partir de agora)
  v_expires_at := NOW() + INTERVAL '30 days';

  -- Registrar assinatura
  INSERT INTO subscriptions (user_id, plan_type, expires_at, raw_payload)
  VALUES (v_user_id, p_plan_type, v_expires_at, p_raw_payload);

  -- Atualizar perfil do usuário
  UPDATE users_profiles
  SET plan = p_plan_type,
      plan_expires_at = v_expires_at
  WHERE id = v_user_id;

  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'plan', p_plan_type,
    'expires_at', v_expires_at
  );
END;
$$;
