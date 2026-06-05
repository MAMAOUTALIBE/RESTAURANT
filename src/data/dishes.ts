/**
 * Données de référence des plats (seed initial de la base).
 * La source de vérité en production est la table `Dish` (éditable via le CRM).
 * Voir `prisma/seed.ts` et `src/lib/dishes.ts`.
 */
export interface SeedDish {
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
  sortOrder: number;
}

export const seedDishes: SeedDish[] = [
  {
    slug: "poulet-dg",
    name: "Poulet DG",
    description: "Poulet sauté à la camerounaise avec plantain et légumes",
    price: 15,
    image: "/images/poulet-dg.jpg",
    tag: "Signature",
    sortOrder: 1,
  },
  {
    slug: "riz-jollof",
    name: "Riz Jollof",
    description: "Riz parfumé à la tomate, épices et viande",
    price: 14,
    image: "/images/riz-jollof.jpg",
    sortOrder: 7,
  },
  {
    slug: "tiep-poulet",
    name: "Tiep Poulet",
    description: "Riz sénégalais mijoté aux légumes et poulet braisé",
    price: 16,
    image: "/images/thieboudienne.jpg",
    tag: "Populaire",
    sortOrder: 2,
  },
  {
    slug: "foutou-gombo",
    name: "Foutou & Sauce Gombo",
    description: "Foutou de manioc accompagné de sauce gombo et viande",
    price: 16,
    image: "/images/foutou-gombo.jpg",
    sortOrder: 4,
  },
  {
    slug: "mafe",
    name: "Mafé",
    description: "Sauce à la pâte d'arachide, viande tendre et riz",
    price: 15,
    image: "/images/mafe.jpg",
    sortOrder: 5,
  },
  {
    slug: "yassa-poulet",
    name: "Yassa Poulet",
    description: "Poulet mariné au citron, oignons caramélisés et riz",
    price: 15,
    image: "/images/yassa-poulet.jpg",
    sortOrder: 3,
  },
  {
    slug: "thieboudienne",
    name: "Thieboudienne",
    description: "Riz au poisson et légumes, spécialité sénégalaise",
    price: 16,
    image: "/images/thieboudienne.jpg",
    tag: "Spécialité",
    sortOrder: 6,
  },
];
