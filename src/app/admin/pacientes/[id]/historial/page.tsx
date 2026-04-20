import { notFound } from "next/navigation";
import { guardAdmin } from "@/lib/utils/serverGuards";
import { adminGetPatient, adminGetRecords, adminGetAntecedents } from "@/modules/historial/services/historial.service";
import { ROUTES } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/dates";
import { DIAGNOSIS_STATUS_LABELS, DIAGNOSIS_STATUS_COLORS } from "@/lib/types/clinical";
import Link from "next/link";
import { RecordActions } from "@/components/historial/RecordActions";

interface Props { params: { id: string } }

export default async function PatientHistorialPage({ params }: Props) {
  await guardAdmin();

  const [patient, records, antecedents] = await Promise.all([
    adminGetPatient(params.id),
    adminGetRecords(params.id).catch(() => []),
    adminGetAntecedents(params.id).catch(() => null),
  ]);

  if (!patient) notFound();

  const age = patient.birth_date
    ? Math.floor((Date.now() - new Date(patient.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  const hasFamilyHistory = antecedents && (
    antecedents.fam_diabetes_paternal || antecedents.fam_diabetes_maternal ||
    antecedents.fam_hypertension_paternal || antecedents.fam_hypertension_maternal ||
    antecedents.fam_cancer_paternal || antecedents.fam_cancer_maternal ||
    antecedents.fam_heart_paternal || antecedents.fam_heart_maternal ||
    antecedents.fam_other_paternal || antecedents.fam_other_maternal
  );

  const hasLifestyleData = antecedents && (
    antecedents.smoker || antecedents.alcohol !== 'none' ||
    antecedents.physical_activity !== 'none' || antecedents.lifestyle_exercise ||
    antecedents.lifestyle_diet || antecedents.lifestyle_sleep_hours
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] relative overflow-hidden font-sans">
      <div className="absolute -top-24 -right-24 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-64 sm:w-80 h-64 sm:h-80 bg-teal-50/30 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10">
        
        <nav className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
          <Link href={ROUTES.adminDashboard} className="text-slate-400 hover:text-[#007b8f] text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
            Admin
          </Link>
          <span className="text-slate-200 text-[10px]">/</span>
          <Link href={ROUTES.adminPacientes} className="text-slate-400 hover:text-[#007b8f] text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
            Pacientes
          </Link>
          <span className="text-slate-200 text-[10px]">/</span>
          <span className="text-[#1e3a8a] font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em]">Historial</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

          {/* COLUMNA IZQUIERDA: PERFIL Y ANTECEDENTES */}
          <div className="lg:col-span-4 space-y-5 sm:space-y-6">
            
            {/* Perfil Card */}
            <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex justify-end mb-4">
                <Link 
                  href={`/admin/pacientes/${params.id}/editar`} 
                  className="text-[8px] sm:text-[9px] font-bold text-[#007b8f] hover:text-[#1e3a8a] transition-colors uppercase tracking-widest"
                >
                  Editar Perfil
                </Link>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#007b8f]/10 flex items-center justify-center mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-[#007b8f]">{patient.full_name[0]?.toUpperCase()}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl text-[#1e3a8a] font-medium" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {patient.full_name}
                </h2>
                {age && (
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-black text-slate-400 mt-1">
                    {age} años · {patient.sex === "M" ? "Masculino" : "Femenino"}
                  </p>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4 pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-50">
                <DataRow label="Documento" value={patient.document_id} />
                <DataRow label="Sangre" value={patient.blood_type} isHighlight />
                <DataRow label="Teléfono" value={patient.phone} />
                
                <div className="flex justify-between items-start py-1">
                  <span className="text-[8px] sm:text-[9px] uppercase font-black text-slate-300 tracking-tighter">Ubicación</span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 text-right max-w-[160px] leading-tight">
                    {patient.city ? `${patient.city}, ` : ""}{patient.address || "—"}
                  </span>
                </div>

                {patient.emergency_contact_name && (
                  <div className="mt-5 p-4 bg-slate-50/80 rounded-xl sm:rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#007b8f]" />
                      <p className="text-[7px] sm:text-[8px] uppercase font-black text-slate-400 tracking-[0.2em]">Emergencia</p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-[10px] sm:text-[11px] font-black text-[#1e3a8a] uppercase">{patient.emergency_contact_name}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-500">· {patient.emergency_contact_phone}</span>
                      </div>
                      {patient.emergency_contact_relation && (
                        <p className="text-[8px] sm:text-[9px] text-[#007b8f] font-bold uppercase tracking-widest">{patient.emergency_contact_relation}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Antecedentes Card */}
            <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-[#1e3a8a]">Antecedentes</h3>
                <Link 
                  href={`/admin/pacientes/${params.id}/antecedentes`} 
                  className="text-[8px] sm:text-[9px] font-bold text-[#007b8f] hover:underline uppercase tracking-widest"
                >
                  Editar
                </Link>
              </div>
              
              {antecedents ? (
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl sm:rounded-[1.5rem] p-4 sm:p-5 border border-slate-100">
                    <p className="text-[8px] sm:text-[9px] uppercase font-black text-[#1e3a8a] tracking-widest mb-3">Personales</p>
                    <div className="space-y-2">
                      {antecedents.prev_diseases && (
                        <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
                          <span className="text-slate-300 font-black uppercase text-[7px] sm:text-[8px]">Patológicos:</span> {antecedents.prev_diseases}
                        </p>
                      )}
                      {antecedents.surgeries && (
                        <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
                          <span className="text-slate-300 font-black uppercase text-[7px] sm:text-[8px]">Cirugías:</span> {antecedents.surgeries}
                        </p>
                      )}
                      {antecedents.hospitalizations && (
                        <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
                          <span className="text-slate-300 font-black uppercase text-[7px] sm:text-[8px]">Hospitalizaciones:</span> {antecedents.hospitalizations}
                        </p>
                      )}
                      {antecedents.allergies && (
                        <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
                          <span className="text-slate-300 font-black uppercase text-[7px] sm:text-[8px]">Alergias:</span> {antecedents.allergies}
                        </p>
                      )}
                      {antecedents.current_meds && (
                        <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
                          <span className="text-slate-300 font-black uppercase text-[7px] sm:text-[8px]">Medicamentos:</span> {antecedents.current_meds}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sistemas */}
                  {(antecedents.sys_metabolic || antecedents.sys_endocrine || antecedents.sys_musculoskeletal || 
                    antecedents.sys_gastrointestinal || antecedents.sys_respiratory || antecedents.sys_neurological ||
                    antecedents.sys_genitourinary || antecedents.sys_skin || antecedents.sys_ocular || antecedents.sys_auditory) && (
                    <div className="bg-slate-50/50 rounded-xl sm:rounded-[1.5rem] p-4 sm:p-5 border border-slate-100">
                      <p className="text-[8px] sm:text-[9px] uppercase font-black text-[#1e3a8a] tracking-widest mb-3">Sistemas</p>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        {antecedents.sys_metabolic && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Metabólico</p><p className="text-slate-600 font-medium">{antecedents.sys_metabolic}</p></div>
                        )}
                        {antecedents.sys_endocrine && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Endocrino</p><p className="text-slate-600 font-medium">{antecedents.sys_endocrine}</p></div>
                        )}
                        {antecedents.sys_musculoskeletal && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Óseo</p><p className="text-slate-600 font-medium">{antecedents.sys_musculoskeletal}</p></div>
                        )}
                        {antecedents.sys_gastrointestinal && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Gastro</p><p className="text-slate-600 font-medium">{antecedents.sys_gastrointestinal}</p></div>
                        )}
                        {antecedents.sys_respiratory && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Respiratorio</p><p className="text-slate-600 font-medium">{antecedents.sys_respiratory}</p></div>
                        )}
                        {antecedents.sys_neurological && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Neurológico</p><p className="text-slate-600 font-medium">{antecedents.sys_neurological}</p></div>
                        )}
                        {antecedents.sys_genitourinary && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Genitourinario</p><p className="text-slate-600 font-medium">{antecedents.sys_genitourinary}</p></div>
                        )}
                        {antecedents.sys_skin && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Piel</p><p className="text-slate-600 font-medium">{antecedents.sys_skin}</p></div>
                        )}
                        {antecedents.sys_ocular && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Ocular</p><p className="text-slate-600 font-medium">{antecedents.sys_ocular}</p></div>
                        )}
                        {antecedents.sys_auditory && (
                          <div><p className="text-slate-300 font-bold uppercase text-[7px] mb-0.5">Auditivo</p><p className="text-slate-600 font-medium">{antecedents.sys_auditory}</p></div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Familiares */}
                  {hasFamilyHistory && (
                    <div className="bg-slate-50/50 rounded-xl sm:rounded-[1.5rem] p-4 sm:p-5 border border-slate-100">
                      <p className="text-[8px] sm:text-[9px] uppercase font-black text-[#1e3a8a] tracking-widest mb-3">Familiares</p>
                      <div className="flex flex-wrap gap-2">
                        {(antecedents.fam_diabetes_paternal || antecedents.fam_diabetes_maternal) && (
                          <span className="text-[8px] bg-white px-2 py-1 rounded-lg border border-slate-100 text-slate-600 font-bold uppercase">Diabetes</span>
                        )}
                        {(antecedents.fam_hypertension_paternal || antecedents.fam_hypertension_maternal) && (
                          <span className="text-[8px] bg-white px-2 py-1 rounded-lg border border-slate-100 text-slate-600 font-bold uppercase">HTA</span>
                        )}
                        {(antecedents.fam_cancer_paternal || antecedents.fam_cancer_maternal) && (
                          <span className="text-[8px] bg-white px-2 py-1 rounded-lg border border-slate-100 text-slate-600 font-bold uppercase">Cáncer</span>
                        )}
                        {(antecedents.fam_heart_paternal || antecedents.fam_heart_maternal) && (
                          <span className="text-[8px] bg-white px-2 py-1 rounded-lg border border-slate-100 text-slate-600 font-bold uppercase">Cardiopatía</span>
                        )}
                        {(antecedents.fam_other_paternal || antecedents.fam_other_maternal) && (
                          <span className="text-[8px] bg-white px-2 py-1 rounded-lg border border-slate-100 text-slate-600 font-bold uppercase">Otras</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Estilo de Vida */}
                  {hasLifestyleData && (
                    <div className="bg-slate-50/50 rounded-xl sm:rounded-[1.5rem] p-4 sm:p-5 border border-slate-100">
                      <p className="text-[8px] sm:text-[9px] uppercase font-black text-[#1e3a8a] tracking-widest mb-3">Estilo de Vida</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-slate-50">
                          <p className="text-[7px] uppercase font-bold text-slate-300">Sueño</p>
                          <p className="text-[10px] font-bold text-slate-600">
                            {antecedents.lifestyle_sleep_hours || '—'}h / {antecedents.lifestyle_sleep_quality || '—'}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-50">
                          <p className="text-[7px] uppercase font-bold text-slate-300">Actividad</p>
                          <p className="text-[10px] font-bold text-slate-600 uppercase">{antecedents.physical_activity || '—'}</p>
                        </div>
                        {antecedents.smoker && (
                          <div className="col-span-2 bg-white p-3 rounded-xl border border-slate-50">
                            <p className="text-[7px] uppercase font-bold text-slate-300">Tabaquismo</p>
                            <p className="text-[10px] font-bold text-slate-600">Fumador activo</p>
                          </div>
                        )}
                        {antecedents.alcohol && antecedents.alcohol !== 'none' && (
                          <div className="bg-white p-3 rounded-xl border border-slate-50">
                            <p className="text-[7px] uppercase font-bold text-slate-300">Alcohol</p>
                            <p className="text-[10px] font-bold text-slate-600 uppercase">{antecedents.alcohol}</p>
                          </div>
                        )}
                        {antecedents.lifestyle_diet && (
                          <div className="bg-white p-3 rounded-xl border border-slate-50">
                            <p className="text-[7px] uppercase font-bold text-slate-300">Dieta</p>
                            <p className="text-[10px] font-bold text-slate-600 uppercase">{antecedents.lifestyle_diet}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 sm:py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl sm:rounded-3xl">
                  <p className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase">Sin registros</p>
                  <Link 
                    href={`/admin/pacientes/${params.id}/antecedentes`}
                    className="inline-block mt-3 text-[9px] font-bold text-[#007b8f] hover:underline uppercase tracking-widest"
                  >
                    Agregar antecedentes
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: CONSULTAS */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 p-5 sm:p-6 md:p-8 shadow-sm">
              <h1 className="text-2xl sm:text-3xl text-[#1e3a8a] font-medium" style={{ fontFamily: "var(--font-cormorant)" }}>
                Evolución <span className="italic text-[#007b8f] font-light">Clínica</span>
              </h1>
              <Link 
                href={`/admin/pacientes/${params.id}/historial/nuevo`}
                className="bg-[#1e3a8a] hover:bg-[#007b8f] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black px-5 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg shadow-[#1e3a8a]/10 text-center"
              >
                + Nueva Consulta
              </Link>
            </header>

            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 p-5 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-500">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    {/* ✅ CORRECCIÓN: Cast del diagnosis_status */}
                    <span className={`text-[7px] sm:text-[8px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-black uppercase tracking-widest ${DIAGNOSIS_STATUS_COLORS[record.diagnosis_status as keyof typeof DIAGNOSIS_STATUS_COLORS]}`}>
                      {DIAGNOSIS_STATUS_LABELS[record.diagnosis_status as keyof typeof DIAGNOSIS_STATUS_LABELS]}
                    </span>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {formatDate(record.consultation_date as string)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl text-[#1e3a8a] mb-5 sm:mb-6 hover:text-[#007b8f] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {record.diagnosis}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-50">
                    <VitalBox icon="presion" label="PRESIÓN" value={record.blood_pressure || "—"} />
                    <VitalBox icon="pulso" label="PULSO" value={record.heart_rate ? `${record.heart_rate} bpm` : "—"} />
                    <VitalBox icon="peso" label="PESO" value={record.weight ? `${record.weight}kg` : "—"} />
                    <VitalBox icon="temp" label="TEMP." value={(record as any).temperature ? `${(record as any).temperature}°C` : "—"} />
                  </div>

                  <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-50 flex justify-end">
                    {/* ✅ CORRECCIÓN: Cast del record */}
                    <RecordActions recordId={record.id} patientId={params.id} record={record as any} patient={patient} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes Auxiliares (SIN CAMBIOS)
function DataRow({ label, value, isHighlight }: { label: string, value: string | null | undefined, isHighlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-[8px] sm:text-[9px] uppercase font-black text-slate-300 tracking-tighter">{label}</span>
      <span className={`text-[10px] sm:text-[11px] font-bold ${isHighlight ? "text-[#007b8f]" : "text-slate-700"}`}>
        {value || "—"}
      </span>
    </div>
  );
}

function VitalBox({ icon, label, value }: { icon: string, label: string, value: string }) {
  return (
    <div className="bg-slate-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100/50 flex items-center gap-2 sm:gap-3">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
        <div className="text-[#007b8f]">
          {icon === "presion" && (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )}
          {icon === "pulso" && (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
          {icon === "peso" && (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9" />
            </svg>
          )}
          {icon === "temp" && (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16V6a1 1 0 00-2 0v10a3 3 0 000 6h2a3 3 0 000-6z" />
            </svg>
          )}
        </div>
      </div>
      <div>
        <p className="text-[7px] sm:text-[8px] uppercase font-black text-slate-300 tracking-widest leading-none mb-0.5">{label}</p>
        <p className="text-[10px] sm:text-[11px] font-black text-[#1e3a8a]">{value}</p>
      </div>
    </div>
  );
}