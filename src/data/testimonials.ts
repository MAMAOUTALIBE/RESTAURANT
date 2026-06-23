import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "marie",
    name: "Marie L.",
    avatar: "/images/avatar-marie.webp",
    rating: 5,
    comment:
      "Des plats délicieux qui me rappellent la maison ! Qualité, goût et accueil au top.",
    city: "Paris",
  },
  {
    id: "benoit",
    name: "Benoît A.",
    avatar: "/images/avatar-benoit.webp",
    rating: 5,
    comment:
      "Le meilleur restaurant turc que j'ai testé ! Service rapide et portions généreuses.",
    city: "Lyon",
  },
  {
    id: "aissata",
    name: "Aïssata K.",
    avatar: "/images/avatar-aissata.webp",
    rating: 5,
    comment:
      "Une vraie découverte ! Les saveurs sont authentiques et l'ambiance est chaleureuse.",
    city: "Marseille",
  },
];
