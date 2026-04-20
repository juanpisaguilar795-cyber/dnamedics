import { NextRequest, NextResponse } from "next/server";
import { getRecordById } from "@/modules/historial/services/historial.service";
import { updateRecord, deleteRecord } from "@/modules/historial/controllers/historial.controller";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const record = await getRecordById(params.id);
  if (!record) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ data: record });
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return updateRecord(params.id, await req.json());
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  return deleteRecord(params.id);
}
