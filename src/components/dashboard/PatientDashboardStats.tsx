"use client";
import { usePatientDashboard } from "@/hooks/useDashboard";

function fmt(d?: string | null) {
  if (!d) return "Sin visitas aún";
  return new Date(d + "T12:00:00").toLocaleDateString("es-CO", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function PatientDashboardStats({ userId }: { userId: string }) {
  const { stats, loading } = usePatientDashboard(userId);

  const items = [
    {
      label: "Citas próximas",
      value: loading ? null : stats?.upcomingAppointments ?? 0,
      sub:   "Confirmadas o pendientes",
      color: "text-brand-teal",
      bg:    "bg-blue-50",
      icon:  (
        <svg className="w-5 h-5 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Registros clínicos",
      value: loading ? null : stats?.totalRecords ?? 0,
      sub:   "Consultas registradas",
      color: "text-teal-600",
      bg:    "bg-teal-50",
      icon:  (
        <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Última visita",
      value: loading ? null : fmt(stats?.lastVisit),
      isText: true,
      sub:   "Fecha de consulta",
      color: "text-green-600",
      bg:    "bg-green-50",
      icon:  (
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {items.map((item) => (
        <div key={item.label} className={`${item.bg} rounded-2xl p-5`}>
          <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
            {item.icon}
          </div>
          {loading ? (
            <div className="h-7 w-20 bg-white/60 rounded-lg animate-pulse mb-1" />
          ) : item.isText ? (
            <p className={`text-sm font-semibold ${item.color} leading-snug mb-1`}>{item.value}</p>
          ) : (
            <p
              className={`text-2xl font-semibold ${item.color} mb-1`}
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {item.value}
            </p>
          )}
          <p className="text-xs text-slate-500 font-light">{item.label}</p>
          <p className="text-[10px] text-slate-400 font-light">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
