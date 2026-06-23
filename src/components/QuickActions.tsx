import Link from "next/link";
import { ShoppingBag, UtensilsCrossed, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";

const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

const tile =
  "flex min-h-[4.25rem] flex-col items-center justify-center gap-1.5 rounded-2xl px-2 text-center transition active:scale-95";
const secondary =
  "border border-white/15 bg-white/[0.04] text-[#F8F3EA] hover:border-[#D89A1C]/60";

/**
 * Actions rapides mobile sous le hero : 3 boutons en grille fixe (1 ligne,
 * sans scroll). Masqué dès la tablette (les CTA sont alors dans le hero).
 */
export function QuickActions() {
  return (
    <nav aria-label="Actions rapides" className="bg-[#050505] sm:hidden">
      <div className="grid grid-cols-3 gap-2 px-4 pb-4 pt-1">
        <Link
          href="/commander"
          className={`${tile} bg-[#D89A1C] text-[#050505] shadow-[0_14px_34px_-20px_rgba(216,154,28,0.95)]`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs font-bold">Commander</span>
        </Link>
        <Link href="/menu" className={`${tile} ${secondary}`}>
          <UtensilsCrossed className="h-5 w-5 text-[#D89A1C]" />
          <span className="text-xs font-bold">Menu</span>
        </Link>
        <a href={phoneHref} className={`${tile} ${secondary}`}>
          <Phone className="h-5 w-5 text-[#D89A1C]" />
          <span className="text-xs font-bold">Appeler</span>
        </a>
      </div>
    </nav>
  );
}
