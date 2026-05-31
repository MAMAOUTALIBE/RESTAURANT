"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

/** Tiroir latéral affichant le contenu du panier. */
export function CartDrawer() {
  const { items, open, setOpen, updateQuantity, removeItem, clear, totalPrice } =
    useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-[90%] max-w-md flex-col bg-ink-soft shadow-card"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-cream">
                <ShoppingBag className="h-5 w-5 text-gold" />
                Votre panier
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer le panier"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-cream transition hover:border-gold/60 hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-muted" />
                <p className="text-muted">Votre panier est vide.</p>
                <button onClick={() => setOpen(false)} className="btn-primary mt-2">
                  Découvrir nos plats
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-white/10 overflow-y-auto p-5">
                  {items.map((item) => (
                    <li key={item.lineId} className="flex gap-4 py-4 first:pt-0">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-cream">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.lineId)}
                            aria-label={`Retirer ${item.name} du panier`}
                            className="text-muted transition hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {item.options.length > 0 && (
                          <p className="text-xs text-muted">
                            {item.options.map((o) => o.label).join(", ")}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-xs italic text-muted">« {item.note} »</p>
                        )}
                        <span className="text-sm text-gold">
                          {formatPrice(item.unitPrice)}
                        </span>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.lineId, item.quantity - 1)
                              }
                              aria-label={`Diminuer la quantité de ${item.name}`}
                              className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-cream transition hover:border-gold/60 hover:text-gold"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-cream">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.lineId, item.quantity + 1)
                              }
                              aria-label={`Augmenter la quantité de ${item.name}`}
                              className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-cream transition hover:border-gold/60 hover:text-gold"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-display font-bold text-cream">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-muted">Total</span>
                    <span className="font-display text-2xl font-bold text-gold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <a href="/commander" onClick={() => setOpen(false)} className="btn-primary w-full">
                    Passer la commande
                  </a>
                  <button
                    onClick={clear}
                    className="mt-2 w-full text-center text-sm text-muted transition hover:text-cream"
                  >
                    Vider le panier
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
