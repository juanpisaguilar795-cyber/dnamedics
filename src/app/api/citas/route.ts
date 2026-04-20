import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener el perfil del usuario para saber su rol
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();


    let query = supabase
      .from("appointments")
      .select(`
        *,
        patient:patient_id (
          id,
          full_name,
          phone
        )
      `)
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (profile?.role !== "admin") {
      query = query.eq("patient_id", user.id);
    }

    const { data, error } = await query;


    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
    
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { appointment_date, start_time, notes } = body;

    // ✅ CÁLCULO CORRECTO DE end_time
    const [hours, minutes] = start_time.split(":").map(Number);
    let endHour = hours;
    let endMinute = minutes + 30;

    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }

    const end_time = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}:00`;

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        patient_id: user.id,
        appointment_date,
        start_time,
        end_time,
        status: "pending",
        notes,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "unique constraint - Horario ya ocupado" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Error interno del servidor" }, // 👈 Mensaje genérico para el usuario
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" }, // 👈 Mensaje genérico
      { status: 500 }
    );
  }
}