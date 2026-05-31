"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { navLinks } from "@/data/services";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useOrderChoice } from "@/context/OrderContext";
import { useLang } from "@/context/LangContext";
import { LangToggle } from "@/components/LangToggle";

/** En-tête sticky avec navigation desktop, panier et menu mobile. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-ink/85 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-cream/80 transition hover:text-cream"
            >
              {t(`nav.${link.href}`, link.label)}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle />
          <Link
            href="/compte"
            aria-label={t("cta.account", "Mon compte")}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-cream transition hover:border-gold/60 hover:text-gold"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            aria-label={`Voir le panier (${cartCount} article${cartCount > 1 ? "s" : ""})`}
            onClick={() => setCartOpen(true)}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 text-cream transition hover:border-gold/60 hover:text-gold"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[11px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </button>

          <a href="/commander" className="btn-primary hidden sm:inline-flex">
            {t("cta.order", "Commander")}
          </a>

          <button
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-cream transition hover:border-gold/60 hover:text-gold lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Bandeau contexte de commande (mode + créneau choisis) */}
      {choice && (
        <Link
          href="/commander"
          className="flex items-center justify-center gap-2 bg-gold/90 px-4 py-1.5 text-center text-xs font-semibold text-ink transition hover:bg-gold"
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
