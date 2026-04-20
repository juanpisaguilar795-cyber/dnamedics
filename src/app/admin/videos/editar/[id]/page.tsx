"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/utils/constants";
import Link from "next/link";

export default function EditarVideoPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    tag: "",
    is_active: true
  });

  useEffect(() => {
    const fetchVideo = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setFormData({
          title: data.title,
          description: data.description || "",
          url: data.url,
          tag: data.tag || "Medicina Natural",
          is_active: data.is_active
        });
      }
      setLoading(false);
    };

    if (id) fetchVideo();
  }, [id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("videos")
      .update({
        title: formData.title,
        description: formData.description,
        url: formData.url,
        tag: formData.tag,
        is_active: formData.is_active
      })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar: " + error.message);
      setSaving(false);
    } else {
      router.push("/admin/videos");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center">
        <p className="text-slate-400 animate-pulse font-light tracking-widest uppercase text-[10px] sm:text-xs">
          Cargando DnaTV Media...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* BOTÓN DE ATRÁS - Responsive */}
        <Link 
          href="/admin/videos"
          className="group inline-flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 transition-all"
        >
          <div className="
            flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 
            rounded-full bg-white border border-slate-100 
            shadow-sm group-hover:shadow-md group-hover:border-[#007b8f]/20
            group-hover:bg-[#f0f9ff] transition-all duration-300
          ">
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-[#007b8f] transform group-hover:-translate-x-1 transition-all duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 group-hover:text-[#007b8f] transition-colors leading-none mb-1">
              Cancelar
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#1e3a8a]">
              Gestión de Videos
            </span>
          </div>
        </Link>

        {/* CONTENEDOR DEL FORMULARIO - Responsive */}
        <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-5 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden">
          {/* Decoración sutil superior */}
          <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-[#1e3a8a] to-[#007b8f]" />

          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#1e3a8a]" style={{ fontFamily: "var(--font-cormorant)" }}>
              Editar <span className="italic text-[#007b8f]">Contenido DnaTV</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-light mt-1 sm:mt-2">
              Modifica la información detallada de este video para tu audiencia.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 md:space-y-8">
            
            {/* Título */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest ml-1">
                Título del Video
              </label>
              <input
                required
                placeholder="Ej. Los beneficios de la medicina natural"
                className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#007b8f]/5 focus:bg-white focus:border-[#007b8f]/30 outline-none transition-all text-slate-700 text-sm sm:text-base"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* URL y Categoría en Fila - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest ml-1">
                  Enlace de YouTube
                </label>
                <input
                  required
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#007b8f]/5 focus:bg-white focus:border-[#007b8f]/30 outline-none transition-all text-slate-700 text-sm sm:text-base"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest ml-1">
                  Categoría
                </label>
                <select
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-[#007b8f]/5 focus:bg-white focus:border-[#007b8f]/30 transition-all text-slate-600 appearance-none cursor-pointer text-sm sm:text-base"
                  value={formData.tag}
                  onChange={(e) => setFormData({...formData, tag: e.target.value})}
                >
                  <option value="Medicina Natural">Medicina Natural</option>
                  <option value="Dnamedics">Dnamedics</option>
                  <option value="Bienestar">Bienestar</option>
                  <option value="Nutrición">Nutrición</option>
                </select>
              </div>
            </div>

            {/* BREVE DESCRIPCIÓN */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest ml-1">
                Breve Descripción
              </label>
              <textarea
                rows={4}
                placeholder="Escribe una pequeña reseña sobre el contenido de este video..."
                className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#007b8f]/5 focus:bg-white focus:border-[#007b8f]/30 outline-none transition-all text-slate-700 resize-none text-sm sm:text-base"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 italic ml-1">
                Esta descripción aparecerá debajo del video en la página principal.
              </p>
            </div>

            {/* Switch de Visibilidad - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-slate-50/50 rounded-xl sm:rounded-[1.5rem] border border-slate-100 group hover:bg-white hover:border-[#007b8f]/20 transition-all">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-[#1e3a8a]">Visibilidad Pública</span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-400">
                  ¿Deseas que este video sea visible para los pacientes?
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#007b8f]"></div>
              </label>
            </div>

            {/* BOTÓN DE GUARDAR */}
            <button
              type="submit"
              disabled={saving}
              className="
                w-full py-4 sm:py-5 bg-[#1e3a8a] text-white rounded-xl sm:rounded-2xl font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs
                hover:bg-[#007b8f] hover:shadow-[0_20px_40px_-10px_rgba(0,123,143,0.3)]
                transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {saving ? "Procesando cambios..." : "Actualizar Información"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}