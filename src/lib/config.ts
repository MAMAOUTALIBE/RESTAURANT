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
  currency: "EUR",
  priceRange: "€€",
} as const;
