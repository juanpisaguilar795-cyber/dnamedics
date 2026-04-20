"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/utils/constants";
import { BookingButton } from "./BookingButton";

export function HeroSection() {
  const waUrl = getWhatsAppUrl("Hola, quisiera agendar una consulta en Dnamedics");
  const [logoSrc, setLogoSrc] = useState("/logo.png");

  useEffect(() => {
    const updateHeroLogo = () => {
      const hour = new Date().getHours();
      // Cambia a logo oscuro después de las 3 PM o antes de las 6 AM
      if (hour >= 15 || hour < 6) {
        setLogoSrc("/logo-oscuro.png");
      } else {
        setLogoSrc("/logo.png");
      }
    };

    updateHeroLogo();
    const interval = setInterval(updateHeroLogo, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      
      {/* Fondos decorativos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] rounded-full bg-brand-teal/5" />
        <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full bg-brand-navy/5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* CONTENIDO PRINCIPAL */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-brand-teal/5 text-brand-teal text-[8px] sm:text-[10px] font-bold tracking-wider uppercase px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
              <span className="hidden sm:inline">Fisioterapia integrativa · Bogotá</span>
              <span className="sm:hidden">Bogotá · Integrativa</span>
            </span>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-navy leading-[1.1] sm:leading-[1.05] tracking-tight mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              La solución{" "}
              <span className="italic text-brand-teal font-medium">integrativa</span>
              {" "}para tu{" "}
              <span className="block sm:inline text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold opacity-90">
                bienestar.
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-6 sm:mb-8 max-w-lg border-l-2 border-brand-teal/20 pl-4 sm:pl-6">
              Dnamedics es un consultorio médico dedicado a la medicina biorreguladora, 
              fisioterapia, quiropráxia y terapias alternativas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
              <BookingButton size="lg" fullWidth className="sm:w-auto" />
              
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-brand-navy text-sm font-medium border border-brand-navy/20 sm:border-b sm:border-t-0 sm:border-x-0 sm:border-b-brand-navy/30 px-4 sm:px-0 py-3 sm:py-0 rounded-full sm:rounded-none hover:bg-brand-navy/5 sm:hover:bg-transparent hover:border-brand-teal hover:text-brand-teal transition-colors"
              >
                <span className="hidden sm:inline">Consultar por WhatsApp</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-around sm:justify-start gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-slate-200">
              {[
                { num: "500+", label: "Pacientes" }, 
                { num: "8+", label: "Años" }, 
                { num: "98%", label: "Satisfacción" }
              ].map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-semibold text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {s.num}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-light">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LOGO CIRCULAR - Desktop (lg+) */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-72 xl:w-80 h-72 xl:h-80">
              {/* Contenedor con relative y h-full corregido */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-brand-teal via-brand-navy to-brand-cyan shadow-2xl shadow-brand-navy/20 transform transition-transform duration-700 hover:scale-105 overflow-hidden">
                
                <Image
                  src={logoSrc}
                  alt="Dnamedics Logo"
                  fill
                  className="object-cover transition-opacity duration-700"
                  priority
                  sizes="(max-width: 1280px) 288px, 320px"
                />

                {/* Overlays decorativos internos */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/25 pointer-events-none" />
                <div className="absolute inset-4 rounded-full border border-white/10 pointer-events-none" />
              </div>

              {/* Badges Flotantes */}
              <div className="absolute -top-3 -right-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-2 z-20">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs font-medium text-slate-700">Citas disponibles</p>
              </div>
            </div>
          </div>

          {/* LOGO CIRCULAR - Móvil/Tablet (Hide en lg) */}
          <div className="lg:hidden flex justify-center mt-6">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-brand-teal via-brand-navy to-brand-cyan shadow-xl shadow-brand-navy/20 overflow-hidden">
                <Image
                  src={logoSrc}
                  alt="Dnamedics"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 192px, 224px"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 flex items-center gap-1.5 z-20">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <p className="text-[9px] font-medium text-slate-700">Citas hoy</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Wave decorativo inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none" className="w-full h-auto">
          <path d="M0 40L1440 40L1440 15C1200 35 960 5 720 20C480 35 240 5 0 15L0 40Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}