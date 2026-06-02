import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Variante claire pour fonds sombres (défaut) ou sombre. */
  tone?: "light" | "dark";
}

/** Logo AFRO MK LO BOKO : cloche stylisée + wordmark. */
export function Logo({ className, tone = "light" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3.5", className)}
      aria-label="AFRO MK LO BOKO — Accueil"
    >
      <span
        className={cn(
          "grid h-12 w-12 place-items-center rounded-2xl border shadow-[0_18px_42px_-30px_rgba(216,154,28,0.95)] transition group-hover:border-gold",
          tone === "light"
            ? "border-gold/45 bg-[#0D0D0D]/70 text-gold"
            : "border-gold/60 bg-white text-gold-600",
        )}
      >
        <svg
          viewBox="0 0 48 48"
          className="h-9 w-9"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M11 25h26v3c0 7-5 12-13 12S11 35 11 28v-3Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M16 25c0-5 4-9 8-9s8 4 8 9"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path
            d="M13 31h28M8 25h32M21 11h6M24 6v5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-2xl font-bold tracking-tight",
            tone === "light" ? "text-cream" : "text-ink",
          )}
        >
          AFRO MK
        </span>
        <span className="block text-sm font-bold uppercase tracking-[0.32em] text-gold">
          LO BOKO
        </span>
      </span>
    </Link>
  );
}
