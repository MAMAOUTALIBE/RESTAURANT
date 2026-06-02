# AFRO MK LO BOKO 🍲

Application **full-stack** (vitrine + commande en ligne) pour un restaurant
africain. Design noir / blanc cassé / orange-or, ambiance africaine moderne.

> ✅ **Full-stack TypeScript / Next.js.** Panier réel persistant, formulaires
> connectés (Server Actions + Zod), API REST, commandes persistées, paiement
> Stripe-ready, espace client, SEO complet, QR code réel, tests Vitest.
> Paiement et emails passent en **mode simulation** tant que les clés
> Stripe/Resend ne sont pas fournies (voir `.env.example`).

## Fonctionnalités backend

| Domaine            | Implémentation                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Panier**         | Context React + `localStorage`, tiroir latéral (`CartDrawer`)                                                   |
| **API REST**       | `/api/dishes`, `/api/testimonials`, `/api/orders` (GET/POST)                                                    |
| **Formulaires**    | Server Actions + validation Zod (newsletter, contact, commande)                                                 |
| **Commande**       | `/commander` → création → `/commande/[ref]` (confirmation + paiement)                                           |
| **Messagerie**     | Commande préremplie WhatsApp/Telegram + notifications restaurant optionnelles                                   |
| **Assistant**      | Assistant local gratuit sans API externe, pour menu/livraison/réservation                                       |
| **Paiement**       | Stripe Checkout si `STRIPE_SECRET_KEY`, sinon simulation                                                        |
| **Webhook Stripe** | `/api/webhooks/stripe` — confirme le paiement (signature vérifiée)                                              |
| **Auth**           | Connexion par **lien magique** vérifié (`VerificationToken`, usage unique, 15 min)                              |
| **Espace client**  | `/compte` — historique des commandes (session cookie HMAC signée)                                               |
| **Back-office**    | `/admin` — protégé par allowlist `ADMIN_EMAILS` : commandes + statuts + stats                                   |
| **Anti-spam**      | Rate-limiting Upstash Redis en prod (fallback mémoire local) + honeypot                                         |
| **Persistance**    | **PostgreSQL via Prisma** (`Order`, `OrderLine`, `NewsletterSubscriber`, `ContactMessage`, `VerificationToken`) |
| **Emails**         | Resend si `RESEND_API_KEY`, sinon log console                                                                   |
| **SEO**            | `sitemap.ts`, `robots.ts`, JSON-LD `Restaurant`, Open Graph + Twitter                                           |
| **Légal / RGPD**   | `/mentions-legales`, `/cgv`, `/confidentialite` + bandeau de consentement cookies                               |
| **QR code**        | Généré côté serveur (`qrcode`), pointe vers `/commander`                                                        |
| **Tests**          | Vitest + Testing Library (utils, validation, panier) — `npm test`                                               |

> Pour activer paiement/emails réels, copier `.env.example` → `.env.local`.
> En production multi-instances, remplacer le rate-limiter in-memory par Upstash/Redis.

## Stack technique

| Outil                        | Rôle                                                    |
| ---------------------------- | ------------------------------------------------------- |
| **Next.js 16** (App Router)  | Framework React + Server Actions + API routes           |
| **TypeScript**               | Typage strict de tous les composants                    |
| **PostgreSQL + Prisma 6**    | Base de données relationnelle + ORM type-safe           |
| **Zod**                      | Validation des entrées (formulaires + API)              |
| **Stripe**                   | Paiement (Checkout) — optionnel                         |
| **TailwindCSS 3**            | Styles utilitaires + thème personnalisé                 |
| **Framer Motion**            | Animations (fade-in scroll, hover, slider, menu mobile) |
| **lucide-react**             | Icônes                                                  |
| **clsx + tailwind-merge**    | Helper `cn()` de fusion de classes                      |
| **class-variance-authority** | Variantes de composants (dispo pour extension)          |
| **ESLint + Prettier**        | Qualité & formatage                                     |

## Démarrer

```bash
# 1. Base de données PostgreSQL (exemple via Docker)
docker run --name afromk-pg -e POSTGRES_PASSWORD=afromk -e POSTGRES_USER=afromk \
  -e POSTGRES_DB=afromk -p 5440:5432 -d postgres:16

# 2. Configuration
cp .env.example .env.local      # puis ajuster si besoin
# (Prisma lit DATABASE_URL depuis .env)

# 3. Dépendances + base
npm install                     # installe + prisma generate (postinstall)
npm run db:migrate              # applique le schéma à la base

# 4. Lancer
npm run dev        # http://localhost:3000 (développement)
npm run build      # build de production (prisma generate + next build)
npm run start      # servir le build de production
npm run test       # tests Vitest
npm run db:studio  # explorer la base (Prisma Studio)
```

> Node.js 18+ et une base PostgreSQL requis.

## Structure

```
src/
  app/
    layout.tsx          # fonts (Inter + Playfair), métadonnées, <html>
    page.tsx            # assemblage des sections
    globals.css         # base Tailwind + classes utilitaires (.btn, .section…)
  components/
    Header.tsx          # header sticky + nav desktop + panier
    MobileNav.tsx       # menu hamburger coulissant
    Hero.tsx            # titre, CTAs, badges, slider auto
    FeaturedDishes.tsx  # grille des plats phares
    DishCard.tsx        # carte plat (hover, bouton +)
    QRCodeSection.tsx   # « Commandez en un scan »
    AboutSection.tsx    # « À propos de nous » + galerie
    PromoSection.tsx    # offre -10 % + code AFRO10
    Testimonials.tsx    # avis clients (étoiles)
    Footer.tsx          # liens, contact, newsletter, paiements
    Logo.tsx            # logo + wordmark
    ui/
      Reveal.tsx        # wrapper animation au scroll
      FakeQR.tsx        # faux QR code SVG décoratif
  data/                 # données mockées
    dishes.ts
    testimonials.ts
    services.ts
  lib/
    utils.ts            # cn(), formatPrice()
  types/
    index.ts            # interfaces (Dish, Testimonial, Service, NavLink)
public/
  images/               # remplacer les images Unsplash par des fichiers locaux ici
```

## Choix techniques

- **Palette centralisée** dans `tailwind.config.ts` (`ink`, `cream`, `gold`,
  `forest`, `muted`) → cohérence garantie.
- **Polices** : Playfair Display (titres) + Inter (texte), via `next/font/google`.
- **Images** : Unsplash via `next/image` (domaine autorisé dans `next.config.mjs`).
  Remplaçables par des fichiers locaux dans `public/images`.
- **Mobile-first** : grilles adaptatives 375 px → 768 px → 1440 px,
  `overflow-x: hidden` global pour éviter tout débordement horizontal.
- **Accessibilité** : `aria-label` sur les boutons icônes, navigation au clavier,
  contrastes forts.

## Sections livrées

Header sticky · Hero + slider · Plats phares · QR code · À propos · Offre
spéciale · Avis clients · Footer complet.

## Reste à faire (phase backend)

- API menu/plats (remplacer `src/data/dishes.ts`).
- Panier réel + état global (Zustand / Context) et page commande.
- Paiement (Stripe / PayPal) — actuellement seulement visuel.
- Formulaire newsletter & contact connectés (envoi email).
- Réservation et module traiteur (pages dédiées).
- Authentification / espace client.
- Génération d'un vrai QR code pointant vers le menu en ligne.
- i18n si multilingue souhaité.
