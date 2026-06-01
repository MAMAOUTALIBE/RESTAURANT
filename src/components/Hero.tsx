"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const slides = [
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-3.jpg",
];

const highlights: { label: string; detail: string; Icon: LucideIcon }[] = [
  {
    label: "À emporter",
    detail: "Prêt au créneau choisi",
    Icon: ShoppingBag,
  },
  {
    label: "Livraison",
    detail: "Paris 11, 12 et 20",
    Icon: MapPin,
  },
  {
    label: "Sur place",
    detail: "Réservation simple",
    Icon: CalendarDays,
  },
];

/** Hero épuré : une promesse claire, deux actions et les infos utiles. */
export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((p) => (p + 1) % slides.length),
      6500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-ink pt-20 text-cream sm:min-h-[76svh] sm:pt-28 lg:min-h-[78vh]"
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            <Image
              src={slides[active]}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.92)_0%,rgba(8,8,8,0.72)_48%,rgba(8,8,8,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="container-page relative flex flex-col justify-center pb-10 pt-6 sm:min-h-[calc(76svh-7rem)] sm:pb-16 lg:min-h-[calc(78vh-7rem)] lg:pb-20">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Cuisine africaine authentique
          </p>
          <h1 className="mt-5 max-w-[11ch] font-display text-4xl font-bold leading-[0.98] sm:text-6xl lg:text-7xl">
            N&apos;KULU Saveurs Africaines
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-cream/78 sm:mt-6 sm:text-lg sm:leading-8">
            Poulet DG, yassa, mafé, bissap maison : une cuisine généreuse à
            commander ou à partager sur place.
          </p>
        </motion.div>

        <motion.div
          className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <Link href="/commander" className="btn-primary">
            <ShoppingBag className="h-4 w-4" />
            Commander
          </Link>
          <Link href="/menu" className="btn-outline">
            <UtensilsCrossed className="h-4 w-4" />
            Voir le menu
          </Link>
        </motion.div>

        <motion.div
          className="mt-8 grid max-w-4xl gap-3 border-t border-cream/15 pt-5 sm:mt-10 sm:grid-cols-3 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.16 }}
        >
          {highlights.map(({ label, detail, Icon }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-ink">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-cream">
                  {label}
                </span>
                <span className="mt-0.5 block text-sm text-cream/62">
                  {detail}
                </span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
