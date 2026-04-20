import { NextRequest, NextResponse } from "next/server";
import { adminGetAntecedents, adminUpsertAntecedents } from "@/modules/historial/services/historial.service";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await adminGetAntecedents(params.id);
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = await adminUpsertAntecedents(params.id, body);
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
