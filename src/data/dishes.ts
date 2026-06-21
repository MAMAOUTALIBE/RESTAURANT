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
    slug: "kebab-grille",
    name: "Kebab grillé",
    description: "Viande marinée aux épices turques, riz pilav et crudités",
    price: 15,
    image: "/images/hero-slide-grillades-turques.png",
    tag: "Signature",
    sortOrder: 1,
  },
  {
    slug: "adana-kebab",
    name: "Adana kebab",
    description: "Brochette hachée relevée, boulgour, salade et pain chaud",
    price: 14,
    image: "/images/hero-slide-adana-kebab.png",
    sortOrder: 7,
  },
  {
    slug: "iskender-kebab",
    name: "Iskender kebab",
    description: "Lamelles de viande, pain pide, sauce tomate et yaourt",
    price: 16,
    image: "/images/hero-slide-grillades-turques.png",
    tag: "Populaire",
    sortOrder: 2,
  },
  {
    slug: "lahmacun",
    name: "Lahmacun",
    description: "Fine pâte garnie de viande épicée, persil, citron et salade",
    price: 16,
    image: "/images/hero-slide-pide-lahmacun.png",
    sortOrder: 4,
  },
  {
    slug: "pide-sucuk",
    name: "Pide sucuk fromage",
    description: "Pain turc garni de sucuk, fromage fondant et herbes",
    price: 15,
    image: "/images/hero-slide-pide-lahmacun.png",
    sortOrder: 5,
  },
  {
    slug: "manti",
    name: "Manti",
    description: "Raviolis turcs au boeuf, yaourt à l'ail et beurre paprika",
    price: 15,
    image: "/images/hero-slide-pide-lahmacun.png",
    sortOrder: 3,
  },
  {
    slug: "kofte",
    name: "Köfte",
    description: "Boulettes grillées aux herbes, boulgour et légumes",
    price: 16,
    image: "/images/hero-slide-grillades-turques.png",
    tag: "Spécialité",
    sortOrder: 6,
  },
];
