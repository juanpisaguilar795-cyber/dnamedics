# Dnamedics — Plataforma de Fisioterapia Integrativa

> La solución integrativa para mejorar tu calidad de vida · Bogotá, Colombia

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilos | Tailwind CSS (mobile-first responsive) |
| Backend | API Routes con arquitectura en capas |
| Base datos | Supabase (PostgreSQL + Auth + RLS) |
| Seguridad | CSP headers, rate limiting, cookies httpOnly |
| Deploy | Vercel (región gru1 - São Paulo) |

---

## Inicio rápido

```bash
npm install
cp .env.production.example .env.local
# → Editar .env.local con tus keys de Supabase
npm run dev
```

## Base de datos (Supabase → SQL Editor)

Ejecutar en orden:
```
001_initial_schema.sql
002_week3_updates.sql
003_week4_security.sql
```

## Crear administrador

```sql
UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'tu@email.com');
```

---

## Deploy en Vercel

```bash
npx vercel --prod
```

O conectar el repositorio en vercel.com y agregar las variables de entorno:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

---

## Seguridad implementada

- Security headers: X-Frame-Options, CSP, HSTS, XSS-Protection
- Cookies seguras: httpOnly, Secure, SameSite=Lax
- Rate limiting: 5/min en auth, 30/min en API general
- RLS en Supabase: políticas por rol en todas las tablas
- Middleware: verifica sesión y rol en cada request
- Sanitización de inputs antes de persistir
- Validación con Zod en cliente y servidor

---

## Rutas

| Ruta | Rol |
|------|-----|
| `/` | Público |
| `/noticias`, `/noticias/[slug]` | Público |
| `/login`, `/registro` | Público |
| `/dashboard`, `/historial`, `/citas` | Paciente |
| `/admin/*` | Admin |
