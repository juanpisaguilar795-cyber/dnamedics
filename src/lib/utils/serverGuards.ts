import { redirect } from "next/navigation";
import { requireAdmin, getCurrentUser } from "@/modules/auth/services/auth.service";
import { ROUTES } from "@/lib/utils/constants";
import type { Profile } from "@/lib/types";

/**
 * Guard para páginas exclusivas del administrador.
 * Doble seguro: el middleware ya bloqueó, pero esto protege
 * a nivel de Server Component también.
 *
 * Si el usuario no está autenticado → va al login
 * Si está autenticado pero no es admin → va al dashboard del paciente
 */
export async function guardAdmin(): Promise<Profile> {
  let admin: Profile;
  try {
    admin = await requireAdmin();
  } catch {
    // Verificar si hay sesión activa para saber a dónde redirigir
    const user = await getCurrentUser().catch(() => null);
    if (user) {
      // Está logueado pero no es admin → dashboard paciente
      redirect(ROUTES.patientDashboard);
    } else {
      // No está logueado → login
      redirect(ROUTES.login);
    }
  }
  return admin!;
}

/**
 * Guard para páginas de paciente.
 * Si no está autenticado → login
 * Si es admin → dashboard admin
 */
export async function guardPatient(): Promise<Profile> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect(ROUTES.login);
  if (user!.role === "admin") redirect(ROUTES.adminDashboard);
  return user!;
}
