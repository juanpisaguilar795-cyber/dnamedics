import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Ignorar solicitudes de Chrome DevTools ─────────────────
  if (pathname.startsWith('/.well-known/')) {
    return new NextResponse(null, { status: 404 });
  }

  let supabaseResponse = NextResponse.next({ request });

  // ── Rate limiting ──────────────────────────────────────────
  if (request.method === "POST") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const isAuthEndpoint = pathname.startsWith("/api/auth") || pathname === "/login";

    if (isAuthEndpoint) {
      const { success } = rateLimit({ key: `auth:${ip}`, limit: 5, windowMs: 60_000 });
      if (!success) {
        return NextResponse.json({ error: "Demasiados intentos. Espera 1 minuto." }, { status: 429 });
      }
    } else if (pathname.startsWith("/api/")) {
      const { success } = rateLimit({ key: `api:${ip}`, limit: 30, windowMs: 60_000 });
      if (!success) {
        return NextResponse.json({ error: "Límite de solicitudes alcanzado." }, { status: 429 });
      }
    }
  }

  // ── Cliente Supabase ───────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            })
          );
        },
      },
    }
  );

  // ── Definir tipos de rutas ─────────────────────────────────
  const adminOnlyRoutes = ["/admin"];
  const publicOnlyRoutes = ["/login", "/registro"];
  const alwaysPublic = ["/reset-password", "/noticias", "/"];

  const isProtectedRoute = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/citas") ||
    pathname.startsWith("/api/citas");

  const isAdminRoute = adminOnlyRoutes.some((r) => pathname.startsWith(r));
  const isPublicOnlyRoute = publicOnlyRoutes.some((r) => pathname.startsWith(r));
  const isAlwaysPublic = alwaysPublic.some((r) => pathname === r || pathname.startsWith(r + "/"));

  // ── Solo obtener usuario si la ruta lo requiere ────────────
  let user = null;
  if (isProtectedRoute || isAdminRoute || isPublicOnlyRoute) {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  // ── 1. Sin sesión válida → limpiar cookies y redirigir ────
  if (!user && (isProtectedRoute || isAdminRoute)) {
    // Si es API, error 401. Si es página, redirect a login.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", pathname);

    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Limpiar cualquier cookie de sesión corrupta o expirada
    request.cookies.getAll().forEach((cookie) => {
      if (
        cookie.name.startsWith("sb-") ||
        cookie.name.includes("supabase") ||
        cookie.name.includes("auth-token")
      ) {
        redirectResponse.cookies.set(cookie.name, "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 0,
          expires: new Date(0),
        });
      }
    });

    return redirectResponse;
  }

  // ── 2. Autenticado en rutas solo-públicas ─────────────────
  if (user && isPublicOnlyRoute && !isAlwaysPublic) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  // ── 3. Verificar rol admin ESTRICTAMENTE ──────────────────
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ── 4. Retornar la response con cookies actualizadas ──────
  return supabaseResponse;
}