import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug, getArticleById } from "@/modules/noticias/repositories/noticias.repository";
import { 
  ChevronLeft, 
  Calendar, 
  Stethoscope, 
  Activity, 
  FileText, 
  MessageCircle, 
  Facebook, 
  Instagram,
} from "lucide-react";

export const revalidate = 60;

interface Props { params: { slug: string } }

/**
 * Validador para evitar errores de sintaxis en PostgreSQL (UUID)
 */
const isUUID = (str: string) => 
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Intentamos primero por slug
  let article = await getArticleBySlug(params.slug).catch(() => null);
  
  // Si no hay artículo y el parámetro parece un ID, intentamos por ID
  if (!article && isUUID(params.slug)) {
    article = await getArticleById(params.slug).catch(() => null);
  }
  
  if (!article) return { title: "Artículo – Dnamedics Bogotá" };
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dnamedics.vercel.app';

  return {
    title: `${article.title} – Dnamedics`,
    description: article.excerpt ?? "Contenido especializado de salud integral en Dnamedics Bogotá.",
    openGraph: {
      title: article.title,
      description: article.excerpt ?? "",
      type: "article",
      url: `${siteUrl}/noticias/${article.slug}`,
      images: article.cover_url ? [{
        url: article.cover_url,
        width: 1200,
        height: 630,
        alt: `Imagen de portada para ${article.title}`
      }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt ?? "",
      images: article.cover_url ? [article.cover_url] : [],
    },
  };
}

const ICON_LIST = [
  <Stethoscope key="1" className="w-16 h-16 sm:w-20 sm:h-20" />, 
  <Activity key="2" className="w-16 h-16 sm:w-20 sm:h-20" />, 
  <FileText key="3" className="w-16 h-16 sm:w-20 sm:h-20" />
];

export default async function ArticlePage({ params }: Props) {
  // Aplicamos la misma lógica de búsqueda segura
  let article = await getArticleBySlug(params.slug).catch(() => null);

  if (!article && isUUID(params.slug)) {
    article = await getArticleById(params.slug).catch(() => null);
  }

  if (!article) notFound();

  const iconIndex = params.slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % ICON_LIST.length;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dnamedics.vercel.app';
  const shareUrl = `${siteUrl}/noticias/${article.slug}`;
  const encodedTitle = encodeURIComponent(article.title);

  return (
    <>
      <Navbar />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 min-h-screen bg-[#FDFDFD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb - Responsive */}
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-6 sm:mb-8 md:mb-10">
            <Link href="/" className="hover:text-brand-teal transition-colors">Inicio</Link>
            <span className="opacity-30">/</span>
            <Link href="/noticias" className="hover:text-brand-teal transition-colors">Artículos</Link>
            <span className="opacity-30">/</span>
            <span className="text-brand-navy font-bold truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">
              {article.title}
            </span>
          </nav>

          {/* Header - Responsive */}
          <header className="mb-8 sm:mb-10 md:mb-12">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
              {(article as any).tag && (
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-brand-teal/10 text-brand-teal px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  {(article as any).tag}
                </span>
              )}
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {new Date(article.created_at).toLocaleDateString("es-CO", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-brand-navy leading-[1.2] mb-5 sm:mb-6 md:mb-8"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-base sm:text-lg md:text-xl text-slate-500 font-light leading-relaxed border-l-2 sm:border-l-3 border-brand-teal/30 pl-4 sm:pl-5 md:pl-6 italic">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Portada - Responsive */}
          <div className="relative mb-10 sm:mb-12 md:mb-16">
            {article.cover_url ? (
              <div className="aspect-video w-full rounded-xl sm:rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg sm:shadow-xl bg-slate-50">
                <img 
                  src={article.cover_url} 
                  alt={`Imagen de portada para ${article.title}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-48 sm:h-56 md:h-64 lg:h-[380px] bg-[#F2F9F9] rounded-xl sm:rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] border border-brand-teal/5 flex items-center justify-center text-brand-teal/60">
                <div className="transition-transform duration-700 hover:scale-110">
                  {ICON_LIST[iconIndex]}
                </div>
              </div>
            )}
          </div>

          {/* Contenido - Responsive */}
          <div className="max-w-2xl mx-auto">
            <article className="prose prose-slate prose-base sm:prose-lg max-w-none mb-12 sm:mb-16 md:mb-20">
              {article.content ? (
                <div
                  className="article-content text-slate-600 leading-relaxed font-light text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="p-8 sm:p-10 md:p-12 bg-slate-50 rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-dashed border-slate-200 text-center text-slate-400 font-light italic text-sm sm:text-base">
                  Contenido en redacción por nuestro equipo médico de Dnamedics.
                </div>
              )}
            </article>

            {/* Barra de redes sociales - Responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-6 sm:pt-8 md:pt-10 border-t border-slate-100 mb-12 sm:mb-16 md:mb-20">
              <Link
                href="/noticias"
                className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-navy hover:text-brand-teal transition-all group"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
                Volver a artículos
              </Link>

              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-wrap justify-center">
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-300">Compartir:</span>
                
                {/* WhatsApp */}
                <a href={`https://api.whatsapp.com/send?text=${encodedTitle} - ${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#25D366] transition-colors">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                
                {/* TikTok */}
                <a href="https://www.tiktok.com/@dnamedics" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.16.99.13 2.02.77 2.82.63.8 1.62 1.3 2.63 1.3 1.15.09 2.33-.42 2.9-1.43.24-.41.36-.88.37-1.35.01-4.24-.01-8.49.01-12.74Z" />
                  </svg>
                </a>

                {/* Threads */}
                <a href={`https://www.threads.net/intent/post?text=${encodedTitle}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12s-2.5 5.5-5.5 5.5c-1.5 0-3-.5-4-1.5m-1.5-4c0 3-2.5 5.5-5.5 5.5S1 15 1 12s2.5-5.5 5.5-5.5 5.5 2.5 5.5 5.5Zm0 0v6.5c0 1.5-1 2.5-2.5 2.5s-2.5-1-2.5-2.5" />
                  </svg>
                </a>

                {/* Instagram */}
                <a href="https://instagram.com/dnamedics" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#E4405F] transition-colors">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>

                {/* Facebook */}
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1877F2] transition-colors">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>

                {/* X (Twitter) */}
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black transition-colors">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* CTA Final - Responsive */}
            <div className="bg-brand-navy rounded-xl sm:rounded-2xl md:rounded-[2rem] lg:rounded-[3rem] p-6 sm:p-8 md:p-12 lg:p-16 text-center relative overflow-hidden mb-12 sm:mb-16">
              {/* Efectos de fondo */}
              <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-brand-teal/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-brand-teal/5 rounded-full blur-3xl -ml-16 -mb-16 opacity-50" />
              
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 sm:mb-4 md:mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
                  ¿Deseas profundizar en <br className="hidden sm:block" />
                  <span className="italic text-brand-teal">tu recuperación?</span>
                </h2>
                <p className="text-slate-300 font-light mb-6 sm:mb-8 md:mb-10 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                  Agenda una valoración presencial en Bogotá y comienza tu proceso de bienestar integral hoy mismo.
                </p>
                <Link 
                  href="/#reserva" 
                  className="inline-block bg-brand-teal hover:bg-teal-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all shadow-lg hover:shadow-xl"
                >
                  Agendar consulta ahora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}