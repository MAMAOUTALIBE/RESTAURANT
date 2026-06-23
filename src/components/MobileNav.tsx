"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, User, ChevronDown } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LangToggle } from "@/components/LangToggle";
import type { NavLink } from "@/types";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  cartCount: number;
}

/** Pages principales (le reste va dans « Autres pages »). */
const PRINCIPAL_HREFS = ["/menu", "/commander", "/reservation", "/contact"];
const SECONDARY_LINKS: NavLink[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGV", href: "/cgv" },
  { label: "Confidentialité", href: "/confidentialite" },
];

/** Panneau de navigation mobile coulissant (hamburger menu). */
export function MobileNav({ open, onClose, links, cartCount }: MobileNavProps) {
  const principal = links.filter((l) => PRINCIPAL_HREFS.includes(l.href));
  const autres = [
    ...links.filter((l) => !PRINCIPAL_HREFS.includes(l.href)),
    ...SECONDARY_LINKS,
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-sm flex-col bg-ink-soft p-6 shadow-card lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={onClose}
                aria-label="Fermer le menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-cream transition hover:border-gold/60 hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 flex-1 overflow-y-auto">
              <NavGroup
                title="Pages principales"
                links={principal}
                onClose={onClose}
                defaultOpen
              />
              <NavGroup title="Autres pages" links={autres} onClose={onClose} />
            </nav>

            <div className="mt-4 space-y-4 border-t border-white/10 pt-5">
              <a
                href="/compte"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-sm font-medium text-cream/75 transition hover:text-gold"
              >
                <User className="h-4 w-4" />
                Mon compte
              </a>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/45">
                  Langue
                </span>
                <LangToggle />
              </div>
            </div>

            {cartCount > 0 && (
              <a
                href="/commander"
                onClick={onClose}
                className="btn-primary mt-4 w-full"
              >
                <ShoppingBag className="h-4 w-4" />
                Finaliser ma commande ({cartCount})
              </a>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** Groupe de liens repliable, aligné à gauche. */
function NavGroup({
  title,
  links,
  onClose,
  defaultOpen = false,
}: {
  title: string;
  links: NavLink[];
  onClose: () => void;
  defaultOpen?: boolean;
}) {
  if (links.length === 0) return null;
  return (
    <details open={defaultOpen} className="group border-b border-white/10">
      <summary className="flex cursor-pointer list-none items-center justify-between px-1 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
        {title}
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="pb-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="block rounded-lg px-3 py-2.5 text-base font-medium text-cream/90 transition hover:bg-white/5 hover:text-gold"
          >
            {link.label}
          </a>
        ))}
      </div>
    </details>
  );
}
