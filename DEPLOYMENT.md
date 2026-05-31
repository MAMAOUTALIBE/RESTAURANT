# Guide de déploiement — N'KULU Saveurs

Déploiement recommandé : **Vercel** (app Next.js) + **base PostgreSQL managée**
(Neon ou Supabase) + **Stripe** + **Resend**.

---

## 1. Base de données PostgreSQL managée

Créer une base sur [Neon](https://neon.tech) ou [Supabase](https://supabase.com)
et récupérer la chaîne de connexion (`postgresql://…`).

> Neon/Supabase exigent le SSL : ajouter `?sslmode=require` à l'URL.

---

## 2. Variables d'environnement (Vercel → Project → Settings → Environment Variables)

| Variable | Obligatoire | Description |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | URL PostgreSQL managée (`?sslmode=require`) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL publique finale (ex. `https://nkulu-saveurs.fr`) |
| `SESSION_SECRET` | ✅ | Secret aléatoire (`openssl rand -hex 32`) |
| `ADMIN_EMAILS` | ✅ | Emails admin séparés par des virgules |
| `STRIPE_SECRET_KEY` | ⬜ | Clé secrète Stripe (`sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | ⬜ | Secret du webhook Stripe (`whsec_…`) |
| `RESEND_API_KEY` | ⬜ | Clé API Resend (emails transactionnels) |
| `EMAIL_FROM` | ⬜ | Expéditeur vérifié (ex. `N'KULU <commandes@nkulu-saveurs.fr>`) |
| `UPSTASH_REDIS_REST_URL` | ⬜ | Rate-limiting distribué (recommandé en prod) |
| `UPSTASH_REDIS_REST_TOKEN` | ⬜ | Jeton Upstash |

---

## 3. Déploiement

```bash
# Connexion + import du projet
npx vercel link
# Pousser les variables ci-dessus, puis :
npx vercel --prod
```

Le `buildCommand` de [vercel.json](vercel.json) lance automatiquement
`prisma generate && prisma migrate deploy && next build` — les migrations sont
appliquées à chaque déploiement.

---

## 4. Stripe (paiement réel)

1. Dashboard Stripe → **Developers → API keys** → copier `sk_live_…` dans `STRIPE_SECRET_KEY`.
2. **Developers → Webhooks → Add endpoint** :
   - URL : `https://VOTRE-DOMAINE/api/webhooks/stripe`
   - Événements : `checkout.session.completed`, `checkout.session.expired`
   - Copier le `whsec_…` dans `STRIPE_WEBHOOK_SECRET`.
3. Test local du webhook :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

Sans clé Stripe, le paiement reste en **mode simulation** (la commande passe
directement en « payée »).

---

## 5. Emails (Resend)

1. Créer un compte [Resend](https://resend.com), **vérifier votre domaine**
   (DNS SPF/DKIM).
2. Renseigner `RESEND_API_KEY` et `EMAIL_FROM` (adresse du domaine vérifié).

Sans clé, les emails sont **loggés en console** (mode dev/simulation).

---

## 6. Rate-limiting en production

Le limiteur par défaut ([src/lib/rate-limit.ts](src/lib/rate-limit.ts)) est
**en mémoire** : il ne suffit pas en multi-instances (serverless). En prod,
brancher [Upstash Ratelimit](https://github.com/upstash/ratelimit) :

```bash
npm install @upstash/ratelimit @upstash/redis
```

puis remplacer l'implémentation de `rateLimit()` par un `Ratelimit.slidingWindow`
adossé à Redis (variables `UPSTASH_REDIS_REST_*`).

---

## 7. Checklist avant mise en ligne

- [ ] Remplir les vraies coordonnées dans [src/lib/config.ts](src/lib/config.ts)
- [ ] Compléter les pages légales (`/mentions-legales`, `/cgv`, `/confidentialite`)
- [ ] Remplacer les photos de stock par les vraies photos du restaurant
- [ ] `SESSION_SECRET` fort et unique
- [ ] Domaine + HTTPS configurés sur Vercel
- [ ] Webhook Stripe testé en production
- [ ] Domaine email vérifié sur Resend
- [ ] Brancher un suivi d'erreurs (ex. Sentry) et analytics
