# ---- Base ----
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ---- Dépendances ----
FROM base AS deps
COPY package.json package-lock.json ./
# --ignore-scripts : le postinstall (prisma generate) requiert le schéma,
# copié seulement au stage build. La génération a lieu dans `npm run build`.
RUN npm ci --ignore-scripts

# ---- Build ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# `build` = prisma generate && next build (sortie standalone)
RUN npm run build

# ---- Runner (image finale, légère) ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# App Next.js autonome (le trace standalone inclut @prisma/client + moteur)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Sécurité : moteur Prisma + client générés (au cas où le trace ne les inclut pas).
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

USER nextjs
EXPOSE 3000
# Les migrations sont appliquées par le service « migrate » (image complète).
CMD ["node", "server.js"]
