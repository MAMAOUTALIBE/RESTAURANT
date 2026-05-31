/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sortie autonome : serveur Node minimal pour le déploiement (Docker/VPS).
  output: "standalone",
  // Toutes les images sont locales (public/images) → pas de domaine distant.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
