"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { clinicalRecordSchema, type ClinicalRecordData } from "@/lib/validations/clinical";
import { DNAMEDICS_SERVICES } from "@/lib/utils/constants";
import type { PatientProfile, ClinicalRecord } from "@/lib/types/clinical";

const TABS = [
  { key: "consulta",    label: "Consulta" },
  { key: "vitales",     label: "Signos vitales" },
  { key: "diagnostico", label: "Diagnóstico" },
  { key: "tratamiento", label: "Tratamiento" },
  { key: "medicacion",  label: "Medicación" },
  { key: "seguimiento", label: "Seguimiento" },
] as const;

type TabKey = typeof TABS[number]["key"];

interface Props {
  patients:   PatientProfile[];
  record?:     ClinicalRecord;
  patientId?: string;
  onSuccess?: () => void;
  onCancel?:  () => void;
}

export function ClinicalRecordForm({ patients, record, patientId, onSuccess, onCancel }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("consulta");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const tabIndex   = TABS.findIndex(t => t.key === activeTab);
  const resolvedId = patientId ?? record?.patient_id ?? "";

  const { register, handleSubmit, watch, control, setValue, formState: { errors } } =
    useForm<ClinicalRecordData>({
      resolver: zodResolver(clinicalRecordSchema),
      defaultValues: {
        patient_id:          resolvedId,
        consultation_date:   record?.consultation_date ?? new Date().toISOString().split("T")[0],
        service_type:        record?.service_type ?? "",
        reason:              record?.reason ?? "",
        symptoms:            record?.symptoms ?? "",
        blood_pressure:      record?.blood_pressure ?? "",
        heart_rate:          record?.heart_rate as number | undefined,
        temperature:         record?.temperature as number | undefined,
        weight:              record?.weight as number | undefined,
        height:              record?.height as number | undefined,
        diagnosis:           record?.diagnosis ?? "",
        secondary_diagnoses: record?.secondary_diagnoses ?? "",
        diagnosis_status:    record?.diagnosis_status ?? "active",
        treatment:           record?.treatment ?? "",
        recommendations:     record?.recommendations ?? "",
        next_appointment:    record?.next_appointment ?? "",
        evolution_notes:     record?.evolution_notes ?? "",
        future_indications:  record?.future_indications ?? "",
        notes:               record?.notes ?? "",
        prescriptions:       (record?.prescriptions ?? []).map(p => ({
          drug_name: p.drug_name, dose: p.dose,
          frequency: p.frequency, duration: p.duration,
          instructions: p.instructions ?? "",
        })),
      },
    });

  useEffect(() => {
    if (resolvedId) setValue("patient_id", resolvedId, { shouldValidate: false });
  }, [resolvedId, setValue]);

  const { fields, append, remove } = useFieldArray({ control, name: "prescriptions" });

  const weight = Number(watch("weight") ?? 0);
  const height = Number(watch("height") ?? 0);
  const bmi = weight > 0 && height > 0
    ? Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10
    : null;

  const patientName = patients.find(p => p.id === resolvedId)?.full_name ?? (record?.patient as any)?.full_name ?? "";

  const handleExit = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  // --- LÓGICA DE GUARDADO PRESERVADA ---
  async function onSubmit(data: ClinicalRecordData) {
    setLoading(true);
    setError(null);
    
    const payload = { ...data, patient_id: resolvedId || data.patient_id, bmi: bmi ?? undefined };
    const url    = record ? `/api/historial/${record.id}` : "/api/historial";
    const method = record ? "PATCH" : "POST";
    
    try {
      const res  = await fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error ?? "Error al guardar");
      
      // Activar ventana de éxito
      setShowSuccess(true);
      
      // Delay para feedback visual antes de redirección
      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/admin/pacientes/${resolvedId}/historial`);
        }
        router.refresh();
      }, 1500);

    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  const inp = "w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 transition-all bg-white text-slate-700 placeholder:text-slate-300 shadow-sm";
  const lbl = "block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em]";

  return (
    <div className="bg-[#fafbfc] min-h-screen relative font-sans">
      
      {/* VENTANA EMERGENTE DE ÉXITO (MODAL) */}
      {showSuccess && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-brand-navy/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 transform animate-in zoom-in-95 duration-300 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl text-brand-navy mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
              ¡Registro Guardado!
            </h3>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Sincronizando información...</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-10">
        
        {/* HEADER */}
        <div className="flex flex-col mb-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
              {record ? "Editar" : "Nuevo"} <span className="italic text-brand-teal">Registro Clínico</span>
            </h1>
            <button onClick={handleExit} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all bg-white rounded-2xl border border-slate-100 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between mb-2 items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso del formulario</span>
              <span className="text-xs font-black text-brand-teal italic">{Math.round(((tabIndex + 1) / TABS.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
              <div className="h-full bg-brand-teal rounded-full transition-all duration-700 ease-out" style={{ width: `${((tabIndex + 1) / TABS.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border
                ${activeTab === tab.key 
                  ? "border-brand-teal bg-brand-teal text-white shadow-lg shadow-brand-teal/20" 
                  : "border-transparent bg-white text-slate-400 hover:bg-slate-50"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-xl shadow-brand-navy/5">
            
            {activeTab === "consulta" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={lbl}>Paciente</label>
                    <div className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-sm font-semibold text-slate-400">
                      {patientName || "—"}
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Fecha</label>
                    <input {...register("consultation_date")} type="date" className={inp} />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Tipo de Servicio</label>
                  <select {...register("service_type")} className={inp}>
                    <option value="">Seleccione un servicio</option>
                    {DNAMEDICS_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className={lbl}>Motivo</label><textarea {...register("reason")} rows={3} className={`${inp} resize-none`} /></div>
                  <div><label className={lbl}>Síntomas</label><textarea {...register("symptoms")} rows={3} className={`${inp} resize-none`} /></div>
                </div>
              </div>
            )}

            {activeTab === "vitales" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { label: "P. Arterial", field: "blood_pressure", ph: "120/80", unit: "mmHg" },
                    { label: "F. Cardíaca", field: "heart_rate", ph: "72", unit: "bpm" },
                    { label: "Temperatura", field: "temperature", ph: "36.5", unit: "°C" },
                    { label: "Peso", field: "weight", ph: "70", unit: "kg" },
                    { label: "Estatura", field: "height", ph: "170", unit: "cm" },
                  ].map(({ label, field, ph, unit }) => (
                    <div key={field}>
                      <label className={lbl}>{label}</label>
                      <div className="relative">
                        <input {...register(field as any)} placeholder={ph} className={`${inp} pr-14`} />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">{unit}</span>
                      </div>
                    </div>
                  ))}
                  <div>
                    <label className={lbl}>IMC</label>
                    <div className="w-full px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 font-black text-emerald-600 shadow-inner">
                      {bmi || "—"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ... Resto de los tabs (diagnóstico, tratamiento, etc) con el mismo estilo ... */}
            {activeTab === "diagnostico" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                 <div><label className={lbl}>Diagnóstico Principal</label><textarea {...register("diagnosis")} rows={3} className={`${inp} resize-none`} /></div>
                 <div>
                    <label className={lbl}>Estado del Cuadro</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["active", "controlled", "resolved"].map((val) => (
                        <label key={val} className="cursor-pointer">
                          <input {...register("diagnosis_status")} type="radio" value={val} className="sr-only" />
                          <div className={`border-2 rounded-2xl py-4 text-center text-[10px] font-black uppercase tracking-widest transition-all
                            ${watch("diagnosis_status") === val ? "border-brand-teal bg-brand-teal/5 text-brand-teal shadow-md" : "border-slate-100 text-slate-300 hover:border-slate-200"}`}>
                            {val === 'active' ? 'Activo' : val === 'controlled' ? 'Controlado' : 'Resuelto'}
                          </div>
                        </label>
                      ))}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "tratamiento" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div><label className={lbl}>Tratamiento</label><textarea {...register("treatment")} rows={6} className={`${inp} resize-none`} /></div>
                <div><label className={lbl}>Recomendaciones</label><textarea {...register("recommendations")} rows={4} className={`${inp} resize-none`} /></div>
              </div>
            )}

            {activeTab === "medicacion" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {fields.map((field, i) => (
                  <div key={field.id} className="p-8 rounded-[2rem] border border-slate-100 bg-[#fafbfc] relative">
                    <button type="button" onClick={() => remove(i)} className="absolute top-6 right-6 text-slate-200 hover:text-rose-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={lbl}>Medicamento</label><input {...register(`prescriptions.${i}.drug_name`)} className={inp} /></div>
                      <div><label className={lbl}>Dosis</label><input {...register(`prescriptions.${i}.dose`)} className={inp} /></div>
                      <div><label className={lbl}>Frecuencia</label><input {...register(`prescriptions.${i}.frequency`)} className={inp} /></div>
                      <div><label className={lbl}>Duración</label><input {...register(`prescriptions.${i}.duration`)} className={inp} /></div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => append({ drug_name:"", dose:"", frequency:"", duration:"", instructions:"" })}
                  className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] hover:border-brand-teal hover:text-brand-teal transition-all">
                  + Añadir Fármaco
                </button>
              </div>
            )}

            {activeTab === "seguimiento" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div><label className={lbl}>Próxima Cita Sugerida</label><input {...register("next_appointment")} type="date" className={inp} /></div>
                <div><label className={lbl}>Notas Evolutivas</label><textarea {...register("evolution_notes")} rows={6} className={`${inp} resize-none`} /></div>
              </div>
            )}

          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex gap-4 pt-4">
            <button type="button" 
              onClick={() => tabIndex === 0 ? handleExit() : setActiveTab(TABS[tabIndex - 1].key)}
              className="flex-1 bg-white border border-slate-100 text-slate-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
              {tabIndex === 0 ? "Cancelar" : "← Regresar"}
            </button>
            
            {tabIndex < TABS.length - 1 ? (
              <button type="button" onClick={() => setActiveTab(TABS[tabIndex + 1].key)}
                className="flex-[2] bg-brand-navy hover:bg-[#2a438c] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-navy/10">
                Siguiente Paso →
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="flex-[2] bg-brand-teal hover:bg-[#006a7a] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-60 flex items-center justify-center gap-3 shadow-xl shadow-brand-teal/20">
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? "Procesando..." : "Finalizar y Guardar"}
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-8 bg-rose-50 border border-rose-100 rounded-2xl px-6 py-4 text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {error}
          </div>
        )}
      </div>
    </div>
  );
}