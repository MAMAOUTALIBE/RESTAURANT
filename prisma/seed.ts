import { PrismaClient } from "@prisma/client";
import { seedDishes } from "../src/data/dishes";

const prisma = new PrismaClient();

const categories = [
  { slug: "entrees", name: "Entrées turques", sortOrder: 1 },
  { slug: "plats", name: "Plats turcs", sortOrder: 2 },
  { slug: "desserts", name: "Desserts turcs", sortOrder: 3 },
  { slug: "boissons", name: "Boissons turques", sortOrder: 4 },
];

const extraDishes = [
  {
    slug: "houmous",
    name: "Houmous",
    description: "Purée de pois chiches, tahini, citron et huile d'olive",
    price: 6,
    image: "/images/hero-slide-pide-lahmacun.webp",
    category: "entrees",
    sortOrder: 1,
  },
  {
    slug: "borek-fromage",
    name: "Börek fromage",
    description: "Feuilleté turc au fromage, persil et herbes fraîches",
    price: 6.5,
    image: "/images/hero-slide-pide-lahmacun.webp",
    category: "entrees",
    sortOrder: 2,
  },
  {
    slug: "mercimek-corbasi",
    name: "Mercimek çorbası",
    description: "Soupe turque de lentilles corail, citron et paprika",
    price: 7,
    image: "/images/hero-slide-pide-lahmacun.webp",
    category: "entrees",
    sortOrder: 3,
  },
  {
    slug: "baklava",
    name: "Baklava",
    description: "Feuilleté aux pistaches, noix et sirop parfumé",
    price: 5,
    image: "/images/hero-slide-desserts-turcs.webp",
    category: "desserts",
    sortOrder: 1,
  },
  {
    slug: "sutlac",
    name: "Sütlaç",
    description: "Riz au lait turc, vanille et cannelle",
    price: 5,
    image: "/images/hero-slide-desserts-turcs.webp",
    category: "desserts",
    sortOrder: 2,
  },
  {
    slug: "ayran",
    name: "Ayran",
    description: "Boisson turque au yaourt, fraîche et légèrement salée",
    price: 3.5,
    image: "/images/hero-slide-boissons-turques.webp",
    category: "boissons",
    sortOrder: 1,
  },
  {
    slug: "the-turc",
    name: "Thé turc",
    description: "Thé noir traditionnel servi chaud",
    price: 3.5,
    image: "/images/hero-slide-boissons-turques.webp",
    category: "boissons",
    sortOrder: 2,
  },
  {
    slug: "sodas-frais",
    name: "Sodas frais",
    description: "Sélection de boissons fraîches en canette",
    price: 4,
    image: "/images/hero-slide-boissons-turques.webp",
    category: "boissons",
    sortOrder: 3,
  },
];

