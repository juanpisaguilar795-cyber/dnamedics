import {
  getPublishedArticles, getAllArticles, getArticleBySlug,
  getArticleById, createArticle, updateArticle, deleteArticle,
} from "@/modules/noticias/repositories/noticias.repository";
import { requireAdmin } from "@/modules/auth/services/auth.service";
import { articleSchema } from "@/lib/validations/articles";
import { generateSlug } from "@/lib/security/sanitize";
import type { Article } from "@/lib/types";

// ─── Público ──────────────────────────────────────────────────
export async function getPublicArticles(): Promise<Article[]> {
  return getPublishedArticles();
}

export async function getArticlePublic(slug: string): Promise<Article | null> {
  return getArticleBySlug(slug);
}

// ─── Admin ────────────────────────────────────────────────────
export async function adminGetAllArticles(): Promise<Article[]> {
  await requireAdmin();
  return getAllArticles();
}

export async function adminCreateArticle(input: unknown): Promise<Article> {
  const admin  = await requireAdmin();
  const parsed = articleSchema.parse(input); // Ahora parsed tendrá 'cover_url'

  const slug = parsed.slug?.trim() || generateSlug(parsed.title);
  if (!slug) throw new Error("No se pudo generar el slug del artículo");

  const articlePayload = {
    title:      parsed.title,
    slug,
    excerpt:    parsed.excerpt ?? null,
    content:    parsed.content ?? null,
    tag:        parsed.tag ?? null,
    cover_url:  parsed.cover_url ?? null,
    published:  parsed.published,
    created_by: admin.id,
  };

  return createArticle(articlePayload as Parameters<typeof createArticle>[0]);
}
export async function adminUpdateArticle(id: string, input: unknown): Promise<Article> {
  await requireAdmin();
  const parsed = articleSchema.partial().parse(input);

  // Si actualizan el título y el slug viene vacío, regenerarlo
  const updatePayload: Partial<Article> & { tag?: string } = {};
  if (parsed.title)    updatePayload.title    = parsed.title;
  if (parsed.slug)     updatePayload.slug     = parsed.slug;
  if (parsed.excerpt !== undefined) updatePayload.excerpt = parsed.excerpt ?? undefined;
  if (parsed.content !== undefined) updatePayload.content = parsed.content ?? undefined;
  if ((parsed as any).tag !== undefined) updatePayload.tag = (parsed as any).tag ?? undefined;
  if (parsed.published !== undefined) updatePayload.published = parsed.published;

  return updateArticle(id, updatePayload);
}

export async function adminDeleteArticle(id: string): Promise<void> {
  await requireAdmin();
  await deleteArticle(id);
}

export { getArticleById };
