"use client";

const steps = [
  { 
    num: "01", 
    title: "Regístrate", 
    desc: "Crea tu cuenta en minutos y accede a todos nuestros servicios de forma segura.",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  { 
    num: "02", 
    title: "Agenda tu cita", 
    desc: "Selecciona el día y hora disponible desde nuestro calendario en línea.",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    num: "03", 
    title: "Evaluación inicial", 
    desc: "Primera consulta para diseñar tu plan de tratamiento personalizado.",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { 
    num: "04", 
    title: "Seguimiento continuo", 
    desc: "Accede a tu historial y monitorea tu evolución desde tu portal personal.",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
];

export function ProcessSection() {
  return (
    <section id="proceso" className="py-12 sm:py-16 lg:py-20 bg-slate-50/50 scroll-mt-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-8 sm:mb-10 lg:mb-12">
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-brand-teal font-bold sm:font-black">
            Proceso de atención
          </span>
          
          <h2 
            className="text-xl sm:text-2xl lg:text-3xl text-brand-navy leading-tight mt-2 sm:mt-3 mb-3 sm:mb-4" 
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Tu camino hacia{" "}
            <span className="italic text-brand-teal">el bienestar integral.</span>
          </h2>
          
          <p className="text-slate-600 font-light text-xs sm:text-sm max-w-md">
            Un proceso simple y claro para iniciar tu recuperación sin complicaciones.
          </p>
        </div>

        {/* Grid de pasos - SIN FLECHAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {steps.map((step) => (
            <div 
              key={step.num} 
              className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-4 sm:p-5 lg:p-6 hover:border-brand-teal/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Número con icono */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-teal/5 border border-brand-teal/10 flex items-center justify-center group-hover:bg-brand-teal transition-colors duration-300">
                  <span 
                    className="text-brand-teal group-hover:text-white text-base sm:text-lg font-bold"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {step.num}
                  </span>
                </div>
                
                {/* Icono decorativo */}
                <div className="text-brand-teal/20 group-hover:text-brand-teal/40 transition-colors duration-300">
                  {step.icon}
                </div>
              </div>
              
              {/* Contenido */}
              <h4 className="font-semibold text-brand-navy text-xs sm:text-sm mb-1.5 sm:mb-2 uppercase tracking-wide">
                {step.title}
              </h4>
              
              <p className="text-[11px] sm:text-xs text-slate-500 font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        
        {/* Trust indicator */}
        <div className="mt-8 sm:mt-10 text-center">
          <p className="inline-flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 font-light">
            <span className="w-1 h-1 rounded-full bg-brand-teal" />
            Proceso 100% digital y seguro
            <span className="w-1 h-1 rounded-full bg-brand-teal" />
          </p>
        </div>
      </div>
    </section>
  );
}