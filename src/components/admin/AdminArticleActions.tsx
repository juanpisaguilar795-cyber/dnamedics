"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface Props {
  articleId: string;
  slug:      string;
  published: boolean;
}

export function AdminArticleActions({ articleId, slug, published }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/noticias/${articleId}`, { method: "DELETE", credentials: "include" });
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  }

  const viewHref = published ? `/noticias/${slug}` : `/noticias/${articleId}`;

  return (
    <>
      <div className="flex items-center gap-3">
        {/* EDITAR */}
        <Link
          href={`/admin/noticias/${articleId}/editar`}
          className="flex items-center justify-center w-10 h-10 bg-white border border-slate-100 text-slate-400 hover:text-[#007b8f] hover:bg-[#f0f9ff] hover:border-[#007b8f]/20 rounded-xl transition-all duration-300 shadow-sm"
          title="Editar artículo"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>

        {/* VER/PREVIEW */}
        <a
          href={viewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 bg-white border border-slate-100 text-slate-400 hover:text-[#1e3a8a] hover:bg-blue-50 hover:border-blue-100 rounded-xl transition-all duration-300 shadow-sm"
          title={published ? "Ver artículo" : "Previsualizar"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </a>

        {/* ELIMINAR */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center w-10 h-10 bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all duration-300 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay con desenfoque suave */}
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-opacity" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 text-center transform transition-all animate-in fade-in zoom-in duration-300">
            {/* Icono de advertencia circular */}
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100/50">
              <svg className="w-8 h-8 text-slate-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-[28px] text-[#1e3a8a] mb-3 tracking-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              Eliminar artículo
            </h3>
            <p className="text-slate-400 text-[13px] font-normal leading-relaxed mb-10 px-4">
              ¿Estás seguro de que deseas eliminar este artículo de la sección de noticias?
            </p>

            <div className="space-y-4">
              {/* Botón Confirmar: Azul Oscuro según referencia */}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-4 bg-[#23314b] text-white rounded-[1.2rem] text-sm font-bold tracking-tight hover:bg-[#1e293b] transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Confirmar eliminación"}
              </button>
              
              {/* Botón Volver: Texto gris azulado */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 text-[#94a3b8] text-[13px] font-medium hover:text-slate-600 transition-colors"
              >
                Volver al panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}