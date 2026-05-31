import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "N'KULU — Saveurs Africaines",
    short_name: "N'KULU",
    description: "Commandez vos plats africains en ligne.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    icons: [
      { src: "/images/poulet-dg.jpg", sizes: "192x192", type: "image/jpeg" },
      { src: "/images/poulet-dg.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
  };
}
