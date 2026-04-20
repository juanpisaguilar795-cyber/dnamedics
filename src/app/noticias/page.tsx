import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { getPublishedArticles } from "@/modules/noticias/repositories/noticias.repository";
import Link from "next/link";
import type { Metadata } from "next";
import { 
  FileText, 
  Activity, 
  Stethoscope, 
  Heart, 
  Thermometer, 
  ShieldCheck, 
  ArrowRight,
  Calendar
} from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Artículos y consejos de salud – Dnamedics",
  description: "Contenido especializado sobre fisioterapia y bienestar integral en Bogotá.",
};

const ICON_LIST = [
  <FileText className="w-8 h-8 sm:w-9 md:w-10" />,
  <Activity className="w-8 h-8 sm:w-9 md:w-10" />,
  <Stethoscope className="w-8 h-8 sm:w-9 md:w-10" />,
  <Heart className="w-8 h-8 sm:w-9 md:w-10" />,
  <Thermometer className="w-8 h-8 sm:w-9 md:w-10" />,
  <ShieldCheck className="w-8 h-8 sm:w-9 md:w-10" />,
];

const MOCK_ARTICLES = [
  { id:"1", slug:"medicina-biorreguladora-heel", tag:"Medicina Natural", title:"Medicina Biorreguladora Heel: cómo funciona y para qué sirve", excerpt:"Conoce cómo los productos Heel estimulan los mecanismos naturales del cuerpo para sanar desde adentro.", created_at:"2025-03-15" },
  { id:"2", slug:"ajuste-quiropractico", tag:"Quiropráxia", title:"Ajuste quiropráctico: cuándo es recomendable y qué esperar", excerpt:"La quiropráxia ofrece resultados sorprendentes para dolores cervicales, lumbares y migrañas tensionales.", created_at:"2025-03-08" },
  { id:"3", slug:"plasma-rico-plaquetas", tag:"Medicina Regenerativa", title:"Plasma Rico en Plaquetas: la regeneración que viene de ti mismo", excerpt:"Descubre cómo los factores de crecimiento de tu propia sangre pueden acelerar tu recuperación tisular.", created_at:"2025-03-01" },
  { id:"4", slug:"kinesiotaping-rehabilitacion", tag:"Deporte", title:"Kinesiotaping: qué es y cómo ayuda en la rehabilitación deportiva", excerpt:"El vendaje neuromuscular es una herramienta poderosa para deportistas en proceso de recuperación.", created_at:"2025-02-22" },
  { id:"5", slug:"estres-lesiones-musculares", tag:"Bienestar", title:"La conexión entre el estrés y las lesiones musculoesqueléticas", excerpt:"Entender el impacto del estrés en nuestro cuerpo es clave para un tratamiento integral y duradero.", created_at:"2025-02-14" },
  { id:"6", slug:"cupping-therapy-ventosas", tag:"Terapias", title:"Cupping Therapy: beneficios y mitos de la terapia con ventosas", excerpt:"Una técnica milenaria que está revolucionando la fisioterapia moderna con evidencia científica.", created_at:"2025-02-07" },
];

export default async function NoticiasPage() {
  let articles: typeof MOCK_ARTICLES = [];
  try {
    const data = await getPublishedArticles();
    articles = data.length > 0 ? (data as any) : MOCK_ARTICLES;
  } catch {
    articles = MOCK_ARTICLES;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 min-h-screen bg-[#FDFDFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Header - Responsive */}
          <div className="max-w-3xl mb-8 sm:mb-12 md:mb-16">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-brand-teal font-black mb-3 sm:mb-4 block">
              Recursos de Salud
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-navy leading-[1.1] mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Artículos y consejos <br className="hidden sm:block" />
              <span className="italic text-brand-teal">especializados.</span>
            </h1>
            <p className="text-slate-500 font-light text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Explora nuestra biblioteca de contenidos sobre medicina integrativa y fisioterapia avanzada.
            </p>
          </div>

          {/* Grid de artículos - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {articles.map((article, i) => (
              <Link 
                key={article.id} 
                href={`/noticias/${article.slug}`}
                className="group"
              >
                <article className="flex flex-col h-full border-b border-slate-100 pb-6 sm:pb-8 transition-all hover:border-brand-teal/30">
                  
                  {/* Icono Minimalista */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#F2F9F9] flex items-center justify-center text-brand-teal mb-5 sm:mb-6 md:mb-8 group-hover:bg-brand-teal group-hover:text-white transition-all duration-500">
                    {ICON_LIST[i % ICON_LIST.length]}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-teal">
                      {article.tag ?? "Clínica"}
                    </span>
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {new Date(article.created_at).toLocaleDateString("es-CO", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                  </div>

                  <h2 
                    className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-navy mb-2 sm:mb-3 leading-snug group-hover:text-brand-teal transition-colors duration-300 line-clamp-2"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {article.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed line-clamp-3 mb-4 sm:mb-5 md:mb-6">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-navy group-hover:text-brand-teal transition-all">
                    Leer más <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* CTA de Reserva - Responsive */}
          <div className="mt-16 sm:mt-20 md:mt-24 bg-brand-navy rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Decoración sutil */}
            <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-brand-teal/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-brand-teal/5 rounded-full blur-3xl -ml-16 -mb-16" />
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-white mb-3 sm:mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                ¿Necesitas una valoración médica?
              </h2>
              <p className="text-slate-300 font-light mb-6 sm:mb-8 md:mb-10 max-w-md mx-auto text-xs sm:text-sm">
                Agenda tu cita en nuestra sede de Bogotá y recibe atención personalizada de nuestro equipo.
              </p>
              <Link
                href="/#reserva"
                className="inline-block bg-brand-teal hover:bg-teal-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all shadow-lg shadow-brand-teal/20 hover:shadow-xl hover:shadow-brand-teal/30"
              >
                Agendar Cita Ahora
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}