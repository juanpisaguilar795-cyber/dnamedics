# Configuración de Supabase para emails únicos y confirmación

## 1. Activar confirmación de email (REQUERIDO)

En Supabase → Authentication → Providers → Email:

- ✅ Enable Email provider: ON
- ✅ Confirm email: ON  ← ACTIVAR ESTO
- ✅ Secure email change: ON
- ✅ Double confirm changes: ON

Esto garantiza que:
- Un email solo puede tener UNA cuenta
- El usuario debe verificar su email antes de poder iniciar sesión
- No pueden existir dos cuentas con el mismo email

## 2. Plantilla de email de confirmación personalizada

En Supabase → Authentication → Email Templates → Confirm signup:

Subject:
```
Confirma tu cuenta en Dnamedics
```

Body (HTML):
```html
<h2>Bienvenido a Dnamedics</h2>
<p>Gracias por registrarte en nuestra plataforma de salud integral.</p>
<p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
<p><a href="{{ .ConfirmationURL }}" style="background:#0e7490;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">
  Confirmar mi cuenta
</a></p>
<p style="color:#666;font-size:12px;">Si no creaste esta cuenta, puedes ignorar este email.</p>
<p style="color:#666;font-size:12px;">— Equipo Dnamedics · Bogotá, Colombia</p>
```

## 3. URL de redirección después de confirmar

En Supabase → Authentication → URL Configuration:

Site URL: https://tu-dominio.vercel.app

Redirect URLs (agregar):
- https://tu-dominio.vercel.app/dashboard
- http://localhost:3000/dashboard  (para desarrollo)

## 4. Verificar en código

El error "User already registered" ya está manejado en registro/page.tsx:
```
"User already registered" → "Ya existe una cuenta con este email."
```

## 5. Política de contraseñas (opcional pero recomendado)

En Supabase → Authentication → Providers → Email → Password strength:
- Minimum password length: 8
- Require uppercase: ON
- Require numbers: ON
