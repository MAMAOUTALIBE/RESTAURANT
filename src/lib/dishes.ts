import "server-only";
import type { Dish as DishRow } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Dish } from "@/types";

const dishImageOverrides: Record<string, string> = {
  "adana-kebab": "/images/hero-slide-adana-kebab.png",
  ayran: "/images/hero-slide-boissons-turques.png",
  baklava: "/images/hero-slide-desserts-turcs.png",
  "borek-fromage": "/images/hero-slide-pide-lahmacun.png",
  houmous: "/images/hero-slide-pide-lahmacun.png",
  "iskender-kebab": "/images/hero-slide-grillades-turques.png",
  "kebab-grille": "/images/hero-slide-grillades-turques.png",
  kofte: "/images/hero-slide-grillades-turques.png",
  lahmacun: "/images/hero-slide-pide-lahmacun.png",
  manti: "/images/hero-slide-pide-lahmacun.png",
  "mercimek-corbasi": "/images/hero-slide-pide-lahmacun.png",
  "pide-sucuk": "/images/hero-slide-pide-lahmacun.png",
  "sodas-frais": "/images/hero-slide-boissons-turques.png",
  sutlac: "/images/hero-slide-desserts-turcs.png",
  "the-turc": "/images/hero-slide-boissons-turques.png",
};

function resolveDishImage(row: Pick<DishRow, "slug" | "image">): string {
  return dishImageOverrides[row.slug] ?? row.image;
}

function withDishPresentation<T extends { slug: string; image: string }>(
  row: T,
): T {
  return {
    ...row,
    image: dishImageOverrides[row.slug] ?? row.image,
  };
}

/** Convertit une ligne Prisma en `Dish` applicatif (id = slug, stable). */
function toDish(row: DishRow): Dish {
  return {
    id: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    image: resolveDishImage(row),
    tag: row.tag ?? undefined,
  };
}

/** Plats visibles sur le site public (disponibles, triés). */
export async function getDishes(): Promise<Dish[]> {
  const rows = await prisma.dish.findMany({
    where: { available: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    distinct: ["slug"],
  });
  return rows.map(toDish);
}

/** Données back-office du menu : catégories + plats (avec catégorie & options). */
export async function getAdminMenuData() {
  const [categories, dishes] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      distinct: ["slug"],
    }),
    prisma.dish.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      distinct: ["slug"],
      include: {
        category: true,
        optionGroups: {
          orderBy: { sortOrder: "asc" },
          include: { options: { orderBy: { sortOrder: "asc" } } },
        },
      },
    }),
  ]);
  return { categories, dishes };
}

export interface MenuDish extends Dish {
  available: boolean;
  hasOptions: boolean;
}
export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  dishes: MenuDish[];
}

/** Menu public structuré par catégories (plats disponibles ou épuisés). */
export async function getMenu(): Promise<MenuCategory[]> {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    distinct: ["slug"],
    include: {
      dishes: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        distinct: ["slug"],
        include: { _count: { select: { optionGroups: true } } },
      },
    },
  });
  return categories
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      dishes: c.dishes.map((d) => ({
        ...toDish(d),
        available: d.available,
        hasOptions: d._count.optionGroups > 0,
      })),
    }))
    .filter((c) => c.dishes.length > 0);
}

/** Données du menu pour le browser interactif : catégories + plats à plat. */
export async function getMenuForBrowser() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    distinct: ["slug"],
  });
  const categoryIds = categories.map((c) => c.id);

  const rows = await prisma.dish.findMany({
    where: { categoryId: { in: categoryIds } },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    distinct: ["slug"],
    include: { _count: { select: { optionGroups: true } } },
  });

  return {
    categories: categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
    })),
    dishes: rows
      .filter((d) => d.categoryId)
      .map((d) => ({
        ...toDish(d),
        available: d.available,
        hasOptions: d._count.optionGroups > 0,
        categoryId: d.categoryId as string,
      })),
  };
}

/** Fiche plat complète avec ses groupes d'options (pour la page détail). */
export async function getDishWithOptions(slug: string) {
  const dish = await prisma.dish.findFirst({
    where: { slug },
    orderBy: { id: "asc" },
    include: {
      category: true,
      optionGroups: {
        orderBy: { sortOrder: "asc" },
        include: { options: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
  return dish ? withDishPresentation(dish) : null;
}
