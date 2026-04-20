"use client";
import Link from "next/link";
import { ROUTES } from "@/lib/utils/constants";

export function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/dnamedics",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.332.014 7.052.072 5.775.13 4.506.409 3.2 1.144 1.894 1.88 1.005 2.769.27 4.075-.465 5.381-.744 6.65-.802 7.927-.86 9.207-.874 9.616-.874 12.88s.014 3.673.072 4.953c.058 1.277.337 2.546 1.072 3.852.735 1.306 1.624 2.195 2.93 2.93 1.306.735 2.575 1.014 3.852 1.072 1.28.058 1.689.072 4.952.072s3.673-.014 4.953-.072c1.277-.058 2.546-.337 3.852-1.072 1.306-.735 2.195-1.624 2.93-2.93.735-1.306 1.014-2.575 1.072-3.852.058-1.28.072-1.689.072-4.952s-.014-3.673-.072-4.953c-.058-1.277-.337-2.546-1.072-3.852-.735-1.306-1.624-2.195-2.93-2.93-1.306-.735-2.575-1.014-3.852-1.072C15.667.014 15.259 0 12 0z"/>
          <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
          <circle cx="18.406" cy="5.594" r="1.44"/>
        </svg>
      )
    },
    {
      name: "Facebook",
      href: "https://facebook.com/dnamedics",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@dnamedics",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.5 3c.3 1.7 1.5 3.1 3.2 3.6v3.1c-1.4 0-2.8-.4-4-1.1v6.3c0 3.5-2.8 6.3-6.3 6.3S3 18.4 3 14.9s2.8-6.3 6.3-6.3c.3 0 .6 0 .9.1v3.3c-.3-.1-.6-.2-.9-.2-1.8 0-3.2 1.4-3.2 3.2S7.5 18.2 9.3 18.2s3.2-1.4 3.2-3.2V3h4z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-14">
        
        {/* Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          
          {/* LOGO + DIRECCIÓN */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-2xl sm:text-3xl font-semibold block mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
              Dnamedics
            </span>
            <p className="text-slate-300 text-xs sm:text-sm font-light">
              Fisioterapia especializada en Bogotá con enfoque en bienestar integral.
            </p>

            {/* Dirección */}
            <div className="mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                📍 Calle 125#21a-70 consultorio 303
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5">
                Edificio Santa Barbara
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                Consultorio de atención especializada
              </p>
            </div>
          </div>

          {/* SERVICIOS */}
          <div>
            <h5 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">Servicios</h5>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {["Quiropráxia","Medicina Biorreguladora","Rehabilitación Deportiva","Infiltración Articular","Biopuntura y SMBT"].map((s) => (
                <li key={s}>
                  <Link href="/#servicios" className="text-xs sm:text-sm text-slate-400 hover:text-brand-teal transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PLATAFORMA */}
          <div>
            <h5 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">Plataforma</h5>
            <ul className="space-y-1.5 sm:space-y-2.5">
              <li><Link href={ROUTES.login} className="text-xs sm:text-sm text-slate-400 hover:text-brand-teal transition-colors">Iniciar sesión</Link></li>
              <li><Link href={ROUTES.registro} className="text-xs sm:text-sm text-slate-400 hover:text-brand-teal transition-colors">Registrarse</Link></li>
              <li><Link href="/noticias" className="text-xs sm:text-sm text-slate-400 hover:text-brand-teal transition-colors">Artículos</Link></li>
              <li><Link href="/privacidad" className="text-xs sm:text-sm text-slate-400 hover:text-brand-teal transition-colors">Política de privacidad</Link></li>
              <li><Link href="/terminos" className="text-xs sm:text-sm text-slate-400 hover:text-brand-teal transition-colors">Términos y condiciones</Link></li>
            </ul>
          </div>

          {/* REDES + CONTACTO */}
          <div>
            <h5 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">Síguenos</h5>

            <div className="flex gap-4 sm:gap-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-teal transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contacto */}
            <div className="mt-4 sm:mt-6">
              <a 
                href="mailto:dnamedics@gmail.com" 
                className="text-xs sm:text-sm text-slate-400 hover:text-brand-teal transition-colors"
              >
                dnamedics@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <p className="text-[10px] sm:text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Dnamedics · Bogotá, Colombia
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 text-center sm:text-right">
            Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}