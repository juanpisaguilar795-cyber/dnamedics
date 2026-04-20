import { guardPatient } from "@/lib/utils/serverGuards";
import { getMyRecords } from "@/modules/historial/services/historial.service";
import { formatDate } from "@/lib/utils/dates";
import { ROUTES } from "@/lib/utils/constants";
import Link from "next/link";
import { ChevronLeft, FileText, Activity, Pill, ClipboardList } from "lucide-react";

export default async function PatientHistorialPage() {
  const user = await guardPatient();

  // Obtener registros clínicos
  let records: Awaited<ReturnType<typeof getMyRecords>> = [];
  try { records = await getMyRecords(); } catch { records = []; }

  // Último registro
  const lastRecord = records[0];
  const activePrescriptions = Array.isArray(lastRecord?.prescriptions) 
  ? lastRecord.prescriptions.filter((p: any) => p.drug_name) 
  : [];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        
        {/* Cabecera */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link 
            href={ROUTES.patientDashboard} 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-teal hover:border-brand-teal transition-all flex-shrink-0 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-brand-navy leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              Mi <span className="italic text-brand-teal">historial clínico</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
              {user.full_name} · {records.length} registro{records.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ============================================ */}
        {/* ÚLTIMO REGISTRO CLÍNICO */}
        {/* ============================================ */}
        {lastRecord ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-teal" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Última Consulta · {formatDate(lastRecord.consultation_date)}
                </h3>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                lastRecord.diagnosis_status === "active" ? "bg-amber-50 text-amber-600" :
                lastRecord.diagnosis_status === "controlled" ? "bg-emerald-50 text-emerald-600" :
                "bg-slate-50 text-slate-500"
              }`}>
                {lastRecord.diagnosis_status === "active" ? "Activo" : 
                 lastRecord.diagnosis_status === "controlled" ? "Controlado" : "Resuelto"}
              </span>
            </div>

            {/* Diagnóstico */}
            <div className="mb-5">
              <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">Diagnóstico</p>
              <p className="text-base sm:text-lg font-medium text-brand-navy">{lastRecord.diagnosis || "Sin diagnóstico"}</p>
            </div>

            {/* Medicamentos */}
            {activePrescriptions.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-3 flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5" /> Medicamentos Recetados
                </p>
                <div className="space-y-2">
                  {activePrescriptions.map((p: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                      <Pill className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700">{p.drug_name}</p>
                        <p className="text-[10px] text-slate-400">{p.dose} · {p.frequency} · {p.duration}</p>
                        {p.instructions && (
                          <p className="text-[10px] text-slate-400 mt-1 italic">{p.instructions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tratamiento */}
            {lastRecord.treatment && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1 flex items-center gap-1">
                  <ClipboardList className="w-3.5 h-3.5" /> Plan de Tratamiento
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{lastRecord.treatment}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm mb-6 sm:mb-8">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-lg text-brand-navy mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
              Aún no hay registros médicos
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Tu fisioterapeuta cargará los diagnósticos y tratamientos después de tu consulta inicial.
            </p>
          </div>
        )}

        {/* ============================================ */}
        {/* HISTORIAL DE CONSULTAS ANTERIORES */}
        {/* ============================================ */}
        {records.length > 1 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Consultas Anteriores ({records.length - 1})
            </h3>
            <div className="space-y-3">
              {records.slice(1).map((record) => (
                <div key={record.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-navy">{formatDate(record.consultation_date)}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      record.diagnosis_status === "active" ? "bg-amber-50 text-amber-600" :
                      record.diagnosis_status === "controlled" ? "bg-emerald-50 text-emerald-600" :
                      "bg-slate-50 text-slate-500"
                    }`}>
                      {record.diagnosis_status === "active" ? "Activo" : 
                       record.diagnosis_status === "controlled" ? "Controlado" : "Resuelto"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-1">{record.diagnosis || "Sin diagnóstico"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}