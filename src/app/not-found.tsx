import Link from "next/link";
import { ROUTES } from "@/lib/utils/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-sm sm:max-w-md w-full">
        
        {/* Número 404 - Responsive */}
        <p
          className="text-6xl sm:text-7xl md:text-8xl font-semibold text-brand-teal mb-3 sm:mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          404
        </p>
        
        {/* Icono decorativo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-teal/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        {/* Título - Responsive */}
        <h1
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-brand-navy mb-2 sm:mb-3"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Página no encontrada
        </h1>
        
        {/* Descripción */}
        <p className="text-slate-500 font-light text-xs sm:text-sm mb-6 sm:mb-8 px-2">
          La página que buscas no existe, ha sido movida o no tienes permisos para acceder a ella.
        </p>
        
        {/* Botones de acción - Responsive */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
          <Link
            href={ROUTES.home}
            className="bg-brand-teal hover:bg-brand-navy text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-lg shadow-brand-teal/20 hover:shadow-xl"
          >
            Volver al inicio
          </Link>
          <Link
            href={ROUTES.login}
            className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all"
          >
            Iniciar sesión
          </Link>
        </div>
        
        {/* Enlaces adicionales */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200/50">
          <p className="text-[10px] sm:text-xs text-slate-400 mb-3">
            ¿Buscas algo específico?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/noticias" className="text-[10px] sm:text-xs text-brand-teal hover:underline font-medium">
              Artículos de salud
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/#servicios" className="text-[10px] sm:text-xs text-brand-teal hover:underline font-medium">
              Nuestros servicios
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/#contacto" className="text-[10px] sm:text-xs text-brand-teal hover:underline font-medium">
              Contactar soporte
            </Link>
          </div>
        </div>
        
        {/* Footer sutil */}
        <p className="text-[8px] sm:text-[10px] text-slate-300 mt-8 sm:mt-10 uppercase tracking-widest">
          Dnamedics · Bogotá
        </p>
      </div>
    </div>
  );
}