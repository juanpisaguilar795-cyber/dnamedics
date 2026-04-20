"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { antecedentsSchema, type AntecedentsData } from "@/lib/validations/clinical";

// ─── ICONOS ───────────────────────────────────────────────────
const Icons = {
  Metabolic: () => (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>),
  Endocrine: () => (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>),
  Bone: () => (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>),
  Respiratory: () => (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-3 3m3-3l3 3M9 15l-3 3m0 0l3 3m-3-3h12" /></svg>),
  Brain: () => (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" /></svg>),
  Stethoscope: () => (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>)
};

// ─── OPCIONES ──────────────────────────────────────────────────
const DIABETES_OPTS = [{ value:"type1",label:"Tipo 1"},{ value:"type2",label:"Tipo 2"},{ value:"gestational",label:"Gestacional"},{ value:"prediabetes",label:"Prediabetes"},{ value:"other",label:"Otro"}];
const CANCER_OPTS = [{ value:"breast",label:"Mama"},{ value:"colon",label:"Colon"},{ value:"lung",label:"Pulmón"},{ value:"prostate",label:"Próstata"},{ value:"skin",label:"Piel"},{ value:"cervical",label:"Cervical"},{ value:"stomach",label:"Estómago"},{ value:"other",label:"Otro"}];
const HEART_OPTS = [{ value:"infarct",label:"Infarto"},{ value:"arrhythmia",label:"Arritmia"},{ value:"valve",label:"Válvula"},{ value:"congenital",label:"Congénita"},{ value:"stroke",label:"ACV"},{ value:"other",label:"Otro"}];
const HYPERTENSION_OPTS = [{ value:"yes",label:"Sí"},{ value:"other",label:"Otro"}];
const ALCOHOL_OPTS = [{ value:"none",label:"No consume"},{ value:"occasional",label:"Ocasional"},{ value:"frequent",label:"Frecuente"}];
const ACTIVITY_OPTS = [{ value:"none",label:"Sedentario"},{ value:"low",label:"Bajo"},{ value:"moderate",label:"Moderado"},{ value:"high",label:"Alto"}];
const SLEEP_HOURS_OPTS = [{ value:"<5",label:"< 5 h"},{ value:"5-6",label:"5–6 h"},{ value:"7-8",label:"7–8 h"},{ value:">8",label:"> 8 h"}];
const SLEEP_QUAL_OPTS = [{ value:"good",label:"Buena"},{ value:"fair",label:"Regular"},{ value:"poor",label:"Mala"}];
const EXERCISE_FREQ_OPTS = [{ value:"none",label:"Ninguna"},{ value:"1-2",label:"1-2 días"},{ value:"3-4",label:"3-4 días"},{ value:"5+",label:"5+ días"}];
const DIET_OPTS = [{ value:"balanced",label:"Equilibrada"},{ value:"vegetarian",label:"Vegetariana"},{ value:"vegan",label:"Vegana"},{ value:"keto",label:"Cetogénica"},{ value:"hypercaloric",label:"Hipercalórica"},{ value:"hypocaloric",label:"Hipocalórica"},{ value:"other",label:"Otra"}];
const ENVIRONMENT_OPTS = [{ value:"urban",label:"Urbano"},{ value:"suburban",label:"Suburbano"},{ value:"rural",label:"Rural"}];

const SYSTEMS = [
  { key: "sys_metabolic", label: "Metabólicas", icon: <Icons.Metabolic /> },
  { key: "sys_endocrine", label: "Endocrinas", icon: <Icons.Endocrine /> },
  { key: "sys_musculoskeletal", label: "Osteomusculares", icon: <Icons.Bone /> },
  { key: "sys_gastrointestinal", label: "Gastrointestinales", icon: <Icons.Stethoscope /> },
  { key: "sys_respiratory", label: "Respiratorias", icon: <Icons.Respiratory /> },
  { key: "sys_neurological", label: "Neurológicas", icon: <Icons.Brain /> },
  { key: "sys_genitourinary", label: "Genitourinarias", icon: <Icons.Stethoscope /> },
  { key: "sys_skin", label: "Tegumentarias", icon: <Icons.Stethoscope /> },
  { key: "sys_ocular", label: "Oculares", icon: <Icons.Stethoscope /> },
  { key: "sys_auditory", label: "Auditivas", icon: <Icons.Stethoscope /> },
];

const TABS = ["Personales", "Sistemas", "Familiares", "Estilo de vida"];

export default function AntecedentesPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<AntecedentsData>({
    resolver: zodResolver(antecedentsSchema),
    defaultValues: {
      prev_diseases: "", surgeries: "", hospitalizations: "", allergies: "", current_meds: "",
      sys_metabolic: "", sys_endocrine: "", sys_musculoskeletal: "", sys_gastrointestinal: "",
      sys_respiratory: "", sys_neurological: "", sys_genitourinary: "", sys_skin: "", sys_ocular: "", sys_auditory: "",
      family_diabetes: false, family_hypertension: false, family_cancer: false, family_heart: false, family_other: "",
      fam_diabetes_paternal: "", fam_diabetes_maternal: "", fam_diabetes_other: "",
      fam_hypertension_paternal: "", fam_hypertension_maternal: "", fam_hypertension_other: "",
      fam_cancer_paternal: "", fam_cancer_maternal: "", fam_cancer_other: "",
      fam_heart_paternal: "", fam_heart_maternal: "", fam_heart_other: "",
      fam_other_paternal: "", fam_other_maternal: "",
      smoker: false, alcohol: "none", physical_activity: "none",
      lifestyle_exercise: "", lifestyle_exercise_freq: "none", lifestyle_diet: "", lifestyle_diet_notes: "",
      lifestyle_sleep_hours: "", lifestyle_sleep_quality: "", lifestyle_sleep_notes: "",
      lifestyle_environment: "", lifestyle_env_notes: "",
    },
  });

  useEffect(() => {
    fetch(`/api/patient-antecedents/${id}`)
      .then(r => r.json())
      .then(({ data }) => {
        if (data) {
          const cleanedData = { ...data };
          Object.keys(cleanedData).forEach(key => {
            if (cleanedData[key] === null) cleanedData[key] = "";
          });
          reset(cleanedData);
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [id, reset]);

  async function onSubmit(data: AntecedentsData) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/patient-antecedents/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error ?? "Error al guardar");

      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/pacientes/${id}/historial`);
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  const inp = "w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-100 text-xs sm:text-sm outline-none focus:border-[#007b8f] focus:ring-2 focus:ring-[#007b8f]/10 bg-slate-50/50 placeholder:text-slate-300 text-slate-700 transition-all";
  const sel = `${inp} cursor-pointer`;
  const card = "bg-white rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-slate-100 p-4 sm:p-6 md:p-8 shadow-sm";

  const CompactCheck = ({ name, label }: { name: keyof AntecedentsData; label: string }) => {
    return (
      <label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
        <input {...register(name as any)} type="checkbox" className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-slate-300 text-[#007b8f] focus:ring-[#007b8f]" />
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight text-slate-500">{label}</span>
      </label>
    );
  };

  const CapsuleGroup = ({ name, opts, color = "text-[#007b8f] border-[#007b8f]" }: { name: keyof AntecedentsData; opts: { value: string; label: string }[]; color?: string }) => {
    const cur = watch(name as any);
    return (
      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
        {opts.map(o => (
          <label key={o.value} className="flex-1 min-w-[48px] sm:min-w-[52px] cursor-pointer">
            <input {...register(name as any)} type="radio" value={o.value} className="sr-only" />
            <div className={`text-[8px] sm:text-[9px] font-bold uppercase text-center py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all border ${cur === o.value ? `bg-white ${color} border-2` : "bg-slate-50 border-slate-100 text-slate-400"}`}>
              {o.label}
            </div>
          </label>
        ))}
      </div>
    );
  };

  const FamilyRow = ({ label, pField, mField, oField, opts }: { label: string; pField: keyof AntecedentsData; mField: keyof AntecedentsData; oField: keyof AntecedentsData; opts: { value: string; label: string }[] }) => {
    const pVal = watch(pField as any);
    const mVal = watch(mField as any);
    const showOther = pVal === "other" || mVal === "other" || opts.length === 0;
    return (
      <div className="bg-slate-50/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100">
        <p className="text-[9px] sm:text-[10px] font-bold text-[#007b8f] uppercase tracking-wider mb-2 sm:mb-3">{label}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2">
          <div>
            <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 mb-1 sm:mb-1.5">Línea paterna</p>
            {opts.length > 0 ? (
              <select {...register(pField as any)} className={sel}>
                <option value="">Sin antecedente</option>
                {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input {...register(pField as any)} type="text" className={inp} placeholder="Describir..." />
            )}
          </div>
          <div>
            <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 mb-1 sm:mb-1.5">Línea materna</p>
            {opts.length > 0 ? (
              <select {...register(mField as any)} className={sel}>
                <option value="">Sin antecedente</option>
                {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input {...register(mField as any)} type="text" className={inp} placeholder="Describir..." />
            )}
          </div>
        </div>
        {showOther && opts.length > 0 && (
          <div className="mt-2">
            <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 mb-1 sm:mb-1.5">Especificar</p>
            <input {...register(oField as any)} type="text" className={inp} placeholder="Describir con detalle..." />
          </div>
        )}
      </div>
    );
  };

  if (fetching) return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
      <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#007b8f] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Header - Responsive */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <Link href={`/admin/pacientes/${id}/historial`} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#007b8f] shadow-sm">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl text-[#1e3a8a]" style={{ fontFamily: "var(--font-cormorant)" }}>
              Antecedentes <span className="italic text-[#007b8f]">Clínicos</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-light mt-0.5">Historia médica completa del paciente</p>
          </div>
        </div>

        {success && (
          <div className="mb-4 sm:mb-5 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
            <p className="text-green-700 text-xs sm:text-sm font-medium">✓ Antecedentes guardados correctamente</p>
          </div>
        )}

        {/* Tabs - Responsive */}
        <div className="flex gap-0.5 sm:gap-1 bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 mb-5 sm:mb-6 shadow-sm overflow-x-auto">
          {TABS.map((tab, i) => (
            <button key={tab} type="button" onClick={() => setActiveTab(i)} className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wide transition-all whitespace-nowrap ${activeTab === i ? "bg-[#007b8f] text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campos ocultos */}
          <input type="hidden" {...register("family_other")} />
          <input type="hidden" {...register("fam_diabetes_other")} />
          <input type="hidden" {...register("fam_hypertension_other")} />
          <input type="hidden" {...register("fam_cancer_other")} />
          <input type="hidden" {...register("fam_heart_other")} />
          <input type="hidden" {...register("fam_other_paternal")} />
          <input type="hidden" {...register("fam_other_maternal")} />
          <input type="hidden" {...register("lifestyle_exercise")} />
          <input type="hidden" {...register("lifestyle_exercise_freq")} />
          <input type="hidden" {...register("lifestyle_diet")} />
          <input type="hidden" {...register("lifestyle_diet_notes")} />
          <input type="hidden" {...register("lifestyle_sleep_hours")} />
          <input type="hidden" {...register("lifestyle_sleep_quality")} />
          <input type="hidden" {...register("lifestyle_sleep_notes")} />
          <input type="hidden" {...register("lifestyle_environment")} />
          <input type="hidden" {...register("lifestyle_env_notes")} />

          {/* TAB 0: PERSONALES */}
          {activeTab === 0 && (
            <div className={card}>
              <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-6">
                <div className="w-1 sm:w-1.5 h-4 sm:h-5 bg-[#007b8f] rounded-full"/>
                <h2 className="text-xs sm:text-sm font-bold text-[#1e3a8a] uppercase tracking-wider">Patologías y cirugías</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="md:col-span-2"><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1 sm:mb-1.5 block">Enfermedades previas</label><textarea {...register("prev_diseases")} rows={2} className={inp} placeholder="Hipertensión, diabetes, asma..." /></div>
                <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1 sm:mb-1.5 block">Cirugías</label><textarea {...register("surgeries")} rows={2} className={inp} placeholder="Apéndice, cesárea..." /></div>
                <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1 sm:mb-1.5 block">Hospitalizaciones</label><textarea {...register("hospitalizations")} rows={2} className={inp} placeholder="Motivo y fecha..." /></div>
                <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1 sm:mb-1.5 block">Alergias</label><textarea {...register("allergies")} rows={2} className={inp} placeholder="Medicamentos, alimentos..." /></div>
                <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1 sm:mb-1.5 block">Medicamentos actuales</label><textarea {...register("current_meds")} rows={2} className={inp} placeholder="Nombre, dosis, frecuencia..." /></div>
              </div>
            </div>
          )}

          {/* TAB 1: SISTEMAS */}
          {activeTab === 1 && (
            <div className={card}>
              <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
                <div className="w-1 sm:w-1.5 h-4 sm:h-5 bg-purple-500 rounded-full"/>
                <h2 className="text-xs sm:text-sm font-bold text-[#1e3a8a] uppercase tracking-wider">Revisión por sistemas</h2>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-light mb-4 sm:mb-5">Describe hallazgos relevantes o deja en blanco si es normal.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {SYSTEMS.map(s => (
                  <div key={s.key}>
                    <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1 sm:mb-1.5 flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[#007b8f]">{s.icon}</span> {s.label}
                    </label>
                    <textarea {...register(s.key as any)} rows={2} className={inp} placeholder={`Ej: Sin alteraciones...`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FAMILIARES */}
          {activeTab === 2 && (
            <div className={card}>
              <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
                <div className="w-1 sm:w-1.5 h-4 sm:h-5 bg-[#1e3a8a] rounded-full"/>
                <h2 className="text-xs sm:text-sm font-bold text-[#1e3a8a] uppercase tracking-wider">Antecedentes familiares</h2>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-light mb-4 sm:mb-5">Selecciona el tipo por línea paterna y materna.</p>
              
              <div className="space-y-3 sm:space-y-4">
                <FamilyRow label="Diabetes" pField="fam_diabetes_paternal" mField="fam_diabetes_maternal" oField="fam_diabetes_other" opts={DIABETES_OPTS} />
                <FamilyRow label="Hipertensión" pField="fam_hypertension_paternal" mField="fam_hypertension_maternal" oField="fam_hypertension_other" opts={HYPERTENSION_OPTS} />
                <FamilyRow label="Cáncer" pField="fam_cancer_paternal" mField="fam_cancer_maternal" oField="fam_cancer_other" opts={CANCER_OPTS} />
                <FamilyRow label="Cardiopatías" pField="fam_heart_paternal" mField="fam_heart_maternal" oField="fam_heart_other" opts={HEART_OPTS} />
                
                <div className="bg-slate-50/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100">
                  <p className="text-[9px] sm:text-[10px] font-bold text-[#007b8f] uppercase tracking-wider mb-2 sm:mb-3">Otras enfermedades</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 mb-1 sm:mb-1.5">Línea paterna</p>
                      <input {...register("fam_other_paternal")} type="text" className={inp} placeholder="Ej: Artritis, tiroides..." />
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 mb-1 sm:mb-1.5">Línea materna</p>
                      <input {...register("fam_other_maternal")} type="text" className={inp} placeholder="Ej: Artritis, tiroides..." />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1 sm:mb-1.5 block">Observaciones adicionales</label>
                <textarea {...register("family_other")} rows={2} className={inp} placeholder="Otras condiciones familiares relevantes..." />
              </div>
            </div>
          )}

          {/* TAB 3: ESTILO DE VIDA */}
          {activeTab === 3 && (
            <div className="space-y-4 sm:space-y-5">
              <div className={card}>
                <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5"><div className="w-1 sm:w-1.5 h-4 sm:h-5 bg-teal-500 rounded-full"/><h2 className="text-xs sm:text-sm font-bold text-[#1e3a8a] uppercase tracking-wider">Hábitos básicos</h2></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Tabaquismo</label><CompactCheck name="smoker" label="Fumador activo" /></div>
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Alcohol</label><CapsuleGroup name="alcohol" opts={ALCOHOL_OPTS} /></div>
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Actividad física</label><CapsuleGroup name="physical_activity" opts={ACTIVITY_OPTS} color="text-[#1e3a8a] border-[#1e3a8a]" /></div>
                </div>
              </div>

              <div className={card}>
                <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5"><div className="w-1 sm:w-1.5 h-4 sm:h-5 bg-blue-500 rounded-full"/><h2 className="text-xs sm:text-sm font-bold text-[#1e3a8a] uppercase tracking-wider">Ejercicio</h2></div>
                <div className="space-y-3 sm:space-y-4">
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Tipo de ejercicio</label><input {...register("lifestyle_exercise")} className={inp} placeholder="Ej: caminata, natación, pesas..." /></div>
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Frecuencia</label><CapsuleGroup name="lifestyle_exercise_freq" opts={EXERCISE_FREQ_OPTS} color="text-blue-700 border-blue-500" /></div>
                </div>
              </div>

              <div className={card}>
                <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5"><div className="w-1 sm:w-1.5 h-4 sm:h-5 bg-green-500 rounded-full"/><h2 className="text-xs sm:text-sm font-bold text-[#1e3a8a] uppercase tracking-wider">Alimentación</h2></div>
                <div className="space-y-3 sm:space-y-4">
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Tipo de dieta</label><CapsuleGroup name="lifestyle_diet" opts={DIET_OPTS} color="text-green-700 border-green-500" /></div>
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Notas adicionales</label><textarea {...register("lifestyle_diet_notes")} rows={2} className={inp} placeholder="Detalles sobre alimentación..." /></div>
                </div>
              </div>

              <div className={card}>
                <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5"><div className="w-1 sm:w-1.5 h-4 sm:h-5 bg-indigo-500 rounded-full"/><h2 className="text-xs sm:text-sm font-bold text-[#1e3a8a] uppercase tracking-wider">Sueño</h2></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Horas de sueño</label><CapsuleGroup name="lifestyle_sleep_hours" opts={SLEEP_HOURS_OPTS} color="text-indigo-700 border-indigo-500" /></div>
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Calidad del sueño</label><CapsuleGroup name="lifestyle_sleep_quality" opts={SLEEP_QUAL_OPTS} color="text-indigo-700 border-indigo-500" /></div>
                </div>
                <div className="mt-3 sm:mt-4"><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Notas sobre sueño</label><textarea {...register("lifestyle_sleep_notes")} rows={2} className={inp} placeholder="Insomnio, pesadillas, apnea..." /></div>
              </div>

              <div className={card}>
                <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5"><div className="w-1 sm:w-1.5 h-4 sm:h-5 bg-amber-500 rounded-full"/><h2 className="text-xs sm:text-sm font-bold text-[#1e3a8a] uppercase tracking-wider">Entorno</h2></div>
                <div className="space-y-3 sm:space-y-4">
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Tipo de entorno</label><CapsuleGroup name="lifestyle_environment" opts={ENVIRONMENT_OPTS} color="text-amber-700 border-amber-500" /></div>
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 block">Notas del entorno</label><textarea {...register("lifestyle_env_notes")} rows={2} className={inp} placeholder="Estrés laboral, condiciones de vivienda..." /></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
              <p className="text-red-600 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {/* Botones de navegación - Responsive */}
          <div className="mt-5 sm:mt-6 flex items-center gap-2 sm:gap-3">
            <button type="button" disabled={activeTab === 0} onClick={() => setActiveTab(t => t - 1)} className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg sm:rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-[#007b8f] disabled:opacity-25">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>

            <Link href={`/admin/pacientes/${id}/historial`} className="flex-1 text-center py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100 bg-white hover:bg-slate-50">
              Cancelar
            </Link>

            {activeTab < TABS.length - 1 ? (
              <button type="button" onClick={() => setActiveTab(t => t + 1)} className="flex-[2] bg-[#007b8f] hover:bg-[#1e3a8a] text-white py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest shadow-lg">
                Siguiente →
              </button>
            ) : (
              <button type="submit" disabled={loading} className="flex-[2] bg-[#007b8f] hover:bg-[#1e3a8a] text-white py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
                {loading ? "Guardando..." : "Guardar Antecedentes"}
              </button>
            )}
          </div>

          {/* Indicador de tabs */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {TABS.map((_, i) => (<div key={i} className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${i === activeTab ? "w-5 sm:w-6 bg-[#007b8f]" : "w-1 sm:w-1.5 bg-slate-200"}`}/>))}
          </div>
        </form>
      </div>
    </div>
  );
}