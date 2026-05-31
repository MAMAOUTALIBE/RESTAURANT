import "server-only";
import { headers } from "next/headers";

interface Bucket {
  count: number;
  resetAt: number;
}

// Fenêtre glissante en mémoire (par instance).
// ⚠️ En production multi-instances, remplacer par Upstash Ratelimit / Redis.
const buckets = new Map<string, Bucket>();

/** Identifie l'appelant via l'IP (en-têtes proxy) ou un fallback. */
export function clientIp(): string {
  const h = headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

/**
 * Autorise au plus `limit` actions par `windowMs` pour une clé donnée.
 * Retourne `true` si l'action est permise, `false` si la limite est atteinte.
 */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}
