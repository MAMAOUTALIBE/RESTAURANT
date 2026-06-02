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
  const actionButton = unavailable ? (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/10 text-ink/35">
      —
    </span>
  ) : href ? (
    <Link
      href={href}
      aria-label={`Choisir ${dish.name}`}
      className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-gold shadow-[0_8px_22px_-14px_rgba(8,8,8,0.95)] transition hover:scale-105 hover:bg-forest"
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
      className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-gold shadow-[0_8px_22px_-14px_rgba(8,8,8,0.95)] transition hover:scale-105 hover:bg-forest active:scale-95"
    >
      <Plus className="h-5 w-5" />
    </button>
  );

  return (
    <motion.article
      whileHover={{ y: unavailable ? 0 : -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_16px_40px_-30px_rgba(8,8,8,0.62)] transition-shadow duration-300 hover:shadow-[0_22px_52px_-34px_rgba(8,8,8,0.72)]"
    >
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-ink">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, (max-width: 1536px) 30vw, 22vw"
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
        <span className="absolute bottom-3 left-3 rounded-md bg-black/35 px-2 py-1 font-display text-2xl font-bold text-cream backdrop-blur-[2px]">
          {formatPrice(dish.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-4 pt-3.5">
        <h3 className="font-display text-2xl font-semibold leading-tight text-ink">
          {dish.name}
        </h3>
        <div className="mt-1.5 flex flex-1 items-start justify-between gap-3">
          <p className="text-ink/62 line-clamp-2 text-base leading-relaxed">
            {dish.description}
          </p>
          {actionButton}
        </div>
      </div>
    </motion.article>
  );
}
