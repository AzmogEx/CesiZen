#!/bin/sh
set -e

cd /app

# Laravel a besoin d'un fichier .env (les variables d'env du conteneur,
# définies par Coolify, ont la priorité sur ce fichier).
[ -f .env ] || cp .env.example .env

# Clés générées au démarrage si absentes (À DÉFINIR EN PROD via Coolify :
# APP_KEY et JWT_SECRET, pour qu'elles restent stables entre déploiements).
if [ -z "$APP_KEY" ]; then
  echo "[entrypoint] APP_KEY absent — génération (pensez à la fixer dans Coolify)."
  php artisan key:generate --force
fi
if [ -z "$JWT_SECRET" ]; then
  echo "[entrypoint] JWT_SECRET absent — génération (pensez à le fixer dans Coolify)."
  php artisan jwt:secret --force
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
