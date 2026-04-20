// app/politicas/page.tsx
"use client";
import Link from "next/link";
import { ROUTES } from "@/lib/utils/constants";

export default function PoliticasPage() {
  return (
    <main className="min-h-screen bg-[#fafbfc] py-8 sm:py-12 md:py-16 lg:py-24 relative overflow-hidden">
      {/* Elementos decorativos de marca */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-brand-teal/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-brand-navy/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Encabezado */}
        <header className="mb-8 sm:mb-12 lg:mb-16 text-center sm:text-left">
          <Link 
            href="/terminos" 
            className="text-[9px] sm:text-[10px] font-black text-brand-teal uppercase tracking-[0.2em] mb-6 sm:mb-8 inline-flex items-center gap-2 hover:text-brand-navy transition-colors group"
          >
            <svg 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Regresar a términos y condiciones
          </Link>
          
          <h1 
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-brand-navy leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Políticas de <br /> Privacidad
          </h1>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4 sm:mt-6 flex items-center gap-3 justify-center sm:justify-start">
            <span className="w-6 sm:w-8 h-px bg-slate-200" />
            Dnamedics — Protocolo de Datos 2026
          </p>
        </header>

        {/* Contenido de la Política */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-5 sm:p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100">
          <p className="text-slate-500 leading-relaxed font-light mb-8 sm:mb-12 italic text-center sm:text-left text-xs sm:text-sm">
            Tu privacidad es nuestra prioridad. En Dnamedics, aplicamos políticas rigurosas para asegurar que cada dato clínico y personal se maneje con la máxima transparencia y ética profesional.
          </p>

          <div className="space-y-10 sm:space-y-12 lg:space-y-16 text-slate-600">
            {/* Sección 1 */}
            <section className="group">
              <h2 className="text-[10px] sm:text-xs font-black text-brand-teal uppercase tracking-[0.2em] mb-4 sm:mb-6 group-hover:text-brand-navy transition-colors">
                01. Recopilación de Datos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-slate-700">
                {[
                  "Identidad: Nombre y apellidos",
                  "Contacto: Correo y teléfono",
                  "Acceso: Credenciales seguras",
                  "Uso: Actividad en la plataforma"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 sm:p-4 bg-[#fafbfc] rounded-2xl border border-slate-50 transition-hover hover:border-brand-teal/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-teal shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                    <span className="text-[11px] sm:text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Sección 2 */}
            <section className="group">
              <h2 className="text-[10px] sm:text-xs font-black text-brand-teal uppercase tracking-[0.2em] mb-4 sm:mb-6 group-hover:text-brand-navy transition-colors">
                02. Propósito del Tratamiento
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed font-light mb-4 sm:mb-6">
                Gestionamos tu información para optimizar tu camino hacia el bienestar:
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "Administración de expedientes y citas.",
                  "Mejora continua de nuestras herramientas digitales.",
                  "Notificaciones preventivas y soporte al paciente.",
                  "Protección proactiva contra incidentes de seguridad."
                ].map((text, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-300 mt-1">/0{i+1}</span>
                    <p className="text-xs sm:text-sm font-light leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECCIÓN 3 - PROTECCIÓN */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <span className="text-[10px] sm:text-xs font-black text-brand-teal font-sans">03.</span>
                <h2 className="text-[10px] sm:text-xs font-black text-brand-teal uppercase tracking-[0.2em] group-hover:text-brand-navy transition-colors">
                  Seguridad de la Información
                </h2>
              </div>
              <div className="p-5 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-[#fafbfc] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-brand-teal/5 rounded-full blur-xl sm:blur-2xl" />
                <h3 className="text-xl sm:text-2xl text-brand-navy mb-4 relative z-10" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Estándares de Protección
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-slate-500 relative z-10">
                  En <span className="text-brand-teal font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Dnamedics</span>, utilizamos infraestructura de vanguardia para garantizar que tus datos clínicos permanezcan privados. Aplicamos encriptación de extremo a extremo y auditorías constantes para mitigar cualquier riesgo de acceso no autorizado.
                </p>
              </div>
            </section>

            {/* Sección 4 */}
            <section className="group">
              <h2 className="text-[10px] sm:text-xs font-black text-brand-teal uppercase tracking-[0.2em] mb-4 sm:mb-6 group-hover:text-brand-navy transition-colors">
                04. Derechos del Usuario
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed font-light mb-4 sm:mb-6 text-slate-500 italic">
                Puedes ejercer tus derechos ARCO en cualquier momento:
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {["Acceso", "Rectificación", "Cancelación", "Oposición"].map((tag) => (
                  <span key={tag} className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-[#fafbfc] border border-slate-100 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-brand-navy/60 hover:text-brand-teal transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-12 sm:mt-16 lg:mt-20 pt-6 sm:pt-8 lg:pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="text-center sm:text-left">
              <p className="text-[9px] sm:text-[10px] font-black text-brand-navy uppercase tracking-widest">Dnamedics Legal Team</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-light mt-1 italic">legal@dnamedics.com</p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}