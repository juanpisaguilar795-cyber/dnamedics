"use client";
import { useAdminDashboard } from "@/hooks/useDashboard";

// ─── Badge de Sincronización Estilo "Apple" ──────────────────
function LiveBadge() {
  return (
    <div className="flex items-center gap-2 bg-brand-teal/5 px-3 py-1.5 rounded-full border border-brand-teal/10">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-40" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-teal" />
      </span>
      <span className="text-[9px] font-black text-brand-teal uppercase tracking-[0.15em]">
        Sincronizado
      </span>
    </div>
  );
}

// ─── StatCard Premium ────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  loading,
}: {
  label:   string;
  value:   number;
  icon:    React.ReactNode;
  loading: boolean;
}) {
  return (
    /* Efecto de cristal con borde de doble capa para profundidad */
    <div className="group relative bg-white/40 backdrop-blur-xl border border-white rounded-[2.2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(15,52,89,0.05)] hover:-translate-y-1">
      {/* Brillo interno sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[2.2rem] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
              {label}
            </p>
            <div className="h-0.5 w-4 bg-brand-teal/30 rounded-full transition-all group-hover:w-8" />
          </div>
          
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-50 text-brand-teal group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
        </div>
        
        {loading ? (
          <div className="h-12 w-24 bg-slate-100/50 rounded-2xl animate-pulse" />
        ) : (
          <div className="flex items-baseline gap-2">
            <p
              className="text-5xl font-light text-brand-navy tracking-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {value}
            </p>
            <span className="text-[10px] text-slate-300 font-medium italic tracking-wide">
              pacientes
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminDashboardStats() {
  const { stats, loading, error, refetch } = useAdminDashboard();

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-end justify-between px-4">
        <div className="space-y-1">
          <h2 className="text-[10px] text-brand-navy/40 font-black uppercase tracking-[0.4em]">
            Panel Administrativo
          </h2>
          <p className="text-2xl text-brand-navy font-medium" style={{ fontFamily: "var(--font-cormorant)" }}>
            Resumen de <span className="italic text-brand-teal">Actividad</span>
          </p>
        </div>
        <LiveBadge />
      </div>

      {error && (
        <div className="mx-4 bg-white/50 backdrop-blur-md border border-red-50 rounded-[1.5rem] px-6 py-4 flex items-center justify-between shadow-sm">
          <p className="text-slate-500 text-xs font-light">
            Ocurrió un inconveniente al actualizar las métricas.
          </p>
          <button
            onClick={refetch}
            className="text-[9px] text-brand-teal font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            Reintentar Conexión
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        <StatCard
          label="Agenda de Hoy"
          value={stats?.todayAppointments ?? 0}
          loading={loading}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Solicitudes"
          value={stats?.pendingAppointments ?? 0}
          loading={loading}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Citas Confirmadas"
          value={stats?.confirmedAppointments ?? 0}
          loading={loading}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Base de Datos"
          value={stats?.totalPatients ?? 0}
          loading={loading}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}