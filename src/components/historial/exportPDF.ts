"use client";
import type { ClinicalRecord, PatientProfile, MedicalAntecedents } from "@/lib/types/clinical";
import { DIAGNOSIS_STATUS_LABELS, EXAM_TYPE_LABELS } from "@/lib/types/clinical";

interface PDFData {
  record:      ClinicalRecord;
  patient:     PatientProfile;
  antecedents: MedicalAntecedents | null;
}

function calcAge(birthDate?: string): string {
  if (!birthDate) return "—";
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + " años";
}

export function exportRecordToPDF({ record, patient, antecedents }: PDFData) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const formatDate = (d?: string) =>
    d ? new Date(d + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }) : "—";

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Historial Clínico – ${patient.full_name}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color:#1e293b; font-size:11px; line-height:1.5; background:#fff; }
  .page { max-width:800px; margin:0 auto; padding:32px 40px; }

  /* Header */
  .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #0e7490; padding-bottom:16px; margin-bottom:20px; }
  .brand h1 { font-size:26px; color:#0d2e6b; font-weight:700; letter-spacing:-0.5px; }
  .brand p { font-size:10px; color:#0e7490; letter-spacing:2px; text-transform:uppercase; margin-top:2px; }
  .doc-info { text-align:right; }
  .doc-info p { font-size:10px; color:#64748b; }
  .doc-info .doc-title { font-size:14px; font-weight:600; color:#0d2e6b; margin-bottom:4px; }

  /* Sections */
  .section { margin-bottom:16px; }
  .section-title {
    font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px;
    color:#0e7490; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin-bottom:8px;
  }

  /* Grid */
  .grid { display:grid; gap:4px 16px; }
  .g2 { grid-template-columns:1fr 1fr; }
  .g3 { grid-template-columns:1fr 1fr 1fr; }
  .g4 { grid-template-columns:1fr 1fr 1fr 1fr; }

  .field { margin-bottom:4px; }
  .field-label { font-size:9px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; font-weight:600; }
  .field-value { font-size:11px; color:#1e293b; font-weight:500; }
  .field-value.empty { color:#cbd5e1; font-style:italic; }

  /* Badges */
  .badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
  .badge-active     { background:#fee2e2; color:#b91c1c; }
  .badge-controlled { background:#fef3c7; color:#92400e; }
  .badge-resolved   { background:#dcfce7; color:#166534; }

  /* Vitals */
  .vitals { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; }
  .vital-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:8px; text-align:center; }
  .vital-value { font-size:16px; font-weight:700; color:#0d2e6b; line-height:1; }
  .vital-unit  { font-size:8px; color:#94a3b8; margin-top:2px; }
  .vital-label { font-size:8px; color:#64748b; margin-top:4px; font-weight:600; text-transform:uppercase; letter-spacing:0.3px; }

  /* Meds table */
  table { width:100%; border-collapse:collapse; font-size:10px; }
  th { background:#f1f5f9; text-align:left; padding:6px 8px; font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:#64748b; border:1px solid #e2e8f0; }
  td { padding:5px 8px; border:1px solid #e2e8f0; vertical-align:top; }
  tr:nth-child(even) td { background:#f8fafc; }

  /* Checkbox row */
  .check-row { display:flex; gap:16px; flex-wrap:wrap; }
  .check-item { display:flex; align-items:center; gap:4px; font-size:10px; }
  .check-box { width:10px; height:10px; border:1px solid #94a3b8; border-radius:2px; display:inline-flex; align-items:center; justify-content:center; }
  .check-box.checked { background:#0e7490; border-color:#0e7490; }
  .check-tick { color:white; font-size:8px; font-weight:bold; }

  /* Footer */
  .footer { margin-top:24px; padding-top:12px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:flex-end; }
  .signature { text-align:center; }
  .signature-line { width:160px; border-top:1px solid #0d2e6b; margin:40px auto 4px; }
  .signature p { font-size:9px; color:#64748b; }

  @media print {
    body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { padding:20px 24px; }
    .no-print { display:none; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="brand">
      <h1>Dnamedics</h1>
      <p>Salud &amp; Bienestar · Bogotá, Colombia</p>
    </div>
    <div class="doc-info">
      <p class="doc-title">Historial Clínico</p>
      <p>Fecha: ${formatDate(record.consultation_date)}</p>
      <p>Registro #${record.id.slice(0,8).toUpperCase()}</p>
    </div>
  </div>

  <!-- 1. Datos del paciente -->
  <div class="section">
    <div class="section-title">1. Información del paciente</div>
    <div class="grid g3">
      <div class="field"><div class="field-label">Nombre completo</div><div class="field-value">${patient.full_name}</div></div>
      <div class="field"><div class="field-label">Documento (${patient.document_type ?? "CC"})</div><div class="field-value">${patient.document_id ?? "—"}</div></div>
      <div class="field"><div class="field-label">Edad</div><div class="field-value">${calcAge(patient.birth_date)}</div></div>
      <div class="field"><div class="field-label">Fecha de nacimiento</div><div class="field-value">${formatDate(patient.birth_date)}</div></div>
      <div class="field"><div class="field-label">Sexo</div><div class="field-value">${patient.sex === "M" ? "Masculino" : patient.sex === "F" ? "Femenino" : patient.sex === "O" ? "Otro" : "—"}</div></div>
      <div class="field"><div class="field-label">Grupo sanguíneo</div><div class="field-value">${patient.blood_type ?? "—"}</div></div>
      <div class="field"><div class="field-label">Teléfono</div><div class="field-value">${patient.phone ?? "—"}</div></div>
      <div class="field"><div class="field-label">Ciudad</div><div class="field-value">${patient.city ?? "Bogotá"}</div></div>
      <div class="field"><div class="field-label">Contacto emergencia</div><div class="field-value">${patient.emergency_contact_name ? `${patient.emergency_contact_name} (${patient.emergency_contact_phone ?? ""})` : "—"}</div></div>
    </div>
  </div>

  <!-- 2. Antecedentes -->
  ${antecedents ? `
  <div class="section">
    <div class="section-title">2. Antecedentes médicos</div>
    <div class="grid g2" style="margin-bottom:8px;">
      <div class="field"><div class="field-label">Enfermedades previas</div><div class="field-value">${antecedents.prev_diseases || "Ninguna reportada"}</div></div>
      <div class="field"><div class="field-label">Alergias</div><div class="field-value">${antecedents.allergies || "Ninguna reportada"}</div></div>
      <div class="field"><div class="field-label">Cirugías</div><div class="field-value">${antecedents.surgeries || "Ninguna"}</div></div>
      <div class="field"><div class="field-label">Medicamentos actuales</div><div class="field-value">${antecedents.current_meds || "Ninguno"}</div></div>
    </div>
    <div class="field-label" style="margin-bottom:4px;">Antecedentes familiares</div>
    <div class="check-row">
      ${[
        ["Diabetes",      antecedents.family_diabetes],
        ["Hipertensión",  antecedents.family_hypertension],
        ["Cáncer",        antecedents.family_cancer],
        ["Cardiopatías",  antecedents.family_heart],
      ].map(([label, val]) => `
        <div class="check-item">
          <div class="check-box ${val ? "checked" : ""}">${val ? '<span class="check-tick">✓</span>' : ''}</div>
          <span>${label}</span>
        </div>
      `).join("")}
      ${antecedents.family_other ? `<span style="font-size:10px;color:#64748b;">Otros: ${antecedents.family_other}</span>` : ""}
    </div>
  </div>
  ` : ""}

  <!-- 3. Consulta -->
  <div class="section">
    <div class="section-title">3. Información de la consulta</div>
    <div class="grid g2">
      <div class="field"><div class="field-label">Servicio</div><div class="field-value">${record.service_type || "—"}</div></div>
      <div class="field"><div class="field-label">Estado diagnóstico</div>
        <div class="field-value">
          <span class="badge badge-${record.diagnosis_status}">${DIAGNOSIS_STATUS_LABELS[record.diagnosis_status]}</span>
        </div>
      </div>
    </div>
    <div class="field" style="margin-top:6px;"><div class="field-label">Motivo de consulta</div><div class="field-value">${record.reason || "—"}</div></div>
    ${record.symptoms ? `<div class="field" style="margin-top:6px;"><div class="field-label">Síntomas reportados</div><div class="field-value">${record.symptoms}</div></div>` : ""}
  </div>

  <!-- 4. Signos vitales -->
  ${(record.blood_pressure || record.heart_rate || record.temperature || record.weight || record.height) ? `
  <div class="section">
    <div class="section-title">4. Signos vitales</div>
    <div class="vitals">
      <div class="vital-card"><div class="vital-value">${record.blood_pressure || "—"}</div><div class="vital-unit">mmHg</div><div class="vital-label">Presión</div></div>
      <div class="vital-card"><div class="vital-value">${record.heart_rate || "—"}</div><div class="vital-unit">bpm</div><div class="vital-label">Frec. card.</div></div>
      <div class="vital-card"><div class="vital-value">${record.temperature || "—"}</div><div class="vital-unit">°C</div><div class="vital-label">Temp.</div></div>
      <div class="vital-card"><div class="vital-value">${record.weight || "—"}</div><div class="vital-unit">kg</div><div class="vital-label">Peso</div></div>
      <div class="vital-card"><div class="vital-value">${record.height || "—"}</div><div class="vital-unit">cm</div><div class="vital-label">Estatura</div></div>
      <div class="vital-card"><div class="vital-value">${record.bmi || "—"}</div><div class="vital-unit">kg/m²</div><div class="vital-label">IMC</div></div>
    </div>
  </div>
  ` : ""}

  <!-- 5. Diagnóstico -->
  <div class="section">
    <div class="section-title">5. Diagnóstico y tratamiento</div>
    <div class="field"><div class="field-label">Diagnóstico principal</div><div class="field-value">${record.diagnosis}</div></div>
    ${record.secondary_diagnoses ? `<div class="field" style="margin-top:6px;"><div class="field-label">Diagnósticos secundarios</div><div class="field-value">${record.secondary_diagnoses}</div></div>` : ""}
    <div class="field" style="margin-top:8px;"><div class="field-label">Tratamiento indicado</div><div class="field-value">${record.treatment}</div></div>
    ${record.recommendations ? `<div class="field" style="margin-top:6px;"><div class="field-label">Recomendaciones</div><div class="field-value">${record.recommendations}</div></div>` : ""}
  </div>

  <!-- 6. Medicación -->
  ${record.prescriptions && record.prescriptions.length > 0 ? `
  <div class="section">
    <div class="section-title">6. Medicación recetada</div>
    <table>
      <thead>
        <tr><th>Medicamento</th><th>Dosis</th><th>Frecuencia</th><th>Duración</th><th>Indicaciones</th></tr>
      </thead>
      <tbody>
        ${record.prescriptions.map((p) => `
          <tr>
            <td><strong>${p.drug_name}</strong></td>
            <td>${p.dose}</td>
            <td>${p.frequency}</td>
            <td>${p.duration}</td>
            <td>${p.instructions || "—"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  ` : ""}

  <!-- 7. Seguimiento -->
  ${(record.next_appointment || record.evolution_notes || record.future_indications) ? `
  <div class="section">
    <div class="section-title">7. Seguimiento</div>
    <div class="grid g2">
      ${record.next_appointment ? `<div class="field"><div class="field-label">Próxima cita</div><div class="field-value">${formatDate(record.next_appointment)}</div></div>` : ""}
      ${record.evolution_notes ? `<div class="field"><div class="field-label">Evolución</div><div class="field-value">${record.evolution_notes}</div></div>` : ""}
      ${record.future_indications ? `<div class="field sm:col-span-2"><div class="field-label">Indicaciones futuras</div><div class="field-value">${record.future_indications}</div></div>` : ""}
    </div>
  </div>
  ` : ""}

  <!-- Footer / Firma -->
  <div class="footer">
    <div>
      <p style="font-size:9px;color:#94a3b8;">Generado el ${new Date().toLocaleDateString("es-CO", { day:"numeric", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}</p>
      <p style="font-size:9px;color:#94a3b8;">Dnamedics · Sistema de Gestión Clínica · Bogotá, Colombia</p>
    </div>
    <div class="signature">
      <div class="signature-line"></div>
      <p style="font-weight:600;color:#0d2e6b;">${(record.doctor as { full_name?: string })?.full_name ?? "Dr. Especialista"}</p>
      <p>Fisioterapeuta / Médico Integrativo</p>
      <p>Dnamedics</p>
    </div>
  </div>

</div>
<script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
