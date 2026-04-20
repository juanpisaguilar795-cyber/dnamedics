import { createClient } from "@/lib/supabase/server";
import type { Appointment, AvailabilityConfig, BlockedSlot } from "@/lib/types";

// ─── Citas ────────────────────────────────────────────────────────────────────
export async function getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId)
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Appointment[];
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, patient:profiles!appointments_patient_id_fkey(full_name, phone)")
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Appointment[];
}

export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, patient:profiles!appointments_patient_id_fkey(full_name)")
    .eq("appointment_date", date)
    .neq("status", "cancelled")
    .order("start_time", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Appointment[];
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, patient:profiles!appointments_patient_id_fkey(full_name, phone)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Appointment;
}

export async function createAppointment(payload: {
  patient_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}): Promise<Appointment> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .insert({ ...payload, status: "pending" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled",
  notes?: string
): Promise<Appointment> {
  const supabase = await createClient();
  const payload: Record<string, unknown> = { status };
  if (notes !== undefined) payload.notes = notes;
  const { data, error } = await supabase
    .from("appointments")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Appointment;
}

export async function updateAppointment(
  id: string,
  payload: Partial<{ appointment_date: string; start_time: string; end_time: string; status: string; notes: string }>
): Promise<Appointment> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── Disponibilidad ───────────────────────────────────────────────────────────
export async function getAvailabilityConfig(): Promise<AvailabilityConfig[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("availability_config")
    .select("*")
    .order("day_of_week");
  if (error) throw new Error(error.message);
  return (data ?? []) as AvailabilityConfig[];
}

export async function updateAvailabilityConfig(
  id: string,
  payload: Partial<AvailabilityConfig>
): Promise<AvailabilityConfig> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("availability_config")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as AvailabilityConfig;
}

// ─── Bloqueos ─────────────────────────────────────────────────────────────────
export async function getBlockedSlotsByDate(date: string): Promise<BlockedSlot[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocked_slots")
    .select("*")
    .eq("blocked_date", date);
  if (error) throw new Error(error.message);
  return (data ?? []) as BlockedSlot[];
}

export async function createBlockedSlot(payload: {
  blocked_date: string;
  start_time: string;
  end_time: string;
  reason?: string;
}): Promise<BlockedSlot> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocked_slots")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as BlockedSlot;
}

export async function deleteBlockedSlot(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
