import { NextRequest, NextResponse } from "next/server";
import { adminGetPatient, adminUpdatePatient } from "@/modules/historial/services/historial.service";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await adminGetPatient(params.id);
    if (!data) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = await adminUpdatePatient(params.id, body);
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
