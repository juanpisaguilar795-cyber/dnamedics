export const ROUTES = {
  home:               "/",
  login:              "/login",
  registro:           "/registro",
  patientDashboard:   "/dashboard",
  patientCitas:       "/citas",
  patientHistorial:   "/historial",
  adminDashboard:     "/admin/dashboard",
  adminAgenda:        "/admin/agenda",
  adminPacientes:     "/admin/pacientes",
  adminNoticias:      "/admin/noticias",
  adminDisponibilidad:"/admin/disponibilidad",
  adminVideos:         "/admin/videos", // <--- NUEVA RUTA
} as const;

export const BUSINESS_HOURS = {
  start:        "08:00",
  end:          "18:00",
  slotDuration: 30,
  workDays:     [1, 2, 3, 4, 5],
} as const;

export const APPOINTMENT_STATUS_LABELS = {
  pending:   "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
} as const;

export const APPOINTMENT_STATUS_COLORS = {
  pending:   "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
} as const;

export const DAY_NAMES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"] as const;

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573192735497";
export const getWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const DNAMEDICS_SERVICES = [
  "Quiropráxia",
  "Medicina Biorreguladora (Heel)",
  "Medicina Ortomolecular",
  "Células Madre Mesenquimales (MSC)",
  "Plasma Rico en Plaquetas",
  "Escleroterapia",
  "Rehabilitación y Potenciación Deportiva",
  "Medicina Estética",
  "Vendaje Neuromuscular / Kinesiotaping",
  "Biopuntura y SMBT",
  "Cupping Therapy (Ventosas)",
  "Infiltración Articular",
] as const;

export type DnamedicsService = typeof DNAMEDICS_SERVICES[number];
