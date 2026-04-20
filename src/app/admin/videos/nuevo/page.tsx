"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NuevoVideoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    tag: "Medicina Natural",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("videos")
      .insert([
        {
          title: formData.title,
          description: formData.description,
          url: formData.url,
          tag: formData.tag,
          is_active: true,
        },
      ]);

    if (error) {
      alert("Error al guardar el video: " + error.message);
      setLoading(false);
    } else {
      router.push("/admin/videos");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        
        {/* BOTÓN REGRESAR - Responsive */}
        <Link 
          href="/admin/videos"
          className="group inline-flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 transition-all"
        >
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-100 shadow-sm group-hover:bg-[#f0f9ff] transition-all">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-[#007b8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 group-hover:text-[#1e3a8a] transition-colors">
            Cancelar y volver
          </span>
        </Link>

        {/* CONTENEDOR DEL FORMULARIO - Responsive */}
        <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] lg:rounded-[3.5rem] p-6 sm:p-8 md:p-12 lg:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
          
          {/* Decoración sutil de fondo */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-[#007b8f]/5 rounded-bl-[3rem] sm:rounded-bl-[5rem] -mr-6 sm:-mr-10 -mt-6 sm:-mt-10 blur-2xl" />

          <header className="relative mb-8 sm:mb-10 md:mb-12">
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl text-[#1e3a8a] mb-2 sm:mb-3" 
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Publicar <span className="italic font-light text-[#007b8f]">Nuevo Contenido</span>
            </h1>
            <p className="text-slate-400 font-light text-xs sm:text-sm max-w-md leading-relaxed">
              Define los detalles del video para mantener tu sección actualizada con los estándares de <span className="font-semibold text-[#1e3a8a]">DnaTV</span>.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 md:space-y-8 relative">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
              {/* Título */}
              <div className="md:col-span-2">
                <label className="block text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#1e3a8a] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3 ml-1 sm:ml-2">
                  Título del video
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ej: El equilibrio celular y la nutrición"
                  className="w-full px-5 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-5 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-[#007b8f]/5 focus:bg-white focus:border-[#007b8f]/20 transition-all text-slate-700 placeholder:text-slate-300 text-sm sm:text-base"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* URL de YouTube */}
              <div>
                <label className="block text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#1e3a8a] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3 ml-1 sm:ml-2">
                  Link de YouTube
                </label>
                <input
                  required
                  type="url"
                  placeholder="https://youtube.com/..."
                  className="w-full px-5 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-5 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-[#007b8f]/5 focus:bg-white focus:border-[#007b8f]/20 transition-all text-slate-700 placeholder:text-slate-300 text-sm sm:text-base"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              {/* Categoría / Tag */}
              <div>
                <label className="block text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#1e3a8a] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3 ml-1 sm:ml-2">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    className="w-full px-5 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-5 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-[#007b8f]/5 focus:bg-white focus:border-[#007b8f]/20 transition-all text-slate-700 appearance-none cursor-pointer text-sm sm:text-base"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  >
                    <option value="Medicina Natural">Medicina Natural</option>
                    <option value="Dnamedics">Dnamedics</option>
                    <option value="Bienestar">Bienestar</option>
                    <option value="Nutrición">Nutrición</option>
                  </select>
                  <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#1e3a8a] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3 ml-1 sm:ml-2">
                Resumen del Contenido
              </label>
              <textarea
                rows={4}
                placeholder="Describe brevemente el propósito de este video..."
                className="w-full px-5 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-5 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-[#007b8f]/5 focus:bg-white focus:border-[#007b8f]/20 transition-all text-slate-700 resize-none placeholder:text-slate-300 text-sm sm:text-base"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Botón de Envío */}
            <div className="pt-4 sm:pt-5 md:pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-4 sm:py-5 md:py-6 bg-[#1e3a8a] text-white rounded-xl sm:rounded-[1.5rem] md:rounded-[1.8rem] 
                  text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] 
                  shadow-xl shadow-blue-900/10 hover:bg-[#007b8f] 
                  hover:shadow-[#007b8f]/20 transition-all duration-500 
                  active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3
                `}
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar y Publicar"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer informativo */}
        <p className="text-center mt-8 sm:mt-10 md:mt-12 text-[8px] sm:text-[9px] md:text-[10px] text-slate-300 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium">
          Dnamedics Administrative Content Management System
        </p>
      </div>
    </div>
  );
}