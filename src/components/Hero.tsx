"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  MapPin,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-3.jpg",
];
const heroStats = [
  { label: "Service", value: "11h - 23h" },
  { label: "Sur place", value: "Paris 11" },
  { label: "Commande", value: "Click & collect" },
];

/** Section hero : titre, sous-titre, CTAs, badges et slider visuel. */
export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % slides.length),
      5000,
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      id="accueil"
      className="relative min-h-[92vh] overflow-hidden bg-ink pt-24 text-cream sm:pt-28 lg:min-h-[88vh]"
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            <Image
              src={slides[active]}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.94)_0%,rgba(8,8,8,0.78)_42%,rgba(8,8,8,0.42)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="container-page relative grid min-h-[calc(92vh-6rem)] items-center gap-10 pb-16 lg:grid-cols-[1.02fr_0.98fr] lg:pb-20">
        {/* Texte */}
        <div className="max-w-2xl">
          <motion.p
            className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Cuisine africaine authentique
          </motion.p>

          <motion.h1
            className="mt-6 max-w-[12ch] font-display text-5xl font-bold leading-[0.98] sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Saveurs africaines, feu doux et grande table.
          </motion.h1>

          <motion.p
            className="text-cream/78 mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            Poulet DG, yassa, mafé, bissap maison : une carte généreuse,
            préparée minute, à commander en ligne ou à partager sur place.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <Link href="/menu" className="btn-primary">
              <UtensilsCrossed className="h-4 w-4" />
              Voir le menu
            </Link>
            <Link href="/commander" className="btn-outline">
              <ShoppingBag className="h-4 w-4" />
              Commander maintenant
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-cream/15 border-y border-cream/15 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="px-4 first:pl-0 last:pr-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-cream/45">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-cream sm:text-base">
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Slider visuel */}
        <motion.div
          className="relative hidden min-h-[560px] lg:block"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          role="group"
          aria-roledescription="carrousel"
          aria-label="Plats africains N'KULU"
          tabIndex={0}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight")
              setActive((p) => (p + 1) % slides.length);
            if (e.key === "ArrowLeft")
              setActive((p) => (p - 1 + slides.length) % slides.length);
          }}
        >
          <div className="absolute right-0 top-8 w-[76%] overflow-hidden rounded-2xl border border-cream/15 bg-cream/10 p-3 shadow-card backdrop-blur">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image
                src="/images/poulet-dg.jpg"
                alt="Poulet DG N'KULU"
                fill
                sizes="38vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute bottom-12 left-0 w-[48%] overflow-hidden rounded-2xl border border-cream/15 bg-cream/10 p-3 shadow-card backdrop-blur">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/images/riz-jollof.jpg"
                alt="Riz jollof N'KULU"
                fill
                sizes="24vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="bg-ink/82 absolute bottom-24 right-8 w-64 rounded-2xl border border-cream/15 p-5 shadow-card backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest text-gold">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-cream">
                  Prêt rapidement
                </p>
                <p className="text-cream/58 text-xs">À emporter ou livraison</p>
              </div>
            </div>
            <div className="text-cream/64 mt-4 flex items-center gap-2 text-xs">
              <MapPin className="h-4 w-4 text-gold" />
              Paris 11, 12 et 20
            </div>
          </div>

          {/* Points de navigation */}
          <div className="absolute right-4 top-4 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Aller au visuel ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
                  i === active ? "w-7 bg-gold" : "w-2 bg-white/40",
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
