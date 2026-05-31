"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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

/** Menu interactif : recherche plein-texte + filtres catégorie / dispo / prix. */
export function MenuBrowser({
  categories,
  dishes,
}: {
  categories: BrowserCategory[];
  dishes: BrowserDish[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");

  const filtered = useMemo(() => {
    let list = dishes.filter((d) => {
      if (cat !== "all" && d.categoryId !== cat) return false;
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
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [dishes, q, cat, onlyAvailable, sort]);

  // Regroupe par catégorie (ordre des catégories), sauf si tri prix actif.
  const grouped = useMemo(() => {
    if (sort !== "default") return null;
    return categories
      .map((c) => ({ cat: c, items: filtered.filter((d) => d.categoryId === c.id) }))
      .filter((g) => g.items.length > 0);
  }, [categories, filtered, sort]);

  return (
    <div>
      {/* Barre de recherche + filtres */}
      <div className="sticky top-20 z-10 -mx-4 mb-8 bg-cream/95 px-4 py-4 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un plat…"
              className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-gold-600 focus:outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-gold-600 focus:outline-none"
          >
            <option value="default">Tri : par catégorie</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-ink/75">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="accent-gold-600" />
            Disponibles
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>Tout</Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-ink/50">Aucun plat ne correspond.</p>
      ) : grouped ? (
        grouped.map((g) => (
          <section key={g.cat.id} id={g.cat.slug} className="mb-12 scroll-mt-44">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{g.cat.name}</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((dish, i) => (
                <Reveal key={dish.id} delay={0.04 * i}>
                  <DishCard dish={dish} unavailable={!dish.available} href={dish.hasOptions ? `/menu/${dish.id}` : undefined} />
                </Reveal>
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dish, i) => (
            <Reveal key={dish.id} delay={0.03 * i}>
              <DishCard dish={dish} unavailable={!dish.available} href={dish.hasOptions ? `/menu/${dish.id}` : undefined} />
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
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active ? "bg-ink text-cream" : "border border-ink/15 text-ink/75 hover:border-gold-600 hover:text-gold-600"
      }`}
    >
      {children}
    </button>
  );
}
