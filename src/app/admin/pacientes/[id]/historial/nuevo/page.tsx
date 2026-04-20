import { notFound } from "next/navigation";
import { guardAdmin } from "@/lib/utils/serverGuards";
import { adminGetPatient, adminGetPatients } from "@/modules/historial/services/historial.service";
import { ClinicalRecordForm } from "@/components/historial/ClinicalRecordForm";
import Link from "next/link";

interface Props { params: { id: string } }

export default async function NewRecordPage({ params }: Props) {
  await guardAdmin();

  const [patient, patients] = await Promise.all([
    adminGetPatient(params.id),
    adminGetPatients(),
  ]);

  if (!patient) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8">
        
        {/* Header - Responsive */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
          <Link 
            href={`/admin/pacientes/${params.id}/historial`}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-brand-teal hover:border-brand-teal/20 transition-all shadow-sm flex-shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex flex-col border-l-3 sm:border-l-4 border-brand-teal pl-3 sm:pl-4 py-0.5 sm:py-1">
            <h1 className="text-2xl sm:text-3xl leading-none text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
              Nueva <span className="italic">Consulta</span>
            </h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-0.5 sm:mt-1">
              Registro Clínico Digital
            </p>
          </div>
        </div>

        {/* Información del paciente - Card rápida */}
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
              <span className="text-base sm:text-lg font-bold text-brand-teal">
                {patient.full_name?.[0]?.toUpperCase() ?? "P"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-bold text-brand-navy truncate">{patient.full_name}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">
                {patient.document_type} {patient.document_id || "—"} · {patient.phone || "Sin teléfono"}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <ClinicalRecordForm patients={patients} patientId={params.id} />
        </div>
      </div>
    </div>
  );
}