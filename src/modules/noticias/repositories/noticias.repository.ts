import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";

export async function getPublishedArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getPublishedArticles]", error.message);
    return [];   // devolver array vacío en vez de lanzar — el frontend muestra mocks
  }
  return (data ?? []) as Article[];
}

export async function getAllArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllArticles]", error.message);
    throw new Error(`Error al obtener artículos: ${error.message}`);
  }
  return (data ?? []) as Article[];
}

// En noticias.repository.ts
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  
  // Usamos ilike para evitar problemas de mayúsculas/minúsculas
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .ilike("slug", slug.trim()) // .trim() limpia espacios accidentales
    .maybeSingle();

  if (error) {
    console.error("[getArticleBySlug]", error.message);
    return null;
  }
  return data as Article | null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getArticleById]", error.message);
    return null;
  }
  return data as Article | null;
}

export async function createArticle(payload: {
  title:       string;
  slug:        string;
  excerpt?:    string | null;
  content?:    string | null;
  tag?:        string | null;
  cover_url?:  string | null; // <-- Asegúrate de que el tipo lo incluya
  published:   boolean;
  created_by:  string;
}): Promise<Article> {
  const supabase = await createClient();

  // Construir el objeto incluyendo cover_url
  const record: Record<string, unknown> = {
    title:      payload.title,
    slug:       payload.slug,
    published:  payload.published,
    created_by: payload.created_by,
  };
  
  if (payload.excerpt) record.excerpt = payload.excerpt;
  if (payload.content) record.content = payload.content;
  if (payload.tag) record.tag = payload.tag;
  
  // --- ESTA ES LA PARTE CLAVE QUE FALTABA ---
  if ((payload as any).cover_url) {
    record.cover_url = (payload as any).cover_url;
  }
  // ------------------------------------------

  const { data, error } = await supabase
    .from("articles")
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error("[createArticle]", error);
    // Tu lógica de reintento por si falla la columna 'tag'
    if (error.message.includes("tag") && payload.tag) {
      delete record.tag;
      const { data: data2, error: error2 } = await supabase
        .from("articles").insert(record).select().single();
      if (error2) throw new Error(`Error al crear artículo: ${error2.message}`);
      return data2 as Article;
    }
    throw new Error(`Error al crear artículo: ${error.message}`);
  }
  return data as Article;
}

export async function updateArticle(id: string, payload: Partial<Article> & { tag?: string }): Promise<Article> {
  const supabase = await createClient();

  // 1. Limpiamos el payload
  const clean: Record<string, unknown> = {};
  
  for (const [k, v] of Object.entries(payload)) {
    // IMPORTANTE: No enviamos el 'id' ni campos 'undefined' en el update
    if (v !== undefined && k !== "id") {
      clean[k] = v;
    }
  }

  // 2. Ejecutamos la actualización
  const { data, error } = await supabase
    .from("articles")
    .update(clean)
    .eq("id", id) // Buscamos por el ID único de Bogotá
    .select()
    .single();

  if (error) {
    console.error("[updateArticle Error]", error);
    
    // Si el error es por el Slug duplicado, damos un mensaje más claro
    if (error.code === '23505') {
      throw new Error("Ese enlace (Slug) ya lo tiene otra noticia. Cámbialo un poco.");
    }
    
    throw new Error(`Error al actualizar: ${error.message}`);
  }
  
  return data as Article;
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(`Error al eliminar artículo: ${error.message}`);
}
