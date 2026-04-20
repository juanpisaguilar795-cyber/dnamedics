/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: "X-Frame-Options",           value: "SAMEORIGIN" }, // Cambiado de DENY a SAMEORIGIN para permitir frames controlados
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection",          value: "1; mode=block" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://img.youtube.com https://i.ytimg.com", // Permitir miniaturas de YT
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://wa.me",
      "frame-src 'self' https://www.youtube.com https://youtube.com", // PERMITIR EL REPRODUCTOR
      "frame-ancestors 'self'", // Cambiado de 'none' a 'self' para permitir el embed
    ].join("; "),
  },
];

const nextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com", // Configuración para el componente <Image /> de Next
        pathname: "/vi/**",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;