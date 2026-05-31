import { ArrowRight, Flame, Leaf, Utensils } from "lucide-react";
import { DishCard } from "@/components/DishCard";
import { Reveal } from "@/components/ui/Reveal";
import { getDishes } from "@/lib/dishes";

const highlights = [
  { Icon: Flame, label: "Épices maîtrisées" },
  { Icon: Leaf, label: "Produits frais" },
  { Icon: Utensils, label: "Recettes maison" },
];

/** Grille des plats phares (« Les incontournables »). */
export async function FeaturedDishes() {
  const dishes = await getDishes();
  return (
    <section id="menu" className="section bg-[#F8F3EA] text-ink">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
              Les incontournables
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
              Une carte courte, généreuse, bien exécutée.
            </h2>
            <p className="text-ink/68 mt-4 max-w-xl text-sm leading-7 sm:text-base">
              Des classiques africains reconnaissables, servis avec une
              présentation plus nette et des options simples pour commander
              vite.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:justify-self-end">
            <div className="mb-5 grid gap-2 sm:grid-cols-3 lg:mb-6">
              {highlights.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 border-l border-ink/15 pl-3 text-sm font-semibold text-ink/75"
                >
                  <Icon className="h-4 w-4 text-forest" />
                  {label}
                </div>
              ))}
            </div>
            <a
              href="/menu"
              className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold text-ink transition hover:border-gold-600 hover:text-gold-600"
            >
              Voir tout le menu
              <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <Reveal key={dish.id} delay={0.05 * i}>
              <DishCard dish={dish} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
