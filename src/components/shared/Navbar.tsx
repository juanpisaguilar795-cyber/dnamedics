"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/utils/constants";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawer] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setDrawer(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      setUserRole(data?.role ?? null);
    });
  }, []);

  const handleHashLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      e.preventDefault();
      const sectionId = href.split('#')[1];
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -64;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        window.history.pushState({}, '', href);
      } else {
        window.location.href = href;
      }
      setDrawer(false);
    }
  };

  const links = [
    { href: "/#quienes-somos", label: "Nosotros" },
    { href: "/#servicios", label: "Servicios" },
    { href: "/#videos", label: "DnaTv" },
    { href: "/#proceso", label: "¿Cómo funciona?" },
    { href: "/#noticias", label: "Artículos" },
    { href: "/#contacto", label: "Contacto" },
  ];

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 h-14 sm:h-16",
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"
        )}
        data-nextjs-scroll-restoration="false" // 👈 SILENCIA EL WARNING
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between">
          
          {/* Logo - Responsive */}
          <Link href={ROUTES.home} className="flex flex-col leading-none no-touch-min">
            <span className="text-lg sm:text-xl font-semibold text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
              Dnamedics
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[2px] sm:tracking-[3px] uppercase text-brand-teal font-light">
              Salud & Bienestar
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-4 xl:gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link 
                  href={l.href} 
                  onClick={(e) => handleHashLink(e, l.href)}
                  className="text-xs xl:text-sm text-slate-600 hover:text-brand-teal transition-colors font-light no-touch-min"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA - Responsive */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {userRole ? (
              <Link 
                href={userRole === "admin" ? ROUTES.adminDashboard : ROUTES.patientDashboard}
                className="group relative inline-flex items-center gap-2 px-4 xl:px-6 py-2 xl:py-2.5 bg-[#007b8f]/5 text-[#007b8f] border border-[#007b8f]/10 rounded-full text-xs xl:text-[13px] font-bold tracking-tight hover:bg-[#007b8f] hover:text-white hover:border-[#007b8f] hover:shadow-[0_10px_20px_-5px_rgba(0,123,143,0.3)] transition-all duration-300 active:scale-95"
              >
                <span className="relative z-10">Mi portal</span>
                <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
              </Link>
            ) : (
              <>
                <Link 
                  href={ROUTES.login} 
                  className="inline-flex items-center text-xs xl:text-sm text-slate-600 hover:text-brand-navy transition-colors font-light h-10"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  href="/#reserva"
                  onClick={(e) => handleHashLink(e, "/#reserva")}
                  className="inline-flex items-center bg-brand-teal text-white text-xs xl:text-sm px-4 xl:px-5 py-2 rounded-full hover:bg-brand-navy transition-colors font-medium h-9 xl:h-10"
                >
                  Agendar cita
                </Link>
              </>
            )}
          </div>

          {/* Mobile - SOLO HAMBURGER (SIN WHATSAPP) */}
          <div className="flex lg:hidden items-center">
            <button 
              onClick={() => setDrawer(true)} 
              aria-label="Abrir menú"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer - RESPONSIVE */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawer(false)} />

          {/* Drawer panel - Ancho responsive */}
          <div className="absolute top-0 right-0 h-full w-[min(85vw,320px)] bg-white shadow-2xl flex flex-col animate-slide-in-right">
            
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 sm:px-5 h-14 sm:h-16 border-b border-slate-100">
              <span className="text-base sm:text-lg font-semibold text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
                Menú
              </span>
              <button 
                onClick={() => setDrawer(false)} 
                aria-label="Cerrar menú"
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer links */}
            <nav className="flex-1 overflow-y-auto py-3 sm:py-4">
              <div className="space-y-0.5 sm:space-y-1 px-3">
                {links.map((l) => (
                  <Link 
                    key={l.href} 
                    href={l.href}
                    onClick={(e) => handleHashLink(e, l.href)}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-slate-700 hover:bg-slate-50 hover:text-brand-teal transition-colors font-light text-sm"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-slate-100 mt-3 sm:mt-4 pt-3 sm:pt-4 px-3 space-y-2">
                {userRole ? (
                  <Link 
                    href={userRole === "admin" ? ROUTES.adminDashboard : ROUTES.patientDashboard}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-brand-teal hover:bg-brand-teal/5 transition-colors font-medium text-sm"
                  >
                    Mi portal →
                  </Link>
                ) : (
                  <>
                    <Link 
                      href={ROUTES.login}
                      className="flex items-center justify-center w-full border border-slate-200 text-slate-700 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      Iniciar sesión
                    </Link>
                    <Link 
                      href={ROUTES.registro}
                      className="flex items-center justify-center w-full bg-brand-teal text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium hover:bg-brand-navy transition-colors"
                    >
                      Crear cuenta gratis
                    </Link>
                  </>
                )}

                <Link 
                  href="/#reserva" 
                  onClick={(e) => handleHashLink(e, "/#reserva")}
                  className="flex items-center justify-center w-full bg-brand-navy text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium hover:bg-brand-teal transition-colors mt-2"
                >
                  Agendar cita →
                </Link>
              </div>
            </nav>

            {/* Drawer footer - SIN WHATSAPP */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-slate-100 safe-bottom">
              <p className="text-center text-[10px] sm:text-xs text-slate-400">
                © Dnamedics · Salud & Bienestar
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}