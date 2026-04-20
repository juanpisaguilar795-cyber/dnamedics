"use client";

import { UserCircle2 } from "lucide-react";

const values = [
  {
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Vocación de servicio",
    desc: "Cada paciente es único. Escuchamos, entendemos y diseñamos un plan pensado exclusivamente para ti.",
  },
  {
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Medicina integrativa",
    desc: "Combinamos terapias convencionales y naturales para tratar el origen del problema, no solo los síntomas.",
  },
  {
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Rigor científico",
    desc: "Aplicamos evidencia clínica actualizada y tecnología de punta para garantizar resultados seguros y efectivos.",
  },
  {
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Acompañamiento continuo",
    desc: "Tu recuperación no termina al salir del consultorio. Te seguimos en cada etapa de tu proceso.",
  },
];

export function AboutSection() {
  return (
    <section id="quienes-somos" className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden scroll-mt-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Grid principal (más compacto en móvil) ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 items-center mb-10 sm:mb-16">
          
          {/* Columna izquierda: texto */}
          <div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-brand-teal font-bold sm:font-black mb-3 sm:mb-4 block">
              Quiénes somos
            </span>
            
            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl text-brand-navy leading-tight mb-4 sm:mb-6" 
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Salud que va más allá <br />
              <span className="italic text-brand-teal">del síntoma.</span>
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">
                Dnamedics es un consultorio médico especializado en medicina integrativa ubicado en
                Bogotá. Nacimos con la convicción de que el cuerpo humano tiene la
                capacidad de sanar cuando se le brindan las condiciones adecuadas.
              </p>
              <p className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">
                Nuestro enfoque combina fisioterapia, quiropráxia y medicina biorreguladora para ofrecer una atención
                completa, centrada en el paciente como persona.
              </p>
            </div>
          </div>

          {/* Columna derecha: Tarjeta de cita (más compacta) */}
          <div className="relative mt-4 lg:mt-0">
            <div className="absolute -inset-2 sm:-inset-4 bg-brand-teal/5 rounded-2xl sm:rounded-[3rem] blur-xl sm:blur-2xl pointer-events-none" />

            <div className="relative bg-[#F2F9F9] rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-10 border border-brand-teal/10 shadow-sm">
              <div className="mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-brand-teal/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <p
                className="text-lg sm:text-xl lg:text-2xl font-light leading-snug mb-6 sm:mb-8 text-brand-navy"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                &ldquo;Nuestro propósito es <span className="text-brand-teal italic font-medium">devolverte la calidad</span> de vida que mereces, integrando ciencia y bienestar natural.&rdquo;
              </p>

              <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-brand-teal/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <UserCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-teal stroke-[1.2]" />
                </div>
                <div>
                  <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-brand-navy">
                    Equipo Dnamedics
                  </p>
                  <p className="text-brand-teal/60 text-[8px] sm:text-[10px] font-bold uppercase tracking-wide">
                    Bienestar Integrativo · Bogotá
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Valores (más compactos en móvil) ───────────────── */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-brand-teal font-bold sm:font-black">
              Nuestros valores
            </span>
            <h3
              className="text-xl sm:text-2xl lg:text-3xl font-semibold text-brand-navy mt-1 sm:mt-2"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Lo que nos guía cada día
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="group bg-slate-50/40 hover:bg-white border border-transparent hover:border-brand-teal/10 hover:shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-300"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white shadow-sm text-brand-teal group-hover:bg-brand-teal group-hover:text-white flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300">
                  {v.icon}
                </div>
                <h4 className="font-bold text-brand-navy text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest mb-2">
                  {v.title}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}