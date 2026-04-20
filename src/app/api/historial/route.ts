import { NextRequest } from "next/server";
import { listAllRecords, createRecord } from "@/modules/historial/controllers/historial.controller";

export async function GET() { return listAllRecords(); }
export async function POST(req: NextRequest) { return createRecord(await req.json()); }
