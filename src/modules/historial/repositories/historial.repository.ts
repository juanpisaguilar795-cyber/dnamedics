import { createClient } from "@/lib/supabase/server";
import type { ClinicalRecord } from "@/lib/types";

const FULL_SELECT = `
  *,
  prescriptions(*),
  patient:profiles!clinical_records_patient_id_fkey(
    id, full_name, phone, document_id, document_type,
    birth_date, sex, blood_type, city,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relation
  ),
  doctor:profiles!clinical_records_created_by_fkey(full_name)
`;

const LIST_SELECT = `
  *,
  prescriptions(id, drug_name, dose, frequency, duration),
  patient:profiles!clinical_records_patient_id_fkey(full_name, phone, document_id),
  doctor:profiles!clinical_records_created_by_fkey(full_name)
`;

// ── Utilidad: limpia un payload eliminando campos que no deben ir a BD ──
function cleanPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    // Saltar campos que son relaciones o metadatos que no van a la BD
    if (["patient", "doctor", "prescriptions", "exam_results", "id", "created_at", "updated_at"].includes(key)) continue;
    // Convertir strings vacíos en null para los campos opcionales
    result[key] = value === "" ? null : value;
  }
  return result;
}

// ─── Registros clínicos ───────────────────────────────────────
export async function getRecordsByPatient(patientId: string): Promise<ClinicalRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinical_records")
    .select(LIST_SELECT)
    .eq("patient_id", patientId)
    .order("consultation_date", { ascending: false })
    .order("created_at",        { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ClinicalRecord[];
}

export async function getAllRecords(): Promise<ClinicalRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinical_records")
    .select(LIST_SELECT)
    .order("consultation_date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ClinicalRecord[];
}

export async function getRecordById(id: string): Promise<ClinicalRecord | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clinical_records")
    .select(FULL_SELECT)
    .eq("id", id)
    .single();
  return data as ClinicalRecord | null;
}

export async function createRecord(payload: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
  const supabase = await createClient();
  const { prescriptions, ...rest } = payload as any;
  const record = cleanPayload(rest as Record<string, unknown>);

  const { data, error } = await supabase
    .from("clinical_records")
    .insert(record)
    .select()
    .single();
  if (error) {
    console.error("[createRecord]", error);
    throw new Error(`Error al crear registro: ${error.message}`);
  }

  const recordId = (data as ClinicalRecord).id;

  if (prescriptions && prescriptions.length > 0) {
    const rxItems = prescriptions.map(({ id: _id, created_at: _ca, record_id: _rid, ...p }: any) => ({
      ...p,
      record_id:  recordId,
      patient_id: (record as any).patient_id,
    }));
    const { error: rxErr } = await supabase.from("prescriptions").insert(rxItems);
    if (rxErr) console.error("[createRecord prescriptions]", rxErr);
  }

  return data as ClinicalRecord;
}

export async function updateRecord(id: string, payload: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
  const supabase = await createClient();
  const { prescriptions, ...rest } = payload as any;
  const record = cleanPayload(rest as Record<string, unknown>);

  const { data, error } = await supabase
    .from("clinical_records")
    .update(record)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("[updateRecord]", error);
    throw new Error(`Error al actualizar registro: ${error.message}`);
  }

  if (prescriptions !== undefined) {
    await supabase.from("prescriptions").delete().eq("record_id", id);
    if (prescriptions.length > 0) {
      const rxItems = prescriptions.map(({ id: _id, created_at: _ca, record_id: _rid, ...p }: any) => ({
        ...p,
        record_id:  id,
        patient_id: (data as ClinicalRecord).patient_id,
      }));
      const { error: rxErr } = await supabase.from("prescriptions").insert(rxItems);
      if (rxErr) console.error("[updateRecord prescriptions]", rxErr);
    }
  }

  return data as ClinicalRecord;
}

export async function deleteRecord(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("clinical_records").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── Pacientes ────────────────────────────────────────────────
export async function getAllPatients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "patient")
    .order("full_name");
  if (error) console.error("[getAllPatients]", error);
  return data ?? [];
}

export async function getPatientById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles").select("*").eq("id", id).single();
  return data ?? null;
}

