import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// 1. GET: Para que el formulario cargue la info al abrirse
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = params;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

// 2. PATCH: Para guardar los cambios del formulario
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = params;

  try {
    const body = await request.json();
    
    // 🛡️ FILTRO DE SEGURIDAD: Convertir strings vacíos a null para Supabase
    const cleanBirthDate = body.birth_date === "" ? null : body.birth_date;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: body.full_name,
        phone: body.phone,
        document_type: body.document_type,
        document_id: body.document_id,
        birth_date: cleanBirthDate, // <-- Usamos el valor limpio
        sex: body.sex,
        blood_type: body.blood_type,
        address: body.address,
        city: body.city,
        emergency_contact_name: body.emergency_contact_name,
        emergency_contact_phone: body.emergency_contact_phone,
        emergency_contact_relation: body.emergency_contact_relation,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error de Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Error crítico en el servidor:", err.message);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}