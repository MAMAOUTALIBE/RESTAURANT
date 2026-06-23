import type { Metadata } from "next";
import { ChefHat, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CateringForm } from "@/components/CateringForm";

export const metadata: Metadata = {
  title: "Service traiteur",
  description:
    "Mariages, entreprises, événements : restaurant régale vos invités. Demandez un devis.",
};

const atouts = [
  "Buffets et plateaux pour tous événements",
  "Cuisine turque généreuse et raffinée",
  "Devis personnalisé sous 48 h",
  "De 10 à plusieurs centaines de convives",
];

export default function TraiteurPage() {
  return (
    <>
      <Header />
      <main className="bg-ink pb-12 pt-24 sm:pb-20 sm:pt-28">
        <div className="container-page max-w-4xl">
          <h1 className="mt-2 flex items-center gap-3 font-display text-2xl font-bold text-cream sm:text-4xl">
            <ChefHat className="h-7 w-7 text-gold sm:h-8 sm:w-8" />
            Service traiteur
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:mt-3 sm:text-base">
            Pour vos mariages, événements d&apos;entreprise ou fêtes de famille,
            nous apportons les saveurs de la Turquie à votre table. Décrivez
            votre projet, nous vous envoyons un devis sur mesure.
          </p>

          {/* Mobile : 3 badges courts (la liste détaillée reste sur desktop) */}
          <div className="mt-5 flex flex-wrap gap-2 sm:hidden">
            {["Repas de groupe", "Événements privés", "Devis rapide"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold"
                >
                  {badge}
                </span>
              ),
            )}
          </div>

          <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-2">
            <ul className="hidden space-y-3 sm:block">
              {atouts.map((a) => (
                <li key={a} className="flex items-center gap-3 text-cream/85">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                    <Check className="h-4 w-4" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-white/10 bg-ink-soft p-5 sm:p-8">
              <CateringForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
