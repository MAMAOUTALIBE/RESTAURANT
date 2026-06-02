import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/menu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/commander`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/reservation`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/traiteur`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${base}/mentions-legales`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    { url: `${base}/cgv`, changeFrequency: "yearly", priority: 0.2 },
    {
      url: `${base}/confidentialite`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
