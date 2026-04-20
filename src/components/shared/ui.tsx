"use client";

// ─── Breakpoint indicator (solo en desarrollo) ───────────────
export function BreakpointIndicator() {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-mono pointer-events-none select-none backdrop-blur-sm">
      <span className="xs:hidden">base &lt;480</span>
      <span className="hidden xs:inline sm:hidden">xs 480+</span>
      <span className="hidden sm:inline md:hidden">sm 640+</span>
      <span className="hidden md:inline lg:hidden">md 768+</span>
      <span className="hidden lg:inline xl:hidden">lg 1024+</span>
      <span className="hidden xl:inline 2xl:hidden">xl 1280+</span>
      <span className="hidden 2xl:inline">2xl 1536+</span>
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────
export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`w-full overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

// ─── Card responsive ─────────────────────────────────────────
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─── Botón primario responsive ────────────────────────────────
export function BtnPrimary({
  onClick,
  href,
  children,
  className = "",
  disabled = false,
  type = "button",
  size = "default",
}: {
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  size?: "sm" | "default" | "lg";
}) {
  const sizes = {
    sm: "min-h-[40px] px-3 py-2 text-xs sm:text-sm",
    default: "min-h-[44px] px-5 py-3 text-sm sm:text-base",
    lg: "min-h-[48px] px-6 py-3.5 text-base sm:text-lg",
  };
  
  const base = `
    inline-flex items-center justify-center gap-2 
    ${sizes[size]}
    bg-brand-teal hover:bg-brand-navy active:scale-[0.98] text-white 
    rounded-xl font-semibold transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed 
    ${className}
  `;

  if (href) {
    return <a href={href} className={base}>{children}</a>;
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}

// ─── Botón secundario ────────────────────────────────────────
export function BtnSecondary({
  onClick,
  children,
  className = "",
  size = "default",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default";
}) {
  const sizes = {
    sm: "min-h-[40px] px-3 py-2 text-xs sm:text-sm",
    default: "min-h-[44px] px-5 py-3 text-sm sm:text-base",
  };
  
  return (
    <button 
      onClick={onClick} 
      className={`
        ${sizes[size]}
        border border-slate-200 hover:bg-slate-50 
        text-slate-700 rounded-xl font-medium transition-colors
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ─── Etiqueta de sección ──────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[9px] xs:text-[10px] sm:text-xs tracking-widest uppercase text-brand-teal font-semibold mb-2 sm:mb-3">
      {children}
    </span>
  );
}

// ─── Título de sección ────────────────────────────────────────
export function SectionTitle({
  children,
  className = "",
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const sizes = {
    sm: "text-xl xs:text-2xl sm:text-3xl",
    default: "text-2xl sm:text-3xl lg:text-4xl",
    lg: "text-3xl sm:text-4xl lg:text-5xl",
  };
  
  return (
    <h2
      className={`${sizes[size]} font-semibold text-brand-navy leading-tight ${className}`}
      style={{ fontFamily: "var(--font-cormorant)" }}
    >
      {children}
    </h2>
  );
}

// ─── Contenedor de botones (stack en móvil) ──────────────────
export function ButtonGroup({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col xs:flex-row gap-2 xs:gap-3 ${className}`}>
      {children}
    </div>
  );
}