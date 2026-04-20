"use client";
import { useState, ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateSlug } from "@/lib/security/sanitize";
import { ROUTES } from "@/lib/utils/constants";
import { ImageIcon, X, ChevronLeft, ClipboardPaste, Check } from "lucide-react";

const TAGS = [
  "Medicina Natural", "Quiropráxia", "Medicina Regenerativa",
  "Deporte", "Bienestar", "Terapias", "Nutrición", "Rehabilitación",
];

export default function NuevaNoticiaPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              const maxWidth = 1280;
              const scale = maxWidth / img.width;
              
              if (img.width > maxWidth) {
                canvas.width = maxWidth;
                canvas.height = img.height * scale;
              } else {
                canvas.width = img.width;
                canvas.height = img.height;
              }

              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
              setImage(compressedBase64); 
            };
            img.src = event.target?.result as string;
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(v));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || title.trim().length < 5) {
      setError("El título debe tener al menos 5 caracteres.");
      return;
    }

    setLoading(true);
    
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tag,
      cover_url: image,
      published: true,
    };

    try {
      const res = await fetch("/api/noticias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      
      router.push(ROUTES.adminNoticias);
      router.refresh();
    } catch (err) {
      setError("Fallo al guardar. Revisa que el campo 'cover_url' en Supabase acepte textos largos.");
      setLoading(false);
    }
  }

  const lbl = "text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1";
  const inp = "w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-100 text-xs sm:text-sm outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 transition-all bg-[#fafbfc] placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-[#fafbfc]" onPaste={handlePaste}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        
        {/* Header - responsive */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          <Link 
            href={ROUTES.adminNoticias} 
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 hover:text-brand-teal transition-all shadow-sm flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
              Nuevo Artículo
            </h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1">
              Dnamedics | Gestión de Contenido
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-8 md:p-10 lg:p-12 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 md:space-y-8">
            
            {/* Título */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className={lbl}>Título del Artículo *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => handleTitleChange(e.target.value)} 
                className={inp} 
                placeholder="Ej. Beneficios de la Quiropráxia"
                required 
              />
            </div>

            {/* SECCIÓN DE IMAGEN - responsive */}
            <div className="space-y-3 sm:space-y-4">
              <label className={lbl}>Imagen de Portada (Pega Ctrl+V)</label>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={image.startsWith("data:image") ? "✓ Imagen optimizada y lista" : image}
                    readOnly
                    placeholder="Presiona Ctrl+V para pegar la imagen de la noticia"
                    className={`${inp} pl-10 sm:pl-12 text-[10px] sm:text-xs ${image.startsWith("data:image") ? "text-brand-teal font-bold" : ""}`}
                  />
                  <ImageIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                  {image && (
                    <button 
                      type="button" 
                      onClick={() => setImage("")} 
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>

                {/* Previsualización */}
                {image ? (
                  <div className="relative group aspect-video w-full rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden border-2 sm:border-4 border-white shadow-lg bg-slate-50">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-sm">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-teal" />
                      <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-brand-navy uppercase tracking-tighter">
                        Imagen Lista
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-xl sm:rounded-2xl md:rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-slate-300 gap-2 sm:gap-3 p-4">
                    <ClipboardPaste className="w-6 h-6 sm:w-8 sm:h-8 opacity-20" />
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-bold tracking-widest opacity-40 text-center">
                      Presiona Ctrl+V para pegar imagen
                    </p>
                    <p className="text-[7px] sm:text-[8px] text-slate-300 opacity-30 hidden sm:block">
                      La imagen se optimizará automáticamente
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Grid - Categoría y Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className={lbl}>Categoría</label>
                <select value={tag} onChange={(e) => setTag(e.target.value)} className={inp}>
                  <option value="">Sin categoría</option>
                  {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className={lbl}>Slug URL</label>
                <input 
                  type="text" 
                  value={slug} 
                  className={`${inp} font-mono text-[9px] sm:text-[10px] bg-slate-50`} 
                  readOnly 
                />
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className={lbl}>Contenido del Artículo</label>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                rows={8} 
                className={`${inp} font-mono text-[10px] sm:text-xs leading-relaxed`}
                placeholder="Escribe el contenido de tu artículo aquí..."
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="p-3 sm:p-4 bg-rose-50 border border-rose-100 rounded-xl sm:rounded-2xl">
                <p className="text-rose-500 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                  {error}
                </p>
              </div>
            )}

            {/* Botón submit */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-brand-navy hover:bg-brand-teal text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all shadow-xl shadow-brand-navy/10 disabled:opacity-50"
            >
              {loading ? "Sincronizando con Dnamedics..." : "Publicar Artículo Ahora"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}