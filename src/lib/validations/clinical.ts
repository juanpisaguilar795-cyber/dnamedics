import { z } from "zod";

// Helper: convierte string vacío en undefined para que los enums opcionales no fallen
const optionalEnum = <T extends [string, ...string[]]>(values: T) =>
  z.enum(values).optional().or(z.literal("").transform(() => undefined));

// ─── Perfil del paciente ──────────────────────────────────────
export const patientProfileSchema = z.object({
  full_name:                  z.string().min(2, "Mínimo 2 caracteres").max(100),
  phone:                      z.string().optional().or(z.literal("").transform(() => undefined)),
  document_type:              z.enum(["CC","CE","PA","TI","RC","NIT"]).default("CC"),
  document_id:                z.string().optional().or(z.literal("").transform(() => undefined)),
  birth_date:                 z.string().optional().or(z.literal("").transform(() => undefined)),
  sex:                        optionalEnum(["M","F","O"]),
  blood_type:                 optionalEnum(["A+","A-","B+","B-","AB+","AB-","O+","O-"]),
  address:                    z.string().optional().or(z.literal("").transform(() => undefined)),
  city:                       z.string().optional().or(z.literal("").transform(() => undefined)),
  emergency_contact_name:     z.string().optional().or(z.literal("").transform(() => undefined)),
  emergency_contact_phone:    z.string().optional().or(z.literal("").transform(() => undefined)),
  emergency_contact_relation: z.string().optional().or(z.literal("").transform(() => undefined)),
});

// ─── Antecedentes médicos ─────────────────────────────────────
// Helper reutilizable
const optStr  = z.string().optional().or(z.literal("").transform(() => undefined));
const optEnum = <T extends [string, ...string[]]>(v: T) =>
  z.enum(v).optional().or(z.literal("").transform(() => undefined));

export const antecedentsSchema = z.object({
  // ── Personales ──────────────────────────────────────────────
  prev_diseases:    optStr,
  surgeries:        optStr,
  hospitalizations: optStr,
  allergies:        optStr,
  current_meds:     optStr,

  // ── Sistemas clínicos ────────────────────────────────────────
  sys_metabolic:       optStr,
  sys_endocrine:       optStr,
  sys_musculoskeletal: optStr,
  sys_gastrointestinal:optStr,
  sys_respiratory:     optStr,
  sys_neurological:    optStr,
  sys_genitourinary:   optStr,
  sys_skin:            optStr,
  sys_ocular:          optStr,
  sys_auditory:        optStr,

  // ── Familiares — Diabetes ────────────────────────────────────
  fam_diabetes_paternal: optEnum(["type1","type2","gestational","prediabetes","other"]),
  fam_diabetes_maternal:  optEnum(["type1","type2","gestational","prediabetes","other"]),
  fam_diabetes_other:     optStr,

  // ── Familiares — Hipertensión ────────────────────────────────
  fam_hypertension_paternal: optEnum(["yes","other"]),
  fam_hypertension_maternal:  optEnum(["yes","other"]),
  fam_hypertension_other:     optStr,

  // ── Familiares — Cáncer ──────────────────────────────────────
  fam_cancer_paternal: optEnum(["breast","colon","lung","prostate","skin","cervical","stomach","other"]),
  fam_cancer_maternal:  optEnum(["breast","colon","lung","prostate","skin","cervical","stomach","other"]),
  fam_cancer_other:     optStr,

  // ── Familiares — Cardiopatías ────────────────────────────────
  fam_heart_paternal: optEnum(["infarct","arrhythmia","valve","congenital","stroke","other"]),
  fam_heart_maternal:  optEnum(["infarct","arrhythmia","valve","congenital","stroke","other"]),
  fam_heart_other:     optStr,

  // ── Familiares — Otros ───────────────────────────────────────
  fam_other_paternal: optStr,
  fam_other_maternal:  optStr,

  // ── Legacy (mantener compatibilidad) ────────────────────────
  family_diabetes:    z.boolean().default(false),
  family_hypertension:z.boolean().default(false),
  family_cancer:      z.boolean().default(false),
  family_heart:       z.boolean().default(false),
  family_other:       optStr,

  // ── Hábitos básicos ──────────────────────────────────────────
  smoker:           z.boolean().default(false),
  alcohol:          z.enum(["none","occasional","frequent"]).default("none"),
  physical_activity:z.enum(["none","low","moderate","high"]).default("none"),

  // ── Estilo de vida ampliado ──────────────────────────────────
  lifestyle_exercise:      optStr,
  lifestyle_exercise_freq: optEnum(["none","1-2","3-4","5+"]),
  lifestyle_diet:          optEnum(["balanced","vegetarian","vegan","keto","hypercaloric","hypocaloric","other"]),
  lifestyle_diet_notes:    optStr,
  lifestyle_sleep_hours:   optEnum(["<5","5-6","7-8",">8"]),
  lifestyle_sleep_quality: optEnum(["good","fair","poor"]),
  lifestyle_sleep_notes:   optStr,
  lifestyle_environment:   optEnum(["urban","rural","suburban"]),
  lifestyle_env_notes:     optStr,
});

// ─── Prescripción ─────────────────────────────────────────────
export const prescriptionSchema = z.object({
  drug_name:    z.string().min(1, "Nombre requerido"),
  dose:         z.string().min(1, "Dosis requerida"),
  frequency:    z.string().min(1, "Frecuencia requerida"),
  duration:     z.string().min(1, "Duración requerida"),
  instructions: z.string().optional().or(z.literal("").transform(() => undefined)),
});

// ─── Registro clínico completo ────────────────────────────────
export const clinicalRecordSchema = z.object({
  patient_id:          z.string().uuid("Paciente requerido"),
  consultation_date:   z.string().min(1, "Fecha requerida"),
  service_type:        z.string().optional().or(z.literal("").transform(() => undefined)),
  reason:              z.string().min(3, "Motivo de consulta requerido"),
  symptoms:            z.string().optional().or(z.literal("").transform(() => undefined)),
  blood_pressure:      z.string().optional().or(z.literal("").transform(() => undefined)),
  heart_rate:          z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  temperature:         z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  weight:              z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  height:              z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  bmi:                 z.coerce.number().optional(),
  diagnosis:           z.string().min(3, "Diagnóstico requerido"),
  secondary_diagnoses: z.string().optional().or(z.literal("").transform(() => undefined)),
  diagnosis_status:    z.enum(["active","controlled","resolved"]).default("active"),
  treatment:           z.string().min(3, "Tratamiento requerido"),
  recommendations:     z.string().optional().or(z.literal("").transform(() => undefined)),
  next_appointment:    z.string().optional().or(z.literal("").transform(() => undefined)),
  evolution_notes:     z.string().optional().or(z.literal("").transform(() => undefined)),
  future_indications:  z.string().optional().or(z.literal("").transform(() => undefined)),
  notes:               z.string().optional().or(z.literal("").transform(() => undefined)),
  prescriptions:       z.array(prescriptionSchema).optional().default([]),
});

export const examSchema = z.object({
  exam_type: z.enum(["lab","image","other"]),
  exam_name: z.string().min(1, "Nombre del examen requerido"),
  result:    z.string().optional(),
});

export type PatientProfileData  = z.infer<typeof patientProfileSchema>;
export type AntecedentsData     = z.infer<typeof antecedentsSchema>;
export type ClinicalRecordData  = z.infer<typeof clinicalRecordSchema>;
export type PrescriptionData    = z.infer<typeof prescriptionSchema>;
export type ExamData            = z.infer<typeof examSchema>;
