import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Variante claire pour fonds sombres (défaut) ou sombre. */
  tone?: "light" | "dark";
}

/** Logo N'KULU : masque africain stylisé + wordmark. */
export function Logo({ className, tone = "light" }: LogoProps) {
  return (
    <a
      href="#accueil"
      className={cn("group flex items-center gap-3", className)}
      aria-label="N'KULU Saveurs Africaines — Accueil"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-600 shadow-glow">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-ink"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2c-3 0-5 2.5-5 6 0 1.5.5 2.5.5 4 0 2-1.5 3-1.5 5 0 3 2.5 5 6 5s6-2 6-5c0-2-1.5-3-1.5-5 0-1.5.5-2.5.5-4 0-3.5-2-6-5-6Z"
            fill="currentColor"
            opacity="0.9"
          />
          <circle cx="9.5" cy="10" r="1" fill="#080808" />
          <circle cx="14.5" cy="10" r="1" fill="#080808" />
          <path
            d="M10 15c.7.6 3.3.6 4 0"
            stroke="#080808"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-xl font-bold tracking-wide",
            tone === "light" ? "text-cream" : "text-ink",
          )}
        >
          N&apos;KULU
        </span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
          Saveurs Africaines
        </span>
      </span>
    </a>
  );
}
