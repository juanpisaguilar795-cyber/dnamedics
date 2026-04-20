"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { exportRecordToPDF } from "@/components/historial/exportPDF";
import type { ClinicalRecord, PatientProfile, MedicalAntecedents } from "@/lib/types/clinical";

interface Props {
  recordId:    string;
  patientId:   string;
  record:      ClinicalRecord;
  patient:     PatientProfile;
  antecedents: MedicalAntecedents | null;
}

export function RecordDetailActions({ recordId, patientId, record, patient, antecedents }: Props) {
  const router = useRouter();
  const [deleting,  setDeleting]  = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Eliminar este registro? No se puede deshacer.")) return;
    setDeleting(true);
    await fetch(`/api/historial/${recordId}`, { method: "DELETE" });
    router.push(`/admin/pacientes/${patientId}/historial`);
    router.refresh();
  }

  function handleExport() {
    setExporting(true);
    exportRecordToPDF({ record, patient, antecedents });
    setTimeout(() => setExporting(false), 1000);
  }

  return (
    <div className="flex items-center gap-6 flex-wrap">
      
      {/* Botón Editar - Minimalista con icono */}
      <Link 
        href={`/admin/pacientes/${patientId}/historial/${recordId}/editar`}
        className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-sky-500 uppercase tracking-[0.15em] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Editar
      </Link>

      {/* Botón Exportar PDF - Estilo Pill (Cápsula) blanco */}
      <button 
        onClick={handleExport} 
        disabled={exporting}
        className="flex items-center gap-2.5 bg-white border border-slate-100 hover:border-sky-200 text-[#1e3a8a] text-[10px] font-black uppercase tracking-[0.15em] px-5 py-2.5 rounded-2xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed group"
      >
        <svg className="w-4 h-4 text-sky-400 group-hover:text-sky-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {exporting ? "Generando..." : "PDF"}
      </button>

      {/* Botón Eliminar - Solo icono de papelera */}
      <button 
        onClick={handleDelete} 
        disabled={deleting}
        title="Eliminar registro"
        className="text-slate-300 hover:text-red-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
      
    </div>
  );
}