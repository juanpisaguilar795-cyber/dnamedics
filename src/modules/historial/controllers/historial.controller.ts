import { NextResponse } from "next/server";
import {
  getAdminAllRecords, createClinicalRecord,
  editClinicalRecord,  removeClinicalRecord,
  adminCreateRecord,   adminUpdateRecord,
} from "@/modules/historial/services/historial.service";
import type { ApiResponse } from "@/lib/types";

function err(e: unknown, status = 400) {
  return NextResponse.json<ApiResponse>({ error: (e as Error).message }, { status });
}

export async function listAllRecords() {
  try {
    const data = await getAdminAllRecords();
    return NextResponse.json<ApiResponse>({ data });
  } catch (e) { return err(e, 403); }
}

export async function createRecord(body: unknown) {
  try {
    // Intenta con el schema completo primero, luego con el básico
    let data;
    try { data = await adminCreateRecord(body); }
    catch { data = await createClinicalRecord(body); }
    return NextResponse.json<ApiResponse>({ data }, { status: 201 });
  } catch (e) { return err(e); }
}

export async function updateRecord(id: string, body: unknown) {
  try {
    let data;
    try { data = await adminUpdateRecord(id, body); }
    catch { data = await editClinicalRecord(id, body); }
    return NextResponse.json<ApiResponse>({ data });
  } catch (e) { return err(e); }
}

export async function deleteRecord(id: string) {
  try {
    await removeClinicalRecord(id);
    return NextResponse.json<ApiResponse>({ message: "Eliminado correctamente" });
  } catch (e) { return err(e); }
}
