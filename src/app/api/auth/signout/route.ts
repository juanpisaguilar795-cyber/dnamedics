import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  // 1. Cerrar sesión en Supabase (invalida el token en el servidor)
  await supabase.auth.signOut();

  // 2. Crear respuesta con redirección a /login
  const response = NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
    { status: 302 }
  );

  // 3. Borrar TODAS las cookies de sesión de Supabase explícitamente
  // Supabase SSR usa estas cookies para mantener la sesión
  const cookieNames = [
    "sb-access-token",
    "sb-refresh-token",
    // El formato exacto depende del proyecto de Supabase
    // También puede ser sb-{project-ref}-auth-token
  ];

  // Obtener todas las cookies y eliminar las que son de Supabase
  const allCookies = (await import("next/headers")).cookies();
  const cookieList = (await allCookies).getAll();

  for (const cookie of cookieList) {
    if (
      cookie.name.startsWith("sb-") ||
      cookie.name.includes("supabase") ||
      cookie.name.includes("auth-token")
    ) {
      response.cookies.set(cookie.name, "", {
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
        sameSite: "lax",
        path:     "/",
        maxAge:   0,   // Expirar inmediatamente
        expires:  new Date(0),
      });
    }
  }

  // Borrar también los nombres conocidos por si acaso
  for (const name of cookieNames) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      path:     "/",
      maxAge:   0,
      expires:  new Date(0),
    });
  }

  return response;
}