export async function updatePatientProfile(id: string, payload: Record<string, unknown>) {
  const supabase = await createClient();

  // Limpiar el payload: solo campos de la tabla profiles, strings vacíos → null
  const PROFILE_FIELDS = [
    "full_name","phone","document_type","document_id","birth_date",
    "sex","blood_type","address","city",
    "emergency_contact_name","emergency_contact_phone","emergency_contact_relation",
  ];

  const clean: Record<string, unknown> = {};
  for (const key of PROFILE_FIELDS) {
    if (key in payload) {
      const v = payload[key];
      clean[key] = (v === "" || v === undefined) ? null : v;
    }
  }

  console.log("[updatePatientProfile] updating id:", id, "with:", clean);

  const { data, error } = await supabase
    .from("profiles")
    .update(clean)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updatePatientProfile] Supabase error:", JSON.stringify(error));
    throw new Error(`No se pudo actualizar el perfil: ${error.message} (code: ${error.code})`);
  }

  return data;
}

// ─── Antecedentes ─────────────────────────────────────────────
export async function getAntecedents(patientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("medical_antecedents")
    .select("*")
    .eq("patient_id", patientId)
    .maybeSingle();
  if (error) console.error("[getAntecedents]", error);
  return data ?? null;
}

export async function upsertAntecedents(
  patientId: string,
  payload:   Record<string, unknown>,
  adminId:   string
) {
  const supabase = await createClient();

  // TODOS los campos de la migración
  const ANTECEDENT_FIELDS = [
    // Personales
    "prev_diseases", "surgeries", "hospitalizations", "allergies", "current_meds",
    
    // Sistemas clínicos
    "sys_metabolic", "sys_endocrine", "sys_musculoskeletal", "sys_gastrointestinal",
    "sys_respiratory", "sys_neurological", "sys_genitourinary", "sys_skin", 
    "sys_ocular", "sys_auditory",
    
    // Familiares legacy (mantener compatibilidad)
    "family_diabetes", "family_hypertension", "family_cancer", "family_heart", "family_other",
    
    // Familiares - Diabetes
    "fam_diabetes_paternal", "fam_diabetes_maternal", "fam_diabetes_other",
    
    // Familiares - Hipertensión
    "fam_hypertension_paternal", "fam_hypertension_maternal", "fam_hypertension_other",
    
    // Familiares - Cáncer
    "fam_cancer_paternal", "fam_cancer_maternal", "fam_cancer_other",
    
    // Familiares - Cardiopatías
    "fam_heart_paternal", "fam_heart_maternal", "fam_heart_other",
    
    // Familiares - Otros
    "fam_other_paternal", "fam_other_maternal",
    
    // Hábitos básicos
    "smoker", "alcohol", "physical_activity",
    
    // Estilo de vida ampliado
    "lifestyle_exercise", "lifestyle_exercise_freq", "lifestyle_diet", "lifestyle_diet_notes",
    "lifestyle_sleep_hours", "lifestyle_sleep_quality", "lifestyle_sleep_notes",
    "lifestyle_environment", "lifestyle_env_notes"
  ];

  const clean: Record<string, unknown> = {
    patient_id: patientId,
    created_by: adminId,
  };

  for (const key of ANTECEDENT_FIELDS) {
    if (key in payload) {
      const value = payload[key];
      
      // Manejo de tipos según el campo
      if (typeof value === "boolean") {
        clean[key] = value;
      } 
      else if (typeof value === "string") {
        // Strings vacíos se guardan como null (mejor para la BD)
        clean[key] = value.trim() === "" ? null : value;
      }
      else if (value === undefined || value === null) {
        clean[key] = null;
      }
      else {
        clean[key] = value;
      }
    } else {
      // Si el campo no viene en el payload, lo dejamos como null
      clean[key] = null;
    }
  }

  console.log("[upsertAntecedents] upserting for patient:", patientId, "with:", clean);

  const { data, error } = await supabase
    .from("medical_antecedents")
    .upsert(clean, { onConflict: "patient_id" })
    .select()
    .single();

  if (error) {
    console.error("[upsertAntecedents] Supabase error:", JSON.stringify(error));
    throw new Error(`No se pudieron guardar los antecedentes: ${error.message} (code: ${error.code})`);
  }

  return data;
}