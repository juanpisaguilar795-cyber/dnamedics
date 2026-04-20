import {
  getRecordsByPatient, getAllRecords, getRecordById,
  createRecord, updateRecord, deleteRecord,
  getAllPatients, getPatientById, updatePatientProfile,
  getAntecedents, upsertAntecedents,
} from "@/modules/historial/repositories/historial.repository";
import { requireAdmin, requireAuth } from "@/modules/auth/services/auth.service";
import { clinicalRecordSchema } from "@/lib/validations/clinical";
import type { ClinicalRecord } from "@/lib/types";

// ─── COMPATIBILIDAD: nombres antiguos que usan otras páginas ──
export async function getMyRecords(): Promise<ClinicalRecord[]> {
  const user = await requireAuth();
  return getRecordsByPatient(user.id) as Promise<ClinicalRecord[]>;
}

export async function getAdminAllRecords(): Promise<ClinicalRecord[]> {
  await requireAdmin();
  return getAllRecords() as Promise<ClinicalRecord[]>;
}

export async function getPatientRecords(patientId: string): Promise<ClinicalRecord[]> {
  await requireAdmin();
  return getRecordsByPatient(patientId) as Promise<ClinicalRecord[]>;
}

export async function createClinicalRecord(input: unknown): Promise<ClinicalRecord> {
  const admin  = await requireAdmin();
  const parsed = clinicalRecordSchema.parse(input);
  const { prescriptions, ...rest } = parsed as any;
  return createRecord({ ...rest, created_by: admin.id, prescriptions } as any) as Promise<ClinicalRecord>;
}

export async function editClinicalRecord(id: string, input: unknown): Promise<ClinicalRecord> {
  await requireAdmin();
  const parsed = clinicalRecordSchema.partial().parse(input);
  return updateRecord(id, parsed as any) as Promise<ClinicalRecord>;
}

export async function removeClinicalRecord(id: string): Promise<void> {
  await requireAdmin();
  await deleteRecord(id);
}

// ─── NUEVAS funciones para historial completo ─────────────────
export async function adminGetPatients() {
  await requireAdmin();
  return getAllPatients();
}

export async function adminGetPatient(id: string) {
  await requireAdmin();
  return getPatientById(id);
}

export async function adminUpdatePatient(id: string, payload: Record<string, unknown>) {
  await requireAdmin();
  return updatePatientProfile(id, payload);
}

export async function adminGetRecords(patientId: string): Promise<ClinicalRecord[]> {
  await requireAdmin();
  return getRecordsByPatient(patientId) as Promise<ClinicalRecord[]>;
}

export async function adminGetRecord(id: string): Promise<ClinicalRecord | null> {
  await requireAdmin();
  return getRecordById(id) as Promise<ClinicalRecord | null>;
}

export async function adminGetRecordPublic(id: string): Promise<ClinicalRecord | null> {
  const user   = await requireAuth();
  const record = await getRecordById(id) as ClinicalRecord | null;
  if (!record) return null;
  if (user.role !== "admin" && record.patient_id !== user.id) return null;
  return record;
}

export async function adminCreateRecord(input: unknown): Promise<ClinicalRecord> {
  const admin  = await requireAdmin();
  const parsed = clinicalRecordSchema.parse(input) as any;

  // Calcular IMC
  let bmi: number | undefined;
  if (parsed.weight && parsed.height && Number(parsed.height) > 0) {
    const hm = Number(parsed.height) / 100;
    bmi = Math.round((Number(parsed.weight) / (hm * hm)) * 10) / 10;
  }

  const { prescriptions, ...rest } = parsed;
  return createRecord({ ...rest, bmi, created_by: admin.id, prescriptions } as any) as Promise<ClinicalRecord>;
}

export async function adminUpdateRecord(id: string, input: unknown): Promise<ClinicalRecord> {
  await requireAdmin();
  const parsed = clinicalRecordSchema.partial().parse(input) as any;

  let bmi: number | undefined;
  if (parsed.weight && parsed.height && Number(parsed.height) > 0) {
    const hm = Number(parsed.height) / 100;
    bmi = Math.round((Number(parsed.weight) / (hm * hm)) * 10) / 10;
  }

  const { prescriptions, ...rest } = parsed;
  return updateRecord(id, { ...rest, bmi, prescriptions } as any) as Promise<ClinicalRecord>;
}

export async function adminDeleteRecord(id: string): Promise<void> {
  await requireAdmin();
  await deleteRecord(id);
}

export async function adminGetAntecedents(patientId: string) {
  try {
    await requireAdmin();
    const data = await getAntecedents(patientId);
    
    // Si la base de datos devuelve vacío o error de "no encontrado", 
    // retornamos null de forma controlada.
    if (!data) return null;
    
    return data;
  } catch (error: any) {
    // Si el error es un 404 o "no encontrado", no explotamos, devolvemos null
    console.warn(`Aviso: No se encontraron antecedentes para ${patientId}, devolviendo null.`);
    return null;
  }
}

export async function adminUpsertAntecedents(patientId: string, input: unknown) {
  const admin = await requireAdmin();
  return upsertAntecedents(patientId, input as Record<string, unknown>, admin.id);
}

// Re-export para compatibilidad
export { getRecordById };