async function main() {
  // Restaurant par défaut (base mono-site aujourd'hui, prêt multi-restaurants).
  const defaultRestaurant = await prisma.restaurant.upsert({
    where: { slug: "restaurant" },
    update: { name: "restaurant", active: true },
    create: { slug: "restaurant", name: "restaurant", active: true },
  });

  // Catégories
  const catBySlug = new Map<string, string>();
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    });
    catBySlug.set(c.slug, row.id);
  }

  // Plats principaux (catégorie « plats »)
  for (const d of seedDishes) {
    await prisma.dish.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        description: d.description,
        price: d.price,
        image: d.image,
        tag: d.tag ?? null,
        sortOrder: d.sortOrder,
        prepMinutes: 20,
        categoryId: catBySlug.get("plats"),
      },
      create: {
        slug: d.slug,
        name: d.name,
        description: d.description,
        price: d.price,
        image: d.image,
        tag: d.tag ?? null,
        sortOrder: d.sortOrder,
        prepMinutes: 20,
        categoryId: catBySlug.get("plats"),
      },
    });
  }

  // Entrées, desserts et boissons turcs.
  const prepByCat: Record<string, number> = {
    entrees: 10,
    desserts: 5,
    boissons: 2,
  };
  for (const d of extraDishes) {
    const prepMinutes = prepByCat[d.category] ?? 15;
    await prisma.dish.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        description: d.description,
        price: d.price,
        image: d.image,
        sortOrder: d.sortOrder,
        prepMinutes,
        categoryId: catBySlug.get(d.category),
      },
      create: {
        slug: d.slug,
        name: d.name,
        description: d.description,
        price: d.price,
        image: d.image,
        sortOrder: d.sortOrder,
        prepMinutes,
        categoryId: catBySlug.get(d.category),
      },
    });
  }

  // Options de démonstration sur le kebab grillé.
  const kebab = await prisma.dish.findUnique({
    where: { slug: "kebab-grille" },
  });
  if (kebab) {
    await resetDemoOptionGroup(kebab.id, {
      name: "Accompagnement",
      type: "single",
      required: true,
      sortOrder: 1,
      options: [
        { name: "Riz pilav", priceDelta: 0, sortOrder: 1 },
        { name: "Boulgour", priceDelta: 0, sortOrder: 2 },
        { name: "Frites", priceDelta: 1, sortOrder: 3 },
      ],
    });
    await resetDemoOptionGroup(kebab.id, {
      name: "Suppléments",
      type: "multi",
      required: false,
      sortOrder: 2,
      options: [
        { name: "Sauce yaourt", priceDelta: 0, sortOrder: 1 },
        { name: "Piment doux", priceDelta: 0, sortOrder: 2 },
        { name: "Fromage", priceDelta: 2, sortOrder: 3 },
      ],
    });
  }

  // Zones de livraison
  for (const z of [
    { postalCode: "91260", fee: 3.5, minOrder: 15 },
    { postalCode: "91200", fee: 4.5, minOrder: 20 },
    { postalCode: "91600", fee: 4, minOrder: 18 },
  ]) {
    await prisma.deliveryZone.upsert({
      where: { postalCode: z.postalCode },
      update: { fee: z.fee, minOrder: z.minOrder },
      create: z,
    });
  }

  // Horaires d'ouverture (11h–23h tous les jours) + réglages de commande.
  for (let day = 0; day < 7; day++) {
    await prisma.openingHour.upsert({
      where: { dayOfWeek: day },
      update: {},
      create: { dayOfWeek: day, openMinutes: 11 * 60, closeMinutes: 23 * 60 },
    });
  }
  await prisma.orderingSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      slotIntervalMin: 15,
      leadTimeMin: 20,
      capacityPerSlot: 8,
    },
  });

  // Code promo affiché sur le site.
  await prisma.promoCode.upsert({
    where: { code: "RESTAURANT10" },
    update: { type: "percent", value: 10, active: true },
    create: { code: "RESTAURANT10", type: "percent", value: 10, active: true },
  });
  const dishes = await prisma.dish.count();
  const zones = await prisma.deliveryZone.count();
  console.log(
    `✓ Seed : ${dishes} plats, ${categories.length} catégories, ${zones} zones, RESTAURANT10, restaurant ${defaultRestaurant.slug}.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

async function resetDemoOptionGroup(
  dishId: string,
  input: {
    name: string;
    type: string;
    required: boolean;
    sortOrder: number;
    options: { name: string; priceDelta: number; sortOrder: number }[];
  },
) {
  const group = await prisma.optionGroup.findFirst({
    where: { dishId, name: input.name },
  });

  if (group) {
    await prisma.option.deleteMany({ where: { groupId: group.id } });
    await prisma.optionGroup.update({
      where: { id: group.id },
      data: {
        type: input.type,
        required: input.required,
        sortOrder: input.sortOrder,
        options: { create: input.options },
      },
    });
    return;
  }

  await prisma.optionGroup.create({
    data: {
      dishId,
      name: input.name,
      type: input.type,
      required: input.required,
      sortOrder: input.sortOrder,
      options: { create: input.options },
    },
  });
}
