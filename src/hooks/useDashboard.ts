"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Tipos ────────────────────────────────────────────────────
export interface AdminStats {
  todayAppointments:   number;
  pendingAppointments: number;
  totalPatients:       number;
  confirmedAppointments: number;
}

export interface PatientStats {
  upcomingAppointments: number;
  totalRecords:         number;
  lastVisit:            string | null;
}

// ─── Hook para el dashboard del ADMIN ────────────────────────
export function useAdminDashboard() {
  const [stats,   setStats]   = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  // Función de carga — la memoizamos para reusar en la suscripción
  const fetchStats = useCallback(async () => {
    try {
      const supabase = createClient();
      const today    = new Date().toISOString().split("T")[0];

      // Ejecutar todas las queries en paralelo
      const [apptToday, apptPending, apptConfirmed, patients] = await Promise.all([
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("appointment_date", today),

        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),

        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed"),

        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "patient"),
      ]);

      setStats({
        todayAppointments:    apptToday.count    ?? 0,
        pendingAppointments:  apptPending.count  ?? 0,
        confirmedAppointments:apptConfirmed.count ?? 0,
        totalPatients:        patients.count     ?? 0,
      });
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial
    fetchStats();

    const supabase = createClient();

    // ── Suscripción en tiempo real a cambios en appointments ──
    // Supabase Realtime notifica INSERT, UPDATE, DELETE en tablas
    channelRef.current = supabase
      .channel("admin-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          // Cualquier cambio en citas → recargar estadísticas
          fetchStats();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        () => {
          // Nuevo paciente registrado → actualizar contador
          fetchStats();
        }
      )
      .subscribe();

    // Cleanup: cancelar suscripción al desmontar
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// ─── Hook para el dashboard del PACIENTE ─────────────────────
export function usePatientDashboard(userId: string) {
  const [stats,   setStats]   = useState<PatientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
    try {
      const supabase = createClient();
      const today    = new Date().toISOString().split("T")[0];

      const [upcoming, records, lastVisit] = await Promise.all([
        // Citas futuras del paciente
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("patient_id", userId)
          .gte("appointment_date", today)
          .neq("status", "cancelled"),

        // Total de registros clínicos
        supabase
          .from("clinical_records")
          .select("id", { count: "exact", head: true })
          .eq("patient_id", userId),

        // Última visita
        supabase
          .from("clinical_records")
          .select("consultation_date")
          .eq("patient_id", userId)
          .order("consultation_date", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      setStats({
        upcomingAppointments: upcoming.count ?? 0,
        totalRecords:         records.count  ?? 0,
        lastVisit:            lastVisit.data?.consultation_date ?? null,
      });
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchStats();

    const supabase = createClient();

    // Escuchar solo cambios que afectan a ESTE paciente
    channelRef.current = supabase
      .channel(`patient-dashboard-${userId}`)
      .on(
        "postgres_changes",
        {
          event:  "*",
          schema: "public",
          table:  "appointments",
          filter: `patient_id=eq.${userId}`,
        },
        () => fetchStats()
      )
      .on(
        "postgres_changes",
        {
          event:  "*",
          schema: "public",
          table:  "clinical_records",
          filter: `patient_id=eq.${userId}`,
        },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
