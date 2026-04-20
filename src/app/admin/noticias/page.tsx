import { redirect } from "next/navigation";
import { requireAdmin } from "@/modules/auth/services/auth.service";
import { adminGetAllArticles, adminDeleteArticle } from "@/modules/noticias/services/noticias.service";
import { ROUTES } from "@/lib/utils/constants";
import Link from "next/link";
import { revalidatePath } from "next/cache";

// ------------------------------------------------------------
// SERVER ACTION - Se ejecuta en el servidor, no muestra JSON
// ------------------------------------------------------------
async function deleteArticleAction(formData: FormData) {
  "use server";
  
  const articleId = formData.get("articleId") as string;
  
  if (!articleId) return;
  
  await adminDeleteArticle(articleId);
  revalidatePath("/admin/noticias");
}

// ------------------------------------------------------------
// PÁGINA PRINCIPAL
// ------------------------------------------------------------
export default async function AdminNoticiasPage() {
  const admin = await requireAdmin().catch(() => null);
  if (!admin) redirect(ROUTES.login);
  const articles = await adminGetAllArticles().catch(() => []);

  const IconWrapper = ({ children, className = "w-4 h-4" }: { children: React.ReactNode, className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {children}
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        
        {/* Header Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <Link href={ROUTES.adminDashboard} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 hover:text-brand-teal hover:border-brand-teal/20 transition-all shadow-sm">
              <IconWrapper className="w-4 h-4 sm:w-5 sm:h-5"><path d="M15 19l-7-7 7-7" /></IconWrapper>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
                Biblioteca de Artículos
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-brand-teal uppercase tracking-[0.15em] sm:tracking-[0.2em]">Gestión de Contenidos</span>
                <span className="text-slate-200 text-[10px] hidden sm:inline">•</span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{articles.length} Registros</span>
              </div>
            </div>
          </div>

          <Link href="/admin/noticias/nuevo"
            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-brand-navy hover:bg-brand-teal text-white text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-brand-navy/10 hover:shadow-brand-teal/20 w-full sm:w-auto">
            <IconWrapper className="w-3 h-3 sm:w-3.5 sm:h-3.5"><path d="M12 4v16m8-8H4" /></IconWrapper>
            <span className="whitespace-nowrap">Redactar Nuevo</span>
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-12 sm:p-16 md:p-20 text-center shadow-sm">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-slate-200">
              <IconWrapper className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /></IconWrapper>
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">No se han encontrado publicaciones</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            
            {/* VISTA DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-50 bg-[#fafbfc]/50">
                    <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em] text-left">Título del Artículo</th>
                    <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em] text-left">Ruta (Slug)</th>
                    <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em] text-left">Estado</th>
                    <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em] text-left">Fecha de Creación</th>
                    <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em] text-center w-36">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {articles.map((article) => (
                    <tr key={article.id} className="group hover:bg-[#fafbfc] transition-all">
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6">
                        <p className="text-xs md:text-sm font-bold text-brand-navy group-hover:text-brand-teal transition-colors line-clamp-1 max-w-sm">
                          {article.title}
                        </p>
                      </td>
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6">
                        <span className="text-[8px] md:text-[9px] lg:text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 whitespace-nowrap">
                          /{article.slug}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${article.published ? "bg-emerald-400" : "bg-slate-300"}`} />
                          <span className={`text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${article.published ? "text-emerald-600" : "text-slate-400"} whitespace-nowrap`}>
                            {article.published ? "Publicado" : "Borrador"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6">
                        <span className="text-[9px] md:text-[10px] lg:text-[11px] font-medium text-slate-400 whitespace-nowrap">
                          {new Date(article.created_at).toLocaleDateString("es-CO", { 
                            day: "2-digit", 
                            month: "short", 
                            year: "numeric" 
                          }).replace(".", "")}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6">
                        <div className="flex items-center justify-center gap-2">
                          {/* VER */}
                          <Link
                            href={`/noticias/${article.slug}`}
                            target="_blank"
                            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-emerald-500 text-slate-500 hover:text-white transition-all"
                            title="Ver artículo"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          {/* EDITAR */}
                          <Link
                            href={`/admin/noticias/${article.id}/editar`}
                            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-brand-teal text-slate-500 hover:text-white transition-all"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          {/* ELIMINAR - SERVER ACTION (NO MUESTRA JSON) */}
                          <form action={deleteArticleAction}>
                            <input type="hidden" name="articleId" value={article.id} />
                            <button
                              type="submit"
                              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-rose-500 text-slate-500 hover:text-white transition-all"
                              title="Eliminar"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VISTA MOBILE */}
            <div className="md:hidden divide-y divide-slate-50">
              {articles.map((article) => (
                <div key={article.id} className="p-4 sm:p-6 hover:bg-[#fafbfc] transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${article.published ? "bg-emerald-400" : "bg-slate-300"}`} />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {article.published ? "Publicado" : "Borrador"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-brand-navy leading-tight line-clamp-2 mb-2">{article.title}</p>
                      <span className="inline-block text-[8px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        /{article.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* VER */}
                      <Link
                        href={`/noticias/${article.slug}`}
                        target="_blank"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-emerald-500 text-slate-500 hover:text-white transition-all"
                        title="Ver"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      {/* EDITAR */}
                      <Link
                        href={`/admin/noticias/${article.id}/editar`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-brand-teal text-slate-500 hover:text-white transition-all"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      {/* ELIMINAR - SERVER ACTION */}
                      <form action={deleteArticleAction}>
                        <input type="hidden" name="articleId" value={article.id} />
                        <button
                          type="submit"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-rose-500 text-slate-500 hover:text-white transition-all"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-50">
                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-400">
                       {new Date(article.created_at).toLocaleDateString("es-CO", {
                         day: "2-digit",
                         month: "short"
                       }).replace(".", "")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}