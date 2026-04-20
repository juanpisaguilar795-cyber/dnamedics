"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  loginSchema,
  forgotPasswordSchema,
  type LoginFormData,
  type ForgotPasswordData,
} from "@/lib/validations/auth";
import { ROUTES } from "@/lib/utils/constants";

// ─── Íconos ───────────────────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── CAPTCHA matemático (CORREGIDO - sin error de hidratación) ───────────────────────────────────────
function MathCaptcha({
  onVerify,
  verified,
}: {
  onVerify: (ok: boolean) => void;
  verified: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setMounted(true);
    setA(Math.floor(Math.random() * 9) + 1);
    setB(Math.floor(Math.random() * 9) + 1);
  }, []);

  const isWrong = touched && value !== "" && value !== String(a + b);

  function handleChange(v: string) {
    setValue(v);
    setTouched(false);
    onVerify(v.trim() === String(a + b));
  }

  if (!mounted) {
    return (
      <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5 border bg-[#fafbfc] border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0-6v2m0-6v2" />
            </svg>
          </div>
          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Verificación de seguridad
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-400">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl px-4 sm:px-6 py-4 sm:py-5 border transition-all duration-200 ${
      verified  ? "bg-brand-teal/5 border-brand-teal/30" :
      isWrong   ? "bg-rose-50 border-rose-200" :
                  "bg-[#fafbfc] border-slate-100"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          verified ? "bg-brand-teal" : "bg-slate-200"
        }`}>
          {verified ? (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          ) : (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0-6v2m0-6v2"/>
            </svg>
          )}
        </div>
        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Verificación de seguridad
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-slate-600 whitespace-nowrap tabular-nums">
          ¿Cuánto es {a} + {b}?
        </span>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="?"
          className={`w-16 h-10 text-center rounded-xl border text-sm font-bold outline-none transition-all ${
            verified  ? "border-brand-teal bg-white text-brand-teal" :
            isWrong   ? "border-rose-300 bg-white text-rose-600" :
                        "border-slate-200 bg-white text-slate-700 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10"
          }`}
        />
        {verified && (
          <span className="text-[9px] sm:text-[10px] font-black text-brand-teal uppercase tracking-wide">
            ✓ Correcto
          </span>
        )}
      </div>

      {isWrong && (
        <p className="text-rose-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-tight mt-2 ml-0.5">
          Respuesta incorrecta, intenta de nuevo
        </p>
      )}
    </div>
  );
}

// ─── Modal de recuperación de contraseña (RESPONSIVE) ──────────────────────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState("");

  const { register, handleSubmit } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordData) {
    setLoading(true); setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) { setError("No pudimos procesar la solicitud. Verifica tu email."); setLoading(false); return; }
    setSentEmail(data.email); setSent(true); setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-brand-navy/20 backdrop-blur-md" onClick={() => !loading && onClose()} />
      <div className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-sm p-6 sm:p-8 md:p-10 border border-white/20">
        {sent ? (
          <div className="text-center space-y-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-teal/5 text-brand-teal rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>Verifica tu bandeja</h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-relaxed tracking-wide uppercase">
              Instrucciones enviadas a <span className="text-brand-teal break-all">{sentEmail}</span>
            </p>
            <button onClick={onClose} className="w-full bg-brand-navy text-white py-3 sm:py-4 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-teal transition-all">
              Entendido
            </button>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>Recuperar acceso</h2>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">Ingresa tu correo electrónico registrado</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input {...register("email")} type="email" placeholder="email@ejemplo.com"
                className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-2xl bg-[#fafbfc] border border-slate-100 text-sm outline-none focus:border-brand-teal transition-all" />
              {error && <p className="text-rose-500 text-[9px] sm:text-[10px] font-bold uppercase">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-brand-teal text-white py-3 sm:py-4 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50">
                {loading ? "Procesando..." : "Enviar Enlace"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente interno que usa useSearchParams ──────────────────────────────
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const failCount = useRef(0);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);

    if (failCount.current >= 1 && !captchaVerified) {
      setServerError("Completa la verificación de seguridad para continuar.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      failCount.current += 1;
      setShowCaptcha(true);
      setCaptchaVerified(false);

      const msgs: Record<string, string> = {
        "Invalid login credentials": "Credenciales no válidas o cuenta no confirmada.",
        "Email not confirmed": "Confirma tu email antes de iniciar sesión.",
        "Too many requests": "Demasiados intentos. Espera 1 minuto.",
      };
      const friendly = Object.entries(msgs).find(([k]) => error.message.includes(k));
      setServerError(friendly ? friendly[1] : "Credenciales no válidas o cuenta no confirmada.");
      setLoading(false);
      return;
    }

    failCount.current = 0;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", user.id).single();

      const target =
        redirectTo?.startsWith("/") && !redirectTo.startsWith("/login")
          ? (redirectTo.startsWith("/admin") && profile?.role !== "admin"
              ? ROUTES.patientDashboard
              : redirectTo)
          : (profile?.role === "admin" ? ROUTES.adminDashboard : ROUTES.patientDashboard);

      window.location.href = target;
    }
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-brand-teal/5 rounded-full blur-[80px] sm:blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-brand-navy/5 rounded-full blur-[80px] sm:blur-[120px]" />

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="w-full max-w-[440px] z-10">
        {/* Branding */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-4xl sm:text-5xl text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
            Dnamedics
          </h1>
          <p className="text-[8px] sm:text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2 sm:mt-3">
            Portal Profesional
          </p>
        </div>

        {/* Card - RESPONSIVE */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-medium text-slate-800">Bienvenido</h2>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2 font-light">Gestiona tu salud con estándares de excelencia.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input 
                {...register("email")} 
                type="email" 
                placeholder="nombre@ejemplo.com"
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#fafbfc] border border-slate-100 text-sm outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 transition-all" 
              />
              {errors.email && (
                <p className="text-rose-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-tight ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Contraseña</label>
                <button 
                  type="button" 
                  onClick={() => setShowForgot(true)}
                  className="text-[8px] sm:text-[10px] font-bold text-brand-teal hover:text-brand-navy transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input 
                  {...register("password")} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#fafbfc] border border-slate-100 text-sm outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 transition-all" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-teal transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-tight ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* CAPTCHA */}
            {showCaptcha && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                <MathCaptcha
                  onVerify={setCaptchaVerified}
                  verified={captchaVerified}
                />
              </div>
            )}

            {/* Error servidor */}
            {serverError && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-rose-600 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                {serverError}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading || (showCaptcha && !captchaVerified)}
              className="w-full bg-brand-navy hover:bg-brand-teal text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-navy/10 hover:shadow-brand-teal/20 disabled:opacity-40"
            >
              {loading ? "Verificando..." : "Entrar al Portal"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-10 border-t border-slate-50 text-center">
            <p className="text-[10px] sm:text-xs text-slate-400">
              ¿Nuevo en Dnamedics?{" "}
              <Link href={ROUTES.registro} className="text-brand-teal font-bold hover:underline decoration-2 underline-offset-4">
                Crea una cuenta
              </Link>
            </p>
          </div>
        </div>

        {/* Volver a la web */}
        <div className="text-center mt-6 sm:mt-10">
          <Link href={ROUTES.home}
            className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] hover:text-brand-teal transition-colors flex items-center justify-center gap-1 sm:gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la web
          </Link>
        </div>
      </div>
    </main>
  );
}

// ─── Página de Login con Suspense ──────────────────────────────────────────
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Cargando...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}