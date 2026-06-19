#!/bin/sh
set -e

cd /app

# Laravel a besoin d'un fichier .env.
[ -f .env ] || cp .env.example .env

# Aligne les paramètres de connexion à la base DANS le .env (avec valeurs par
# défaut). Indispensable : un DB_PASSWORD vide dans .env masquait la valeur du
# conteneur -> "fe_sendauth: no password supplied".
: "${DB_HOST:=postgres}"
: "${DB_PORT:=5432}"
: "${DB_DATABASE:=cesizen}"
: "${DB_USERNAME:=cesizen}"
: "${DB_PASSWORD:=cesizen_secret_change_me}"
export DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD
sed -i \
  -e "s|^DB_CONNECTION=.*|DB_CONNECTION=pgsql|" \
  -e "s|^DB_HOST=.*|DB_HOST=${DB_HOST}|" \
  -e "s|^DB_PORT=.*|DB_PORT=${DB_PORT}|" \
  -e "s|^DB_DATABASE=.*|DB_DATABASE=${DB_DATABASE}|" \
  -e "s|^DB_USERNAME=.*|DB_USERNAME=${DB_USERNAME}|" \
  -e "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASSWORD}|" \
  .env

# URLs publiques : forcées dans .env si fournies par le conteneur. Indispensable
# pour le CORS : un FRONTEND_URL=http://localhost du .env bloquait l'origine de
# production (-> "is not allowed by Access-Control-Allow-Origin").
if [ -n "$APP_URL" ]; then sed -i "s|^APP_URL=.*|APP_URL=${APP_URL}|" .env; fi
if [ -n "$FRONTEND_URL" ]; then sed -i "s|^FRONTEND_URL=.*|FRONTEND_URL=${FRONTEND_URL}|" .env; fi

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

# Purge tout cache de config/route résiduel (pour relire les variables d'env).
php artisan optimize:clear || true

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
