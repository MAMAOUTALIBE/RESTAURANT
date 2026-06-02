import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DishCard } from "@/components/DishCard";
import { getMenuForBrowser } from "@/lib/dishes";

/** Grille des plats phares (« Les incontournables »). */
export async function FeaturedDishes() {
  const { dishes } = await getMenuForBrowser();
  const featured = dishes.filter((dish) => dish.available).slice(0, 4);
  return (
    <section
      id="menu"
      className="bg-[#F8F3EA] pb-16 pt-6 text-ink sm:pb-20 sm:pt-8 lg:pb-24 lg:pt-10"
    >
      <div className="container-page">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between xl:gap-6">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
                Une carte courte, généreuse, bien exécutée.
              </h2>
            </div>
            <div className="xl:shrink-0">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink shadow-[0_12px_26px_-16px_rgba(239,164,29,0.95)] transition hover:-translate-y-0.5 hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
              >
                Voir tout le menu
                <ArrowRight className="h-4 w-4 motion-safe:animate-pulse" />
              </Link>
            </div>
          </div>
          <div className="max-w-4xl">
            <p className="text-ink/68 text-sm leading-7 sm:text-base">
              Des classiques africains, une présentation soignée et une commande
              rapide.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((dish) => (
            <div key={dish.id}>
              <DishCard
                dish={dish}
                href={dish.hasOptions ? `/menu/${dish.id}` : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
