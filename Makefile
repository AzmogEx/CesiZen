# CESIZen — commandes de développement
# Modèle : backend + base de données dans Docker, web et mobile en local (hot reload).
# Tape simplement `make` pour voir l'aide.

.DEFAULT_GOAL := help
.PHONY: help back back-logs back-stop web mobile up down stop ps seed migrate fresh test kill-3000

## help : affiche cette aide
help:
	@echo ""
	@echo "  CESIZen — commandes disponibles"
	@echo ""
	@echo "  \033[36mmake back\033[0m      Lance le BACKEND (API + PostgreSQL + Redis) dans Docker   -> http://localhost:8000"
	@echo "  \033[36mmake web\033[0m       Lance le SITE WEB / landing page (Next.js, local)         -> http://localhost:3000"
	@echo "  \033[36mmake mobile\033[0m    Lance l'APP MOBILE (Expo) + QR code"
	@echo ""
	@echo "  \033[36mmake up\033[0m        Lance TOUT dans Docker (api + db + redis + front)"
	@echo "  \033[36mmake down\033[0m      Arrête tous les conteneurs Docker"
	@echo "  \033[36mmake stop\033[0m      Arrête Docker ET libère le port 3000 (front local)"
	@echo "  \033[36mmake ps\033[0m        État des conteneurs"
	@echo ""
	@echo "  \033[36mmake seed\033[0m      Reset + remplit la base (migrate:fresh --seed)"
	@echo "  \033[36mmake migrate\033[0m   Applique les migrations"
	@echo "  \033[36mmake test\033[0m      Lance les tests backend (PHPUnit)"
	@echo "  \033[36mmake back-logs\033[0m Affiche les logs de l'API en direct"
	@echo "  \033[36mmake kill-3000\033[0m Libère le port 3000 s'il est bloqué"
	@echo ""

# ---------------------------------------------------------------------------
# Backend (API Laravel + PostgreSQL + Redis) — dans Docker, SANS le front
# ---------------------------------------------------------------------------

## back : démarre l'API + la base + Redis (pas le front -> évite le conflit de port 3000)
back:
	docker compose up -d postgres redis backend
	@echo ""
	@echo "✅ Backend prêt -> API sur http://localhost:8000  (logs: make back-logs)"

## back-logs : suit les logs de l'API
back-logs:
	docker compose logs -f backend

## back-stop : arrête uniquement la stack backend
back-stop:
	docker compose stop postgres redis backend

# ---------------------------------------------------------------------------
# Web (Next.js) — en local pour le hot reload
# ---------------------------------------------------------------------------

## web : lance le site web / landing page en local
web:
	cd frontend && npm run dev

# ---------------------------------------------------------------------------
# Mobile (Expo)
# ---------------------------------------------------------------------------

## mobile : lance le serveur Expo (scanne le QR code avec Expo Go)
mobile:
	cd mobile && npx expo start

# ---------------------------------------------------------------------------
# Tout en Docker (alternative : front inclus, ne pas combiner avec `make web`)
# ---------------------------------------------------------------------------

## up : lance toute la stack dans Docker (api + db + redis + front)
up:
	docker compose up -d

## down : arrête tous les conteneurs
down:
	docker compose down

## stop : arrête Docker et libère le port 3000
stop: down kill-3000

## ps : état des conteneurs
ps:
	docker compose ps

# ---------------------------------------------------------------------------
# Base de données / tests
# ---------------------------------------------------------------------------

## seed : reset complet + données de démo
seed:
	docker compose exec backend php artisan migrate:fresh --seed

## migrate : applique les migrations
migrate:
	docker compose exec backend php artisan migrate

## fresh : alias de seed
fresh: seed

## test : tests backend
test:
	docker compose exec backend php artisan test

# ---------------------------------------------------------------------------
# Utilitaire : libère le port 3000
# ---------------------------------------------------------------------------

## kill-3000 : tue le process qui occupe le port 3000
kill-3000:
	@lsof -ti tcp:3000 | xargs kill -9 2>/dev/null && echo "Port 3000 libéré." || echo "Port 3000 déjà libre."
