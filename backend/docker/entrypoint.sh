#!/bin/sh
set -e

cd /app

# Laravel a besoin d'un fichier .env (les variables d'env du conteneur,
# définies par Coolify, ont la priorité sur ce fichier).
[ -f .env ] || cp .env.example .env

# --- APP_KEY ---
# Si fournie (Coolify) : on la force dans .env. Sinon : on en génère une et on
# l'EXPORTE, sinon une variable d'env vide masquerait la valeur du .env
# (phpdotenv n'écrase pas une variable déjà présente) -> MissingAppKeyException.
if [ -n "$APP_KEY" ]; then
  echo "[entrypoint] APP_KEY fournie."
  sed -i "s|^APP_KEY=.*|APP_KEY=${APP_KEY}|" .env
else
  echo "[entrypoint] APP_KEY absente — génération (pensez à la fixer dans Coolify)."
  php artisan key:generate --force
  APP_KEY="$(grep '^APP_KEY=' .env | cut -d '=' -f 2-)"
  export APP_KEY
fi

# --- JWT_SECRET ---
if [ -n "$JWT_SECRET" ]; then
  echo "[entrypoint] JWT_SECRET fourni."
  sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|" .env
else
  echo "[entrypoint] JWT_SECRET absent — génération (pensez à le fixer dans Coolify)."
  php artisan jwt:secret --force
  JWT_SECRET="$(grep '^JWT_SECRET=' .env | cut -d '=' -f 2-)"
  export JWT_SECRET
fi

# Base de données : migrations + seed (les seeders sont idempotents).
echo "[entrypoint] Migrations..."
php artisan migrate --force
echo "[entrypoint] Seed (idempotent)..."
php artisan db:seed --force || true

# Optimisation (les routes ne dépendent pas de l'env ; on évite config:cache
# pour ne pas figer des variables d'environnement par erreur).
php artisan route:cache || true
php artisan view:cache || true

echo "[entrypoint] Démarrage de l'API sur le port 8000."
exec php artisan serve --host=0.0.0.0 --port=8000
