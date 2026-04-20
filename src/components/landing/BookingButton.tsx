"use client";
import { useEffect, useRef } from "react";

// ─── Botón "Agendar mi cita" — Optimizado para móvil ──────────────────────
export function BookingButton({ 
  className = "",
  fullWidth = false, // Nueva prop para controlar ancho
  size = "default",  // sm | default | lg
}: { 
  className?: string;
  fullWidth?: boolean;
  size?: "sm" | "default" | "lg";
}) {
  
  // Tamaños responsive
  const sizes = {
    sm: "px-4 py-2 text-xs sm:text-sm min-h-[40px]",
    default: "px-5 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]",
    lg: "px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[48px]",
  };

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const section = document.getElementById("reserva");
    
    if (section) {
      // Scroll suave con offset para el navbar
      const yOffset = -64; // Altura del navbar (h-16 = 64px)
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ 
        top: y, 
        behavior: "smooth" 
      });
      
      // Actualizar URL sin saltar
      window.history.pushState({}, "", "/#reserva");
    } else {
      // Si no está en la home, navegar y luego hacer scroll
      window.location.href = "/#reserva";
    }
  }

  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    ${sizes[size]}
    ${fullWidth ? 'w-full' : 'w-full sm:w-auto'}
    bg-brand-teal hover:bg-brand-navy active:scale-[0.98]
    text-white rounded-full font-semibold 
    transition-all duration-300 
    hover:shadow-lg hover:shadow-brand-teal/20 
    active:shadow-md
    ${className}
  `;

  return (
    <a
      href="/#reserva"
      onClick={handleClick}
      className={baseClasses}
    >
      <span className="relative top-[1px]">Agendar mi cita</span>
      <svg 
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </a>
  );
}

// ─── Versión compacta para lugares con poco espacio ──────────────────────
export function BookingButtonCompact({ className = "" }: { className?: string }) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const section = document.getElementById("reserva");
    
    if (section) {
      const yOffset = -64;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState({}, "", "/#reserva");
    } else {
      window.location.href = "/#reserva";
    }
  }

  return (
    <a
      href="/#reserva"
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center
        min-h-[44px] min-w-[44px] sm:min-w-[120px]
        px-3 sm:px-5 py-2
        bg-brand-teal hover:bg-brand-navy active:scale-[0.98]
        text-white rounded-full
        transition-all duration-300
        hover:shadow-lg hover:shadow-brand-teal/20
        ${className}
      `}
    >
      {/* En móvil: solo icono, en desktop: icono + texto */}
      <span className="hidden sm:inline text-sm font-semibold">Agendar cita</span>
      <svg 
        className="w-4 h-4 sm:ml-1" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </a>
  );
}

// ─── Hook mejorado: scroll automático si la URL tiene #reserva ────────────
export function useHashScroll() {
  const hasScrolled = useRef(false);
  
  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash === "#reserva" && !hasScrolled.current) {
      hasScrolled.current = true;
      
      // Pequeño delay para asegurar que el DOM esté listo
      const timer = setTimeout(() => {
        const el = document.getElementById("reserva");
        
        if (el) {
          // Calcular posición con offset del navbar
          const yOffset = -64;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({ 
            top: y, 
            behavior: "smooth" 
          });
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, []);
}

// ─── Componente wrapper para usar en layouts ─────────────────────────────
export function BookingButtonWrapper({ 
  variant = "default",
  className = "" 
}: { 
  variant?: "default" | "compact";
  className?: string;
}) {
  if (variant === "compact") {
    return <BookingButtonCompact className={className} />;
  }
  
  return <BookingButton className={className} />;
}