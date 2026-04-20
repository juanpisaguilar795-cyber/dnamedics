"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { ROUTES } from "@/lib/utils/constants";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 12s4-6 10-6c1.5 0 2.8.3 4 .8M22 12s-4 6-10 6c-1.5 0-2.8-.3-4-.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [invalidLink, setInvalidLink]   = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password", "");

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          setSessionReady(true);
        } else if (event === "SIGNED_IN" && session) {
          setSessionReady(true);
        }
      }
    );

    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) setInvalidLink(true);
      else setSessionReady(true);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function onSubmit(data: ResetPasswordFormData) {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (err) {
      setError(
        err.message.includes("same password")
          ? "La nueva contraseña debe ser diferente a la anterior."
          : "Error al actualizar la contraseña. Intenta de nuevo."
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push(ROUTES.patientDashboard);
      router.refresh();
    }, 2000);
  }

  // ─── Estado: link inválido o expirado ──────────────────────────────────────
  if (invalidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-8">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2
            className="text-lg sm:text-xl font-semibold text-brand-navy mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Enlace inválido o expirado
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light mb-6">
            El enlace para restablecer tu contraseña ya expiró o no es válido.
            Los enlaces tienen una validez de 1 hora.
          </p>
          <Link
            href={ROUTES.login}
            className="inline-flex items-center justify-center w-full bg-brand-teal hover:bg-brand-navy text-white py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-colors"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  // ─── Estado: cargando sesión ────────────────────────────────────────────────
  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-slate-400 font-light">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  // ─── Estado: contraseña actualizada ────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-8">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2
            className="text-lg sm:text-xl font-semibold text-brand-navy mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            ¡Contraseña actualizada!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light mb-2">
            Tu contraseña fue cambiada correctamente.
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400 font-light">
            Redirigiendo a tu portal...
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Formulario de nueva contraseña ─────────────────────────────────────────
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strengthCount = strength.filter(Boolean).length;
  const strengthLabel = ["Muy débil", "Débil", "Regular", "Buena", "Fuerte"][strengthCount];
  const strengthColor = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-green-400"][strengthCount];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-6 sm:py-8">
      <div className="w-full max-w-sm sm:max-w-md">

        {/* Logo - Responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold text-brand-navy"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Dnamedics
          </h1>
          <p className="text-brand-teal text-[10px] sm:text-xs tracking-widest uppercase mt-1 font-light">
            Salud &amp; Bienestar
          </p>
        </div>

        {/* Card - Responsive */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 md:p-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-teal/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2
            className="text-lg sm:text-xl font-semibold text-brand-navy mb-1"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Nueva contraseña
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light mb-5 sm:mb-6">
            Crea una contraseña segura para tu cuenta.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">

            {/* Nueva contraseña */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-11 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-teal transition-colors"
                  style={{ minHeight: "auto" }}
                  aria-label={showPass ? "Ocultar" : "Mostrar"}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.password.message}</p>
              )}

              {/* Indicador de fortaleza */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0,1,2,3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i < strengthCount ? strengthColor : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[10px] sm:text-xs font-medium ${
                    strengthCount <= 1 ? "text-red-400" :
                    strengthCount === 2 ? "text-amber-500" :
                    strengthCount === 3 ? "text-yellow-500" : "text-green-500"
                  }`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repite tu nueva contraseña"
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-11 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-teal transition-colors"
                  style={{ minHeight: "auto" }}
                  aria-label={showConfirm ? "Ocultar" : "Mostrar"}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Requisitos - Responsive */}
            <div className="bg-slate-50 rounded-xl p-3 sm:p-3">
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-2">Requisitos:</p>
              <ul className="space-y-1">
                {[
                  { ok: password.length >= 8,    label: "Mínimo 8 caracteres" },
                  { ok: /[A-Z]/.test(password),   label: "Al menos una mayúscula" },
                  { ok: /[0-9]/.test(password),   label: "Al menos un número" },
                ].map((req) => (
                  <li key={req.label} className="flex items-center gap-2">
                    <span className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      req.ok ? "bg-green-100" : "bg-slate-200"
                    }`}>
                      {req.ok && (
                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-[10px] sm:text-xs ${req.ok ? "text-green-600" : "text-slate-400"} font-light`}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                <p className="text-red-600 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || strengthCount < 3}
              className="w-full bg-brand-teal hover:bg-brand-navy text-white py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Actualizando...
                </>
              ) : "Guardar nueva contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}