import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  email:     z.string().min(1, "El email es requerido").email("Email inválido"),
  phone:     z.string().min(7, "Teléfono inválido").optional().or(z.literal("")),
  password:  z.string().min(8, "Mínimo 8 caracteres")
               .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
               .regex(/[0-9]/, "Debe tener al menos un número"),
  confirmPassword: z.string().min(1, "Confirma tu contraseña"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
      .regex(/[0-9]/, "Debe tener al menos un número"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormData         = z.infer<typeof loginSchema>;
export type RegisterFormData      = z.infer<typeof registerSchema>;
export type ForgotPasswordData    = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

