import { NextRequest } from "next/server";
import { listArticles, createArticleHandler } from "@/modules/noticias/controllers/noticias.controller";
import { getCurrentUser } from "@/modules/auth/services/auth.service";

export async function GET() {
  const user = await getCurrentUser();
  return listArticles(user?.role === "admin");
}
export async function POST(req: NextRequest) {
  return createArticleHandler(await req.json());
}
