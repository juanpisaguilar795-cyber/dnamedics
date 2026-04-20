import { guardAdmin } from "@/lib/utils/serverGuards";
import { ROUTES } from "@/lib/utils/constants";
import Link from "next/link";
import { SignOutButton } from "@/components/shared/SignOutButton";
import { AdminDashboardStats } from "@/components/dashboard/AdminDashboardStats";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const admin = await guardAdmin();
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const cards = [
    {
      href: ROUTES.adminAgenda,
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      label: "Agenda",
      desc: "Calendario semanal",
      tag: "Citas activas",
    },
    {
      href: ROUTES.adminPacientes,
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
      label: "Pacientes",
      desc: "Historiales médicos",
      tag: "Registros activos",
    },
    {
      href: ROUTES.adminDisponibilidad,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "Horarios",
      desc: "Configurar disponibilidad",
      tag: "Jornada activa",
    },
    {
      href: ROUTES.adminNoticias,
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      label: "Blog",
      desc: "Artículos y noticias",
      tag: "Contenido",
    },
    {
      href: ROUTES.adminVideos,
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
      label: "DnaMedia",
      desc: "Gestionar videos de YouTube",
      tag: "Educación",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-[#007b8f] text-[11px] font-bold tracking-widest uppercase mb-4">
              • Panel Administrativo
            </span>
            <h1 className="text-5xl text-[#1e3a8a] leading-tight mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
              Bienvenido, <span className="text-[#007b8f] italic">{admin.full_name.split(" ")[0]}</span>
            </h1>
            <p className="text-slate-500 text-base font-light leading-relaxed">
              Administra tu consulta integrativa con la misma calidad con la que atiendes a tus pacientes.
            </p>
          </div>

          {/* 👇 SOLO CAMBIÉ ESTA SECCIÓN - BOTONES SIMÉTRICOS Y RESPONSIVE */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Link 
              href={ROUTES.home} 
              className="group flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full border border-slate-200 text-[11px] sm:text-xs md:text-[13px] font-medium text-slate-500 hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Ver sitio público</span>
              <span className="sm:hidden">Sitio</span>
            </Link>
            <SignOutButton className="!rounded-full !px-4 sm:!px-5 md:!px-6 !py-2 sm:!py-2.5 !text-[11px] sm:!text-xs md:!text-[13px] shadow-sm hover:shadow-md transition-all" />
          </div>
          {/* 👆 FIN DE LA SECCIÓN MODIFICADA */}
        </header>

        <div className="mb-16">
          <AdminDashboardStats />
        </div>

        {/* DISTRIBUCIÓN 3 ARRIBA / 2 ABAJO CENTRADAS */}
        <div className="flex flex-wrap justify-center gap-8">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group relative bg-white border border-slate-50 rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col items-center text-center w-full md:w-[calc(45%-1rem)] lg:w-[calc(30%-1rem)] min-w-[280px]"
            >
              <span className="absolute top-6 right-6 px-3 py-1 bg-white shadow-sm border border-slate-100 rounded-full text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {c.tag}
              </span>
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#007b8f] group-hover:text-white transition-all duration-500 shadow-inner">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d={c.icon} />
                </svg>
              </div>
              <h3 className="text-xl text-[#1e3a8a] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                {c.label}
              </h3>
              <p className="text-sm text-slate-400 font-light mb-6">{c.desc}</p>
              <div className="mt-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-[#007b8f] group-hover:bg-[#007b8f] group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[11px] text-slate-300 uppercase tracking-[0.3em]">Dnamedics © 2026</p>
        </footer>
      </div>
    </div>
  );
}