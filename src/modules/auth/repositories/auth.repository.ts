import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles").select("*").eq("id", userId).single();
  if (error) return null;
  return data as Profile;
}

export async function getAllPatients(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles").select("*").eq("role", "patient").order("full_name");
  return (data ?? []) as Profile[];
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "full_name" | "phone" | "avatar_url">>
): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles").update(updates).eq("id", userId).select().single();
  if (error) return null;
  return data as Profile;
}
