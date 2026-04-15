FROM php:8.4-cli

# Extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql bcmath \
    && pecl install redis && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /app

# Dépendances PHP d'abord (cache Docker)
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

# Copier le reste du code
COPY . .
RUN composer dump-autoload --optimize

EXPOSE 8000

# Script de démarrage : migration + seed + serve
CMD php artisan migrate --seed --force && php artisan serve --host=0.0.0.0 --port=8000
