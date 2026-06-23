import { describe, expect, it } from "vitest";
import {
  buildTelegramOrderUrl,
  buildWhatsAppOrderUrl,
  formatSocialOrderMessage,
} from "@/lib/social-order";
import type { CartItem } from "@/types";

const item: CartItem = {
  lineId: "kebab-1",
  dishId: "kebab-grille",
  name: "Kebab grillé",
  image: "/images/kebab-grille.webp",
  basePrice: 14,
  unitPrice: 15,
  quantity: 2,
  options: [{ groupId: "side", optionId: "riz", label: "Riz", priceDelta: 1 }],
  note: "Sans piment",
};

describe("social order helpers", () => {
  it("formate un panier lisible pour les messageries", () => {
    const message = formatSocialOrderMessage({
      items: [item],
      choice: {
        fulfillment: "livraison",
        postalCode: "91260",
        label: "Aujourd'hui 19:30",
      },
      subtotal: 30,
      deliveryFee: 4,
      discount: 5,
      tip: 2,
      total: 31,
      promoCode: "RESTAURANT10",
    });

    expect(message).toContain("2 x Kebab grillé");
    expect(message).toContain("Options : Riz");
    expect(message).toContain("Code postal : 91260");
    expect(message.replace(/\s/g, " ")).toContain("Total estimé : 31,00 €");
  });

  it("génère des URLs WhatsApp et Telegram encodées", () => {
    const message = "Bonjour restaurant\nCommande test";

    expect(buildWhatsAppOrderUrl(message)).toMatch(
      /^https:\/\/wa\.me\/33775787825\?text=/,
    );
    expect(buildWhatsAppOrderUrl(message)).toContain("Commande%20test");
    expect(buildTelegramOrderUrl(message)).toMatch(
      /^https:\/\/t\.me\/share\/url\?/,
    );
    expect(buildTelegramOrderUrl(message)).toContain("Commande%20test");
  });
});
