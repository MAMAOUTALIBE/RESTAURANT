import { PrismaClient } from "@prisma/client";
import { seedDishes } from "../src/data/dishes";

const prisma = new PrismaClient();

const categories = [
  { slug: "entrees", name: "Entrées africaines", sortOrder: 1 },
  { slug: "plats", name: "Plats africains", sortOrder: 2 },
  { slug: "desserts", name: "Desserts africains", sortOrder: 3 },
  { slug: "boissons", name: "Boissons africaines", sortOrder: 4 },
];

const extraDishes = [
  {
    slug: "accras",
    name: "Accras de morue",
    description: "Beignets de morue antillais, herbes fraîches et piment doux",
    price: 6,
    image: "/images/poulet-dg.jpg",
    category: "entrees",
    sortOrder: 1,
  },
  {
    slug: "samoussas-boeuf",
    name: "Samoussas boeuf",
    description: "Croustillants d'inspiration est-africaine au boeuf épicé",
    price: 6.5,
    image: "/images/yassa-poulet.jpg",
    category: "entrees",
    sortOrder: 2,
  },
  {
    slug: "pastels-thon",
    name: "Pastels au thon",
    description: "Chaussons sénégalais au thon, sauce tomate relevée",
    price: 7,
    image: "/images/thieboudienne.jpg",
    category: "entrees",
    sortOrder: 3,
  },
  {
    slug: "thiakry",
    name: "Thiakry",
    description: "Dessert ouest-africain au mil, lait caillé et vanille",
    price: 5,
    image: "/images/mafe.jpg",
    category: "desserts",
    sortOrder: 1,
  },
  {
    slug: "degue",
    name: "Dèguè",
    description: "Dessert au mil et yaourt, doux et frais",
    price: 5,
    image: "/images/foutou-gombo.jpg",
    category: "desserts",
    sortOrder: 2,
  },
  {
    slug: "bissap",
    name: "Bissap",
    description: "Boisson maison à l'hibiscus, servie fraîche",
    price: 3.5,
    image: "/images/boisson-bissap.png",
    category: "boissons",
    sortOrder: 1,
  },
  {
    slug: "gingembre",
    name: "Gingembre frais",
    description: "Boisson tonique au gingembre, citron et menthe",
    price: 3.5,
    image: "/images/boisson-gingembre.png",
    category: "boissons",
    sortOrder: 2,
  },
  {
    slug: "sodas-frais",
    name: "Sodas frais",
    description: "Sélection de boissons fraîches en canette",
    price: 4,
    image: "/images/boisson-sodas.png",
    category: "boissons",
    sortOrder: 3,
  },
];

async function main() {
  // Restaurant par défaut (base mono-site aujourd'hui, prêt multi-restaurants).
  const defaultRestaurant = await prisma.restaurant.upsert({
    where: { slug: "afromk-loboko" },
    update: { name: "AFRO MK LO BOKO", active: true },
    create: { slug: "afromk-loboko", name: "AFRO MK LO BOKO", active: true },
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

  // Entrées, desserts et boissons africains.
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

  await prisma.dish.deleteMany({
    where: { slug: { in: ["samoussas", "bouye"] } },
  });

  // Options de démonstration sur le Poulet DG.
  const pouletDg = await prisma.dish.findUnique({
    where: { slug: "poulet-dg" },
  });
  if (pouletDg) {
    await resetDemoOptionGroup(pouletDg.id, {
      name: "Accompagnement",
      type: "single",
      required: true,
      sortOrder: 1,
      options: [
        { name: "Plantain", priceDelta: 0, sortOrder: 1 },
        { name: "Riz parfumé", priceDelta: 0, sortOrder: 2 },
        { name: "Attiéké", priceDelta: 1, sortOrder: 3 },
      ],
    });
    await resetDemoOptionGroup(pouletDg.id, {
      name: "Suppléments",
      type: "multi",
      required: false,
      sortOrder: 2,
      options: [
        { name: "Piment fort", priceDelta: 0, sortOrder: 1 },
        { name: "Sauce arachide", priceDelta: 1.5, sortOrder: 2 },
        { name: "Avocat", priceDelta: 2, sortOrder: 3 },
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
    where: { code: "AFROMK10" },
    update: { type: "percent", value: 10, active: true },
    create: { code: "AFROMK10", type: "percent", value: 10, active: true },
  });
  // Ancien code conservé comme alias pour ne pas casser les campagnes déjà envoyées.
  await prisma.promoCode.upsert({
    where: { code: "AFRO10" },
    update: { type: "percent", value: 10, active: true },
    create: { code: "AFRO10", type: "percent", value: 10, active: true },
  });

  const dishes = await prisma.dish.count();
  const zones = await prisma.deliveryZone.count();
  console.log(
    `✓ Seed : ${dishes} plats, ${categories.length} catégories, ${zones} zones, AFROMK10, restaurant ${defaultRestaurant.slug}.`,
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
