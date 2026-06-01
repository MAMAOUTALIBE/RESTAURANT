import { PrismaClient } from "@prisma/client";
import { seedDishes } from "../src/data/dishes";

const prisma = new PrismaClient();

const categories = [
  { slug: "entrees", name: "Entrées", sortOrder: 1 },
  { slug: "plats", name: "Plats", sortOrder: 2 },
  { slug: "desserts", name: "Desserts", sortOrder: 3 },
  { slug: "boissons", name: "Boissons", sortOrder: 4 },
];

// Plats supplémentaires pour étoffer le menu par catégorie.
const extraDishes = [
  { slug: "accras", name: "Accras de morue", description: "Beignets de morue épicés", price: 6, image: "/images/about-3.jpg", category: "entrees", sortOrder: 1 },
  { slug: "samoussas", name: "Samoussas boeuf", description: "Croustillants à la viande épicée", price: 6.5, image: "/images/about-2.jpg", category: "entrees", sortOrder: 2 },
  { slug: "thiakry", name: "Thiakry", description: "Dessert au mil et lait, vanille", price: 5, image: "/images/about-1.jpg", category: "desserts", sortOrder: 1 },
  { slug: "bissap", name: "Bissap", description: "Jus d'hibiscus maison", price: 3.5, image: "/images/riz-jollof.jpg", category: "boissons", sortOrder: 1 },
  { slug: "gingembre", name: "Jus de gingembre", description: "Boisson fraîche et tonique", price: 3.5, image: "/images/mafe.jpg", category: "boissons", sortOrder: 2 },
];

async function main() {
  // Restaurant par défaut (base mono-site aujourd'hui, prêt multi-restaurants).
  const defaultRestaurant = await prisma.restaurant.upsert({
    where: { slug: "nkulu-paris-11" },
    update: { name: "N'KULU Paris 11", active: true },
    create: { slug: "nkulu-paris-11", name: "N'KULU Paris 11", active: true },
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

  // Plats supplémentaires (entrées, desserts, boissons) avec prep par catégorie.
  const prepByCat: Record<string, number> = { entrees: 10, desserts: 5, boissons: 2 };
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

  // Options de démonstration sur le Poulet DG (si pas déjà présentes).
  const pouletDg = await prisma.dish.findUnique({
    where: { slug: "poulet-dg" },
    include: { optionGroups: true },
  });
  if (pouletDg && pouletDg.optionGroups.length === 0) {
    await prisma.optionGroup.create({
      data: {
        dishId: pouletDg.id,
        name: "Accompagnement",
        type: "single",
        required: true,
        sortOrder: 1,
        options: {
          create: [
            { name: "Plantain", priceDelta: 0, sortOrder: 1 },
            { name: "Riz", priceDelta: 0, sortOrder: 2 },
            { name: "Frites", priceDelta: 1, sortOrder: 3 },
          ],
        },
      },
    });
    await prisma.optionGroup.create({
      data: {
        dishId: pouletDg.id,
        name: "Suppléments",
        type: "multi",
        required: false,
        sortOrder: 2,
        options: {
          create: [
            { name: "Piment fort", priceDelta: 0, sortOrder: 1 },
            { name: "Sauce arachide", priceDelta: 1.5, sortOrder: 2 },
            { name: "Avocat", priceDelta: 2, sortOrder: 3 },
          ],
        },
      },
    });
  }

  // Zones de livraison
  for (const z of [
    { postalCode: "75011", fee: 3.5, minOrder: 15 },
    { postalCode: "75012", fee: 4.5, minOrder: 20 },
    { postalCode: "75020", fee: 4, minOrder: 18 },
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
    create: { id: "default", slotIntervalMin: 15, leadTimeMin: 20, capacityPerSlot: 8 },
  });

  // Code promo affiché sur le site
  await prisma.promoCode.upsert({
    where: { code: "AFRO10" },
    update: {},
    create: { code: "AFRO10", type: "percent", value: 10, active: true },
  });

  const dishes = await prisma.dish.count();
  const zones = await prisma.deliveryZone.count();
  console.log(
    `✓ Seed : ${dishes} plats, ${categories.length} catégories, ${zones} zones, AFRO10, restaurant ${defaultRestaurant.slug}.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
