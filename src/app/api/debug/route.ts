import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/debug — solo en desarrollo, verifica tablas y permisos
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible en producción" }, { status: 403 });
  }

  const supabase = await createClient();
  const results: Record<string, unknown> = {};

  // 1. Verificar sesión actual
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  results.auth = user
    ? { ok: true, id: user.id, email: user.email }
    : { ok: false, error: authErr?.message };

  if (!user) {
    return NextResponse.json({ error: "No autenticado", results }, { status: 401 });
  }

  // 2. Verificar rol del usuario
  const { data: profile, error: profileErr } = await supabase
    .from("profiles").select("id, full_name, role").eq("id", user.id).single();
  results.profile = profile ?? { error: profileErr?.message };

  // 3. Verificar si tabla medical_antecedents existe
  const { error: tableErr } = await supabase
    .from("medical_antecedents").select("id").limit(1);
  results.medical_antecedents_table = tableErr
    ? { exists: false, error: tableErr.message, code: tableErr.code }
    : { exists: true };

  // 4. Verificar si tabla prescriptions existe
  const { error: rxErr } = await supabase
    .from("prescriptions").select("id").limit(1);
  results.prescriptions_table = rxErr
    ? { exists: false, error: rxErr.message }
    : { exists: true };

  // 5. Verificar columnas nuevas en profiles
  const { data: profileCols, error: colErr } = await supabase
    .from("profiles").select("document_id, birth_date, sex, blood_type, city").limit(1);
  results.profiles_new_columns = colErr
    ? { ok: false, error: colErr.message }
    : { ok: true };

  // 6. Verificar columnas nuevas en clinical_records
  const { data: recCols, error: recColErr } = await supabase
    .from("clinical_records").select("consultation_date, reason, blood_pressure, diagnosis_status").limit(1);
  results.clinical_records_new_columns = recColErr
    ? { ok: false, error: recColErr.message }
    : { ok: true };

  // 7. Test de UPDATE en profiles (solo si es admin)
  if (profile?.role === "admin") {
    // Intentar un update sin cambios reales para verificar permisos
    const testPatientId = await supabase
      .from("profiles").select("id").eq("role", "patient").limit(1).single();

    if (testPatientId.data) {
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ city: "Bogotá" })    // valor que ya debería tener
        .eq("id", testPatientId.data.id);
      results.admin_update_profiles = updateErr
        ? { ok: false, error: updateErr.message, code: updateErr.code, hint: "Ejecuta 007_fix_rls_policies.sql" }
        : { ok: true, message: "Admin puede actualizar perfiles de pacientes ✅" };
    } else {
      results.admin_update_profiles = { ok: "N/A", message: "No hay pacientes para probar" };
    }

    // Test de upsert en medical_antecedents
    if (testPatientId.data) {
      const { error: antErr } = await supabase
        .from("medical_antecedents")
        .upsert({ patient_id: testPatientId.data.id, created_by: user.id }, { onConflict: "patient_id" })
        .select().single();
      results.admin_upsert_antecedents = antErr
        ? { ok: false, error: antErr.message, code: antErr.code, hint: "Ejecuta 007_fix_rls_policies.sql" }
        : { ok: true, message: "Admin puede upsert antecedentes ✅" };
    }
  }

  return NextResponse.json({ results }, { status: 200 });
}
