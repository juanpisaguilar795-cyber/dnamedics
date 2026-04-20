"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 👈 NUEVO: para redirección
import { DNAMEDICS_SERVICES, ROUTES } from "@/lib/utils/constants";
import { formatTime } from "@/lib/utils/dates";
import type { TimeSlot } from "@/lib/types";
import { CheckCircle2, UserCircle2, CalendarDays, ArrowRight, ArrowLeft, Clock, AlertCircle, CalendarX2, ChevronRight } from "lucide-react";

const STEPS = ["Servicio", "Fecha", "Horario", "Confirmar"] as const;

export function BookingSection() {
  const router = useRouter(); // 👈 NUEVO: hook de navegación
  const [step, setStep] = useState(0);
  const [service, setService] = useState<(typeof DNAMEDICS_SERVICES)[number]>(DNAMEDICS_SERVICES[0]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  // Verificar sesión
useEffect(() => {
  fetch("/api/auth/check")
    .then(r => r.json())
    .then(({ authenticated }) => setAuthed(authenticated))
    .catch(() => setAuthed(false));
}, []);

  // Cargar slots
  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    setError(null);

    fetch(`/api/slots?date=${date}`)
      .then((r) => r.json())
      .then(({ data }) => {
        setSlots(data ?? []);
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, [date]);

  // Confirmar Cita
  async function handleConfirm() {
    if (!selectedSlot || !date) return;
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_date: date,
          start_time: selectedSlot.start_time,
          notes: notes || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error?.includes("unique constraint") || res.status === 409) {
          throw new Error("Este horario acaba de ser ocupado. Por favor, selecciona otro.");
        }
        throw new Error(json.error ?? "Error al procesar la reserva");
      }

      setSuccess(true);
      
      // 👇 NUEVO: Redirección automática después de 2 segundos
      setTimeout(() => {
        router.push(ROUTES.patientCitas);
        router.refresh();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes("ocupado")) {
        setTimeout(() => {
          setStep(2);
          setSelectedSlot(null);
        }, 2000);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const minDate = new Date().toISOString().split("T")[0];
  
  const isWeekend = (dateString: string): boolean => {
    if (!dateString) return false;
    const day = new Date(dateString + "T12:00:00").getDay();
    return day === 0 || day === 6;
  };

  if (authed === false) return <AuthRequiredView />;
  
  // 👇 MODIFICADO: Vista de éxito con mensaje de redirección
  if (success) return (
    <SuccessView 
      service={service} 
      date={date} 
      reset={() => { setSuccess(false); setStep(0); setDate(""); }} 
    />
  );

  return (
    <section id="reserva" className="py-8 sm:py-12 lg:py-16 bg-white scroll-mt-nav">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Grid principal - Stack en móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
          
          {/* Info - Más compacta en móvil */}
          <BookingInfo />

          {/* Formulario - Optimizado para touch */}
          <div className="bg-slate-50/50 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-slate-100 p-4 sm:p-5 lg:p-6 shadow-sm">
            
            {/* Stepper - Versión móvil mejorada */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`
                    w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all
                    ${i < step ? "bg-brand-teal text-white" : i === step ? "bg-brand-navy text-white scale-105 shadow-md" : "bg-white text-slate-400 border border-slate-200"}
                  `}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  
                  {/* Label visible en sm+ */}
                  <span className={`
                    hidden sm:block text-[9px] sm:text-[10px] uppercase tracking-wider ml-2
                    ${i === step ? "text-brand-navy font-bold" : "text-slate-400 font-medium"}
                  `}>
                    {s}
                  </span>
                  
                  {/* Línea conectora */}
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 mx-2 sm:mx-3 h-0.5 rounded-full ${i < step ? "bg-brand-teal" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Paso 0: Servicio */}
            {step === 0 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-lg sm:text-xl lg:text-2xl text-brand-navy mb-3 sm:mb-4 font-cormorant">
                  ¿Qué servicio <span className="italic text-brand-teal">requieres?</span>
                </h3>
                
                <div className="space-y-2 max-h-[40vh] sm:max-h-80 overflow-y-auto pr-1">
                  {DNAMEDICS_SERVICES.map((s) => (
                    <button 
                      key={s} 
                      onClick={() => setService(s)}
                      className={`
                        w-full text-left px-4 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm transition-all
                        ${service === s 
                          ? "border-brand-teal bg-white text-brand-navy font-semibold shadow-sm" 
                          : "border-transparent bg-white/50 text-slate-600 hover:bg-white"}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{s}</span>
                        {service === s && <ChevronRight className="w-4 h-4 text-brand-teal" />}
                      </div>
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setStep(1)} 
                  className="w-full mt-6 bg-brand-teal hover:bg-brand-navy text-white py-3 sm:py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  Siguiente <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Paso 1: Fecha */}
            {step === 1 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-lg sm:text-xl lg:text-2xl text-brand-navy mb-2 font-cormorant">
                  Selecciona la <span className="italic text-brand-teal">fecha</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 mb-4">
                  Servicio: <span className="text-brand-teal font-medium">{service}</span>
                </p>
                
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
                  <input 
                    type="date" 
                    value={date} 
                    min={minDate} 
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-base sm:text-lg outline-none text-slate-700 bg-transparent" 
                  />
                </div>
                
                {/* Aviso fin de semana */}
                {date && isWeekend(date) && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                    <CalendarX2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-amber-800">No atendemos fines de semana</p>
                      <p className="text-[10px] text-amber-600 mt-0.5">
                        Horario: Lunes a Viernes
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(0)} 
                    className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm hover:bg-slate-50 flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Atrás
                  </button>
                  <button 
                    onClick={() => setStep(2)} 
                    disabled={!date || isWeekend(date)} 
                    className="flex-1 bg-brand-teal hover:bg-brand-navy text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                  >
                    Ver horarios
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Horario */}
            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-lg sm:text-xl lg:text-2xl text-brand-navy mb-1 font-cormorant">
                  Elige tu <span className="italic text-brand-teal">horario</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 mb-4">
                  {date && new Date(date + "T12:00:00").toLocaleDateString("es-CO", { 
                    weekday: "long", 
                    day: "numeric", 
                    month: "long" 
                  })}
                </p>

                {loadingSlots ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Clock className="w-6 h-6 animate-spin mb-3 text-brand-teal" />
                    <span className="text-xs text-slate-500">Cargando horarios...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-10">
                    <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 font-medium mb-1">Sin horarios</p>
                    <p className="text-xs text-slate-400">
                      {isWeekend(date) ? "Solo Lunes a Viernes" : "Prueba otra fecha"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[50vh] sm:max-h-64 overflow-y-auto pr-1">
                    {slots.map((slot) => {
                      const isTaken = !slot.available;
                      return (
                        <button 
                          key={slot.start_time} 
                          disabled={isTaken}
                          onClick={() => { setSelectedSlot(slot); setError(null); }}
                          className={`
                            py-2.5 sm:py-3 px-1 rounded-lg text-xs sm:text-sm font-medium transition-all
                            ${isTaken
                              ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                              : selectedSlot?.start_time === slot.start_time
                              ? "bg-brand-teal text-white shadow-md scale-[1.02]"
                              : "bg-white text-brand-navy border border-slate-200 hover:border-brand-teal/50"}
                          `}
                        >
                          {formatTime(slot.start_time)}
                          {isTaken && (
                            <span className="block text-[8px] opacity-60 mt-0.5">Ocupado</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setStep(1)} 
                    className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm"
                  >
                    Atrás
                  </button>
                  <button 
                    onClick={() => setStep(3)} 
                    disabled={!selectedSlot} 
                    className="flex-1 bg-brand-teal hover:bg-brand-navy text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Confirmación */}
            {step === 3 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-lg sm:text-xl lg:text-2xl text-brand-navy mb-4 font-cormorant">
                  Finalizar <span className="italic text-brand-teal">reserva</span>
                </h3>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mb-4 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 mb-5">
                  {[
                    { label: "Servicio", value: service },
                    { label: "Fecha", value: date ? new Date(date + "T12:00:00").toLocaleDateString("es-CO", { 
                      weekday: "short", 
                      day: "numeric", 
                      month: "short" 
                    }) : "" },
                    { label: "Horario", value: selectedSlot ? formatTime(selectedSlot.start_time) : "" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center px-4 py-3">
                      <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium">{row.label}</span>
                      <span className="text-xs sm:text-sm text-brand-navy font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(2)} 
                    className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm"
                  >
                    Atrás
                  </button>
                  <button 
                    onClick={handleConfirm} 
                    disabled={submitting}
                    className="flex-1 bg-brand-teal hover:bg-brand-navy text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                  >
                    {submitting ? "Confirmando..." : "Confirmar ✓"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Vista de autenticación requerida (optimizada) ---
function AuthRequiredView() {
  return (
    <section className="py-12 sm:py-16 bg-white scroll-mt-nav">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <BookingInfo />
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 text-center border border-slate-100">
          <UserCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-brand-teal mx-auto mb-4 stroke-[1.2]" />
          <h3 className="text-xl sm:text-2xl text-brand-navy mb-2 font-cormorant">
            Inicia sesión <span className="italic text-brand-teal">para agendar</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-xs mx-auto">
            Para garantizar la seguridad de tus datos médicos, necesitas una cuenta activa.
          </p>
          <div className="flex flex-col gap-2">
            <a href={ROUTES.login} className="bg-brand-teal text-white py-3 rounded-xl text-sm font-semibold">
              Iniciar Sesión
            </a>
            <a href={ROUTES.registro} className="text-slate-500 text-xs sm:text-sm hover:underline">
              O crear una cuenta nueva
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Vista de éxito (con mensaje de redirección) ---
function SuccessView({ service, date, reset }: any) {
  return (
    <section className="py-16 sm:py-20 text-center bg-white">
      <div className="max-w-md mx-auto px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-brand-teal" />
        </div>
        <h2 className="text-2xl sm:text-3xl text-brand-navy mb-3 font-cormorant">
          ¡Cita <span className="italic text-brand-teal">enviada!</span>
        </h2>
        <p className="text-sm text-slate-600 mb-2">
          Tu solicitud de <b>{service}</b> está en proceso.
        </p>
        {/* 👇 NUEVO: Mensaje de redirección */}
        <p className="text-xs text-slate-400 mb-8 flex items-center justify-center gap-1">
          <span className="inline-block w-3 h-3 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
          Redirigiendo a Mis Citas...
        </p>
        <button 
          onClick={reset} 
          className="bg-brand-teal text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-brand-navy transition-colors"
        >
          Entendido
        </button>
      </div>
    </section>
  );
}

// --- Info lateral (optimizada para móvil) ---
function BookingInfo() {
  return (
    <div className="lg:pr-6">
      <span className="inline-flex items-center gap-1.5 bg-brand-teal/5 text-brand-teal text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
        <CalendarDays className="w-3 h-3" /> Agenda tu cita
      </span>
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-brand-navy leading-tight mb-3 font-cormorant">
        Reserva directamente <br /> 
        <span className="italic text-brand-teal">desde la plataforma.</span>
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 max-w-md">
        Selecciona el servicio, la fecha y el horario disponible. Recibirás confirmación inmediata.
      </p>
      <ul className="space-y-2">
        {["Confirmación rápida", "Historial clínico", "Notificaciones"].map(t => (
          <li key={t} className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" /> {t}
          </li>
        ))}
      </ul>
    </div>
  );
}