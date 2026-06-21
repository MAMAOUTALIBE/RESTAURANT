"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { navLinks } from "@/data/services";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useOrderChoice } from "@/context/OrderContext";
import { useLang } from "@/context/LangContext";
import { siteConfig } from "@/lib/config";

/** Liens masqués dans l'en-tête pour l'aérer (restent accessibles via footer). */
const HEADER_HIDDEN_HREFS = ["/commander", "/traiteur", "/contact"];
const headerLinks = navLinks.filter(
  (link) => !HEADER_HIDDEN_HREFS.includes(link.href),
);
const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

/** En-tête sticky avec navigation desktop, panier et menu mobile. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalCount: cartCount, setOpen: setCartOpen } = useCart();
  const { choice } = useOrderChoice();
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-4 z-50 px-4 transition-all duration-300 sm:px-6",
        scrolled && "top-3",
      )}
    >
      <div
        className={cn(
          "mx-auto grid h-[76px] w-full max-w-[1540px] grid-cols-[auto_auto] items-center justify-between gap-4 rounded-[28px] border border-gold/35 bg-[linear-gradient(110deg,rgba(5,5,5,0.94)_0%,rgba(19,16,12,0.92)_45%,rgba(77,50,9,0.55)_100%)] px-4 shadow-[0_22px_70px_-45px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:h-[82px] sm:px-6 lg:h-[96px] lg:grid-cols-[auto_auto_minmax(280px,0.78fr)_auto] lg:gap-7 lg:px-7 xl:px-8",
          scrolled &&
            "h-[70px] border-gold/45 bg-[linear-gradient(110deg,rgba(5,5,5,0.96)_0%,rgba(19,16,12,0.94)_45%,rgba(77,50,9,0.62)_100%)] shadow-[0_18px_55px_-42px_rgba(216,154,28,0.5)] sm:h-[74px] lg:h-[86px]",
        )}
      >
        <div className="flex min-w-0 items-center gap-6">
          <Logo className="shrink-0" />
          <span
            className="hidden h-12 w-px bg-gold/25 lg:block"
            aria-hidden
          />
        </div>

        <nav className="hidden items-center justify-center gap-7 lg:flex">
          {headerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative inline-flex items-center gap-2.5 text-base font-semibold text-cream/88 transition hover:text-white"
            >
              {link.href === "/reservation" ? (
                <CalendarDays className="h-5 w-5 text-[#D89A1C]" />
              ) : (
                <UtensilsCrossed className="h-5 w-5 text-[#D89A1C]" />
              )}
              {t(`nav.${link.href}`, link.label)}
              <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#D89A1C] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <form
          action="/menu"
          className="hidden h-16 min-w-0 items-center gap-3 rounded-full border border-white/28 bg-black/32 px-5 text-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition focus-within:border-gold/70 xl:flex"
          role="search"
        >
          <Search className="h-5 w-5 shrink-0 text-[#D89A1C]" />
          <input
            name="q"
            type="search"
            aria-label="Rechercher un plat ou une boisson"
            placeholder="Rechercher un plat, une boisson..."
            className="min-w-0 flex-1 bg-transparent text-base font-medium text-cream placeholder:text-cream/46 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Lancer la recherche"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-cream/80 transition hover:bg-white/[0.08] hover:text-gold"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </form>

        <div className="flex items-center gap-3 lg:gap-4">
          <a
            href={phoneHref}
            className="hidden min-h-[3rem] items-center justify-center gap-2 rounded-full border border-white/15 bg-black/28 px-4 py-2 text-sm font-bold text-cream transition hover:-translate-y-0.5 hover:border-[#D89A1C]/70 hover:text-[#D89A1C] 2xl:inline-flex"
          >
            <Phone className="h-4 w-4 text-[#D89A1C]" />
            {siteConfig.contact.phone}
          </a>

          <a
            href={siteConfig.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-[3rem] items-center justify-center gap-2 rounded-full border border-[#25D366]/45 bg-[#25D366]/12 px-4 py-2 text-sm font-bold text-cream transition hover:-translate-y-0.5 hover:border-[#25D366] hover:bg-[#25D366]/20 lg:inline-flex"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            WhatsApp
          </a>

          <button
            aria-label={`Voir le panier (${cartCount} article${cartCount > 1 ? "s" : ""})`}
            onClick={() => setCartOpen(true)}
            className="relative grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-cream transition hover:-translate-y-0.5 hover:border-[#D89A1C]/70 hover:text-[#D89A1C] lg:h-14 lg:w-14"
          >
            <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#D89A1C] text-[11px] font-bold text-[#050505]">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href="/commander"
            className="hidden min-h-[3.5rem] items-center justify-center gap-3 rounded-full bg-[#D89A1C] px-8 py-3 text-base font-bold text-[#050505] shadow-[0_16px_42px_-24px_rgba(216,154,28,0.95)] transition hover:-translate-y-0.5 hover:bg-[#f0ad2f] sm:inline-flex lg:px-9"
          >
            <ShoppingBag className="h-5 w-5" />
            {t("cta.order", "Commander")}
          </a>

          <button
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-cream transition hover:border-[#D89A1C]/70 hover:text-[#D89A1C] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {choice && pathname === "/commander" && (
        <Link
          href="/commander"
          className="mx-auto mt-2 flex w-fit items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/90 px-4 py-1.5 text-center text-xs font-semibold text-ink shadow-[0_10px_28px_-18px_rgba(216,154,28,0.9)] transition hover:bg-gold"
        >
          {choice.label} · modifier
        </Link>
      )}

      <MobileNav
        open={open}
        onClose={() => setOpen(false)}
        links={navLinks}
        cartCount={cartCount}
      />
    </header>
  );
}
