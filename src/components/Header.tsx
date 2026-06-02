"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { navLinks } from "@/data/services";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useOrderChoice } from "@/context/OrderContext";
import { useLang } from "@/context/LangContext";

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
          "border-white/12 bg-[#050505]/72 mx-auto grid h-[76px] w-full max-w-[1540px] grid-cols-[auto_auto] items-center justify-between gap-4 rounded-[28px] border px-4 shadow-[0_22px_70px_-45px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:h-[82px] sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:px-9",
          scrolled &&
            "bg-[#050505]/86 h-[70px] shadow-[0_18px_55px_-42px_rgba(216,154,28,0.5)] sm:h-[74px]",
        )}
      >
        <Logo className="shrink-0" />

        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-cream/86 group relative text-base font-semibold transition hover:text-white"
            >
              {t(`nav.${link.href}`, link.label)}
              <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#D89A1C] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label={`Voir le panier (${cartCount} article${cartCount > 1 ? "s" : ""})`}
            onClick={() => setCartOpen(true)}
            className="relative grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-cream transition hover:-translate-y-0.5 hover:border-[#D89A1C]/70 hover:text-[#D89A1C]"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#D89A1C] text-[11px] font-bold text-[#050505]">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href="/commander"
            className="hidden items-center justify-center rounded-full bg-[#D89A1C] px-8 py-3 text-sm font-bold text-[#050505] shadow-[0_16px_42px_-24px_rgba(216,154,28,0.95)] transition hover:-translate-y-0.5 hover:bg-[#f0ad2f] sm:inline-flex"
          >
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
