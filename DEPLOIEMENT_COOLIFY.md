# Déploiement CESIZen sur Coolify

Stack de production : **PostgreSQL + API Laravel + Frontend Next.js (DSFR)**.
Le mobile (Expo) n'est pas concerné (ce n'est pas une appli web).

Fichiers fournis :
- `backend/Dockerfile.prod` — API Laravel (PHP 8.4, migrations + seed au démarrage)
- `frontend/Dockerfile.prod` — Next.js en sortie *standalone* (image légère)
- `docker-compose.prod.yaml` — orchestration des 3 services
- `backend/docker/entrypoint.sh` — démarrage de l'API

---

## Option recommandée : « Docker Compose » dans Coolify

1. **Créer une ressource** → *Docker Compose* → connecter le dépôt GitHub `AzmogEx/CesiZen`, branche `main`.
2. **Compose file** : `docker-compose.prod.yaml`.
3. Renseigner les **variables d'environnement** (ci-dessous).
4. **Domaines** : dans Coolify, mapper
   - le service **frontend** (port `3000`) sur ton domaine principal (ex. `cesizen.tondomaine.fr`)
   - le service **backend** (port `8000`) sur un sous-domaine API (ex. `api.cesizen.tondomaine.fr`)
5. **Déployer**.

> Le frontend lit l'API via `NEXT_PUBLIC_API_URL`, **injectée au build** → elle doit pointer vers l'**URL publique** du backend (pas l'URL interne Docker).

---

## Variables d'environnement à définir dans Coolify

| Variable | Exemple | Rôle |
|---|---|---|
| `POSTGRES_DB` | `cesizen` | Nom de la base |
| `POSTGRES_USER` | `cesizen` | Utilisateur base |
| `POSTGRES_PASSWORD` | *(mot de passe fort)* | **Obligatoire** |
| `APP_KEY` | `base64:...` | Clé Laravel — voir génération ci-dessous |
| `JWT_SECRET` | *(chaîne aléatoire)* | Secret JWT — voir génération |
| `JWT_TTL` | `60` | Durée de vie du token (min) |
| `APP_URL` | `https://api.cesizen.tondomaine.fr` | URL publique de l'API |
| `FRONTEND_URL` | `https://cesizen.tondomaine.fr` | Origine autorisée (CORS) |
| `NEXT_PUBLIC_API_URL` | `https://api.cesizen.tondomaine.fr/api/v1` | URL publique de l'API côté navigateur |

### Générer les secrets (en local)
```bash
# APP_KEY
docker run --rm php:8.4-cli sh -c "php -r 'echo \"base64:\".base64_encode(random_bytes(32)).\"\n\";'"
# JWT_SECRET (64 caractères)
openssl rand -base64 48 | tr -d '\n='
```
> Définis-les **une fois** dans Coolify pour qu'ils restent stables entre déploiements. Si tu ne les fournis pas, l'entrypoint en génère au démarrage — mais ils changeront à chaque redéploiement (déconnexion de tous les utilisateurs).

---

## Notes

- **Migrations & seed** : exécutés automatiquement au démarrage du backend. Les seeders sont **idempotents** (pas de doublons même au redémarrage). La base est peuplée avec les comptes de démo (`admin@cesizen.fr` / `Admin123!`, `demo@cesizen.fr` / `Demo123!`) et le référentiel d'émotions.
- **Cache/queue/session** : en `database` (aucun Redis requis). Tu peux ajouter un service Redis et repasser ces variables sur `redis` si besoin.
- **HTTPS** : géré par le proxy de Coolify (Traefik). Pense à passer `APP_URL`/`FRONTEND_URL`/`NEXT_PUBLIC_API_URL` en `https://`.
- **Serveur PHP** : l'API tourne via `php artisan serve` (suffisant pour ce projet). Pour une charge réelle, on passerait à php-fpm+nginx ou FrankenPHP/Octane.

---

## Déploiement par services séparés (alternative)

Si tu préfères 3 ressources distinctes dans Coolify :
1. **PostgreSQL** : ressource « Database » Coolify (récupère host/user/password).
2. **Backend** : ressource « Dockerfile », dossier `backend`, fichier `Dockerfile.prod`, port `8000`, + les variables `APP_*`, `DB_*`, `JWT_*`, `FRONTEND_URL`.
3. **Frontend** : ressource « Dockerfile », dossier `frontend`, fichier `Dockerfile.prod`, port `3000`, **build arg** `NEXT_PUBLIC_API_URL`.
