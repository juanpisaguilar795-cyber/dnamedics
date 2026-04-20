import { notFound } from "next/navigation";
import { guardAdmin } from "@/lib/utils/serverGuards";
import { adminGetRecord, adminGetPatient, adminGetAntecedents } from "@/modules/historial/services/historial.service";
import { DIAGNOSIS_STATUS_LABELS, DIAGNOSIS_STATUS_COLORS } from "@/lib/types/clinical";
import { formatDate } from "@/lib/utils/dates";
import Link from "next/link";
import { RecordDetailActions } from "@/components/historial/RecordDetailActions";
import { ROUTES } from "@/lib/utils/constants";

interface Props { params: { id: string; recordId: string } }

export default async function RecordDetailPage({ params }: Props) {
  await guardAdmin();

  const [record, patient, antecedents] = await Promise.all([
    adminGetRecord(params.recordId),
    adminGetPatient(params.id),
    adminGetAntecedents(params.id).catch(() => null),
  ]);

  if (!record || !patient) notFound();

  // Helper para acceder a propiedades extendidas
  const recordData = record as any;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8 sm:mb-10 md:mb-12">
      <h3 className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#007b8f] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-5 md:mb-6 pb-2 border-b border-slate-50">
        {title}
      </h3>
      {children}
    </div>
  );

  const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="space-y-1.5 sm:space-y-2">
      <p className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-300 font-black uppercase tracking-[0.1em] sm:tracking-[0.15em]">{label}</p>
      <p className={`text-xs sm:text-sm leading-relaxed ${value ? "text-slate-600 font-medium" : "text-slate-300 italic"}`}>
        {value ?? "No registrado"}
      </p>
    </div>
  );

  const IconWrapper = ({ children, color = "text-[#007b8f]" }: { children: React.ReactNode, color?: string }) => (
    <svg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {children}
    </svg>
  );

  const consultationDate = record.consultation_date instanceof Date 
    ? record.consultation_date.toISOString().split("T")[0]
    : record.consultation_date;

  return (
    <div className="min-h-screen bg-[#fafbfc] relative overflow-hidden font-sans">
      <div className="absolute -top-24 -right-24 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-64 sm:w-80 h-64 sm:h-80 bg-teal-50/30 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 relative z-10">

        <nav className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
          <Link href={ROUTES.adminDashboard} className="text-slate-400 hover:text-[#007b8f] transition-colors">Admin</Link>
          <span className="text-slate-200">/</span>
          <Link href={ROUTES.adminPacientes} className="text-slate-400 hover:text-[#007b8f] transition-colors">Pacientes</Link>
          <span className="text-slate-200">/</span>
          <Link href={`/admin/pacientes/${params.id}/historial`} className="text-slate-400 hover:text-[#007b8f] transition-colors truncate max-w-[120px] sm:max-w-none">
            {patient.full_name}
          </Link>
          <span className="text-slate-200">/</span>
          <span className="text-[#1e3a8a] font-bold">Detalle de Consulta</span>
        </nav>

        <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-6 md:p-8 mb-6 sm:mb-7 md:mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 md:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl text-[#1e3a8a] font-medium truncate" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {record.diagnosis}
                </h1>
                {/* ✅ CORRECCIÓN 1: Cast del diagnosis_status */}
                <span className={`text-[7px] sm:text-[8px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-black uppercase tracking-widest whitespace-nowrap ${DIAGNOSIS_STATUS_COLORS[record.diagnosis_status as keyof typeof DIAGNOSIS_STATUS_COLORS]}`}>
                  {DIAGNOSIS_STATUS_LABELS[record.diagnosis_status as keyof typeof DIAGNOSIS_STATUS_LABELS]}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <IconWrapper><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></IconWrapper>
                  <span className="whitespace-nowrap">{formatDate(consultationDate)}</span>
                </div>
                {record.service_type && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <IconWrapper><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></IconWrapper>
                    <span className="whitespace-nowrap">{record.service_type}</span>
                  </div>
                )}
                {recordData.doctor?.full_name && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <IconWrapper><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></IconWrapper>
                    <span className="whitespace-nowrap">{recordData.doctor.full_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ CORRECCIÓN 2: Cast del record para que coincida con el tipo esperado */}
            <RecordDetailActions
              recordId={record.id}
              patientId={params.id}
              record={record as any}
              patient={patient}
              antecedents={antecedents}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 md:gap-8">
          
          {/* Columna de Información Médica */}
          <div className="lg:col-span-8 bg-white rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-6 md:p-8 lg:p-10 shadow-sm">
            
            <Section title="Evaluación Inicial">
              <div className="grid grid-cols-1 gap-6 sm:gap-7 md:gap-8">
                <Field label="Motivo de consulta" value={record.reason} />
                {recordData.symptoms && <Field label="Sintomatología" value={recordData.symptoms} />}
              </div>
            </Section>

            {/* Signos Vitales */}
            {(record.blood_pressure || record.heart_rate || recordData.temperature || record.weight) && (
              <Section title="Signos Vitales">
                <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                  {[
                    { id: "presion", label: "Presión",  value: record.blood_pressure, unit: "mmHg" },
                    { id: "pulso",   label: "Pulso",    value: record.heart_rate,     unit: "bpm" },
                    { id: "temp",    label: "Temp.",    value: recordData.temperature, unit: "°C" },
                    { id: "peso",    label: "Peso",     value: record.weight,         unit: "kg" },
                    { id: "talla",   label: "Talla",    value: record.height,         unit: "cm" },
                    { id: "imc",     label: "IMC",      value: record.bmi,            unit: "kg/m²" },
                  ].map((v) => v.value ? (
                    <VitalMiniBox key={v.label} icon={v.id} label={v.label} value={v.value} unit={v.unit} />
                  ) : null)}
                </div>
              </Section>
            )}

            <Section title="Diagnóstico y Plan">
              <div className="space-y-6 sm:space-y-7 md:space-y-8">
                <Field label="Diagnóstico Clínico" value={record.diagnosis} />
                {recordData.secondary_diagnoses && <Field label="Diagnósticos Secundarios" value={recordData.secondary_diagnoses} />}
                <Field label="Plan de Tratamiento" value={record.treatment} />
                {recordData.recommendations && <Field label="Recomendaciones" value={recordData.recommendations} />}
                {record.notes && <Field label="Observaciones" value={record.notes} />}
              </div>
            </Section>

            {recordData.prescriptions && recordData.prescriptions.length > 0 && (
              <Section title={`Prescripción Médica (${recordData.prescriptions.length})`}>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {recordData.prescriptions.map((p: any, i: number) => (
                    <div key={p.id ?? i} className="bg-[#007b8f]/5 border border-[#007b8f]/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 group transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4">
                        <p className="font-bold text-[#1e3a8a] text-xs sm:text-sm uppercase tracking-wide">{p.drug_name}</p>
                        <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black bg-white text-[#007b8f] border border-[#007b8f]/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase whitespace-nowrap">
                          {p.dose}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-[#007b8f]/10">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <IconWrapper><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
                          <span className="truncate">{p.frequency}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <IconWrapper><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></IconWrapper>
                          <span className="truncate">{p.duration}</span>
                        </div>
                        {p.instructions && (
                          <div className="sm:col-span-2 md:col-span-1 flex items-center gap-1.5 sm:gap-2 text-slate-400">
                            <IconWrapper><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></IconWrapper>
                            <span className="truncate">{p.instructions}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {(recordData.next_appointment || recordData.evolution_notes || recordData.future_indications) && (
              <Section title="Seguimiento">
                <div className="grid grid-cols-1 gap-6 sm:gap-7 md:gap-8">
                  {recordData.next_appointment && <Field label="Próxima Cita Sugerida" value={formatDate(recordData.next_appointment)} />}
                  {recordData.evolution_notes && <Field label="Evolución del Paciente" value={recordData.evolution_notes} />}
                </div>
              </Section>
            )}
          </div>

          {/* Sidebar de Contexto */}
          <aside className="lg:col-span-4 space-y-5 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-slate-100 p-5 sm:p-6 md:p-8 shadow-sm">
              <h3 className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-5 md:mb-6">Paciente</h3>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-[1.2rem] bg-[#007b8f]/10 flex items-center justify-center text-[#007b8f] font-bold text-lg sm:text-xl flex-shrink-0">
                  {patient.full_name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1e3a8a] text-xs sm:text-sm leading-tight truncate">{patient.full_name}</p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 sm:mt-1">ID: {patient.document_id || "—"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-slate-100 p-5 sm:p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-slate-50/50 rounded-bl-2xl sm:rounded-bl-[3rem] -z-0" />
              
              <div className="relative z-10">
                <h3 className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-5 md:mb-6 flex items-center gap-1.5 sm:gap-2">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#007b8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Metadatos del Registro
                </h3>

                <div className="space-y-3 sm:space-y-4 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex justify-between border-b border-slate-50 pb-2.5 sm:pb-3">
                    <span className="text-slate-300">Creación</span>
                    <span className="text-slate-600">{formatDate(record.created_at)}</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-slate-50 pb-2.5 sm:pb-3">
                    <span className="text-slate-300">Última Mod.</span>
                    <span className="text-slate-600">{formatDate(record.updated_at)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-300">Origen</span>
                    <span className="text-[#007b8f]">Digital CRM</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Componente para signos vitales - SIN CAMBIOS
function VitalMiniBox({ icon, label, value, unit }: { icon: string, label: string, value: any, unit: string }) {
  return (
    <div className="bg-[#fafbfc] border border-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all hover:border-[#007b8f]/30 text-center flex flex-col items-center justify-center">
      <div className="mb-1.5 sm:mb-2">
        {icon === "presion" && <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007b8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
        {icon === "pulso" && <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007b8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        {icon === "temp" && <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007b8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-2 0v10a3 3 0 000 6h2a3 3 0 000-6z" /></svg>}
        {icon === "peso" && <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007b8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9" /></svg>}
        {icon === "talla" && <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007b8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4m4-10v12" /></svg>}
        {icon === "imc" && <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007b8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m12-11H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>}
      </div>
      <p className="text-base sm:text-lg font-bold text-[#1e3a8a] leading-none mb-0.5 sm:mb-1">{value}</p>
      <p className="text-[6px] sm:text-[7px] md:text-[8px] font-black text-slate-300 uppercase tracking-tighter">{unit}</p>
      <p className="text-[6px] sm:text-[7px] md:text-[8px] text-[#007b8f] font-black mt-1.5 sm:mt-2 uppercase tracking-widest border-t border-slate-100 pt-1.5 sm:pt-2 w-full">{label}</p>
    </div>
  );
}