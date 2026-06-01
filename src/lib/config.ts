const whatsappOrderNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER ?? "+33123456789";
const telegramOrderUsername =
  process.env.NEXT_PUBLIC_TELEGRAM_ORDER_USERNAME ?? "";
const telegramUrl = telegramOrderUsername
  ? `https://t.me/${telegramOrderUsername.replace(/^@/, "")}`
  : "";

/** Configuration centrale du site (SEO, QR code, emails, coordonnées). */
export const siteConfig = {
  name: "N'KULU — Saveurs Africaines",
  shortName: "N'KULU",
  description:
    "Cuisine africaine authentique : recettes traditionnelles préparées avec amour, ingrédients frais et épices d'exception. Commandez en ligne.",
  /** URL publique (override en prod via NEXT_PUBLIC_SITE_URL). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
  contact: {
    phone: "+33 1 23 45 67 89",
    email: "contact@nkulu-saveurs.fr",
    address: "12 rue des Saveurs, 75011 Paris",
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
