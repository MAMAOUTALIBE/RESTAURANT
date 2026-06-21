# 🔄 Mettre à jour le site en ligne — lodene.cloud

Runbook pour redéployer le restaurant en production après une modification du code.

---

## ⚡ La méthode rapide (recommandée)

Depuis ce Mac, à la racine du projet :

```bash
./deploy/update-lodene.sh
```

Le script fait tout : vérifs locales (typecheck + lint) → `rsync` du code → rebuild Docker → migrations auto → vérification `/api/health`. **Si typecheck/lint échoue, rien n'est déployé** (la prod n'est pas touchée).

> 💡 Même si le build échoue sur le VPS, l'ancienne version **reste en ligne** : Docker ne remplace le conteneur que si la nouvelle image se construit correctement.

---

## 🧠 Ce qu'il faut savoir (contexte)

| | |
|---|---|
| **Domaine** | https://lodene.cloud (+ www) |
| **VPS** | `root@213.130.144.215` (Hostinger, Ubuntu 24.04) — clé SSH `~/.ssh/claude_deploy` |
| **Code sur le VPS** | `/root/restaurant` |
| **Exécution** | Docker Compose, projet `restaurant` : `restaurant-app-1` (Next.js, `127.0.0.1:3100`), `restaurant-db-1` (PostgreSQL), `restaurant-migrate-1` (migrations, puis s'arrête) |
| **Reverse-proxy** | Nginx `/etc/nginx/sites-available/lodene.cloud` → `127.0.0.1:3100` + HTTPS Let's Encrypt |
| **Config / secrets** | `/root/restaurant/.env` (chmod 600) — **jamais dans git, jamais écrasé par rsync** |

> ⚠️ **VPS partagé** : ce serveur héberge aussi `lodene.org` (auto-école) et `esvirychatillonfootball.org`. Ne jamais toucher leurs configs Nginx, leurs conteneurs/process, ni le port 3000 (pris). Le restaurant est isolé sur le **port 3100**.

---

## 🛠️ La méthode manuelle (étape par étape)

Si tu veux faire à la main ce que fait le script :

### 1. Vérifier que le code compile (sur le Mac)
```bash
npm run typecheck && npm run lint
```

### 2. Envoyer le code sur le VPS (rsync)
```bash
rsync -az --delete \
  -e "ssh -i ~/.ssh/claude_deploy -o IdentitiesOnly=yes" \
  --exclude '.git' --exclude 'node_modules' --exclude '.next' \
  --exclude '.env' --exclude '.env.local' --exclude '.env*.local' \
  --exclude 'docker-compose.override.yml' --exclude 'deploy-build.log' \
  --exclude 'coverage' --exclude '.DS_Store' --exclude '*.tsbuildinfo' \
  --exclude '.data' --exclude '.vercel' \
  ./ root@213.130.144.215:/root/restaurant/
```
> `--delete` garde le VPS identique au local. `.env` est **exclu** donc protégé (secrets + mot de passe admin conservés).

### 3. Rebuild + redéploiement (sur le VPS)
```bash
ssh -i ~/.ssh/claude_deploy -o IdentitiesOnly=yes root@213.130.144.215 \
  'cd /root/restaurant && docker compose --env-file .env -p restaurant up -d --build'
```
- Les **migrations Prisma** s'appliquent automatiquement (service `migrate`) avant que l'app démarre.
- L'app n'est recréée que si le build réussit.

### 4. Vérifier
```bash
curl -s https://lodene.cloud/api/health      # -> {"status":"ok","db":"up"}
ssh -i ~/.ssh/claude_deploy -o IdentitiesOnly=yes root@213.130.144.215 \
  'docker compose -p restaurant ps'
```

---

## 📋 Cas particuliers

### Recharger les données du menu (seed)
⚠️ Le seed **réécrit** les plats/catégories de base. À n'utiliser que sur une base vide ou pour réinitialiser.
```bash
ssh -i ~/.ssh/claude_deploy -o IdentitiesOnly=yes root@213.130.144.215 \
  'cd /root/restaurant && docker compose --env-file .env -p restaurant run --rm migrate npm run db:seed'
```

### Modifier une variable d'environnement / un secret
```bash
ssh -i ~/.ssh/claude_deploy -o IdentitiesOnly=yes root@213.130.144.215
nano /root/restaurant/.env          # éditer la valeur
cd /root/restaurant
docker compose --env-file .env -p restaurant up -d app   # recrée l'app avec la nouvelle valeur
```
> Une variable `NEXT_PUBLIC_*` est figée au **build** → après l'avoir changée, refaire `up -d --build` (pas seulement `up -d app`).

### Changer le mot de passe admin
Éditer `ADMIN_PASSWORD=` dans `/root/restaurant/.env`, puis `docker compose --env-file .env -p restaurant up -d app`.

### Voir les logs de l'app
```bash
ssh -i ~/.ssh/claude_deploy -o IdentitiesOnly=yes root@213.130.144.215 \
  'docker logs -f --tail 100 restaurant-app-1'
```

### Sauvegardes de la base
- Automatique : chaque jour à 3h (`/etc/cron.d/lodene-restaurant` → `/root/backup-lodene-db.sh`), conservées 14 jours dans `/root/backups/`.
- Manuelle : `ssh … 'docker exec -t restaurant-db-1 pg_dump -U restaurant restaurant > /root/backups/lodene-manuel.sql'`

### Revenir en arrière (rollback simple)
Le plus sûr : `git checkout <commit-précédent>` en local, puis relancer `./deploy/update-lodene.sh`. (Pour un retour DB, restaurer un dump de `/root/backups/`.)

---

## ✅ Checklist express
- [ ] `npm run typecheck && npm run lint` OK en local
- [ ] `./deploy/update-lodene.sh`
- [ ] `https://lodene.cloud/api/health` → `ok`
- [ ] La page modifiée s'affiche bien sur https://lodene.cloud
