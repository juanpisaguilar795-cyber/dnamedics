"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { articleSchema, type ArticleFormData } from "@/lib/validations/articles";
import { generateSlug } from "@/lib/security/sanitize";
import { ROUTES } from "@/lib/utils/constants";
import { ImageIcon, X, UploadCloud } from "lucide-react";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
  });

  const title = watch("title");
  const coverUrl = watch("cover_url");

  useEffect(() => {
    fetch(`/api/noticias/${id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          reset({ 
            title: data.title, 
            slug: data.slug, 
            excerpt: data.excerpt ?? "", 
            content: data.content ?? "", 
            cover_url: data.cover_url ?? "",
            published: data.published 
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [id, reset]);

  function autoSlug() { 
    if (title) setValue("slug", generateSlug(title)); 
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const item = e.clipboardData.items[0];
    if (item?.type.includes("image")) {
      const file = item.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setValue("cover_url", base64);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  async function onSubmit(data: ArticleFormData) {
    setLoading(true); 
    setError(null);
    
    const res = await fetch(`/api/noticias/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    const json = await res.json();
    if (!res.ok) { 
      setError(json.error ?? "Error al actualizar"); 
      setLoading(false); 
      return; 
    }
    
    router.push(ROUTES.adminNoticias);
    router.refresh();
  }

  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {children}
    </svg>
  );

  if (fetching) return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
      <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        
        {/* Header - responsive */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          <Link 
            href={ROUTES.adminNoticias} 
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 hover:text-brand-teal hover:border-brand-teal/20 transition-all shadow-sm flex-shrink-0"
          >
            <IconWrapper><path d="M15 19l-7-7 7-7" /></IconWrapper>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
              Edición Editorial
            </h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1">
              Dnamedics Bogotá — Gestión de Contenido
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-8 md:p-10 lg:p-12 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-7 md:space-y-8" onPaste={handlePaste}>
            
            {/* Título */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Título del Artículo
              </label>
              <input 
                {...register("title")} 
                type="text" 
                onBlur={autoSlug}
                placeholder="Escribe un título cautivador..."
                className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-100 text-base sm:text-lg font-medium outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 transition-all bg-[#fafbfc] placeholder:text-slate-300" 
              />
              {errors.title && (
                <p className="text-rose-500 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-tight mt-1 ml-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* SECCIÓN DE IMAGEN - responsive */}
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Imagen de Portada
              </label>
              
              {coverUrl ? (
                <div className="relative group aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                  <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 p-4">
                    <p className="text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center">
                      Pega una nueva imagen para cambiar
                    </p>
                    <button 
                      type="button" 
                      onClick={() => setValue("cover_url", "")}
                      className="p-1.5 sm:p-2 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center bg-[#fafbfc] hover:bg-brand-teal/5 hover:border-brand-teal/20 transition-all group cursor-pointer">
                  <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-slate-200 group-hover:text-brand-teal transition-colors mb-3 sm:mb-4" />
                  <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-brand-teal transition-colors text-center px-4">
                    Haz clic aquí y <span className="text-brand-teal">pega (Ctrl+V)</span> <br />
                    la imagen de la noticia
                  </p>
                  <input {...register("cover_url")} type="hidden" />
                </div>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Enlace Permanente (Slug)
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input 
                  {...register("slug")} 
                  type="text"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-slate-100 text-[10px] sm:text-xs font-mono text-slate-500 outline-none focus:border-brand-teal transition-all bg-[#fafbfc]" 
                />
                <button 
                  type="button" 
                  onClick={autoSlug}
                  className="px-4 sm:px-6 py-3 sm:py-3.5 border border-slate-100 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-brand-teal hover:bg-brand-teal/5 transition-all whitespace-nowrap"
                >
                  Generar
                </button>
              </div>
              {errors.slug && (
                <p className="text-rose-500 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-tight mt-1 ml-1">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Resumen */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Resumen Corto
              </label>
              <textarea 
                {...register("excerpt")} 
                rows={2}
                placeholder="Breve descripción para la vista previa..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-100 text-xs sm:text-sm leading-relaxed outline-none focus:border-brand-teal transition-all bg-[#fafbfc] resize-none placeholder:text-slate-300" 
              />
            </div>

            {/* Contenido Principal */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Cuerpo del Artículo
              </label>
              <textarea 
                {...register("content")} 
                rows={8}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-100 text-xs sm:text-sm leading-relaxed outline-none focus:border-brand-teal transition-all bg-[#fafbfc] resize-y font-serif placeholder:text-slate-300" 
                placeholder="Comienza a escribir..."
              />
            </div>

            {/* Estado de Publicación */}
            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-[#fafbfc] rounded-xl sm:rounded-2xl border border-slate-50 group cursor-pointer">
              <div className="relative flex items-center">
                <input 
                  {...register("published")} 
                  type="checkbox" 
                  id="published" 
                  className="peer w-4 h-4 sm:w-5 sm:h-5 rounded-md border-slate-200 text-brand-teal focus:ring-brand-teal/20 transition-all cursor-pointer accent-brand-teal" 
                />
              </div>
              <label 
                htmlFor="published" 
                className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest cursor-pointer group-hover:text-brand-navy transition-colors"
              >
                Visibilidad Pública <span className="ml-1 sm:ml-2 font-medium text-slate-300 text-[8px] sm:text-[9px]">(Marcar para publicar)</span>
              </label>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
                <p className="text-rose-600 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
                  {error}
                </p>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Link 
                href={ROUTES.adminNoticias} 
                className="flex-1 text-center border border-slate-100 text-slate-400 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:bg-slate-50 transition-all order-2 sm:order-1"
              >
                Descartar
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-brand-navy hover:bg-brand-teal text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all shadow-lg shadow-brand-navy/10 hover:shadow-brand-teal/20 disabled:opacity-40 order-1 sm:order-2"
              >
                {loading ? "Sincronizando..." : "Actualizar Contenido"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}