-- ============================================================
-- Dnamedics — Migración inicial completa
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- ─── Función para updated_at automático ─────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ─── Perfiles de usuario ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient','admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Historial clínico ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clinical_records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  diagnosis   TEXT NOT NULL,
  treatment   TEXT NOT NULL,
  notes       TEXT,
  created_by  UUID NOT NULL REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER clinical_records_updated_at BEFORE UPDATE ON clinical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_clinical_records_patient ON clinical_records(patient_id);

-- ─── Configuración de disponibilidad semanal ─────────────────
CREATE TABLE IF NOT EXISTS availability_config (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week           INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time            TIME NOT NULL,
  end_time              TIME NOT NULL,
  slot_duration_minutes INT NOT NULL DEFAULT 30,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(day_of_week)
);

INSERT INTO availability_config (day_of_week, start_time, end_time, slot_duration_minutes, is_active)
VALUES (1,'08:00','18:00',30,TRUE),(2,'08:00','18:00',30,TRUE),(3,'08:00','18:00',30,TRUE),
       (4,'08:00','18:00',30,TRUE),(5,'08:00','18:00',30,TRUE)
ON CONFLICT (day_of_week) DO NOTHING;

-- ─── Bloqueos de horario ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS blocked_slots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date  DATE NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  reason        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots(blocked_date);

-- ─── Citas médicas ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_date  DATE NOT NULL,
  start_time        TIME NOT NULL,
  end_time          TIME NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(appointment_date, start_time)
);
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date    ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status  ON appointments(status);

-- ─── Artículos / Noticias ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  content     TEXT,
  excerpt     TEXT,
  cover_url   TEXT,
  published   BOOLEAN NOT NULL DEFAULT FALSE,
  created_by  UUID NOT NULL REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_articles_slug      ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_records    ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots       ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles            ENABLE ROW LEVEL SECURITY;

-- Helper: verificar admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles
CREATE POLICY "profiles_own"       ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_update"    ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_admin"     ON profiles FOR ALL    USING (is_admin());

-- Clinical records
CREATE POLICY "clinical_own"       ON clinical_records FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "clinical_admin"     ON clinical_records FOR ALL    USING (is_admin());

-- Appointments
CREATE POLICY "appt_select_own"    ON appointments FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "appt_insert_own"    ON appointments FOR INSERT WITH CHECK (patient_id = auth.uid());
CREATE POLICY "appt_update_own"    ON appointments FOR UPDATE USING (patient_id = auth.uid());
CREATE POLICY "appt_admin"         ON appointments FOR ALL    USING (is_admin());

-- Availability (lectura pública autenticada)
CREATE POLICY "avail_read"         ON availability_config FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "avail_admin"        ON availability_config FOR ALL    USING (is_admin());

-- Blocked slots (lectura pública autenticada)
CREATE POLICY "blocked_read"       ON blocked_slots FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "blocked_admin"      ON blocked_slots FOR ALL    USING (is_admin());

-- Articles
CREATE POLICY "articles_published" ON articles FOR SELECT USING (published = TRUE OR is_admin());
CREATE POLICY "articles_admin"     ON articles FOR ALL    USING (is_admin());
