"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteVideoButton({ videoId, videoTitle }: { videoId: string, videoTitle: string }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", videoId);

    if (error) {
      alert("Error: " + error.message);
      setIsDeleting(false);
      setIsOpen(false);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      {/* BOTÓN DISPARADOR (El de la tarjeta en la Videoteca) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
        title="Eliminar video"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* VENTANA MODAL (SIGUIENDO EL ESTILO DE TUS CAPTURAS) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Fondo con desenfoque como en la captura */}
          <div 
            className="absolute inset-0 bg-[#1e3a8a]/10 backdrop-blur-md transition-opacity"
            onClick={() => !isDeleting && setIsOpen(false)}
          />

          {/* Contenedor de la ventana - rounded-[3rem] como en la imagen */}
          <div className="relative bg-white w-full max-w-[400px] rounded-[3rem] p-12 shadow-2xl border border-slate-50 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              
              {/* Icono de advertencia en círculo gris claro */}
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100/50">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-3xl text-[#1e3a8a] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                Eliminar video
              </h3>
              
              <p className="text-slate-400 text-sm font-light mb-10 leading-relaxed px-2">
                ¿Estás seguro de que deseas eliminar <br />
                <span className="font-semibold text-[#1e3a8a]">"{videoTitle}"</span> de la videoteca?
              </p>

              {/* Botones de acción siguiendo la captura #3 */}
              <div className="flex flex-col w-full gap-5">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full py-4 bg-[#1e3a8a] text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-[#162a63] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? "Eliminando..." : "Confirmar eliminación"}
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="text-slate-400 text-sm font-medium hover:text-[#1e3a8a] transition-colors py-2"
                >
                  Volver al panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}