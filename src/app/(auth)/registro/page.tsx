"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { ROUTES } from "@/lib/utils/constants";

/* PASSWORD CHECKS */
function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

function PasswordCheck({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${ok ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-slate-200"}`} />
      <span className={`text-[9px] xs:text-[10px] font-black uppercase tracking-widest ${ok ? "text-emerald-600" : "text-slate-300"}`}>
        {label}
      </span>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const formData = watch();

  useEffect(() => {
    const savedData = sessionStorage.getItem("dnamedics_reg_draft");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      Object.keys(parsed).forEach((key) => {
        setValue(key as keyof RegisterFormData, parsed[key]);
      });
      if (parsed.password) setPasswordValue(parsed.password);
      if (parsed.confirmPassword) setConfirmValue(parsed.confirmPassword);
    }
  }, [setValue]);

  useEffect(() => {
    sessionStorage.setItem("dnamedics_reg_draft", JSON.stringify(formData));
  }, [formData]);

  async function onSubmit(data: RegisterFormData) {
    if (!accepted) return;
    setLoading(true); setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: data.full_name.trim(),
          phone: data.phone?.trim() ?? "",
          role: "patient",
          accepted_terms: true,
        },
      },
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }
    
    sessionStorage.removeItem("dnamedics_reg_draft");
    router.replace(ROUTES.login + "?message=check-email");
  }

  const checks = getPasswordChecks(passwordValue);

  return (
    <main className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-teal/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-navy/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]" />

      <div className="w-full max-w-[440px] xs:max-w-[480px] z-10 py-6 sm:py-8 md:py-12">
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl text-brand-navy" style={{ fontFamily: "var(--font-cormorant)" }}>
            Dnamedics
          </h1>
          <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2 sm:mt-3 ml-[0.3em] sm:ml-[0.4em]">
            Registro de Paciente
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-5 sm:p-8 lg:p-10 xl:p-14 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="mb-6 sm:mb-8 lg:mb-10 text-center sm:text-left">
            <h2 className="text-base sm:text-lg lg:text-xl font-medium text-slate-800">Crea tu cuenta</h2>
            <p className="text-[10px] xs:text-xs text-slate-400 mt-1 sm:mt-2 font-light italic">
              Estás a un paso de una atención más humana y tecnológica.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-5">
              <input 
                {...register("full_name")} 
                placeholder="Nombre y Apellidos"
                className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl bg-[#fafbfc] border border-slate-100 text-xs sm:text-sm outline-none focus:border-brand-teal transition-all" 
              />
              
              <input 
                {...register("email")} 
                type="email" 
                placeholder="Correo electrónico"
                className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl bg-[#fafbfc] border border-slate-100 text-xs sm:text-sm outline-none focus:border-brand-teal transition-all" 
              />
              
              <input 
                {...register("phone")} 
                placeholder="Teléfono de contacto"
                className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl bg-[#fafbfc] border border-slate-100 text-xs sm:text-sm outline-none focus:border-brand-teal transition-all" 
              />

              {/* Password Group */}
              <div className="space-y-2 sm:space-y-3">
                <div className="relative">
                  <input 
                    {...register("password")} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Contraseña"
                    onChange={(e) => {
                      register("password").onChange(e);
                      setPasswordValue(e.target.value);
                    }}
                    className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl bg-[#fafbfc] border border-slate-100 text-xs sm:text-sm outline-none focus:border-brand-teal transition-all" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-teal transition-colors"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>

                {passwordValue && (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 sm:gap-y-2 px-1 sm:px-2 pt-1">
                    <PasswordCheck ok={checks.length} label="8+ Caracteres" />
                    <PasswordCheck ok={checks.upper} label="Mayúscula" />
                    <PasswordCheck ok={checks.number} label="Un número" />
                    <PasswordCheck ok={checks.symbol} label="Un símbolo" />
                  </div>
                )}

                <div className="relative">
                  <input 
                    {...register("confirmPassword")} 
                    type={showConfirm ? "text" : "password"} 
                    placeholder="Confirmar contraseña"
                    onChange={(e) => {
                      register("confirmPassword").onChange(e);
                      setConfirmValue(e.target.value);
                    }}
                    className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl bg-[#fafbfc] border border-slate-100 text-xs sm:text-sm outline-none focus:border-brand-teal transition-all" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirm(!showConfirm)} 
                    className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-teal transition-colors"
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                
                {confirmValue && (
                  <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ml-1 sm:ml-2 ${confirmValue === passwordValue ? "text-emerald-500" : "text-rose-400"}`}>
                    {confirmValue === passwordValue ? "● Las contraseñas coinciden" : "○ No coinciden"}
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 sm:gap-4 px-1 sm:px-2 py-3 sm:py-4 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={accepted} 
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg border-slate-200 text-brand-teal focus:ring-brand-teal/20 mt-0.5 accent-brand-teal" 
              />
              <span className="text-[10px] xs:text-[11px] text-slate-400 leading-relaxed font-light">
                Acepto los <Link href="/terminos" className="text-brand-teal font-bold hover:underline">Términos de Servicio</Link> y el tratamiento de mis datos según la <Link href="/politicas" className="text-brand-teal font-bold hover:underline">Política de Privacidad</Link>.
              </span>
            </label>

            {serverError && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-rose-600 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                {serverError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || passwordValue !== confirmValue || !accepted}
              className="w-full bg-brand-navy hover:bg-brand-teal text-white py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all shadow-lg sm:shadow-xl shadow-brand-navy/10 hover:shadow-brand-teal/20 disabled:opacity-30 disabled:shadow-none"
            >
              {loading ? "Creando Expediente..." : "Finalizar Registro"}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 lg:mt-10 pt-6 sm:pt-8 lg:pt-10 border-t border-slate-50 text-center">
            <p className="text-[10px] xs:text-xs text-slate-400 font-light">
              ¿Ya eres parte de nosotros?{" "}
              <Link href={ROUTES.login} className="text-brand-teal font-bold hover:underline decoration-2 underline-offset-4">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8 lg:mt-10">
          <Link 
            href={ROUTES.home} 
            className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:text-brand-teal transition-colors inline-flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}