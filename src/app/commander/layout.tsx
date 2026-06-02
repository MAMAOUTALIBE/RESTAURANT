import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finaliser ma commande",
  description:
    "Validez votre commande chez AFRO MK LO BOKO : à emporter, en livraison ou sur place. Paiement sécurisé.",
};

export default function CommanderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
