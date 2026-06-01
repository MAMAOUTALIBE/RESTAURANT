"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, Send, X } from "lucide-react";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const initialMessage: Message = {
  role: "assistant",
  text: "Bonjour, je peux aider pour le menu, la livraison, une réservation ou une commande.",
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function answerQuestion(input: string) {
  const q = normalize(input);

  if (q.includes("whatsapp") || q.includes("telegram")) {
    return "Ajoutez vos plats au panier, choisissez le créneau, puis utilisez les boutons WhatsApp ou Telegram dans le récapitulatif de commande.";
  }

  if (q.includes("livraison") || q.includes("adresse") || q.includes("code postal")) {
    return "La livraison est prévue sur Paris 11, 12 et 20. Le site vérifie le code postal et le minimum de commande avant validation.";
  }

  if (q.includes("reservation") || q.includes("table") || q.includes("sur place")) {
    return "Pour manger sur place, utilisez la page Réservation. Vous choisissez la date, l'heure, le nombre de personnes et vos coordonnées.";
  }

  if (q.includes("traiteur") || q.includes("evenement") || q.includes("devis")) {
    return "Pour un événement, la page Traiteur permet d'envoyer une demande de devis avec le nombre d'invités, la date et le message.";
  }

  if (q.includes("allerg") || q.includes("halal") || q.includes("vegetar")) {
    return "Indiquez vos contraintes dans les notes de commande. Pour les allergènes, appelez le restaurant avant de valider.";
  }

  if (q.includes("menu") || q.includes("plat") || q.includes("prix") || q.includes("poulet")) {
    return "Le menu contient les plats disponibles avec prix, options et ajout au panier. Les plats populaires sont accessibles depuis la page Menu.";
  }

  if (q.includes("paiement") || q.includes("payer") || q.includes("stripe")) {
    return "La commande se valide d'abord, puis le paiement se fait à l'étape suivante. En production, Stripe peut gérer le paiement réel.";
  }

  if (q.includes("horaire") || q.includes("ouvert")) {
    return "Le service est prévu de 11h à 23h. Les créneaux disponibles sont proposés automatiquement pendant la commande.";
  }

  return "Le plus rapide est de choisir Menu, ajouter vos plats au panier, puis finaliser sur Commander. Pour une demande spéciale, utilisez Contact.";
}

export function AiAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const hidden = useMemo(() => pathname?.startsWith("/admin"), [pathname]);

  if (hidden) return null;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { role: "user", text },
      { role: "assistant", text: answerQuestion(text) },
    ]);
    setValue("");
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 print:hidden">
      {open && (
        <section
          aria-label="Assistant N'KULU"
          className="mb-3 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft shadow-card"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-ink">
                <Bot className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold text-cream">Assistant N&apos;KULU</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-cream/70 transition hover:border-gold/60 hover:text-gold"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "bg-white/[0.08] text-cream/85"
                    : "ml-auto bg-gold text-ink"
                }`}
              >
                {message.text}
              </p>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-white/10 p-3">
            <label htmlFor="assistant-question" className="sr-only">
              Question
            </label>
            <input
              id="assistant-question"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Posez votre question"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-ink px-4 py-2 text-sm text-cream placeholder:text-muted focus:border-gold/60 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Envoyer"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-ink transition hover:bg-gold-400"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label="Ouvrir l'assistant"
        className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-ink-soft px-4 text-sm font-semibold text-cream shadow-card transition hover:border-gold/60 hover:text-gold"
      >
        <Bot className="h-5 w-5" />
        Aide
      </button>
    </div>
  );
}
