import { NextResponse } from "next/server";
import {
  getMyAppointments, bookAppointment, cancelMyAppointment,
  adminGetAllAppointments, adminUpdateAppointment, adminDeleteAppointment,
  adminBlockSlot, adminUnblockSlot, getAvailableSlots,
} from "@/modules/citas/services/citas.service";
import type { ApiResponse } from "@/lib/types";

function err(e: unknown, status = 400) {
  return NextResponse.json<ApiResponse>({ error: (e as Error).message }, { status });
}

// GET /api/slots?date=YYYY-MM-DD
export async function getSlotsHandler(date: string) {
  try {
    const data = await getAvailableSlots(date);
    return NextResponse.json<ApiResponse>({ data });
  } catch (e) { return err(e); }
}

// GET /api/citas (paciente: las suyas / admin: todas)
export async function listCitasHandler(isAdmin: boolean) {
  try {
    const data = isAdmin ? await adminGetAllAppointments() : await getMyAppointments();
    return NextResponse.json<ApiResponse>({ data });
  } catch (e) { return err(e, 403); }
}

// POST /api/citas
export async function createCitaHandler(body: unknown) {
  try {
    const data = await bookAppointment(body as { appointment_date: string; start_time: string; notes?: string });
    return NextResponse.json<ApiResponse>({ data }, { status: 201 });
  } catch (e) { return err(e); }
}

// PATCH /api/citas/[id]
export async function updateCitaHandler(id: string, body: any) {
  try {
    // 🛡️ FILTRO DE SEGURIDAD: Evitar que campos vacíos rompan la base de datos
    const cleanBody = {
      ...body,
      // Si mandas notas vacías, que sean null, no ""
      notes: body.notes === "" ? null : body.notes,
      // Si se está enviando una fecha de reprogramación vacía
      appointment_date: body.appointment_date === "" ? null : body.appointment_date,
    };

    const data = await adminUpdateAppointment(id, cleanBody);
    return NextResponse.json<ApiResponse>({ data });
  } catch (e) { 
    console.error("Error en updateCitaHandler:", (e as Error).message);
    return err(e); 
  }
}

// DELETE /api/citas/[id]
export async function deleteCitaHandler(id: string) {
  try {
    await adminDeleteAppointment(id);
    return NextResponse.json<ApiResponse>({ message: "Cita eliminada" });
  } catch (e) { return err(e); }
}

// PATCH /api/citas/[id]/cancelar (paciente)
// PATCH /api/citas/[id]/cancelar
export async function cancelCitaHandler(id: string) {
  try {
    // ESTA es la clave: cancelMyAppointment solo pide requireAuth()
    const data = await cancelMyAppointment(id); 
    return NextResponse.json({ data });
  } catch (e) { 
    return NextResponse.json({ error: (e as Error).message }, { status: 400 }); 
  }
}

// POST /api/disponibilidad/bloquear
export async function blockSlotHandler(body: unknown) {
  try {
    const data = await adminBlockSlot(body as Parameters<typeof adminBlockSlot>[0]);
    return NextResponse.json<ApiResponse>({ data }, { status: 201 });
  } catch (e) { return err(e); }
}

// DELETE /api/disponibilidad/[id]
export async function unblockSlotHandler(id: string) {
  try {
    await adminUnblockSlot(id);
    return NextResponse.json<ApiResponse>({ message: "Bloqueo eliminado" });
  } catch (e) { return err(e); }
}
