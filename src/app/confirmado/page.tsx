import Link from "next/link";
import { ROUTES } from "@/lib/utils/constants";

export default function ConfirmadoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 bg-gradient-to-br from-[#fafbfc] to-[#f0f4f8]">
      
      {/* Card de confirmación - Responsive */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl max-w-sm sm:max-w-md w-full text-center border border-slate-100 animate-fade-in">
        
        {/* Icono de éxito */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-2 sm:mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
          ¡Email Confirmado!
        </h1>

        <p className="text-slate-500 mb-6 sm:mb-8 text-xs sm:text-sm leading-relaxed">
          Tu cuenta ha sido verificada correctamente. Ya puedes acceder a todos los servicios de Dnamedics.
        </p>

        <Link
          href={ROUTES.login}
          className="block w-full bg-[#007b8f] hover:bg-[#1e3a8a] text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#007b8f]/20 hover:shadow-xl hover:shadow-[#1e3a8a]/20"
        >
          Iniciar sesión
        </Link>

        <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-slate-400">
          ¿Necesitas ayuda?{" "}
          <Link href="/#contacto" className="text-[#007b8f] hover:underline font-medium">
            Contactar soporte
          </Link>
        </p>
      </div>
    </main>
  );
}