import { createClient } from "@/lib/supabase/server";
import { getProfileById } from "@/modules/auth/repositories/auth.repository";
import type { Profile } from "@/lib/types";

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return getProfileById(user.id);
}

export async function requireAuth(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) throw new Error("No autenticado");
  return user;
}

export async function requireAdmin(): Promise<Profile> {
  const user = await requireAuth();
  
  // ✅ Verificación más robusta
  if (!user.role || user.role !== "admin") {
    throw new Error("Acceso denegado: se requiere rol de administrador");
  }
  
  return user;
}