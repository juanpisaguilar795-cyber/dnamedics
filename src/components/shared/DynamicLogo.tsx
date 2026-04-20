"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type DayPeriod = "day" | "dark_mode";

export function DynamicLogo() {
  const [period, setPeriod] = useState<DayPeriod>("day");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateLogoByTime = () => {
      const hour = new Date().getHours();
      
      // Logo oscuro desde las 5 PM (17:00) hasta las 6 AM
      if (hour >= 17 || hour < 6) {
        setPeriod("dark_mode");
      } else {
        setPeriod("day");
      }
    };

    updateLogoByTime();
    setMounted(true);

    const interval = setInterval(updateLogoByTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Skeleton loader mientras monta
  if (!mounted) {
    return (
      <div className="flex flex-col items-start gap-0.5 sm:gap-1">
        <div className="relative h-8 sm:h-9 lg:h-10 w-32 sm:w-36 lg:w-40 animate-pulse bg-slate-200/50 rounded" />
        <div className="h-3 sm:h-3.5 w-24 sm:w-28 bg-slate-200/50 rounded animate-pulse" />
      </div>
    );
  }

  const logoSrc = period === "dark_mode" ? "/logo-oscuro.png" : "/logo.png";
  const subTextColor = period === "dark_mode" ? "text-slate-400" : "text-brand-teal";

  return (
    <Link href="/" className="flex flex-col items-start gap-0.5 sm:gap-1 group no-touch-min">
      {/* Logo - Tamaño responsive */}
      <div className="relative h-7 sm:h-8 lg:h-10 w-28 sm:w-32 md:w-36 lg:w-40 transition-all duration-700">
        <Image
          src={logoSrc}
          alt="Dnamedics Logo"
          fill
          priority
          sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
          className="object-contain object-left"
        />
      </div>
      
      {/* Subtítulo - Responsive */}
      <span className={`
        text-[7px] sm:text-[8px] lg:text-[9px] 
        tracking-[0.2em] sm:tracking-[0.25em] lg:tracking-[0.3em] 
        uppercase font-light -mt-0.5 transition-colors duration-700
        ${subTextColor}
      `}>
        Salud & Bienestar
      </span>
    </Link>
  );
}