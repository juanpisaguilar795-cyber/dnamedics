"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Play, ChevronRight } from "lucide-react";

// ─── Tipos ──────────────────────────────────────────────────
interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  tag: string;
  is_active: boolean;
}

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
};

// ─── Reproductor YouTube Optimizado ──────────────────────────
function YouTubePlayer({ video }: { video: VideoItem }) {
  const [loaded, setLoaded] = useState(false);
  const videoId = getYoutubeId(video.url);

  useEffect(() => {
    setLoaded(false);
  }, [video.url]);

  return (
    <div 
      className="relative aspect-video bg-slate-900 rounded-xl sm:rounded-2xl lg:rounded-[2rem] overflow-hidden shadow-lg sm:shadow-xl cursor-pointer group"
      onClick={() => setLoaded(true)}
    >
      {loaded ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-brand-navy/10 transition-colors duration-300" />
          
          {/* Botón Play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/95 shadow-xl rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-teal">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-brand-teal group-hover:text-white ml-0.5 transition-colors" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Componente Principal Optimizado ─────────────────────────
export function VideoSection() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setVideos(data);
      }
      setLoading(false);
    };

    fetchVideos();
  }, [supabase]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-slate-200 rounded mb-4" />
            <div className="h-8 w-64 bg-slate-200 rounded mb-8" />
            <div className="aspect-video bg-slate-200 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;

  const video = videos[active];

  return (
    <section id="videos" className="py-12 sm:py-16 lg:py-20 bg-[#f0f9ff] scroll-mt-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Más compacto */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-brand-teal font-bold sm:font-black mb-2 block">
            Educación y Bienestar
          </span>
          <h2 
            className="text-xl sm:text-2xl lg:text-3xl text-brand-navy leading-tight" 
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Aprende sobre tu{" "}
            <span className="italic text-brand-teal">proceso de sanación</span>
          </h2>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Columna del video principal */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <YouTubePlayer video={video} />
            
            {/* Info del video - Más compacta */}
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-slate-100 p-4 sm:p-5 lg:p-6 shadow-md">
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-brand-teal font-bold block mb-1.5">
                {video.tag}
              </span>
              <h3 className="text-base sm:text-lg lg:text-xl text-brand-navy font-semibold mb-2">
                {video.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                {video.description}
              </p>
            </div>
          </div>

          {/* Playlist - Desktop siempre visible, móvil con toggle */}
          <div className="lg:block">
            
            {/* Toggle para móvil */}
            <div className="lg:hidden mb-3">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm font-medium text-brand-navy"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-brand-teal" />
                  {showPlaylist ? "Ocultar" : "Ver"} lista de videos ({videos.length})
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showPlaylist ? "rotate-90" : ""}`} />
              </button>
            </div>
            
            {/* Lista de videos */}
            <div className={`
              space-y-2 max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-1
              ${showPlaylist ? "block" : "hidden lg:block"}
            `}>
              <p className="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold mb-2 px-2 hidden lg:block">
                DnaTV · {videos.length} videos
              </p>
              
              {videos.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setActive(i);
                    setShowPlaylist(false); // Cerrar playlist en móvil al seleccionar
                  }}
                  className={`
                    group flex items-center gap-3 p-3 rounded-lg sm:rounded-xl text-left transition-all duration-300 w-full
                    ${active === i 
                      ? "bg-white border border-brand-teal/30 shadow-md" 
                      : "hover:bg-white/80 border border-transparent"}
                  `}
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-12 sm:w-24 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                    <img 
                      src={`https://img.youtube.com/vi/${getYoutubeId(v.url)}/mqdefault.jpg`} 
                      className="w-full h-full object-cover" 
                      alt={v.title}
                      loading="lazy"
                    />
                    {active === i && (
                      <div className="absolute inset-0 bg-brand-teal/20 flex items-center justify-center">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                          <Play className="w-2.5 h-2.5 text-brand-teal ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] sm:text-[9px] text-brand-teal/70 uppercase font-bold tracking-wider block mb-0.5">
                      {v.tag}
                    </span>
                    <p className={`
                      text-[11px] sm:text-xs leading-snug line-clamp-2
                      ${active === i ? "text-brand-navy font-semibold" : "text-slate-600 font-medium"}
                    `}>
                      {v.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Badge de total en móvil cuando está colapsado */}
            {!showPlaylist && (
              <div className="lg:hidden mt-2 text-center">
                <span className="text-[10px] text-slate-400">
                  {videos.length} videos disponibles
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}