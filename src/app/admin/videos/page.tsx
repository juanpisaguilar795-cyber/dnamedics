import { guardAdmin } from "@/lib/utils/serverGuards";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/utils/constants";
import Link from "next/link";
import { DeleteVideoButton } from "@/components/admin/DeleteVideoButton";

export default async function AdminVideosPage() {
  await guardAdmin();
  const supabase = await createClient();

  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* BOTÓN REGRESAR - Responsive */}
        <Link 
          href={ROUTES.adminDashboard}
          className="group inline-flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 transition-all"
        >
          <div className="
            flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 
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
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 group-hover:text-[#007b8f] transition-colors leading-none mb-1">
              Regresar
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#1e3a8a]">
              Panel de Control
            </span>
          </div>
        </Link>

        {/* HEADER - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1e3a8a] leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              Gestión de <br className="hidden sm:block" />
              <span className="italic font-light text-[#007b8f]">Contenido DnaTV</span>
            </h1>
          </div>
          
          <Link 
            href="/admin/videos/nuevo" 
            className="
              inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 
              bg-[#1e3a8a] text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]
              hover:bg-[#007b8f] hover:shadow-[0_20px_40px_-10px_rgba(0,123,143,0.3)]
              transition-all duration-500 active:scale-95 shadow-xl shadow-blue-900/10
              w-full sm:w-auto
            "
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            <span className="whitespace-nowrap">Nuevo Video</span>
          </Link>
        </div>

        {/* GRID DE VIDEOS - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
          {videos?.map((video) => {
            const match = video.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
            const videoId = (match && match[2].length === 11) ? match[2] : "";

            return (
              <div key={video.id} className="group bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-3 sm:p-4 border border-slate-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700">
                {/* Thumbnail */}
                <div className="aspect-[16/10] rounded-xl sm:rounded-[1.5rem] md:rounded-[2.2rem] overflow-hidden relative bg-slate-100">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className={`absolute top-3 sm:top-4 right-3 sm:right-4 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${
                    video.is_active 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}>
                    {video.is_active ? "● Activo" : "○ Oculto"}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-3 sm:p-4 md:p-6">
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#007b8f] font-black">
                    {video.tag || "Salud"}
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl text-[#1e3a8a] mt-1 sm:mt-2 mb-2 sm:mb-3 line-clamp-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {video.title}
                  </h3>
                  
                  {/* DESCRIPCIÓN BREVE */}
                  <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed line-clamp-2 mb-4 sm:mb-6 md:mb-8 min-h-[2.5rem]">
                    {video.description || "Sin descripción disponible para esta cápsula."}
                  </p>
                  
                  {/* ACCIONES - Ver, Editar, Eliminar */}
                  <div className="flex justify-end items-center gap-2 sm:gap-3 border-t border-slate-50 pt-4 sm:pt-5">
                    {/* VER */}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 
                        bg-[#f8fafc] text-slate-400 hover:text-emerald-500 
                        hover:bg-emerald-50 rounded-xl sm:rounded-2xl transition-all duration-300
                        border border-transparent hover:border-emerald-500/10
                      "
                      title="Ver video"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>

                    {/* EDITAR */}
                    <Link 
                      href={`/admin/videos/editar/${video.id}`}
                      className="
                        flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 
                        bg-[#f8fafc] text-slate-400 hover:text-[#007b8f] 
                        hover:bg-[#f0f9ff] rounded-xl sm:rounded-2xl transition-all duration-300
                        border border-transparent hover:border-[#007b8f]/10
                      "
                      title="Editar contenido"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>

                    {/* ELIMINAR */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center">
                      <DeleteVideoButton videoId={video.id} videoTitle={video.title} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {(!videos || videos.length === 0) && (
            <div className="col-span-full py-20 sm:py-32 md:py-40 text-center rounded-2xl sm:rounded-[3rem] md:rounded-[4rem] bg-white border border-dashed border-slate-200">
              <p className="text-slate-400 font-light text-base sm:text-lg italic">No hay contenido en DnaTV todavía.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}