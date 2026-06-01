import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { LangProvider } from "@/context/LangContext";
import { CartDrawer } from "@/components/CartDrawer";
import { CookieConsent } from "@/components/CookieConsent";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { AiAssistant } from "@/components/AiAssistant";
import { siteConfig } from "@/lib/config";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "N'KULU — Saveurs Africaines | Cuisine africaine authentique",
    template: "%s | N'KULU Saveurs Africaines",
  },
  description:
    "N'KULU Saveurs Africaines : recettes traditionnelles préparées avec amour, ingrédients frais et épices d'exception. Commandez en ligne ou scannez le QR code.",
  keywords: [
    "restaurant africain",
    "cuisine africaine",
    "Poulet DG",
    "Riz Jollof",
    "Yassa",
    "Mafé",
    "livraison",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "N'KULU — Saveurs Africaines",
    description: "L'Afrique dans chaque bouchée.",
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/poulet-dg.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "N'KULU — Saveurs Africaines",
    description: "L'Afrique dans chaque bouchée.",
    images: ["/images/poulet-dg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    servesCuisine: "Africaine",
    priceRange: siteConfig.priceRange,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressCountry: "FR",
    },
    image: [
      `${siteConfig.url}/images/hero-1.jpg`,
      `${siteConfig.url}/images/hero-2.jpg`,
      `${siteConfig.url}/images/hero-3.jpg`,
    ],
    menu: `${siteConfig.url}/#menu`,
    acceptsReservations: true,
  };

  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body className="bg-ink font-sans text-cream antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LangProvider>
          <CartProvider>
            <OrderProvider>
              {children}
              <CartDrawer />
              <AiAssistant />
            </OrderProvider>
          </CartProvider>
        </LangProvider>
        <CookieConsent />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
