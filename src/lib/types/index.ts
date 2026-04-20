export type UserRole = "patient" | "admin";
export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  patient?: Profile;
}

export interface ClinicalRecord {
  temperature: any;
  diagnosis_status: any;
  prescriptions: boolean;
  bmi: string;
  height: any;
  weight: any;
  heart_rate: any;
  blood_pressure: any;
  reason: any;
  service_type: any;
  consultation_date: string | Date;
  id: string;
  patient_id: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  patient?: Profile;
  creator?: Profile;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  cover_url?: string;
  published: boolean;
  created_by: string;
  created_at: string;
}

export interface AvailabilityConfig {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

export interface BlockedSlot {
  id: string;
  blocked_date: string;
  start_time: string;
  end_time: string;
  reason?: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}
