-- ============================================================
-- Dnamedics — Migración Semana 4
-- Mejoras de seguridad adicionales en RLS
-- Ejecutar DESPUÉS de 001 y 002
-- ============================================================

-- ── Evitar que un paciente lea perfiles de otros pacientes ──
DROP POLICY IF EXISTS "profiles_own" ON profiles;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (
    id = auth.uid() OR is_admin()
  );

-- ── Índice para búsqueda de artículos por slug ───────────────
CREATE INDEX IF NOT EXISTS idx_articles_slug_published
  ON articles(slug) WHERE published = TRUE;

-- ── Función: obtener rol del usuario actual ──────────────────
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Vista pública de artículos (para lectura anónima) ────────
-- Permite leer artículos publicados sin autenticación
DROP POLICY IF EXISTS "articles_published" ON articles;

CREATE POLICY "articles_anon_read" ON articles
  FOR SELECT USING (published = TRUE);

CREATE POLICY "articles_admin_all" ON articles
  FOR ALL USING (is_admin());
