"use client";
import { useState } from "react";

interface Props {
  label?: string;
  className?: string;
}

export function SignOutButton({ label = "Cerrar sesión", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error signing out", error);
    }
    window.location.href = "/login";
  }

  return (
    <>
      {/* CONTENEDOR QUE ALINEA A LA DERECHA */}
      <div className="flex justify-end w-full">
        <button
          onClick={() => setOpen(true)}
          className={`
            flex items-center justify-center gap-1.5 sm:gap-2 
            px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 
            rounded-xl sm:rounded-2xl
            bg-white border border-slate-200
            text-[11px] sm:text-xs lg:text-[13px] font-medium text-slate-600
            hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900
            transition-all duration-300 shadow-sm active:scale-95
            ${className}
          `}
        >
          <svg 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" 
            />
          </svg>
          <span className="hidden xs:inline">{label}</span>
          <span className="xs:hidden">Salir</span>
        </button>
      </div>

      {/* Modal de confirmación - Responsive */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-3 sm:px-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-opacity"
            onClick={() => !loading && setOpen(false)}
          />

          <div className="relative bg-white rounded-2xl sm:rounded-[2rem] shadow-xl w-full max-w-[300px] sm:max-w-[340px] p-5 sm:p-6 lg:p-8 animate-in fade-in zoom-in duration-200">
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-slate-100">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h2 
                className="text-xl sm:text-2xl text-[#1e293b] mb-1.5 sm:mb-2"
                style={{ fontFamily: 'var(--font-cormorant), serif' }}
              >
                {loading ? "Saliendo..." : "Cerrar Sesión"}
              </h2>

              <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed mb-6 sm:mb-8 px-2">
                {loading 
                  ? "Estamos finalizando tu conexión de forma segura." 
                  : "¿Estás seguro de que deseas salir del panel administrativo?"}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-1 sm:py-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 border-[3px] border-slate-200 border-t-slate-800 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:gap-3">
                <button
                  onClick={handleSignOut}
                  className="w-full bg-[#1e293b] text-white py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                  Confirmar salida
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full bg-transparent text-slate-400 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-[13px] font-normal hover:text-slate-600 transition-colors"
                >
                  Volver al panel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}