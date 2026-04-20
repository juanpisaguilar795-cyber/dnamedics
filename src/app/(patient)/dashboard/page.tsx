import { guardPatient }           from "@/lib/utils/serverGuards";
import { ROUTES }                 from "@/lib/utils/constants";
import Link                       from "next/link";
import { SignOutButton }            from "@/components/shared/SignOutButton";
import { PatientDashboardStats }   from "@/components/dashboard/PatientDashboardStats";

export default async function PatientDashboardPage() {
  const user = await guardPatient();

  const cards = [
    {
      href:  ROUTES.patientCitas,
      icon:  "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      label: "Mis citas",
      desc:  "Ver y agendar tus próximas consultas",
      bg:    "bg-brand-teal/10",
      iconColor: "text-brand-teal",
    },
    {
      href:  ROUTES.patientHistorial,
      icon:  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      label: "Historial clínico",
      desc:  "Consulta tus registros y evoluciones",
      bg:    "bg-brand-navy/10",
      iconColor: "text-brand-navy",
    },
    {
      href:  "/noticias",
      icon:  "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9",
      label: "Artículos",
      desc:  "Consejos de salud integrativa",
      bg:    "bg-emerald-50/50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Burbujas decorativas de fondo */}
      <div className="absolute top-[-10%] right-[-5%] w-64 sm:w-80 md:w-[400px] h-64 sm:h-80 md:h-[400px] rounded-full bg-brand-teal/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-10%] w-56 sm:w-72 md:w-[350px] h-56 sm:h-72 md:h-[350px] rounded-full bg-brand-navy/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 border-b border-slate-100 pb-6 sm:pb-7 md:pb-8">
          <div className="flex-1">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.15em] sm:tracking-[0.2em] text-brand-teal uppercase mb-1.5 sm:mb-2 block">
              Portal del Paciente
            </span>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Bienvenido, <span className="italic font-medium text-brand-teal">{user.full_name.split(" ")[0]}</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 sm:mt-2 font-light max-w-xs leading-relaxed">
              Gestione sus citas y consulte su historial médico de forma segura.
            </p>
          </div>
          <div className="flex sm:flex-col items-end gap-3">
             <SignOutButton />
          </div>
        </div>

        {/* Componente de Stats */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <PatientDashboardStats userId={user.id} />
        </div>

        {/* Sección de Accesos Rápidos */}
        <div>
          <h2 className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-5 md:mb-6">
            Servicios Disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {cards.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group relative bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 hover:border-brand-teal/30 hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Efecto de luz al hover */}
                <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-brand-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${c.bg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <svg className={`w-6 h-6 sm:w-7 sm:h-7 ${c.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} />
                  </svg>
                </div>
                
                <h3 className="font-semibold text-brand-navy text-base sm:text-lg mb-1.5 sm:mb-2 group-hover:text-brand-teal transition-colors">
                  {c.label}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                  {c.desc}
                </p>
                
                {/* Indicador de flecha sutil */}
                <div className="mt-4 sm:mt-5 md:mt-6 flex items-center text-[8px] sm:text-[9px] md:text-[10px] font-black text-brand-teal uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  Acceder 
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1.5 sm:ml-2 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}