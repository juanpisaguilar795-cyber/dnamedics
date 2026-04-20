import { NextRequest } from "next/server";
import { updateCitaHandler, deleteCitaHandler } from "@/modules/citas/controllers/citas.controller";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return updateCitaHandler(params.id, await req.json());
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  return deleteCitaHandler(params.id);
}
