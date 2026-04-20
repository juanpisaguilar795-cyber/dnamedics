"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES, APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from "@/lib/utils/constants";
import { formatDate, formatTime } from "@/lib/utils/dates";
import type { Appointment } from "@/lib/types";
import { ChevronLeft, Plus, Calendar, Clock, Ban } from "lucide-react";

export default function PatientCitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    fetch("/api/citas", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(({ data }) => {
        setAppointments(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function openCancelModal(id: string) {
    setShowModal({ open: true, id });
  }

  async function handleConfirmCancel() {
    const id = showModal.id;
    if (!id) return;

    setCancelling(id);
    setShowModal({ open: false, id: null });

    await fetch(`/api/citas/${id}/cancelar`, {
      method: "PATCH",
    });
    setAppointments((prev) => 
      prev.map((a) => a.id === id ? { ...a, status: "cancelled" as const } : a)
    );
    setCancelling(null);
  }

  const upcoming = appointments.filter((a) => a.status !== "cancelled" && new Date(a.appointment_date + "T23:59:59") >= new Date());
  const past = appointments.filter((a) => a.status === "cancelled" || new Date(a.appointment_date + "T23:59:59") < new Date());

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* Modal de cancelación - Responsive */}
      {showModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowModal({ open: false, id: null })} />
          
          <div className="relative bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 max-w-xs sm:max-w-sm w-full shadow-2xl shadow-slate-200/50 text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <Ban className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl text-[#1e293b] mb-3 sm:mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
              Cancelar Cita
            </h3>
            
            <p className="text-slate-500 text-xs sm:text-sm font-light mb-6 sm:mb-10 leading-relaxed px-2">
              ¿Estás seguro de que deseas cancelar esta consulta médica? Esta acción no se puede deshacer.
            </p>

            <div className="flex flex-col gap-3 sm:gap-4">
              <button 
                onClick={handleConfirmCancel}
                className="w-full bg-[#1e293b] text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-[0.98]"
              >
                Confirmar cancelación
              </button>
              
              <button 
                onClick={() => setShowModal({ open: false, id: null })}
                className="w-full py-2 text-slate-400 text-xs sm:text-sm font-medium hover:text-slate-600 transition-colors"
              >
                Volver al panel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        
        {/* Cabecera - Responsive */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 border-b border-slate-100 pb-6 sm:pb-8 md:pb-10">
          <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
            <Link 
              href={ROUTES.patientDashboard} 
              className="mt-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-teal transition-all flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-brand-teal font-black mb-1 sm:mb-2 block">
                Gestión de Consultas
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-brand-navy leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
                Mis <span className="italic">citas</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2 font-light">{appointments.length} registros encontrados</p>
            </div>
          </div>
          <Link 
            href="/#reserva" 
            className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-navy text-white text-[10px] sm:text-xs uppercase tracking-widest px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all font-bold shadow-lg shadow-brand-teal/10 w-full sm:w-auto"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Nueva cita
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24 gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase font-medium">Cargando agenda...</p>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            
            {/* Sección: Próximas */}
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="w-6 sm:w-8 h-[1px] bg-slate-200" />
                  Próximas citas
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {upcoming.map((appt) => (
                    <div key={appt.id} className="group bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:shadow-xl transition-all duration-500">
                      <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-teal/5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border border-brand-teal/10 group-hover:bg-brand-teal transition-colors duration-500">
                          <span className="text-brand-teal group-hover:text-white font-bold text-lg sm:text-xl leading-none" style={{ fontFamily: "var(--font-cormorant)" }}>
                            {new Date(appt.appointment_date + "T12:00:00").getDate()}
                          </span>
                          <span className="text-brand-teal group-hover:text-white/80 text-[7px] sm:text-[8px] md:text-[9px] uppercase font-black tracking-tighter">
                            {new Date(appt.appointment_date + "T12:00:00").toLocaleString("es-CO", { month: "short" })}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                            <Clock className="w-3 h-3 text-brand-teal" />
                            <p className="font-bold text-brand-navy text-xs sm:text-sm">
                              {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                            </p>
                          </div>
                          <p className="text-[10px] sm:text-xs text-slate-400 font-light italic">{formatDate(appt.appointment_date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-none pt-3 sm:pt-0">
                        <span className={`text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold whitespace-nowrap ${APPOINTMENT_STATUS_COLORS[appt.status]}`}>
                          {APPOINTMENT_STATUS_LABELS[appt.status]}
                        </span>
                        {appt.status !== "cancelled" && (
                          <button 
                            onClick={() => openCancelModal(appt.id)} 
                            disabled={cancelling === appt.id}
                            className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 font-black transition-colors disabled:opacity-50 whitespace-nowrap"
                          >
                            {cancelling === appt.id ? "..." : "Cancelar"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sección: Historial */}
            {past.length > 0 && (
              <div>
                <h2 className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="w-6 sm:w-8 h-[1px] bg-slate-100" />
                  Historial y pasadas
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {past.map((appt) => (
                    <div key={appt.id} className="bg-slate-50/50 rounded-xl sm:rounded-2xl border border-transparent p-3 sm:p-4 md:p-5 flex items-center justify-between gap-3 sm:gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-slate-100">
                          <span className="text-slate-500 font-bold text-xs sm:text-sm leading-none" style={{ fontFamily: "var(--font-cormorant)" }}>
                            {new Date(appt.appointment_date + "T12:00:00").getDate()}
                          </span>
                          <span className="text-slate-400 text-[7px] sm:text-[8px] uppercase font-bold">
                            {new Date(appt.appointment_date + "T12:00:00").toLocaleString("es-CO", { month: "short" })}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-brand-navy text-[10px] sm:text-xs italic">{formatDate(appt.appointment_date)}</p>
                          <p className="text-[8px] sm:text-[10px] text-slate-400 font-light mt-0.5">{formatTime(appt.start_time)}</p>
                        </div>
                      </div>
                      <span className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-tighter font-bold text-slate-400 whitespace-nowrap">
                        {APPOINTMENT_STATUS_LABELS[appt.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}