import { guardAdmin } from "@/lib/utils/serverGuards";

// Este layout envuelve TODAS las páginas del grupo (admin)
// Es la tercera capa de seguridad:
// 1. Middleware (verificación de sesión + rol)
// 2. guardAdmin() en cada Server Component
// 3. Este layout (captura cualquier caso edge)

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Si llega aquí sin ser admin, guardAdmin() redirige automáticamente
  await guardAdmin();

  return <>{children}</>;
}
