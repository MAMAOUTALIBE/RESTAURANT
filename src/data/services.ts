import { Leaf, ChefHat, Truck, ShieldCheck } from "lucide-react";
import type { Service, NavLink } from "@/types";

/** Badges de réassurance affichés sous le hero. */
export const services: Service[] = [
  { id: "frais", label: "Ingrédients frais et locaux", icon: Leaf },
  { id: "prepare", label: "Préparé chaque jour", icon: ChefHat },
  { id: "livraison", label: "Livraison rapide à domicile", icon: Truck },
  { id: "paiement", label: "Paiement sécurisé en ligne", icon: ShieldCheck },
];

/** Liens de navigation principaux. */
export const navLinks: NavLink[] = [
  { label: "Menu", href: "/menu" },
  { label: "Commander", href: "/commander" },
  { label: "Réservation", href: "/reservation" },
  { label: "Traiteur", href: "/traiteur" },
  { label: "Contact", href: "/#contact" },
];

/** Liens plus complets pour les zones secondaires comme le footer. */
export const footerLinks: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/#a-propos" },
  ...navLinks,
  { label: "Avis", href: "/#avis" },
];

/** Avantages listés dans la section QR code. */
export const qrFeatures: string[] = [
  "Accès au menu",
  "Commande rapide",
  "Paiement sécurisé",
  "Livraison à domicile",
];

/** Points forts listés dans la section À propos. */
export const aboutPoints: string[] = [
  "Recettes traditionnelles et authentiques",
  "Produits frais et de qualité",
  "Cuisine familiale et chaleureuse",
  "Équipe passionnée et accueillante",
];
