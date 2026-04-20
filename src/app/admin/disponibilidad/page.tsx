"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES, DAY_NAMES, BUSINESS_HOURS } from "@/lib/utils/constants";
import type { AvailabilityConfig } from "@/lib/types";
import { 
  ChevronLeft, 
  Clock, 
  CalendarOff, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Calendar as CalendarIcon 
} from "lucide-react";

// Generamos las opciones de tiempo (ej. 07:00 a 21:00 en intervalos de 30 min)
const TIME_OPTIONS = Array.from({ length: 29 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const min = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${min}`;
});

export default function AdminDisponibilidadPage() {
  const [configs, setConfigs] = useState<AvailabilityConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("12:00");
  const [blockEnd, setBlockEnd] = useState("13:00");
  const [blockReason, setBlockReason] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [blockMsg, setBlockMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data } = await supabase
          .from("availability_config")
          .select("*")
          .order("day_of_week");
        setConfigs(data ?? []);
      } catch (error) {
        console.error("Error cargando disponibilidad:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  async function toggleDay(config: AvailabilityConfig) {
    setSaving(config.id);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("availability_config").update({ is_active: !config.is_active }).eq("id", config.id);
    setConfigs((prev) => prev.map((c) => c.id === config.id ? { ...c, is_active: !c.is_active } : c));
    setSaving(null);
  }

  async function updateTime(config: AvailabilityConfig, field: "start_time" | "end_time", value: string) {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const timeWithSeconds = `${value}:00`;
    await supabase.from("availability_config").update({ [field]: timeWithSeconds }).eq("id", config.id);
    setConfigs((prev) => prev.map((c) => c.id === config.id ? { ...c, [field]: timeWithSeconds } : c));
  }

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault();
    setBlocking(true);
    setBlockMsg(null);
    try {
      const res = await fetch("/api/disponibilidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          blocked_date: blockDate, 
          start_time: blockStart, 
          end_time: blockEnd, 
          reason: blockReason || "BLOQUEO ADMINISTRATIVO" 
        }),
      });
      if (res.ok) {
        setBlockMsg({ type: 'success', text: "Horario bloqueado correctamente" });
        setBlockDate(""); setBlockReason("");
      } else {
        const j = await res.json();
        setBlockMsg({ type: 'error', text: j.error || "Error al bloquear" });
      }
    } catch (err) {
      setBlockMsg({ type: 'error', text: "Error de conexión" });
    } finally {
      setBlocking(false);
    }
  }

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {/* Header - responsive */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <Link href={ROUTES.adminDashboard} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-teal transition-all shadow-sm">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 font-bold">
                Configuración
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-brand-navy tracking-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              Gestión de <span className="italic text-brand-teal">Disponibilidad</span>
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          
          {/* HORARIO SEMANAL - responsive */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-teal" />
              <h2 className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-brand-navy uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                Jornada Laboral Estándar
              </h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-3 sm:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-brand-teal/10 border-t-brand-teal rounded-full animate-spin" />
                <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Sincronizando...
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {configs.map((config) => (
                  <div key={config.id} className={`group flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 md:gap-6 p-4 sm:p-5 rounded-xl sm:rounded-[1.5rem] border transition-all duration-500
                    ${config.is_active ? "border-slate-100 bg-white shadow-sm" : "border-transparent bg-slate-50/50 opacity-40 grayscale"}`}>
                    
                    {/* Toggle Switch */}
                    <div 
                      onClick={() => !saving && toggleDay(config)}
                      className={`relative flex h-6 sm:h-7 w-10 sm:w-12 items-center rounded-full cursor-pointer transition-colors duration-300 px-0.5 sm:px-1 flex-shrink-0
                        ${config.is_active ? "bg-brand-teal" : "bg-slate-200"} ${saving === config.id ? "opacity-50" : ""}`}
                    >
                      <div className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white shadow-md transition-transform duration-300
                        ${config.is_active ? "translate-x-4 sm:translate-x-5" : "translate-x-0"}`} 
                      />
                    </div>

                    <span className="text-[10px] sm:text-xs font-bold text-brand-navy uppercase tracking-widest w-16 sm:w-20 md:w-24 flex-shrink-0">
                      {DAY_NAMES[config.day_of_week].slice(0, 3)}
                      <span className="hidden sm:inline">{DAY_NAMES[config.day_of_week].slice(3)}</span>
                    </span>

                    <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto">
                      {/* Select Inicio */}
                      <select 
                        value={config.start_time.substring(0, 5)}
                        disabled={!config.is_active}
                        onChange={(e) => updateTime(config, "start_time", e.target.value)}
                        className="w-full bg-[#fafbfc] text-center text-[10px] sm:text-xs font-bold border border-slate-100 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 outline-none focus:border-brand-teal focus:ring-[4px] focus:ring-brand-teal/5 transition-all text-brand-navy appearance-none cursor-pointer disabled:cursor-default"
                      >
                        {TIME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>

                      <span className="text-slate-300 font-light text-xs sm:text-sm">—</span>

                      {/* Select Fin */}
                      <select 
                        value={config.end_time.substring(0, 5)}
                        disabled={!config.is_active}
                        onChange={(e) => updateTime(config, "end_time", e.target.value)}
                        className="w-full bg-[#fafbfc] text-center text-[10px] sm:text-xs font-bold border border-slate-100 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 outline-none focus:border-brand-teal focus:ring-[4px] focus:ring-brand-teal/5 transition-all text-brand-navy appearance-none cursor-pointer disabled:cursor-default"
                      >
                        {TIME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 bg-[#fafbfc] rounded-xl sm:rounded-[1.5rem] border border-slate-50 flex items-center gap-3 sm:gap-4">
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-teal flex-shrink-0">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" />
               </div>
               <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Intervalos de <span className="text-brand-navy">{BUSINESS_HOURS.slotDuration} min</span>.
               </p>
            </div>
          </div>

          {/* BLOQUEO URGENTE - responsive */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-8 md:p-10 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-2 h-2 bg-brand-teal rounded-full animate-pulse" />
                  <h2 className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-brand-teal uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                    Bloqueo Urgente
                  </h2>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium mb-6 sm:mb-8 md:mb-10 leading-relaxed">
                  ¿Necesitas cerrar una tarde? Inhabilita franjas para reservas.
                </p>

                <form onSubmit={handleBlock} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-brand-navy uppercase tracking-widest ml-1">
                      Fecha a bloquear
                    </label>
                    <div className="relative">
                      <input type="date" value={blockDate} min={minDate} required
                        onChange={(e) => setBlockDate(e.target.value)}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-100 text-xs sm:text-sm font-bold outline-none focus:border-brand-teal focus:ring-[6px] focus:ring-brand-teal/5 transition-all bg-[#fafbfc] text-brand-navy shadow-inner" />
                      <CalendarIcon className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Desde</label>
                      <div className="relative">
                        <select 
                          value={blockStart} 
                          onChange={(e) => setBlockStart(e.target.value)}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-100 text-[10px] sm:text-xs md:text-sm font-bold outline-none focus:border-brand-teal focus:ring-[6px] focus:ring-brand-teal/5 transition-all bg-[#fafbfc] text-brand-navy shadow-inner appearance-none cursor-pointer"
                        >
                          {TIME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <Clock className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-300 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hasta</label>
                      <div className="relative">
                        <select 
                          value={blockEnd} 
                          onChange={(e) => setBlockEnd(e.target.value)}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-100 text-[10px] sm:text-xs md:text-sm font-bold outline-none focus:border-brand-teal focus:ring-[6px] focus:ring-brand-teal/5 transition-all bg-[#fafbfc] text-brand-navy shadow-inner appearance-none cursor-pointer"
                        >
                          {TIME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <Clock className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-300 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Motivo (Interno)
                    </label>
                    <input type="text" value={blockReason} placeholder="EJ. CAPACITACIÓN"
                      onChange={(e) => setBlockReason(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-100 text-[10px] sm:text-xs md:text-sm font-bold outline-none focus:border-brand-teal focus:ring-[6px] focus:ring-brand-teal/5 transition-all bg-[#fafbfc] placeholder:text-slate-300 uppercase text-brand-navy shadow-inner" />
                  </div>

                  {blockMsg && (
                    <div className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 sm:gap-3 animate-in fade-in zoom-in duration-300 ${
                      blockMsg.type === 'error' ? "bg-red-50 text-red-500 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      {blockMsg.type === 'error' ? <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> : <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
                      <span className="leading-tight">{blockMsg.text}</span>
                    </div>
                  )}

                  <button type="submit" disabled={blocking}
                    className="w-full group relative overflow-hidden bg-brand-navy py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] transition-all active:scale-[0.97] shadow-2xl shadow-brand-navy/30 disabled:opacity-50">
                    <span className="relative z-10 text-white">
                      {blocking ? "Procesando..." : "Confirmar Bloqueo"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-teal to-brand-navy opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-brand-teal/5 rounded-xl sm:rounded-[2rem] border border-brand-teal/10 p-5 sm:p-6 md:p-8 flex gap-4 sm:gap-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-teal text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-teal/30">
                <Info className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-brand-navy uppercase tracking-widest mb-1 sm:mb-2">
                  Funcionamiento
                </p>
                <p className="text-[9px] sm:text-[10px] md:text-[11px] text-brand-teal/80 font-medium leading-relaxed">
                  El sistema eliminará automáticamente estas horas del formulario de reserva. No afecta citas confirmadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}