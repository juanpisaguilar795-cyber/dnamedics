import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { cancelMyAppointment }       from "@/modules/citas/services/citas.service";

// PATCH /api/citas/[id]/cancelar
// Solo para pacientes. No requiere body.
// El admin usa PATCH /api/citas/[id] directamente.
export async function PATCH(
  _req:   NextRequest,
  { params }: { params: { id: string } }
) {
  // Verificar sesión aquí — UNA sola vez — antes de llamar al servicio
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "No autenticado. Inicia sesión para cancelar una cita." },
      { status: 401 }
    );
  }

  try {
    const data = await cancelMyAppointment(params.id);
    return NextResponse.json({ data, message: "Cita cancelada correctamente" });
  } catch (e) {
    const msg = (e as Error).message;

    // Mapear mensajes a códigos HTTP correctos
    // — "No estás autorizado" → 403 (autenticado pero sin permiso)
    // — "Cita no encontrada" → 404
    // — RLS / Supabase       → 400 con mensaje descriptivo
    const status =
      msg.includes("autorizado")    ? 403 :
      msg.includes("no encontrada") ? 404 :
      msg.includes("RLS")           ? 403 :
      400;

    console.error(`[PATCH /api/citas/${params.id}/cancelar]`, msg);
    return NextResponse.json({ error: msg }, { status });
  }
}
