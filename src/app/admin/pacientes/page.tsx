import { guardAdmin } from "@/lib/utils/serverGuards";
import { adminGetPatients } from "@/modules/historial/services/historial.service";
import { ROUTES } from "@/lib/utils/constants";
import Link from "next/link";

export default async function AdminPacientesPage() {
  await guardAdmin();

  let patients: any[] = [];
  try {
    patients = await adminGetPatients();
  } catch {
    patients = [];
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] relative overflow-hidden">
      {/* Elementos Decorativos de Fondo - Responsive */}
      <div className="absolute -top-24 -right-24 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-64 sm:w-80 h-64 sm:h-80 bg-teal-50/30 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10">
        
        {/* Header - Responsive */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <Link 
                href={ROUTES.adminDashboard} 
                className="group w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#007b8f] hover:border-[#007b8f]/30 hover:shadow-lg transition-all duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 font-bold">Base de Datos</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#1e3a8a] tracking-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              Nuestros <span className="italic text-[#007b8f]">Pacientes</span>
            </h1>
            <p className="text-[8px] sm:text-[9px] md:text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 sm:mt-2 ml-1">
              {patients.length} registro{patients.length !== 1 ? "s" : ""} en total
            </p>
          </div>
        </header>

        {patients.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-12 sm:p-16 md:p-20 text-center shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-slate-200">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
              </svg>
            </div>
            <p className="text-lg sm:text-xl text-[#1e3a8a] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>Aún no hay pacientes registrados</p>
            <p className="text-[10px] sm:text-xs text-slate-400 font-light max-w-xs mx-auto uppercase tracking-tighter">
              Los perfiles aparecerán aquí automáticamente tras su primera cita.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-[0_10px_60px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
            
            {/* Vista Desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/30 text-center">
                    {["Paciente", "Identificación", "Contacto", "Ubicación", "Gestión"].map((h) => (
                      <th key={h} className="px-6 lg:px-8 py-4 lg:py-5 text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] lg:tracking-[0.2em] text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {patients.map((patient) => {
                    const age = patient.birth_date
                      ? Math.floor((Date.now() - new Date(patient.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                      : null;
                    return (
                      <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 lg:px-8 py-5 lg:py-6">
                          <div className="flex items-center gap-3 lg:gap-4">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-[#007b8f]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                              <span className="text-sm lg:text-base font-bold text-[#007b8f]">
                                {patient.full_name?.[0]?.toUpperCase() ?? "P"}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs lg:text-sm font-bold text-[#1e3a8a]">{patient.full_name}</p>
                              {age && (
                                <p className="text-[8px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                                  {age} años · {patient.sex === "M" ? "Masculino" : "Femenino"}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 lg:px-8 py-5 lg:py-6">
                          <p className="text-xs lg:text-[13px] text-slate-600 font-medium">
                            <span className="text-[8px] lg:text-[10px] text-slate-300 mr-1">CC</span>
                            {patient.document_id || "—"}
                          </p>
                        </td>
                        <td className="px-6 lg:px-8 py-5 lg:py-6">
                          <p className="text-xs lg:text-[13px] text-slate-600 font-medium">{patient.phone || "—"}</p>
                        </td>
                        <td className="px-6 lg:px-8 py-5 lg:py-6">
                          <p className="text-xs lg:text-[13px] text-slate-500">{patient.city || "Bogotá"}</p>
                        </td>
                        <td className="px-6 lg:px-8 py-5 lg:py-6">
                          <div className="flex items-center gap-2">
                            <Link 
                              href={`/admin/pacientes/${patient.id}/historial`}
                              className="px-4 lg:px-5 py-2 rounded-lg lg:rounded-xl bg-[#1e3a8a] text-white text-[9px] lg:text-[10px] font-bold uppercase tracking-widest hover:bg-[#007b8f] hover:shadow-lg hover:shadow-[#007b8f]/20 transition-all whitespace-nowrap"
                            >
                              Historial
                            </Link>
                            <Link 
                              href={`/admin/pacientes/${patient.id}/historial/nuevo`}
                              className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#007b8f] hover:border-[#007b8f]/20 hover:bg-white transition-all"
                              title="Nueva Consulta"
                            >
                              <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Vista Tablet - Cards en grid */}
            <div className="hidden sm:grid md:hidden grid-cols-2 gap-4 p-4 sm:p-6">
              {patients.map((patient) => {
                const age = patient.birth_date
                  ? Math.floor((Date.now() - new Date(patient.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                  : null;
                return (
                  <div key={patient.id} className="bg-[#fafbfc] rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#007b8f]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-base font-bold text-[#007b8f]">{patient.full_name?.[0]?.toUpperCase() ?? "P"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1e3a8a] truncate">{patient.full_name}</p>
                        {age && (
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                            {age} años · {patient.sex === "M" ? "M" : "F"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4 text-xs">
                      <p className="text-slate-600"><span className="text-slate-300">CC:</span> {patient.document_id || "—"}</p>
                      <p className="text-slate-600"><span className="text-slate-300">📞</span> {patient.phone || "—"}</p>
                      <p className="text-slate-500"><span className="text-slate-300">📍</span> {patient.city || "Bogotá"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/pacientes/${patient.id}/historial`}
                        className="flex-1 text-center text-[9px] bg-[#1e3a8a] text-white py-2.5 rounded-xl font-bold uppercase tracking-widest"
                      >
                        Historial
                      </Link>
                      <Link 
                        href={`/admin/pacientes/${patient.id}/historial/nuevo`}
                        className="w-10 flex items-center justify-center border border-slate-100 text-slate-400 rounded-xl"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vista Mobile - Cards con botones AL LADO */}
            <div className="sm:hidden divide-y divide-slate-50">
              {patients.map((patient) => (
                <div key={patient.id} className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#007b8f]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-[#007b8f]">{patient.full_name?.[0]?.toUpperCase() ?? "P"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1e3a8a] text-sm truncate">{patient.full_name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">
                          {patient.phone || "Sin teléfono"}
                        </p>
                      </div>
                    </div>
                    {/* Botones al lado */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Link 
                        href={`/admin/pacientes/${patient.id}/historial`}
                        className="px-3 py-2 bg-[#1e3a8a] text-white text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#007b8f] transition-all"
                      >
                        Historial
                      </Link>
                      <Link 
                        href={`/admin/pacientes/${patient.id}/historial/nuevo`}
                        className="w-8 h-8 flex items-center justify-center border border-slate-200 text-slate-500 rounded-lg hover:border-[#007b8f] hover:text-[#007b8f] transition-all"
                        title="Nueva consulta"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}