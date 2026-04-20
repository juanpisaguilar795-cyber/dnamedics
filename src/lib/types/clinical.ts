// ─── Tipos extendidos para historial clínico completo ────────

export interface PatientProfile {
  id: string;
  full_name: string;
  phone?: string;
  role: "patient" | "admin";
  // Datos personales extendidos
  document_id?: string;
  document_type?: "CC" | "CE" | "PA" | "TI" | "RC" | "NIT";
  birth_date?: string;
  sex?: "M" | "F" | "O";
  blood_type?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address?: string;
  city?: string;
  // Contacto de emergencia
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  created_at: string;
  // JOIN
  email?: string;
}

export interface MedicalAntecedents {
  id: string;
  patient_id: string;
  // Personales
  prev_diseases?:     string;
  surgeries?:         string;
  hospitalizations?:  string;
  allergies?:         string;
  current_meds?:      string;
  // Sistemas clínicos
  sys_metabolic?:        string;
  sys_endocrine?:        string;
  sys_musculoskeletal?:  string;
  sys_gastrointestinal?: string;
  sys_respiratory?:      string;
  sys_neurological?:     string;
  sys_genitourinary?:    string;
  sys_skin?:             string;
  sys_ocular?:           string;
  sys_auditory?:         string;
  // Familiares con linaje
  fam_diabetes_paternal?:    string;
  fam_diabetes_maternal?:    string;
  fam_diabetes_other?:       string;
  fam_hypertension_paternal?:string;
  fam_hypertension_maternal?: string;
  fam_hypertension_other?:   string;
  fam_cancer_paternal?:      string;
  fam_cancer_maternal?:      string;
  fam_cancer_other?:         string;
  fam_heart_paternal?:       string;
  fam_heart_maternal?:       string;
  fam_heart_other?:          string;
  fam_other_paternal?:       string;
  fam_other_maternal?:       string;
  // Legacy
  family_diabetes:    boolean;
  family_hypertension:boolean;
  family_cancer:      boolean;
  family_heart:       boolean;
  family_other?:      string;
  // Hábitos básicos
  smoker:           boolean;
  alcohol:          "none" | "occasional" | "frequent";
  physical_activity:"none" | "low" | "moderate" | "high";
  // Estilo de vida
  lifestyle_exercise?:      string;
  lifestyle_exercise_freq?: string;
  lifestyle_diet?:          string;
  lifestyle_diet_notes?:    string;
  lifestyle_sleep_hours?:   string;
  lifestyle_sleep_quality?: string;
  lifestyle_sleep_notes?:   string;
  lifestyle_environment?:   string;
  lifestyle_env_notes?:     string;
  created_at: string;
  updated_at: string;
}

export interface ClinicalRecord {
  id: string;
  patient_id: string;
  // Consulta
  consultation_date: string;
  service_type?: string;
  reason?: string;
  symptoms?: string;
  // Signos vitales
  blood_pressure?: string;
  heart_rate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  // Diagnóstico
  diagnosis: string;
  secondary_diagnoses?: string;
  diagnosis_status: "active" | "controlled" | "resolved";
  // Tratamiento
  treatment: string;
  recommendations?: string;
  // Medicamentos
  prescriptions?: Prescription[];
  // Exámenes
  exam_results?: ExamResult[];
  // Seguimiento
  next_appointment?: string;
  evolution_notes?: string;
  future_indications?: string;
  notes?: string;
  // Sistema
  created_by: string;
  created_at: string;
  updated_at: string;
  // JOINs
  patient?: PatientProfile;
  doctor?: { full_name: string };
}

export interface Prescription {
  id: string;
  record_id: string;
  patient_id: string;
  drug_name: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions?: string;
  created_at: string;
}

export interface ExamResult {
  id: string;
  record_id: string;
  patient_id: string;
  exam_type: "lab" | "image" | "other";
  exam_name: string;
  result?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
}

export interface MedicalDocument {
  id: string;
  patient_id: string;
  record_id?: string;
  doc_type: "recipe" | "incapacity" | "report" | "other";
  title: string;
  file_url?: string;
  file_name?: string;
  created_by?: string;
  created_at: string;
}

export type DiagnosisStatus = "active" | "controlled" | "resolved";

export const DIAGNOSIS_STATUS_LABELS: Record<DiagnosisStatus, string> = {
  active:     "Activo",
  controlled: "Controlado",
  resolved:   "Resuelto",
};

export const DIAGNOSIS_STATUS_COLORS: Record<DiagnosisStatus, string> = {
  active:     "bg-red-100 text-red-700",
  controlled: "bg-amber-100 text-amber-700",
  resolved:   "bg-green-100 text-green-700",
};

export const EXAM_TYPE_LABELS = {
  lab:   "Laboratorio",
  image: "Imagen diagnóstica",
  other: "Otro",
};

export const DOC_TYPE_LABELS = {
  recipe:     "Receta médica",
  incapacity: "Incapacidad",
  report:     "Informe médico",
  other:      "Otro documento",
};

export const ALCOHOL_LABELS = {
  none:       "No consume",
  occasional: "Ocasional",
  frequent:   "Frecuente",
};

export const ACTIVITY_LABELS = {
  none:     "Sedentario",
  low:      "Bajo",
  moderate: "Moderado",
  high:     "Alto",
};
