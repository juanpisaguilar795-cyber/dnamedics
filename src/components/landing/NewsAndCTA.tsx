"use client";
import Link from "next/link";
import { getWhatsAppUrl, ROUTES } from "@/lib/utils/constants";
import { Leaf, Bone, Activity } from "lucide-react"; 

const articles = [
  { 
    tag: "Medicina Natural", 
    icon: <Leaf className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />,
    title: "Medicina Biorreguladora Heel: el equilibrio desde el interior", 
    excerpt: "Descubre cómo estimular los mecanismos naturales de sanación de tu cuerpo con ciencia de vanguardia." 
  },
  { 
    tag: "Quiropráxia", 
    icon: <Bone className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />, 
    title: "El Ajuste Quiropráctico: más allá del alivio inmediato", 
    excerpt: "Resultados profundos para migrañas y dolores crónicos mediante la alineación estructural de tu bienestar." 
  },
  { 
    tag: "Regenerativa", 
    icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />, 
    title: "Plasma Rico en Plaquetas: regeneración biológica avanzada", 
    excerpt: "Utiliza tus propios factores de crecimiento para acelerar la recuperación tisular y vitalidad celular." 
  },
];

export function NewsPreviewSection() {
  return (
    <section id="noticias" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#fafbfc] scroll-mt-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-teal mb-3 sm:mb-4 block">
              Nuestro Blog
            </span>
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-navy leading-[1.2] mb-4 sm:mb-6" 
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Artículos y <br />
              <span className="italic text-brand-teal">consejos para tu salud.</span>
            </h2>
            <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-brand-teal/20 mt-3 sm:mt-4 rounded-full" />
          </div>
          <Link href="/noticias" className="group text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-brand-navy flex items-center gap-2 hover:text-brand-teal transition-colors">
            Ver biblioteca completa <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {articles.map((a) => (
            <article key={a.title} className="group bg-white rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 lg:p-10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden">
              
              {/* Icono */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 text-brand-teal bg-brand-teal/5 group-hover:bg-brand-teal group-hover:text-white transition-all duration-500">
                {a.icon}
              </div>
              
              <span className="text-[8px] sm:text-[9px] font-black text-brand-teal uppercase tracking-[0.15em] sm:tracking-[0.2em]">{a.tag}</span>
              <h3 className="text-lg sm:text-xl text-brand-navy mt-2 sm:mt-3 mb-3 sm:mb-4 leading-snug group-hover:text-brand-teal transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
                {a.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-6 sm:mb-8">
                {a.excerpt}
              </p>
              <Link href="/noticias" className="inline-flex items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-brand-navy group/link">
                <span className="border-b-2 border-brand-teal/20 group-hover/link:border-brand-teal transition-all pb-1">Leer artículo</span>
                <span className="ml-2 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  const waUrl = getWhatsAppUrl("Hola, quiero agendar mi primera cita en Dnamedics");
  return (
    <section id="contacto" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-brand-navy relative overflow-hidden scroll-mt-nav">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-teal/10 blur-[80px] sm:blur-[100px] lg:blur-[120px] rounded-full translate-x-1/2 -z-0" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-brand-teal block mb-4 sm:mb-6">
          Comienza tu transformación
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6 sm:mb-8 leading-[1.1]" style={{ fontFamily: "var(--font-cormorant)" }}>
          ¿Listo para mejorar <br />
          <span className="italic text-brand-teal">tu calidad de vida?</span>
        </h2>
        <p className="text-slate-300 font-light text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 lg:mb-12 max-w-xl mx-auto leading-relaxed">
          Agenda tu primera consulta hoy y experimenta un enfoque integral diseñado exclusivamente para tu bienestar.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative z-20 max-w-md sm:max-w-none mx-auto">
          <Link href={ROUTES.registro}
            className="w-full sm:w-auto bg-white text-brand-navy px-6 sm:px-8 lg:px-10 py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all hover:bg-brand-teal hover:text-white hover:shadow-xl active:scale-95 text-center">
            Crear mi cuenta gratis
          </Link>
          
          {/* Botón WhatsApp */}
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#1da851] text-white px-6 sm:px-8 lg:px-10 py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all hover:shadow-[0_10px_30px_rgba(37,211,102,0.3)] active:scale-95">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}