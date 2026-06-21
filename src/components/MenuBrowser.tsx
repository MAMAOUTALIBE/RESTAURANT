"use client";

import { useMemo, useState } from "react";
import {
  CakeSlice,
  CupSoda,
  Flame,
  Search,
  Star,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { DishCard } from "@/components/DishCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Dish } from "@/types";

export interface BrowserDish extends Dish {
  available: boolean;
  hasOptions: boolean;
  categoryId: string;
}
export interface BrowserCategory {
  id: string;
  slug: string;
  name: string;
}

type MenuFilter = "all" | "grillades" | "pides" | "desserts" | "boissons";

const quickFilters: {
  id: MenuFilter;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: "all", label: "Tout", Icon: Star },
  { id: "grillades", label: "Grillades", Icon: Flame },
  { id: "pides", label: "Pides", Icon: UtensilsCrossed },
  { id: "desserts", label: "Desserts", Icon: CakeSlice },
  { id: "boissons", label: "Boissons", Icon: CupSoda },
];

const popularDishIds = new Set([
  "kebab-grille",
  "iskender-kebab",
  "lahmacun",
  "baklava",
]);

const dishDetails: Record<string, string[]> = {
  "kebab-grille": ["Sauces au choix", "Supplément fromage", "Gluten"],
  "adana-kebab": ["Grillade épicée", "Sauces au choix", "Gluten"],
  "iskender-kebab": ["Yaourt", "Sauce tomate", "Gluten/lait"],
  lahmacun: ["Citron & salade", "Sauce au choix", "Gluten"],
  "pide-sucuk": ["Fromage", "Supplément sucuk", "Gluten/lait"],
  manti: ["Yaourt à l'ail", "Beurre paprika", "Gluten/lait"],
  kofte: ["Grillade", "Sauces au choix", "Gluten"],
  baklava: ["Pistache/noix", "Portion dessert", "Fruits à coque"],
  sutlac: ["Lait", "Cannelle", "Dessert frais"],
  ayran: ["Boisson fraîche", "Lait", "Sans alcool"],
  "the-turc": ["Chaud", "Traditionnel", "Sans alcool"],
  "sodas-frais": ["Frais", "Canette", "Sans alcool"],
};

/** Menu interactif : recherche plein-texte + filtres catégorie / dispo / prix. */
export function MenuBrowser({
  categories,
  dishes,
}: {
  categories: BrowserCategory[];
  dishes: BrowserDish[];
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<MenuFilter>("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">(
    "default",
  );
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const filtered = useMemo(() => {
    let list = dishes.filter((d) => {
      const category = categoryById.get(d.categoryId);
      if (!matchesQuickFilter(d, category?.slug, filter)) return false;
      if (onlyAvailable && !d.available) return false;
      if (q.trim()) {
        const n = q.toLowerCase();
        return (
          d.name.toLowerCase().includes(n) ||
          d.description.toLowerCase().includes(n)
        );
      }
      return true;
    });
    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [categoryById, dishes, filter, q, onlyAvailable, sort]);

  // Regroupe par catégorie (ordre des catégories), sauf si tri prix actif.
  const grouped = useMemo(() => {
    if (sort !== "default" || filter !== "all" || q.trim()) return null;
    return categories
      .map((c) => ({
        cat: c,
        items: filtered.filter((d) => d.categoryId === c.id),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, filter, filtered, q, sort]);

  return (
    <div>
      {/* Barre de recherche + filtres (sombre, glissée sous la pilule du header) */}
      <div className="sticky top-28 z-10 -mx-4 mb-10 border-b border-white/10 bg-ink/85 px-4 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/35" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un plat…"
              className="w-full rounded-full border border-white/12 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-cream placeholder:text-cream/40 focus:border-gold-400 focus:outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm text-cream focus:border-gold-400 focus:outline-none [&>option]:text-ink"
          >
            <option value="default">Tri : par catégorie</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="accent-gold-400"
            />
            Disponibles
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {quickFilters.map(({ id, label, Icon }) => (
            <Chip key={id} active={filter === id} onClick={() => setFilter(id)}>
              <Icon className="h-4 w-4" />
              {label}
            </Chip>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-cream/70">
          {["Taille", "Sauce", "Boisson", "Supplément"].map((option) => (
            <span
              key={option}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1"
            >
              Option {option}
            </span>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-cream/50">
          Aucun plat ne correspond.
        </p>
      ) : grouped ? (
        grouped.map((g, gi) => (
          <section
            key={g.cat.id}
            id={g.cat.slug}
            className="mb-12 scroll-mt-44"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-display text-sm font-semibold tracking-wider text-gold-400">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">
                {g.cat.name}
              </h2>
              <span className="h-px flex-1 bg-white/10" />
              <span className="shrink-0 text-sm text-cream/40">
                {g.items.length} plat{g.items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((dish, i) => (
                <Reveal key={dish.id} delay={0.04 * i}>
                  <DishCard
                    dish={withDisplayTag(dish)}
                    badges={getDishBadges(dish)}
                    details={getDishDetails(dish)}
                    unavailable={!dish.available}
                    href={dish.hasOptions ? `/menu/${dish.id}` : undefined}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dish, i) => (
            <Reveal key={dish.id} delay={0.03 * i}>
              <DishCard
                dish={withDisplayTag(dish)}
                badges={getDishBadges(dish)}
                details={getDishDetails(dish)}
                unavailable={!dish.available}
                href={dish.hasOptions ? `/menu/${dish.id}` : undefined}
              />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-forest-600 text-cream shadow-[0_10px_26px_-16px_rgba(27,94,54,0.95)]"
          : "border border-white/15 text-cream/70 hover:border-gold-400/50 hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}

function matchesQuickFilter(
  dish: BrowserDish,
  categorySlug: string | undefined,
  filter: MenuFilter,
) {
  const text = `${dish.id} ${dish.name} ${dish.description}`.toLowerCase();
  if (filter === "all") return true;
  if (filter === "desserts") return categorySlug === "desserts";
  if (filter === "boissons") return categorySlug === "boissons";
  if (filter === "pides") return text.includes("pide") || text.includes("lahmacun");
  if (filter === "grillades") {
    return (
      categorySlug === "plats" &&
      ["kebab", "köfte", "kofte", "grill"].some((term) => text.includes(term))
    );
  }
  return true;
}

function withDisplayTag(dish: BrowserDish): BrowserDish {
  if (dish.tag || !popularDishIds.has(dish.id)) return dish;
  return { ...dish, tag: "Populaire" };
}

function getDishBadges(dish: BrowserDish) {
  const badges = [];
  if (popularDishIds.has(dish.id)) badges.push("Populaire");
  if (dish.hasOptions) badges.push("Options");
  return badges;
}

function getDishDetails(dish: BrowserDish) {
  return dishDetails[dish.id] ?? (dish.hasOptions ? ["Taille", "Sauce", "Supplément"] : []);
}
