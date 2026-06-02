"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingBag,
  Pencil,
  MessageCircle,
  Send,
  Lock,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useOrderChoice } from "@/context/OrderContext";
import { placeOrder, checkPromo, checkDelivery } from "@/app/actions";
import { OrderStarter } from "@/components/OrderStarter";
import { formatPrice } from "@/lib/utils";
import {
  buildTelegramOrderUrl,
  buildWhatsAppOrderUrl,
  formatSocialOrderMessage,
} from "@/lib/social-order";

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-cream placeholder:text-muted focus:border-gold/60 focus:outline-none";
const TIPS = [0, 1, 2, 5];

export default function CommanderPage() {
  const { items, totalPrice, clear, cartId } = useCart();
  const { choice, clearChoice } = useOrderChoice();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [tip, setTip] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Recalcule les frais de livraison à partir du choix mémorisé.
  useEffect(() => {
    if (choice?.fulfillment === "livraison" && choice.postalCode) {
      checkDelivery(choice.postalCode, totalPrice).then((r) =>
        setDeliveryFee(r.ok ? r.fee : 0),
      );
    } else {
      setDeliveryFee(0);
    }
  }, [choice, totalPrice]);

  const fee = choice?.fulfillment === "livraison" ? deliveryFee : 0;
  const total = Math.max(0, totalPrice - discount) + fee + tip;
  const socialOrderMessage = choice
    ? formatSocialOrderMessage({
        items,
        choice,
        subtotal: totalPrice,
        deliveryFee: fee,
        discount,
        tip,
        total,
        promoCode: promo.trim() || undefined,
      })
    : "";
  const whatsappOrderUrl = socialOrderMessage
    ? buildWhatsAppOrderUrl(socialOrderMessage)
    : "#";
  const telegramOrderUrl = socialOrderMessage
    ? buildTelegramOrderUrl(socialOrderMessage)
    : "#";

  async function applyPromo() {
    if (!promo.trim()) return;
    const r = await checkPromo(promo, totalPrice);
    setPromoMsg({ ok: r.ok, text: r.message });
    setDiscount(r.ok ? (r.discount ?? 0) : 0);
  }

  async function action(formData: FormData) {
    if (!choice) return;
    setSubmitting(true);
    setGlobalError(null);
    setErrors({});
    const lines = items.map((i) => ({
      id: i.dishId,
      name: i.name,
      price: i.unitPrice,
      quantity: i.quantity,
      options: i.options,
      note: i.note,
    }));
    formData.set("items", JSON.stringify(lines));
    formData.set("fulfillment", choice.fulfillment);
    formData.set("tip", String(tip));
    formData.set("cartId", cartId);
    if (choice.scheduledAt) formData.set("scheduledAt", choice.scheduledAt);
    if (choice.fulfillment === "livraison" && choice.postalCode)
      formData.set("postalCode", choice.postalCode);
    if (discount > 0 && promo.trim()) formData.set("promoCode", promo.trim());

    const result = await placeOrder(null, formData);
    if (result.ok && result.reference) {
      clear();
      clearChoice();
      window.location.assign(`/commande/${result.reference}`);
      return;
    }
    setErrors(result.errors ?? {});
    setGlobalError(result.message);
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-ink pb-20 pt-28">
      <div className="container-page max-w-5xl">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au menu
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-cream sm:text-4xl">
          Finaliser ma commande
        </h1>

        {items.length > 0 && (
          <StepIndicator current={choice ? 2 : 1} />
        )}

        {items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-ink-soft p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-muted" />
            <p className="text-muted">Votre panier est vide.</p>
            <Link href="/menu" className="btn-primary">
              Voir le menu
            </Link>
          </div>
        ) : !choice ? (
          /* ÉTAPE 1 — mode + calendrier (entrée de commande) */
          <div className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-ink-soft p-6">
            <OrderStarter subtotal={totalPrice} />
          </div>
        ) : (
          /* ÉTAPE 2 — récap + coordonnées */
          <>
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/5 px-5 py-3">
              <p className="text-sm text-cream">
                <span className="font-semibold">{choice.label}</span>
              </p>
              <button
                onClick={clearChoice}
                className="inline-flex items-center gap-1.5 text-sm text-gold transition hover:underline"
              >
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </button>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              {/* Récap */}
              <section aria-label="Récapitulatif">
                <h2 className="font-display text-xl font-semibold text-cream">
                  Récapitulatif
                </h2>
                <ul className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-ink-soft p-5">
                  {items.map((item) => (
                    <li
                      key={item.lineId}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-cream">{item.name}</p>
                        {item.options.length > 0 && (
                          <p className="text-xs text-muted">
                            {item.options.map((o) => o.label).join(", ")}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-xs italic text-muted">
                            « {item.note} »
                          </p>
                        )}
                        <p className="text-sm text-muted">
                          {item.quantity} × {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <span className="font-display font-bold text-cream">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value.toUpperCase())}
                    placeholder="Code promo"
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="shrink-0 rounded-xl border border-gold/40 px-4 text-sm font-semibold text-gold transition hover:bg-gold/10"
                  >
                    Appliquer
                  </button>
                </div>
                {promoMsg && (
                  <p
                    className={`mt-1 text-xs ${promoMsg.ok ? "text-green-400" : "text-red-400"}`}
                  >
                    {promoMsg.text}
                  </p>
                )}

                <div className="mt-4 space-y-2 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4 text-sm">
                  <div className="flex justify-between text-cream/80">
                    <span>Sous-total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Remise{promo ? ` (${promo})` : ""}</span>
                      <span>− {formatPrice(discount)}</span>
                    </div>
                  )}
                  {fee > 0 && (
                    <div className="flex justify-between text-cream/80">
                      <span>Livraison</span>
                      <span>{formatPrice(fee)}</span>
                    </div>
                  )}
                  {tip > 0 && (
                    <div className="flex justify-between text-cream/80">
                      <span>Pourboire</span>
                      <span>{formatPrice(tip)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-2 font-display text-2xl font-bold text-gold">
                    <span className="text-base text-cream">Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  {/* Fidélité : 1 point par euro (cf. lib/loyalty.ts). */}
                  {Math.floor(total) > 0 && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-gold">
                      <Sparkles className="h-3.5 w-3.5" />
                      Vous gagnerez {Math.floor(total)} point
                      {Math.floor(total) > 1 ? "s" : ""} de fidélité
                    </p>
                  )}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-ink-soft p-5">
                  <p className="text-sm font-semibold text-cream">
                    Commander par messagerie
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Le message reprend le panier, le créneau et le total estimé.
                    Vous confirmez ensuite vos coordonnées dans
                    l&apos;application.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <a
                      href={whatsappOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200 transition hover:border-green-300 hover:bg-green-500/15"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <a
                      href={telegramOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-200 transition hover:border-sky-300 hover:bg-sky-500/15"
                    >
                      <Send className="h-4 w-4" />
                      Telegram
                    </a>
                  </div>
                </div>
              </section>

              {/* Coordonnées */}
              <section aria-label="Vos coordonnées">
                <h2 className="font-display text-xl font-semibold text-cream">
                  Vos coordonnées
                </h2>
                <form action={action} className="mt-4 space-y-4">
                  <Field id="name" label="Nom complet" error={errors.name} />
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    error={errors.email}
                    onBlur={(v) => {
                      if (v && cartId) {
                        fetch("/api/cart", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            cartId,
                            email: v,
                            items: items.map((i) => ({
                              name: i.name,
                              quantity: i.quantity,
                              unitPrice: i.unitPrice,
                            })),
                          }),
                        }).catch(() => {});
                      }
                    }}
                  />
                  <Field
                    id="phone"
                    label="Téléphone"
                    type="tel"
                    error={errors.phone}
                  />
                  {choice.fulfillment === "livraison" && (
                    <Field
                      id="address"
                      label="Adresse de livraison"
                      error={errors.address}
                    />
                  )}
                  <div>
                    <span className="mb-1.5 block text-sm text-cream/80">
                      Pourboire
                    </span>
                    <div className="flex gap-2">
                      {TIPS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTip(t)}
                          className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${tip === t ? "border-gold bg-gold/10 text-cream" : "border-white/10 text-cream/70 hover:border-white/30"}`}
                        >
                          {t === 0 ? "Aucun" : `${t} €`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="notes"
                      className="mb-1.5 block text-sm text-cream/80"
                    >
                      Notes (optionnel)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={2}
                      className={fieldClass}
                    />
                  </div>
                  {globalError && (
                    <p role="alert" className="text-sm text-red-400">
                      {globalError}
                    </p>
                  )}
                  <div className="sticky bottom-3 z-10 rounded-2xl bg-ink-soft/95 p-1 shadow-card backdrop-blur lg:static lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full disabled:opacity-60"
                    >
                      {submitting
                        ? "Validation…"
                        : `Valider — ${formatPrice(total)}`}
                    </button>
                    <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
                      <Lock className="h-3 w-3" />
                      Paiement sécurisé à l&apos;étape suivante.
                    </p>
                  </div>
                </form>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

/** Indicateur d'étapes du checkout (1 = mode/créneau, 2 = coordonnées). */
function StepIndicator({ current }: { current: 1 | 2 }) {
  const steps = [
    { n: 1, label: "Mode & créneau" },
    { n: 2, label: "Coordonnées & paiement" },
  ];
  return (
    <ol className="mt-6 flex items-center gap-3">
      {steps.map((s, i) => {
        const active = current === s.n;
        const done = current > s.n;
        return (
          <li key={s.n} className="flex flex-1 items-center gap-3">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                active
                  ? "bg-gold text-ink"
                  : done
                    ? "bg-gold/30 text-gold"
                    : "bg-white/10 text-cream/50"
              }`}
            >
              {s.n}
            </span>
            <span
              className={`text-xs font-medium sm:text-sm ${active ? "text-cream" : "text-cream/50"}`}
            >
              {s.label}
            </span>
            {i === 0 && (
              <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  id,
  label,
  type = "text",
  error,
  onBlur,
}: {
  id: string;
  label: string;
  type?: string;
  error?: string;
  onBlur?: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-cream/80">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        className={fieldClass}
        onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
