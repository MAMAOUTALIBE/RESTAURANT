"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, SlidersHorizontal } from "lucide-react";
import type { Dish } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface DishCardProps {
  dish: Dish;
  /** Si fourni, le bouton mène à la fiche plat (plat avec options à choisir). */
  href?: string;
  /** Plat indisponible (épuisé). */
  unavailable?: boolean;
}

/** Carte produit : image, titre, description, prix et action (ajout ou choix). */
export function DishCard({ dish, href, unavailable }: DishCardProps) {
  const { addItem } = useCart();

  return (
    <motion.article
      whileHover={{ y: unavailable ? 0 : -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_18px_60px_-42px_rgba(8,8,8,0.9)]"
    >
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-ink">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-110 ${unavailable ? "grayscale" : ""}`}
        />
        {dish.tag && !unavailable && (
          <span className="bg-cream/92 absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-forest backdrop-blur">
            {dish.tag}
          </span>
        )}
        {unavailable && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-300 backdrop-blur">
            Épuisé
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/80 to-transparent" />
        <span className="absolute bottom-3 left-3 font-display text-2xl font-bold text-cream">
          {formatPrice(dish.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl font-semibold leading-tight text-ink">
          {dish.name}
        </h3>
        <p className="text-ink/62 mt-2 flex-1 text-sm leading-6">
          {dish.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-forest/70">
            N&apos;KULU
          </span>

          {unavailable ? (
            <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-ink/35">
              —
            </span>
          ) : href ? (
            <Link
              href={href}
              aria-label={`Choisir ${dish.name}`}
              className="grid h-10 w-10 place-items-center rounded-full bg-ink text-gold shadow-glow transition hover:scale-105 hover:bg-forest"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Link>
          ) : (
            <button
              onClick={() =>
                addItem({
                  dishId: dish.id,
                  name: dish.name,
                  image: dish.image,
                  basePrice: dish.price,
                })
              }
              aria-label={`Ajouter ${dish.name} au panier`}
              className="grid h-10 w-10 place-items-center rounded-full bg-ink text-gold shadow-glow transition hover:scale-105 hover:bg-forest active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
