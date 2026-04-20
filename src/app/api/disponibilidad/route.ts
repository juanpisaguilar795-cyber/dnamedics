import { NextRequest } from "next/server";
import { blockSlotHandler } from "@/modules/citas/controllers/citas.controller";

export async function POST(req: NextRequest) {
  return blockSlotHandler(await req.json());
}
