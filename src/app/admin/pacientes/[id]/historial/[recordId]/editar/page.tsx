"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ClinicalRecordForm } from "@/components/historial/ClinicalRecordForm";

export default function EditRecordPage() {
  const router = useRouter();
  const params = useParams();
  
  const id = params.id as string; 
  const recordId = params.recordId as string;

  const [record, setRecord] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !recordId) return;

    async function loadData() {
      try {
        setFetching(true);
        setError(null);
        
        const resRec = await fetch(`/api/historial/${recordId}`);
        const recJson = await resRec.ok ? await resRec.json() : null;
        
        const resPat = await fetch(`/api/pacientes/${id}/profile`);
        let patJson = null;

      if (resPat.ok) {
        patJson = await resPat.json();
      }

        if (!recJson && !patJson) {
          setError("No se pudo cargar la información del paciente o registro.");
        }

        setRecord(recJson?.data || recJson);
        setPatient(patJson?.data || patJson);
      } catch (err) {
        console.error("Error cargando datos", err);
        setError("Error de conexión al cargar los datos.");
      } finally {
        setFetching(false);
      }
    }

    loadData();
  }, [id, recordId]);

  const IconWrapper = ({ children, className = "w-4 h-4" }: { children: React.ReactNode, className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {children}
    </svg>
  );

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-[#007b8f] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">
          Cargando información clínica...
        </p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 p-8 sm:p-10 text-center max-w-md shadow-sm">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-rose-400">
            <IconWrapper className="w-7 h-7 sm:w-8 sm:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </IconWrapper>
          </div>
          <h3 className="text-lg sm:text-xl text-[#1e3a8a] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
            Error al cargar
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">{error || "No se encontró el paciente."}</p>
          <Link
            href={`/admin/pacientes/${id}/historial`}
            className="inline-flex items-center justify-center gap-2 bg-[#007b8f] hover:bg-[#1e3a8a] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
          >
            <IconWrapper className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></IconWrapper>
            Volver al historial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8">
        
        {/* Header - Responsive */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
          <Link 
            href={`/admin/pacientes/${id}/historial`}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#007b8f] hover:border-[#007b8f]/20 transition-all shadow-sm flex-shrink-0"
          >
            <IconWrapper className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </IconWrapper>
          </Link>
          <div className="flex flex-col border-l-3 sm:border-l-4 border-[#007b8f] pl-3 sm:pl-4 py-0.5 sm:py-1">
            <h1 className="text-2xl sm:text-3xl leading-none text-[#1e3a8a]" style={{ fontFamily: "var(--font-cormorant)" }}>
              Editar <span className="italic text-[#007b8f]">Consulta</span>
            </h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-0.5 sm:mt-1">
              Registro Clínico Digital
            </p>
          </div>
        </div>

        {/* Info rápida del paciente */}
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#007b8f]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-base sm:text-lg font-bold text-[#007b8f]">
                {patient.full_name?.[0]?.toUpperCase() ?? "P"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-bold text-[#1e3a8a] truncate">{patient.full_name}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">
                {patient.document_type} {patient.document_id || "—"} · {patient.phone || "Sin teléfono"}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <ClinicalRecordForm
            patients={patient ? [patient] : []}
            record={record}
            patientId={id}
            onSuccess={() => {
              router.push(`/admin/pacientes/${id}/historial`);
              router.refresh();
            }}
            onCancel={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}