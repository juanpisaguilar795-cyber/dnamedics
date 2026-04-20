"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { exportRecordToPDF } from "@/components/historial/exportPDF";
import type { ClinicalRecord, PatientProfile, MedicalAntecedents } from "@/lib/types/clinical";

interface Props {
  recordId: string;
  patientId: string;
  record: ClinicalRecord;
  patient: PatientProfile;
  antecedents?: MedicalAntecedents | null;
}

export function RecordActions({ recordId, patientId, record, patient, antecedents = null }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function confirmDelete() {
    setShowConfirm(false);
    setDeleting(true);
    try {
      const res = await fetch(`/api/historial/${recordId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error("Error al eliminar", e);
    } finally {
      setDeleting(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      let ants = antecedents;
      if (!ants) {
        const res = await fetch(`/api/patient-antecedents/${patientId}`);
        if (res.ok) {
          const j = await res.json();
          ants = j.data;
        }
      }
      exportRecordToPDF({ record, patient, antecedents: ants });
    } catch (e) {
      console.error("Error al exportar", e);
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      {/* Contenedor principal - Responsive */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full pt-4 sm:pt-5 md:pt-6 mt-3 sm:mt-4 md:mt-6 border-t border-slate-100/60 bg-white/50 backdrop-blur-sm rounded-b-2xl gap-3 sm:gap-0">
        
        {/* Navegación Principal */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            href={`/admin/pacientes/${patientId}/historial/${recordId}`}
            className="group flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.12em] font-bold text-[#007b8f] bg-[#007b8f]/5 hover:bg-[#007b8f] hover:text-white transition-all duration-300 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm shadow-[#007b8f]/10 flex-1 sm:flex-none"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden xs:inline">Ver detalle</span>
            <span className="xs:hidden">Ver</span>
          </Link>
          
          <Link 
            href={`/admin/pacientes/${patientId}/historial/${recordId}/editar`}
            className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.12em] font-bold text-slate-500 hover:text-[#1e3a8a] bg-slate-50/50 hover:bg-blue-50 transition-all duration-300 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl border border-transparent hover:border-blue-100 flex-1 sm:flex-none"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden xs:inline">Editar</span>
            <span className="xs:hidden">Editar</span>
          </Link>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={handleExport} 
            disabled={exporting}
            className="group flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.12em] font-bold bg-white text-slate-600 hover:text-[#1e3a8a] border border-slate-200 hover:border-[#1e3a8a]/30 shadow-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 flex-1 sm:flex-none"
          >
            {exporting ? (
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1e3a8a]/70 group-hover:text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span className="hidden sm:inline">{exporting ? "Generando..." : "Exportar PDF"}</span>
            <span className="sm:hidden">{exporting ? "..." : "PDF"}</span>
          </button>

          <button 
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all duration-300 flex-shrink-0"
          >
            {deleting ? (
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Modal de confirmación - Responsive */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/20 w-full max-w-[300px] sm:max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-5 sm:p-6 md:p-8 text-center">
              {/* Icono de Alerta */}
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">¿Confirmar eliminación?</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Estás a punto de borrar este registro clínico. Esta acción es definitiva y no podrá ser recuperada.
              </p>
            </div>

            <div className="flex border-t border-slate-50">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors border-r border-slate-50 uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors uppercase tracking-widest"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}