"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  MapPin,
  MessageCircle,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const serviceHighlights: {
  title: string;
  detail: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "À emporter",
    detail: "Prêt au créneau choisi",
    Icon: ShoppingBag,
  },
  {
    title: "Livraison",
    detail: "Juvisy et alentours",
    Icon: MapPin,
  },
  {
    title: "Sur place",
    detail: "Réservation simple",
    Icon: UtensilsCrossed,
  },
  {
    title: "Ingrédients frais",
    detail: "Qualité garantie",
    Icon: Leaf,
  },
];

const heroSlides = [
  {
    label: "Grillades turques",
    src: "/images/hero-slide-grillades-turques.png",
    alt: "Plateau de grillades turques avec kebab, köfte, riz, boulgour, légumes grillés et sauces",
  },
  {
    label: "Adana kebab",
    src: "/images/hero-slide-adana-kebab.png",
    alt: "Adana kebab grillé avec lavash, boulgour, piments, tomates, oignons rouges et sauces",
  },
  {
    label: "Pide et lahmacun",
    src: "/images/hero-slide-pide-lahmacun.png",
    alt: "Pide au sucuk et lahmacun croustillant servis avec citron, herbes et sauces",
  },
  {
    label: "Desserts turcs",
    src: "/images/hero-slide-desserts-turcs.png",
    alt: "Baklava, künefe, loukoums, pistaches, thé turc et café turc sur table sombre",
  },
  {
    label: "Boissons turques",
    src: "/images/hero-slide-boissons-turques.png",
    alt: "Ayran, thé turc, café turc, jus de grenade et limonade à la menthe",
  },
] as const;

const HERO_SLIDE_INTERVAL_MS = 5600;

/** Hero premium : promesse forte, image immersive et réassurance immédiate. */
export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (prefersReducedMotion.matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, HERO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-[#050505] px-4 pb-8 pt-[6.75rem] text-cream sm:px-6 sm:pb-10 lg:min-h-[690px] lg:pt-[7.35rem]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={slide.src}
            aria-hidden={index !== activeSlide}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: index === activeSlide ? 1 : 0,
              scale: index === activeSlide ? 1.055 : 1.015,
            }}
            transition={{
              opacity: { duration: 1.05, ease: "easeInOut" },
              scale: { duration: 6.2, ease: "easeOut" },
            }}
          >
            <Image
              src={slide.src}
              alt={index === activeSlide ? slide.alt : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              className="origin-right object-cover object-[56%_60%] brightness-[1.08] contrast-[1.08] saturate-[1.08] sm:object-[58%_60%] lg:object-[58%_62%]"
            />
          </motion.div>
        ))}
        <div
          className="via-black/38 absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/75 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[1540px] flex-col gap-6 lg:gap-7">
        <div className="flex min-h-[470px] items-center pb-2 sm:min-h-[500px] lg:min-h-[535px]">
          <motion.div
            className="relative z-20 -mt-[4.5rem] max-w-[650px] py-4 sm:-mt-[5.5rem] lg:-mt-[6.75rem] lg:pl-2 xl:pl-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div
              className="pointer-events-none absolute -bottom-5 -left-5 -right-8 -top-5 bg-[linear-gradient(90deg,rgba(5,5,5,0.76)_0%,rgba(5,5,5,0.58)_56%,rgba(5,5,5,0.18)_82%,transparent_100%)] sm:-left-7 lg:-bottom-8 lg:-left-10 lg:-right-24 lg:-top-8"
              aria-hidden
            />

            <div className="relative z-10">
              <h1 className="font-display text-5xl font-bold leading-[0.98] text-[#F8F3EA] drop-shadow-[0_3px_8px_rgba(0,0,0,0.96)] sm:text-6xl lg:text-[4.15rem] xl:text-[4.8rem]">
                <span className="block text-[#D89A1C]">Restaurant</span>
              </h1>

              <p className="text-[#F8F3EA]/94 mt-5 max-w-xl text-lg font-semibold leading-7 drop-shadow-[0_2px_5px_rgba(0,0,0,0.98)] sm:text-xl sm:leading-8">
                Spécialités turques grillées, à emporter ou en livraison.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/commander"
                  className="inline-flex min-h-[3.75rem] items-center justify-center gap-3 rounded-full bg-[#D89A1C] px-10 py-3.5 text-lg font-black text-[#050505] shadow-[0_24px_58px_-24px_rgba(216,154,28,0.98)] transition hover:-translate-y-1 hover:bg-[#f0ad2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D89A1C]/70"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Commander
                </Link>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366]/16 hover:bg-[#25D366]/24 inline-flex min-h-[3.75rem] items-center justify-center gap-3 rounded-full border border-[#25D366]/70 px-8 py-3.5 text-base font-bold text-[#F8F3EA] transition hover:-translate-y-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/70"
                >
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  WhatsApp
                </a>
                <span className="hidden basis-full sm:block" aria-hidden />
                <Link
                  href="/menu"
                  className="border-white/26 bg-black/22 inline-flex min-h-[3rem] items-center justify-center gap-2.5 rounded-full border px-6 py-2.5 text-sm font-bold text-[#F8F3EA] transition hover:-translate-y-1 hover:border-[#D89A1C]/70 hover:bg-black/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Voir le menu
                </Link>
              </div>

              <div
                className="mt-5 flex items-center gap-2"
                aria-label="Images du hero"
              >
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    aria-label={`Afficher ${slide.label}`}
                    aria-current={index === activeSlide ? "true" : undefined}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D89A1C]/70 ${
                      index === activeSlide
                        ? "w-8 bg-[#D89A1C]"
                        : "w-2 bg-white/45 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          aria-label="Services disponibles"
          className="bg-black/48 relative z-20 overflow-hidden rounded-[28px] border border-white/10 shadow-[0_22px_60px_-34px_rgba(216,154,28,0.95)] backdrop-blur-[2px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {serviceHighlights.map(({ title, detail, Icon }) => (
              <div
                key={title}
                className="flex items-center gap-4 border-t border-white/10 px-5 py-4 first:border-t-0 sm:px-6 lg:border-l lg:border-t-0 lg:px-7 lg:first:border-l-0"
              >
                <span className="border-[#D89A1C]/58 bg-black/28 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-[#D89A1C] sm:h-14 sm:w-14">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-black leading-tight text-[#F8F3EA] sm:text-xl">
                    {title}
                  </span>
                  <span className="text-[#F8F3EA]/78 mt-1 block text-sm font-medium leading-snug sm:text-base">
                    {detail}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
