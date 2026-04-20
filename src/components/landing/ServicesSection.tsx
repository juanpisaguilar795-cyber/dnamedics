"use client";
import { 
  ShieldCheck, Leaf, FlaskConical, Zap, 
  Droplet, Activity, Timer, Sparkles, 
  Stethoscope, Thermometer, Target, Syringe 
} from "lucide-react";

const services = [
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Quiropráxia", desc: "Ajustes vertebrales y manipulaciones articulares para aliviar el dolor y mejorar la movilidad." },
  { icon: <Leaf className="w-5 h-5" />, title: "Medicina Biorreguladora", desc: "Tratamientos biológicos de alta calidad para estimular los mecanismos naturales del organismo." },
  { icon: <FlaskConical className="w-5 h-5" />, title: "Medicina Ortomolecular", desc: "Optimización de la salud a través del equilibrio de nutrientes, vitaminas y minerales a nivel celular." },
  { icon: <Zap className="w-5 h-5" />, title: "Células Madre (MSC)", desc: "Terapia regenerativa de vanguardia para acelerar la reparación tisular y tratar condiciones complejas." },
  { icon: <Droplet className="w-5 h-5" />, title: "Plasma Rico en Plaquetas", desc: "Tratamiento biológico con factores de crecimiento propios para regenerar tendones y articulaciones." },
  { icon: <Activity className="w-5 h-5" />, title: "Escleroterapia", desc: "Procedimiento mínimamente invasivo para el tratamiento de venas varicosas con resultados seguros." },
  { icon: <Timer className="w-5 h-5" />, title: "Potenciación Deportiva", desc: "Programas especializados para deportistas: recuperación de lesiones y mejora del rendimiento." },
  { icon: <Sparkles className="w-5 h-5" />, title: "Medicina Estética", desc: "Tratamientos no invasivos para mejorar tu apariencia física con resultados naturales y seguros." },
  { icon: <Target className="w-5 h-5" />, title: "Kinesiotaping", desc: "Técnica de vendaje elástico que facilita la recuperación muscular y reduce el dolor sin limitar el movimiento." },
  { icon: <Stethoscope className="w-5 h-5" />, title: "Biopuntura y SMBT", desc: "Inyecciones de micro-dosis de medicamentos homeopáticos para tratar dolor e inflamación natural." },
  { icon: <Thermometer className="w-5 h-5" />, title: "Cupping Therapy", desc: "Técnica milenaria de succión para mejorar la circulación y liberar tensión muscular profunda." },
  { icon: <Syringe className="w-5 h-5" />, title: "Infiltración Articular", desc: "Aplicación precisa de medicamentos directamente en la articulación para mejorar la función articular." },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden scroll-mt-nav">
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-brand-teal/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Tamaños responsive manteniendo diseño original */}
        <div className="max-w-3xl mb-8 sm:mb-12 lg:mb-16">
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-brand-teal font-black mb-2 sm:mb-4 block">
            Especialidades Médicas
          </span>
          
          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-brand-navy leading-[1.2]" 
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Cuidado especializado para <br className="hidden sm:block" />
            <span className="italic text-brand-teal">tu recuperación y rendimiento.</span>
          </h2>
          
          <p className="text-slate-500 font-light mt-3 sm:mt-4 lg:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed">
            Unimos la ciencia moderna con terapias biológicas para ofrecerte una solución integral a tus necesidades de salud.
          </p>
        </div>

        {/* Grid - SIEMPRE muestra TODOS los servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {services.map((s, i) => (
            <div 
              key={i} 
              className="group relative bg-[#fafbfc] rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 lg:p-8 border border-slate-50 hover:bg-white hover:border-brand-teal/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500"
            >
              
              {/* Icono - Tamaño responsive */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center text-brand-teal mb-4 sm:mb-5 lg:mb-6 shadow-sm group-hover:bg-brand-teal group-hover:text-white transition-all duration-500 border border-slate-100/50">
                <span className="group-hover:scale-110 transition-transform duration-500 stroke-[1.2]">
                  {s.icon}
                </span>
              </div>

              {/* Título */}
              <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-2 sm:mb-3 leading-snug group-hover:text-brand-teal transition-colors">
                {s.title}
              </h3>
              
              {/* Descripción - Tamaño responsive */}
              <p className="text-[11px] sm:text-xs text-slate-500 font-light leading-relaxed mb-3 sm:mb-4">
                {s.desc}
              </p>

              {/* Indicador "Ver más" - Siempre visible en móvil, hover en desktop */}
              <div className="pt-1 sm:pt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-teal transition-all duration-500 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0">
                Saber más <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}