"use client";
import Link from "next/link";
import { ROUTES } from "@/lib/utils/constants";

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-[#fafbfc] py-8 sm:py-12 md:py-16 lg:py-24 relative overflow-hidden">
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-teal/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-navy/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[120px] -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header de la página */}
        <header className="mb-8 sm:mb-12 lg:mb-16 text-center sm:text-left">
          <Link 
            href={ROUTES.registro} 
            className="text-[9px] sm:text-[10px] font-black text-brand-teal uppercase tracking-[0.2em] mb-6 sm:mb-8 inline-flex items-center gap-2 hover:text-brand-navy transition-colors"
          >
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Volver al registro
          </Link>
          
          <h1 
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-brand-navy leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Términos y <br className="hidden sm:block" /> Condiciones
          </h1>
          <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center sm:justify-start">
            <span className="h-px w-8 sm:w-12 bg-brand-teal/30" />
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Versión 2.0 — Actualizado 2026
            </p>
          </div>
        </header>

        {/* Contenido Principal */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-5 sm:p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100">
          <article className="prose prose-slate max-w-none">
            <p className="text-slate-500 leading-relaxed font-light mb-8 sm:mb-12 text-xs sm:text-sm">
              Bienvenido a <span className="text-brand-navy font-semibold">Dnamedics</span>. Al acceder y utilizar nuestra plataforma, aceptas los siguientes términos y condiciones. Nuestra misión es ofrecerte una gestión de salud integral basada en la confianza y la transparencia tecnológica.
            </p>

            <div className="space-y-8 sm:space-y-10 lg:space-y-12 text-slate-600">
              <section className="group">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-black text-brand-teal/40 group-hover:text-brand-teal transition-colors">01</span>
                  <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-widest">Uso del servicio</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-light ml-7 sm:ml-8">
                  Dnamedics es una plataforma digital orientada a la gestión de información relacionada con la salud y bienestar. El usuario se compromete a utilizar la plataforma de manera responsable y conforme a la ley vigente.
                </p>
              </section>

              <section className="group">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-black text-brand-teal/40 group-hover:text-brand-teal transition-colors">02</span>
                  <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-widest">Registro de cuenta</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-light ml-7 sm:ml-8">
                  Para acceder a ciertas funcionalidades, debes crear una cuenta proporcionando información veraz. El usuario es el único responsable de:
                </p>
                <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 ml-7 sm:ml-8">
                  <li className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal/40 flex-shrink-0" />
                    Mantener la confidencialidad de su contraseña de acceso.
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal/40 flex-shrink-0" />
                    Todas las actividades realizadas bajo su perfil de usuario.
                  </li>
                </ul>
              </section>

              <section className="group">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-black text-brand-teal/40 group-hover:text-brand-teal transition-colors">03</span>
                  <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-widest">Restricciones</h2>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 ml-7 sm:ml-8">
                  {[
                    "Uso para fines ilegales",
                    "Vulneración de seguridad",
                    "Suplantación de identidad",
                    "Información engañosa"
                  ].map((item, i) => (
                    <div key={i} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#fafbfc] border border-slate-50 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="group">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-black text-brand-teal/40 group-hover:text-brand-teal transition-colors">04</span>
                  <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-widest">Información Médica</h2>
                </div>
                <div className="ml-7 sm:ml-8 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-brand-navy/[0.02] border-l-4 border-brand-teal">
                  <p className="text-xs sm:text-sm leading-relaxed font-light italic">
                    "Dnamedics actúa como una herramienta de soporte. El contenido aquí presente no reemplaza, bajo ninguna circunstancia, el diagnóstico o la consulta médica profesional presencial."
                  </p>
                </div>
              </section>

              <section className="group">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-black text-brand-teal/40 group-hover:text-brand-teal transition-colors">05</span>
                  <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-widest">Propiedad Intelectual</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-light ml-7 sm:ml-8">
                  Todo el ecosistema visual, código fuente, logotipos y textos son propiedad exclusiva de <span className="text-brand-teal font-bold">Dnamedics</span>. Su reproducción total o parcial sin autorización escrita está estrictamente prohibida.
                </p>
              </section>
            </div>
          </article>

          {/* Footer de la Card */}
          <footer className="mt-10 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center sm:text-left">
              © 2026 Dnamedics — Salud & Bienestar
            </p>
            <Link 
              href="/privacidad" 
              className="px-6 sm:px-8 py-3 sm:py-4 bg-brand-navy text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-teal transition-all shadow-lg shadow-brand-navy/10"
            >
              Política de Privacidad
            </Link>
          </footer>
        </div>

        {/* Contacto extra */}
        <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
          <p className="text-[10px] sm:text-xs text-slate-400 font-light">
            ¿Tienes dudas legales? Contáctanos en 
            <span className="text-brand-teal font-medium ml-1">legal@dnamedics.com</span>
          </p>
        </div>
      </div>
    </main>
  );
}