-- ============================================================
-- Dnamedics — Migración adicional Semana 3
-- Agrega índice para cancelar cita desde el paciente con RLS
-- Ejecutar DESPUÉS de 001_initial_schema.sql
-- ============================================================

-- Permitir que el paciente actualice SOLO el estado a 'cancelled' de sus propias citas
DROP POLICY IF EXISTS "appt_update_own" ON appointments;

CREATE POLICY "appt_update_own" ON appointments
  FOR UPDATE
  USING (patient_id = auth.uid())
  WITH CHECK (
    patient_id = auth.uid()
    AND status = 'cancelled'  -- solo puede cancelar, no re-confirmar
  );

-- Vista útil para el admin: citas con datos del paciente
CREATE OR REPLACE VIEW appointments_with_patient AS
  SELECT
    a.*,
    p.full_name AS patient_name,
    p.phone     AS patient_phone
  FROM appointments a
  JOIN profiles p ON p.id = a.patient_id;
