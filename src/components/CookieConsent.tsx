"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "restaurant-cookie-consent";

/** Bandeau de consentement cookies (RGPD), persisté en localStorage. */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage indisponible : on n'affiche rien.
    }
  }, []);

  function decide(choice: "accepted" | "refused") {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Consentement aux cookies"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-white/10 bg-ink-soft p-4 shadow-card sm:flex sm:items-center sm:gap-5 sm:p-5"
        >
          <p className="text-sm leading-relaxed text-cream/85">
            {/* Version courte sur mobile */}
            <span className="sm:hidden">
              Cookies pour le bon fonctionnement du site et, avec votre accord,
              la mesure d&apos;audience.{" "}
            </span>
            {/* Version complète dès la tablette */}
            <span className="hidden sm:inline">
              Nous utilisons un cookie strictement nécessaire au fonctionnement
              du site. Avec votre accord, nous pourrons aussi mesurer
              l&apos;audience.{" "}
            </span>
            <a href="/confidentialite" className="text-gold underline">
              En savoir plus
            </a>
            .
          </p>
          <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
            <button
              onClick={() => decide("refused")}
              className="flex-1 rounded-full border border-white/15 px-4 py-2.5 text-sm text-cream transition hover:border-white/40 sm:flex-none sm:py-2"
            >
              Refuser
            </button>
            <button
              onClick={() => decide("accepted")}
              className="flex-1 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-400 sm:flex-none sm:py-2"
            >
              Accepter
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
