import { NextRequest, NextResponse } from "next/server";
import { getArticleById } from "@/modules/noticias/services/noticias.service";
import { updateArticleHandler, deleteArticleHandler } from "@/modules/noticias/controllers/noticias.controller";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const article = await getArticleById(params.id);
  if (!article) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ data: article });
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return updateArticleHandler(params.id, await req.json());
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  return deleteArticleHandler(params.id);
}
