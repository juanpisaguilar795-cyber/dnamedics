import {
  getAvailabilityConfig,
  getBlockedSlotsByDate,
  getAppointmentsByDate,
  getAllAppointments,
  getAppointmentsByPatient,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,   // ← ahora sí existe en el repository
  deleteAppointment,
  createBlockedSlot,
  deleteBlockedSlot,
} from "@/modules/citas/repositories/citas.repository";
import { requireAdmin, requireAuth } from "@/modules/auth/services/auth.service";
import { generateTimeSlots, overlaps } from "@/lib/utils/dates";
import type { Appointment, TimeSlot } from "@/lib/types";

// ─── Slots disponibles ────────────────────────────────────────
export async function getAvailableSlots(date: string): Promise<TimeSlot[]> {
  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  const configs   = await getAvailabilityConfig();
  const config    = configs.find((c) => c.day_of_week === dayOfWeek && c.is_active);
  if (!config) return [];

  const allSlots = generateTimeSlots(config.start_time, config.end_time, config.slot_duration_minutes);
  const blocked  = await getBlockedSlotsByDate(date);
  const booked   = await getAppointmentsByDate(date);

  return allSlots.map((slot) => ({
    ...slot,
    available:
      !blocked.some((b) => overlaps(slot, { start_time: b.start_time, end_time: b.end_time })) &&
      !booked.some((a)  => overlaps(slot, { start_time: a.start_time, end_time: a.end_time })),
  }));
}

// ─── Reservar cita (paciente) ─────────────────────────────────
export async function bookAppointment(input: {
  appointment_date: string;
  start_time:       string;
  notes?:           string;
}): Promise<Appointment> {
  const user  = await requireAuth();
  const slots = await getAvailableSlots(input.appointment_date);
  const slot  = slots.find((s) => s.start_time === input.start_time && s.available);
  if (!slot) throw new Error("El horario seleccionado no está disponible");

  return createAppointment({
    patient_id:       user.id,
    appointment_date: input.appointment_date,
    start_time:       slot.start_time,
    end_time:         slot.end_time,
    notes:            input.notes,
  }) as Promise<Appointment>;
}

// ─── Mis citas (paciente) ─────────────────────────────────────
export async function getMyAppointments(): Promise<Appointment[]> {
  const user = await requireAuth();
  return getAppointmentsByPatient(user.id) as Promise<Appointment[]>;
}

// ─── CANCELAR CITA (paciente) ─────────────────────────────────
// FIX: errores más descriptivos para distinguir los 3 escenarios de fallo
export async function cancelMyAppointment(id: string): Promise<Appointment> {
  const user = await requireAuth();
  
  // 1. Buscamos la cita usando el repositorio
  const appt = await getAppointmentById(id);
  
  if (!appt) {
    console.error(`[CancelService] Cita ${id} no encontrada o RLS la oculta.`);
    throw new Error("Cita no encontrada");
  }

  // 2. COMPARACIÓN ROBUSTA
  // Forzamos a string y limpiamos posibles espacios
  const patientId = String(appt.patient_id).trim();
  const userId = String(user.id).trim();

  console.log(`[CancelService] Comparando Patient: ${patientId} con User: ${userId}`);

  if (patientId !== userId) {
    console.warn("[CancelService] Intento de cancelación no autorizado por ID match.");
    throw new Error("No tienes permiso para cancelar esta cita.");
  }

  if (appt.status === "cancelled") return appt;

  // 3. Llamada al repositorio que YA corregimos con el cleanPayload
  return updateAppointmentStatus(id, "cancelled");
}
// ─── Admin: todas las citas ───────────────────────────────────
export async function adminGetAllAppointments(): Promise<Appointment[]> {
  await requireAdmin();
  return getAllAppointments() as Promise<Appointment[]>;
}

// ─── Admin: actualizar cita ───────────────────────────────────
// ─── Admin: actualizar cita ───────────────────────────────────
// ─── Admin: actualizar cita ───────────────────────────────────
export async function adminUpdateAppointment(
  id:      string,
  payload: Partial<{
    status:           "pending" | "confirmed" | "cancelled";
    notes:            string;
    appointment_date: string;
    start_time:       string;
    end_time:         string;
  }>
): Promise<Appointment> {
  await requireAdmin();
  return updateAppointment(id, payload) as Promise<Appointment>;
}

// ─── Admin: eliminar cita ─────────────────────────────────────
export async function adminDeleteAppointment(id: string): Promise<void> {
  await requireAdmin();
  await deleteAppointment(id);
}

// ─── Admin: bloquear / desbloquear horario ────────────────────
export async function adminBlockSlot(payload: {
  blocked_date: string;
  start_time:   string;
  end_time:     string;
  reason?:      string;
}) {
  await requireAdmin();
  return createBlockedSlot(payload);
}

export async function adminUnblockSlot(id: string) {
  await requireAdmin();
  await deleteBlockedSlot(id);
}

export { getAppointmentById, getAvailabilityConfig, getBlockedSlotsByDate };
