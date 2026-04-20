"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ClinicalRecordForm } from "@/components/historial/ClinicalRecordForm";
import { exportRecordToPDF } from "@/components/historial/exportPDF";
import { DIAGNOSIS_STATUS_LABELS, DIAGNOSIS_STATUS_COLORS } from "@/lib/types/clinical";
import type { ClinicalRecord, PatientProfile, MedicalAntecedents } from "@/lib/types/clinical";

interface Props {
  patientId:   string;
  patient:     PatientProfile;
  records:     ClinicalRecord[];
  antecedents: MedicalAntecedents | null;
}

type ModalMode = "new" | "edit";

function fmt(d?: string) {
  if (!d) return "—";
  return new Date(d + "T12:00:00").toLocaleDateString("es-CO", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function PatientHistorialClient({ patientId, patient, records, antecedents }: Props) {
  const router                = useRouter();
  const [, startTransition]   = useTransition();
  const [modalMode, setModalMode]       = useState<ModalMode>("new");
  const [editingRecord, setEditingRecord] = useState<ClinicalRecord | null>(null);
  const [showModal, setShowModal]       = useState(false);
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [exportingId, setExportingId]   = useState<string | null>(null);

  function openNew() {
    setModalMode("new");
    setEditingRecord(null);
    setShowModal(true);
  }

  function openEdit(record: ClinicalRecord) {
    setModalMode("edit");
    setEditingRecord(record);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingRecord(null);
  }

  function handleSuccess() {
    closeModal();
    startTransition(() => router.refresh());
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) return;
    setDeletingId(id);
    await fetch(`/api/historial/${id}`, { method: "DELETE" });
    setDeletingId(null);
    startTransition(() => router.refresh());
  }

  function handleExport(record: ClinicalRecord) {
    setExportingId(record.id);
    exportRecordToPDF({ record, patient, antecedents });
    setTimeout(() => setExportingId(null), 800);
  }

  return (
    <>
      {/* ── Modal nueva consulta / editar ──────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-6 pb-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto animate-slide-up">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-brand-navy text-base" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {modalMode === "new" ? "Nueva consulta" : "Editar consulta"}
                </h2>
                <p className="text-xs text-slate-400 font-light mt-0.5">{patient.full_name}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                aria-label="Cerrar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[78vh]">
              <ClinicalRecordForm
                patients={[patient]}
                patientId={patientId}
                record={modalMode === "edit" ? (editingRecord ?? undefined) : undefined}
                onSuccess={handleSuccess}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Header con botón nueva consulta ─────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
            Historial clínico
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            {records.length} consulta{records.length !== 1 ? "s" : ""} registrada{records.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-brand-teal hover:bg-brand-navy text-white text-sm px-4 py-2.5 rounded-xl transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva consulta
        </button>
      </div>

      {/* ── Lista de registros ──────────────────────────────── */}
      {records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Sin consultas registradas</p>
          <p className="text-xs text-slate-400 font-light mb-4">Crea la primera consulta de este paciente.</p>
          <button onClick={openNew} className="text-sm text-brand-teal font-medium hover:text-brand-navy transition-colors">
            Crear primera consulta →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-slate-200 hover:shadow-sm transition-all">

              {/* Record header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-semibold text-brand-navy leading-snug">
                      {record.diagnosis}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${DIAGNOSIS_STATUS_COLORS[record.diagnosis_status]}`}>
                      {DIAGNOSIS_STATUS_LABELS[record.diagnosis_status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-light flex-wrap">
                    <span>📅 {fmt(record.consultation_date)}</span>
                    {record.service_type && <span>· {record.service_type}</span>}
                    {record.reason && <span className="truncate max-w-[200px]">· {record.reason}</span>}
                  </div>
                </div>
              </div>

              {/* Signos vitales mini */}
              {(record.blood_pressure || record.heart_rate || record.weight) && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {record.blood_pressure && (
                    <span className="text-xs bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-slate-600">
                      🫀 {record.blood_pressure}
                    </span>
                  )}
                  {record.heart_rate && (
                    <span className="text-xs bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-slate-600">
                      ❤️ {record.heart_rate} bpm
                    </span>
                  )}
                  {record.weight && record.height && (
                    <span className="text-xs bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-slate-600">
                      ⚖️ {record.weight}kg · IMC {record.bmi ?? "—"}
                    </span>
                  )}
                </div>
              )}

              {/* Medicamentos */}
              {record.prescriptions && record.prescriptions.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {record.prescriptions.slice(0, 3).map(p => (
                      <span key={p.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                        💊 {p.drug_name} {p.dose}
                      </span>
                    ))}
                    {record.prescriptions.length > 3 && (
                      <span className="text-xs text-slate-400 px-2 py-0.5">+{record.prescriptions.length - 3} más</span>
                    )}
                  </div>
                </div>
              )}

              {/* ── Acciones ─────────────────────────────────── */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-50 flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  {/* Ver detalle */}
                  <a
                    href={`/admin/pacientes/${patientId}/historial/${record.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-brand-teal hover:text-brand-navy font-medium transition-colors px-3 py-2 rounded-lg hover:bg-brand-teal/5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver detalle
                  </a>

                  {/* Editar — abre el modal con el registro cargado */}
                  <button
                    onClick={() => openEdit(record)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-navy font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {/* PDF */}
                  <button
                    onClick={() => handleExport(record)}
                    disabled={exportingId === record.id}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-teal font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {exportingId === record.id ? "..." : "PDF"}
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => handleDelete(record.id)}
                    disabled={deletingId === record.id}
                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deletingId === record.id ? "..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
