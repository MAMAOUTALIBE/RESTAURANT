const whatsappOrderNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER ?? "+33775787825";
const telegramOrderUsername =
  process.env.NEXT_PUBLIC_TELEGRAM_ORDER_USERNAME ?? "restaurant";
const telegramUrl = telegramOrderUsername
  ? `https://t.me/${telegramOrderUsername.replace(/^@/, "")}`
  : "";

/** Configuration centrale du site (SEO, QR code, emails, coordonnées). */
export const siteConfig = {
  name: "restaurant",
  shortName: "restaurant",
  description:
    "La saveur de la Turquie dans votre assiette : recettes turques généreuses, ingrédients frais et commande en ligne.",
  /** URL publique (override en prod via NEXT_PUBLIC_SITE_URL). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
  contact: {
    phone: "07 75 78 78 25",
    email: "contact@restaurant.fr",
    address: "5 Rue Jules Vallès, 91260 Juvisy-sur-Orge",
  },
  messaging: {
    whatsappOrderNumber,
    telegramOrderUsername,
  },
  socials: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://facebook.com",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://tiktok.com",
    whatsapp: `https://wa.me/${whatsappOrderNumber.replace(/\D/g, "")}`,
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL ?? telegramUrl,
  },
  currency: "EUR",
  priceRange: "€€",
} as const;
