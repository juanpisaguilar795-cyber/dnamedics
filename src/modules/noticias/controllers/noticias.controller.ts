import { NextResponse } from "next/server";
import {
  getPublicArticles, adminGetAllArticles, adminCreateArticle,
  adminUpdateArticle, adminDeleteArticle,
} from "@/modules/noticias/services/noticias.service";
import type { ApiResponse } from "@/lib/types";

function err(e: unknown, status = 400) {
  return NextResponse.json<ApiResponse>({ error: (e as Error).message }, { status });
}

export async function listArticles(isAdmin: boolean) {
  try {
    const data = isAdmin ? await adminGetAllArticles() : await getPublicArticles();
    return NextResponse.json<ApiResponse>({ data });
  } catch (e) { return err(e, 403); }
}

export async function createArticleHandler(body: unknown) {
  try {
    const data = await adminCreateArticle(body);
    return NextResponse.json<ApiResponse>({ data }, { status: 201 });
  } catch (e) { return err(e); }
}

export async function updateArticleHandler(id: string, body: unknown) {
  try {
    const data = await adminUpdateArticle(id, body);
    return NextResponse.json<ApiResponse>({ data });
  } catch (e) { return err(e); }
}

export async function deleteArticleHandler(id: string) {
  try {
    await adminDeleteArticle(id);
    return NextResponse.json<ApiResponse>({ message: "Artículo eliminado" });
  } catch (e) { return err(e); }
}
