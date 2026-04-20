"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { patientProfileSchema, type PatientProfileData } from "@/lib/validations/clinical";

const DOC_TYPES  = ["CC","CE","PA","TI","RC","NIT"] as const;
const SEX_OPTS   = [{ value:"M", label:"Masculino" },{ value:"F", label:"Femenino" },{ value:"O", label:"Otro" }];
const BLOOD_OPTS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"] as const;

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const id     = params.id as string;

  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PatientProfileData>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: { document_type: "CC" },
  });

  useEffect(() => {
    fetch(`/api/pacientes/${id}/profile`)
      .then(r => r.json())
      .then(({ data }) => {
        if (data) {
          reset({
            full_name:                  data.full_name ?? "",
            phone:                      data.phone ?? "",
            document_type:              data.document_type ?? "CC",
            document_id:                data.document_id ?? "",
            birth_date:                 data.birth_date ?? "",
            sex:                        data.sex ?? "",
            blood_type:                 data.blood_type ?? "",
            address:                    data.address ?? "",
            city:                       data.city ?? "",
            emergency_contact_name:     data.emergency_contact_name ?? "",
            emergency_contact_phone:    data.emergency_contact_phone ?? "",
            emergency_contact_relation: data.emergency_contact_relation ?? "",
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [id, reset]);

  async function onSubmit(data: PatientProfileData) {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/pacientes/${id}/profile`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al actualizar");
      
      setSuccess(true);
      setTimeout(() => { 
        router.push(`/admin/pacientes/${id}/historial`); 
        router.refresh(); 
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  const inp = "w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-[1.2rem] border border-slate-100 text-xs sm:text-sm outline-none focus:border-[#007b8f] focus:ring-4 focus:ring-[#007b8f]/5 transition-all bg-slate-50/30 placeholder:text-slate-300 font-medium text-slate-700";
  const lbl = "block text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 uppercase tracking-[0.1em] sm:tracking-[0.15em] ml-1";

  if (fetching) return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
      <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 border-[#007b8f] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] relative overflow-hidden">
      {/* Decoración de fondo - Responsive */}
      <div className="absolute -top-24 -right-24 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10">
        
        {/* Header - Responsive */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10">
          <Link href={`/admin/pacientes/${id}/historial`}
            className="group w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-[#007b8f] hover:border-[#007b8f]/20 hover:shadow-xl hover:shadow-[#007b8f]/10 transition-all duration-300">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl text-[#1e3a8a]" style={{ fontFamily: "var(--font-cormorant)" }}>
              Editar Perfil de <span className="italic text-[#007b8f]">Paciente</span>
            </h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID de Registro: {id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 sm:mb-8 bg-[#007b8f] text-white rounded-xl sm:rounded-[1.5rem] px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg shadow-[#007b8f]/20">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Cambios guardados con éxito. Redirigiendo...</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-7 md:space-y-8">

          {/* Sección: Información Personal */}
          <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-8">
                <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-[#007b8f] rounded-full" />
                <h2 className="text-base sm:text-lg text-[#1e3a8a] font-semibold" style={{ fontFamily: "var(--font-cormorant)" }}>Información Básica</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="md:col-span-2">
                <label className={lbl}>Nombre Completo *</label>
                <input {...register("full_name")} type="text" placeholder="Ej. Juan Pablo Gómez" className={inp} />
                {errors.full_name && <p className="text-red-500 text-[8px] sm:text-[9px] md:text-[10px] font-bold mt-1.5 sm:mt-2 ml-1 uppercase tracking-tighter">{errors.full_name.message}</p>}
              </div>
              
              <div>
                <label className={lbl}>Tipo de Documento</label>
                <select {...register("document_type")} className={inp}>
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              <div>
                <label className={lbl}>Número de Documento</label>
                <input {...register("document_id")} type="text" placeholder="123456789" className={inp} />
              </div>

              <div>
                <label className={lbl}>Fecha de Nacimiento</label>
                <input {...register("birth_date")} type="date" className={inp} />
              </div>

              <div>
                <label className={lbl}>Género</label>
                <select {...register("sex")} className={inp}>
                  <option value="">Seleccionar...</option>
                  {SEX_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <label className={lbl}>Grupo Sanguíneo</label>
                <select {...register("blood_type")} className={inp}>
                  <option value="">Seleccionar...</option>
                  {BLOOD_OPTS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className={lbl}>Teléfono Móvil</label>
                <input {...register("phone")} type="tel" placeholder="+57 300 000 0000" className={inp} />
              </div>
            </div>
          </div>

          {/* Sección: Ubicación y Contacto */}
          <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-8">
                <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-[#1e3a8a] rounded-full" />
                <h2 className="text-base sm:text-lg text-[#1e3a8a] font-semibold" style={{ fontFamily: "var(--font-cormorant)" }}>Ubicación y Emergencia</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div>
                <label className={lbl}>Ciudad</label>
                <input {...register("city")} type="text" placeholder="Bogotá" className={inp} />
              </div>
              <div>
                <label className={lbl}>Dirección de Residencia</label>
                <input {...register("address")} type="text" placeholder="Calle 123 # 45-67" className={inp} />
              </div>

              <div className="md:col-span-2 mt-3 sm:mt-4 pt-4 sm:pt-5 md:pt-6 border-t border-slate-50">
                <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-5 md:mb-6">En caso de emergencia avisar a:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                        <label className={lbl}>Nombre</label>
                        <input {...register("emergency_contact_name")} type="text" placeholder="Nombre contacto" className={inp} />
                    </div>
                    <div>
                        <label className={lbl}>Teléfono</label>
                        <input {...register("emergency_contact_phone")} type="tel" placeholder="Teléfono" className={inp} />
                    </div>
                    <div>
                        <label className={lbl}>Parentesco</label>
                        <input {...register("emergency_contact_relation")} type="text" placeholder="Ej. Esposa" className={inp} />
                    </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400 animate-pulse" />
              <p className="text-red-600 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          {/* Botones de Acción - Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
            <Link href={`/admin/pacientes/${id}/historial`}
              className="flex-1 text-center border border-slate-200 text-slate-400 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:bg-white hover:text-slate-600 hover:border-slate-300 transition-all order-2 sm:order-1">
              Descartar Cambios
            </Link>
            <button type="submit" disabled={loading || success}
              className="flex-[2] bg-[#007b8f] hover:bg-[#1e3a8a] text-white py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all disabled:opacity-50 shadow-xl shadow-[#007b8f]/20 flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98] order-1 sm:order-2">
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Actualizando Datos...</span>
                </>
              ) : (
                "Confirmar y Guardar Perfil"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}