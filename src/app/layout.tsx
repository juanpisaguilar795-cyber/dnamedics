import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dnamedics",
  description:
    "Dnamedics es un consultorio médico dedicado a la medicina biorreguladora de sistemas, la medicina Ortomolecular, la fisioterapia, la Quiropráxia y las terapias alternativas. Bogotá, Colombia.",
  keywords: [
    "quiropráxia", "medicina biorreguladora", "medicina ortomolecular",
    "fisioterapia", "plasma rico en plaquetas", "células madre", "bienestar", "Bogotá", "Dnamedics",
  ],
  // 👇 Agregar metadataBase para evitar el warning
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://dnamedics.com" // 👈 Cambia por tu dominio real cuando hagas deploy
      : "http://localhost:3000"
  ),
  icons: {
    icon: [
      { url: "/icono.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icono.svg",
  },
  openGraph: {
    title: "Dnamedics",
    description: "La solución integrativa para mejorar tu calidad de vida.",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icono.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}