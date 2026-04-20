"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES, APPOINTMENT_STATUS_COLORS, APPOINTMENT_STATUS_LABELS } from "@/lib/utils/constants";
import { formatTime } from "@/lib/utils/dates";
import type { Appointment } from "@/lib/types";

type CalendarView = "day" | "week" | "month";

export default function AdminAgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch("/api/citas")
      .then((r) => r.json())
      .then(({ data }) => {
        setAppointments(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusColor: Record<string, string> = {
    pending: "#f59e0b",
    confirmed: "#007b8f",
    cancelled: "#ef4444",
  };

  async function handleStatus(id: string, status: "confirmed" | "cancelled") {
    setUpdating(true);
    try {
      await fetch(`/api/citas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      if (selected?.id === id) setSelected((s) => (s ? { ...s, status } : s));
    } finally {
      setUpdating(false);
    }
  }

  function getWeekDates(base: Date): Date[] {
    const start = new Date(base);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  function getMonthDates(base: Date): Date[] {
    const year = base.getFullYear();
    const month = base.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  }

  function navigate(dir: -1 | 1) {
    const d = new Date(currentDate);
    if (view === "day") d.setDate(d.getDate() + dir);
    if (view === "week") d.setDate(d.getDate() + dir * 7);
    if (view === "month") d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  }

  function getApptsForDate(date: Date): Appointment[] {
    const iso = date.toISOString().split("T")[0];
    return appointments.filter((a) => a.appointment_date === iso && a.status !== "cancelled");
  }

  const weekDates = getWeekDates(currentDate);
  const monthDates = getMonthDates(currentDate);
  const viewDates = view === "day" ? [currentDate] : view === "week" ? weekDates : monthDates;

  const rangeLabel = view === "day"
    ? currentDate.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })
    : view === "week"
    ? `${weekDates[0].toLocaleDateString("es-CO", { day: "numeric", month: "short" })} – ${weekDates[4].toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}`
    : currentDate.toLocaleDateString("es-CO", { month: "long", year: "numeric" });

  // Detectar si es móvil para ajustar vista por defecto
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-[#fafbfc] relative overflow-hidden">
      {/* Fondos decorativos - responsive */}
      <div className="absolute -top-24 -right-24 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-64 sm:w-80 h-64 sm:h-80 bg-teal-50/30 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10">
        
        {/* Header - responsive */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <Link href={ROUTES.adminDashboard} className="group w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#007b8f] hover:border-[#007b8f]/30 hover:shadow-lg transition-all duration-300">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 font-bold">
                Gestión de Agenda
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#1e3a8a] tracking-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              Tu Calendario <span className="italic text-[#007b8f]">Profesional</span>
            </h1>
          </div>

          {/* Selector de Vista - responsive */}
          <div className="flex bg-white p-0.5 sm:p-1 rounded-full border border-slate-100 shadow-sm self-start md:self-end">
            {(["day", "week", "month"] as CalendarView[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-widest font-bold transition-all duration-300 whitespace-nowrap
                  ${view === v ? "bg-[#007b8f] text-white shadow-md shadow-[#007b8f]/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}>
                {v === "day" ? "Día" : v === "week" ? "Semana" : "Mes"}
              </button>
            ))}
          </div>
        </header>

        {/* Navegador de Fecha - responsive */}
        <nav className="flex items-center justify-between mb-6 sm:mb-8 bg-white/60 backdrop-blur-md border border-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 shadow-sm">
          <button onClick={() => navigate(-1)} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full hover:bg-white text-slate-400 hover:text-[#007b8f] transition-all flex items-center justify-center border border-transparent hover:border-slate-100">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base sm:text-lg md:text-2xl text-[#1e3a8a] capitalize px-2 text-center" style={{ fontFamily: "var(--font-cormorant)" }}>
            {rangeLabel}
          </h2>
          <button onClick={() => navigate(1)} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full hover:bg-white text-slate-400 hover:text-[#007b8f] transition-all flex items-center justify-center border border-transparent hover:border-slate-100">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-24 md:py-32 space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#007b8f] border-t-transparent rounded-full animate-spin" />
            <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 font-bold animate-pulse">
              Sincronizando registros...
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
            
            {/* Contenedor Calendario Principal - responsive */}
            <div className="flex-1 w-full bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-[0_10px_60px_-20px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500">
              
              {/* VISTA DÍA / SEMANA */}
              {(view === "week" || view === "day") && (
                <div className={`grid ${view === "week" ? "grid-cols-5" : "grid-cols-1"} overflow-x-auto`}>
                  {viewDates.map((date) => {
                    const apts = getApptsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                      <div key={date.toISOString()} className={`border-r border-slate-50 last:border-r-0 min-w-[100px] sm:min-w-0`}>
                        <div className={`px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-8 text-center transition-colors ${isToday ? "bg-teal-50/30" : "bg-white"}`}>
                          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-slate-400 mb-1">
                            {date.toLocaleDateString("es-CO", { weekday: "short" })}
                          </p>
                          <p className={`text-xl sm:text-2xl md:text-3xl font-medium ${isToday ? "text-[#007b8f]" : "text-slate-800"}`} style={{ fontFamily: "var(--font-cormorant)" }}>
                            {date.getDate()}
                          </p>
                        </div>
                        
                        <div className="p-2 sm:p-3 md:p-4 min-h-[250px] sm:min-h-[350px] md:min-h-[400px] space-y-2 sm:space-y-3">
                          {apts.length === 0 ? (
                            <div className="mt-8 sm:mt-12 text-center opacity-20">
                              <div className="w-6 sm:w-8 h-px bg-slate-400 mx-auto mb-1 sm:mb-2" />
                              <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-bold tracking-widest">Sin citas</p>
                            </div>
                          ) : apts.map((a) => (
                            <button key={a.id} onClick={() => setSelected(a)}
                              className={`w-full text-left rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 transition-all duration-500 hover:shadow-xl group relative
                                ${selected?.id === a.id ? "bg-white ring-1 ring-[#007b8f]/30 shadow-xl shadow-[#007b8f]/10" : "bg-slate-50 hover:bg-white hover:-translate-y-0.5"}`}>
                              <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#1e3a8a]">{formatTime(a.start_time)}</span>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: statusColor[a.status] }} />
                              </div>
                              <p className="text-[10px] sm:text-[12px] md:text-[13px] text-slate-500 font-medium truncate">
                                {(a.patient as any)?.full_name ?? "Paciente Registrado"}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VISTA MES - responsive */}
              {view === "month" && (
                <div className="animate-in fade-in duration-700 overflow-x-auto">
                  <div className="min-w-[600px] sm:min-w-full">
                    <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50 text-center">
                      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                        <div key={d} className="px-1 sm:px-2 py-2 sm:py-3 md:py-4 text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {Array.from({ length: (monthDates[0].getDay() || 7) - 1 }).map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[80px] sm:min-h-[100px] md:min-h-[110px] border-b border-r border-slate-50/50 bg-[#fafbfc]/50" />
                      ))}
                      {monthDates.map((date) => {
                        const apts = getApptsForDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                          <div key={date.toISOString()} className={`min-h-[80px] sm:min-h-[100px] md:min-h-[110px] p-1 sm:p-2 border-b border-r border-slate-50 relative group transition-colors hover:bg-slate-50/80 ${isToday ? "bg-teal-50/20" : ""}`}>
                            <div className="flex justify-between items-start mb-1 sm:mb-2">
                              <span className={`text-xs sm:text-sm font-medium w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-all
                                ${isToday ? "bg-[#007b8f] text-white shadow-md shadow-[#007b8f]/20" : "text-slate-400 group-hover:text-slate-600"}`} style={{ fontFamily: "var(--font-cormorant)" }}>
                                {date.getDate()}
                              </span>
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                              {apts.slice(0, isMobile ? 2 : 3).map((a) => (
                                <button key={a.id} onClick={(e) => { e.stopPropagation(); setSelected(a); }}
                                  className="w-full text-left text-[7px] sm:text-[8px] md:text-[9px] px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-bold truncate transition-all hover:brightness-95 border-l-2"
                                  style={{ background: `${statusColor[a.status]}15`, color: statusColor[a.status], borderLeftColor: statusColor[a.status] }}>
                                  {formatTime(a.start_time).replace(/\s/, '').slice(0, 4)} {(a.patient as any)?.full_name?.split(" ")[0]}
                                </button>
                              ))}
                              {apts.length > (isMobile ? 2 : 3) && (
                                <p className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-400 font-bold pl-1 tracking-tighter">
                                  + {apts.length - (isMobile ? 2 : 3)}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PANEL LATERAL - responsive */}
            <aside className="lg:w-80 w-full space-y-4 sm:space-y-6 lg:sticky lg:top-8">
              {/* Estadísticas Rápidas */}
              <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 p-4 sm:p-6 shadow-sm">
                <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 sm:mb-6">
                  Resumen del Periodo
                </h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {(["pending", "confirmed", "cancelled"] as const).map((s) => (
                    <div key={s} className="text-center">
                      <p className="text-xl sm:text-2xl text-[#1e3a8a] mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                        {appointments.filter((a) => a.status === s).length}
                      </p>
                      <div className={`text-[6px] sm:text-[7px] md:text-[8px] uppercase font-bold py-0.5 sm:py-1 px-1 rounded-full ${APPOINTMENT_STATUS_COLORS[s]}`}>
                        {APPOINTMENT_STATUS_LABELS[s]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Flotante Detalle */}
              {selected ? (
                <div className="bg-[#1e3a8a] rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 text-white shadow-2xl shadow-blue-900/30 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-start mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-all">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Paciente</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-medium leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
                        {(selected.patient as any)?.full_name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-teal-300/80 mt-1">{(selected.patient as any)?.phone}</p>
                    </div>
                    
                    <div className="flex gap-6 sm:gap-10">
                      <div>
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Hora</p>
                        <p className="text-xs sm:text-sm font-bold">{formatTime(selected.start_time)}</p>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Estado</p>
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-teal-300 uppercase tracking-tighter">
                          {APPOINTMENT_STATUS_LABELS[selected.status]}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 sm:pt-8 space-y-2 sm:space-y-3">
                      {selected.status === "pending" && (
                        <button onClick={() => handleStatus(selected.id, "confirmed")} disabled={updating}
                          className="w-full bg-[#007b8f] hover:bg-white hover:text-[#007b8f] py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#000]/20">
                          ✓ Confirmar Cita
                        </button>
                      )}
                      <button onClick={() => handleStatus(selected.id, "cancelled")} disabled={updating}
                        className="w-full border border-white/10 hover:bg-red-500/20 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold transition-all active:scale-95 disabled:opacity-50">
                        Cancelar Cita
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-dashed border-slate-200 p-6 sm:p-8 md:p-10 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-slate-200">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-light leading-relaxed">
                    Selecciona una cita para gestionar el estado y los detalles médicos.
                  </p>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}