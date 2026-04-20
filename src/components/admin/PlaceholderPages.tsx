import Link from "next/link";
import { ROUTES } from "@/lib/utils/constants";

function PlaceholderPage({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href={ROUTES.adminDashboard} className="text-slate-400 hover:text-brand-teal transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>{title}</h1>
        </div>
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
            </svg>
          </div>
          <h3 className="font-medium text-slate-700 mb-2">{title}</h3>
          <p className="text-sm text-slate-400 font-light max-w-sm mx-auto">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export function AgendaPage() {
  return <PlaceholderPage
    title="Agenda"
    desc="El calendario completo con FullCalendar se implementa en la Semana 3."
    icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
  />;
}

export function DisponibilidadPage() {
  return <PlaceholderPage
    title="Disponibilidad"
    desc="La configuración de horarios laborales se implementa en la Semana 3."
    icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  />;
}

export function NoticiasAdminPage() {
  return <PlaceholderPage
    title="Artículos"
    desc="El gestor de artículos y noticias se implementa en la Semana 4."
    icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
  />;
}
