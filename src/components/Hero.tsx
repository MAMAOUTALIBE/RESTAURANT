"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  MapPin,
  ShoppingBag,
  Star,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const trustSignals: { label: string; Icon: LucideIcon }[] = [
  { label: "4.8/5 Google", Icon: Star },
  { label: "Livraison rapide", Icon: Truck },
  { label: "Produits frais", Icon: Leaf },
];

const advantages: { label: string; detail: string; Icon: LucideIcon }[] = [
  {
    label: "À emporter",
    detail: "Prêt au créneau choisi",
    Icon: ShoppingBag,
  },
  {
    label: "Livraison",
    detail: "Juvisy et alentours",
    Icon: MapPin,
  },
  {
    label: "Sur place",
    detail: "Réservation simple",
    Icon: UtensilsCrossed,
  },
  {
    label: "Ingrédients frais",
    detail: "Qualité garantie",
    Icon: Leaf,
  },
];

/** Hero premium : promesse forte, image immersive et réassurance immédiate. */
export function Hero() {
  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-[#050505] px-4 pb-5 pt-[6.75rem] text-cream sm:px-6 sm:pb-6 lg:min-h-[760px] lg:pt-[7.35rem]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_34%,rgba(216,154,28,0.22),transparent_25%),radial-gradient(circle_at_72%_18%,rgba(216,154,28,0.16),transparent_28%),linear-gradient(180deg,#050505_0%,#070707_52%,#050505_100%)]" />
        <div className="absolute inset-y-0 left-0 w-[58%] bg-[linear-gradient(90deg,rgba(5,5,5,0.98)_0%,rgba(5,5,5,0.88)_56%,rgba(5,5,5,0.22)_86%,transparent_100%)]" />
        <div className="bg-[#D89A1C]/8 absolute bottom-0 left-1/2 h-72 w-[68vw] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1540px] flex-col gap-6 lg:gap-7">
        <div className="grid items-center gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-5 xl:gap-7">
          <motion.div
            className="relative z-20 max-w-[590px] lg:pl-2 xl:pl-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="bg-[#D89A1C]/12 pointer-events-none absolute -left-10 top-16 h-52 w-52 rounded-full blur-3xl" />

            <h1 className="relative font-display text-5xl font-bold leading-[0.98] text-[#F8F3EA] sm:text-6xl lg:text-[4.25rem] xl:text-[5rem] 2xl:text-[5.25rem]">
              <span className="block">AFRO MK</span>
              <span className="block text-[#D89A1C]">LO BOKO</span>
            </h1>

            <div
              className="mt-4 flex items-center gap-4 text-[#D89A1C]"
              aria-hidden
            >
              <span className="h-px w-16 bg-[#D89A1C]/70" />
              <UtensilsCrossed className="h-5 w-5" />
              <span className="h-px w-16 bg-[#D89A1C]/70" />
            </div>

            <p className="text-[#F8F3EA]/84 mt-5 max-w-lg text-base leading-7 sm:text-lg sm:leading-8">
              La saveur de l&apos;Afrique dans votre assiette : Poulet DG,
              yassa, mafé et bissap maison à commander ou à partager sur place.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/commander"
                className="inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-full bg-[#D89A1C] px-8 py-3 text-base font-bold text-[#050505] shadow-[0_18px_48px_-24px_rgba(216,154,28,0.95)] transition hover:-translate-y-1 hover:bg-[#f0ad2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D89A1C]/70"
              >
                <ShoppingBag className="h-5 w-5" />
                Commander
              </Link>
              <Link
                href="/menu"
                className="border-white/28 inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-full border bg-white/[0.04] px-8 py-3 text-base font-bold text-[#F8F3EA] backdrop-blur transition hover:-translate-y-1 hover:border-[#D89A1C]/70 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <UtensilsCrossed className="h-5 w-5" />
                Voir le menu
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {trustSignals.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="border-white/12 text-[#F8F3EA]/88 inline-flex items-center gap-2 rounded-full border bg-white/[0.05] px-3.5 py-1.5 text-sm font-semibold backdrop-blur"
                >
                  <Icon className="h-4 w-4 fill-[#D89A1C] text-[#D89A1C]" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative z-10 mx-auto w-full max-w-[860px] lg:mr-0 lg:max-w-[900px]"
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="absolute -inset-6 rounded-full bg-[#D89A1C]/10 blur-3xl" />
            <div className="border-white/8 relative aspect-[16/9] overflow-hidden rounded-[26px] border bg-[#080808]/35 shadow-[0_24px_80px_-58px_rgba(216,154,28,0.72)] backdrop-blur-sm">
              <Image
                src="/images/hero-premium-poulet-dg.png"
                alt="Poulet DG gastronomique fumant avec riz, légumes et plantains"
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="scale-[0.985] object-cover [object-position:right_center]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.66)_0%,rgba(5,5,5,0.24)_28%,rgba(5,5,5,0.05)_64%,rgba(5,5,5,0.16)_100%)]" />
              <div className="absolute inset-y-0 -left-2 w-1/3 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.48)_42%,transparent_100%)]" />
            </div>
          </motion.div>
        </div>

        <motion.div
          aria-label="Services disponibles"
          className="bg-black/42 relative z-20 overflow-hidden rounded-[26px] border border-white/10 shadow-[0_22px_70px_-58px_rgba(0,0,0,0.95)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
        >
          <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
            {advantages.map(({ label, detail, Icon }, index) => (
              <div
                key={label}
                className="flex items-start gap-2.5 border-white/10 p-3 sm:items-center sm:gap-3.5 sm:p-4 lg:border-l lg:first:border-l-0"
              >
                <span className="bg-[#D89A1C]/12 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#D89A1C]/65 text-[#D89A1C] sm:h-11 sm:w-11">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#F8F3EA] sm:text-lg">
                    {label}
                  </span>
                  <span className="text-[#F8F3EA]/64 mt-1 block text-xs sm:text-sm">
                    {detail}
                  </span>
                </span>
                {index < advantages.length - 1 && (
                  <span
                    className="ml-auto hidden h-12 w-px bg-white/10 lg:block"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
