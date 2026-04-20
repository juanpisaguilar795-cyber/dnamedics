import { NextRequest, NextResponse } from "next/server";
import { getSlotsHandler } from "@/modules/citas/controllers/citas.controller";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "Parámetro 'date' requerido" }, { status: 400 });
  return getSlotsHandler(date);
}
