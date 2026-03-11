# CESIZen — Application de santé mentale

## Projet
Projet CESI École d'Ingénieurs — Bloc "Concevoir les solutions logicielles" (INFCDAAL1).
Plateforme web de gestion du stress et suivi émotionnel pour le Ministère des Solidarités et de la Santé.

## Stack technique
- **Backend** : Laravel 11 (PHP 8.2+) — API REST, architecture MVC
- **Frontend** : Next.js 14 (React + TypeScript + Tailwind CSS) — App Router, `src/` dir
- **BDD** : PostgreSQL 16 (via Docker)
- **Auth** : JWT (`tymon/jwt-auth`)
- **Dépendances frontend** : axios, zustand, @tanstack/react-query, recharts, next-themes, lucide-react, react-hot-toast

## Charte graphique
- Couleur principale : `#fce117` (Candlelight / jaune) — Tailwind: `candlelight-*`
- Couleur secondaire : `#06c656` (Malachite / vert) — Tailwind: `malachite-*`
- Couleur tertiaire : `#000000` (noir)
- Polices : Inter (body, `font-sans`), Poppins (titres, `font-display`)
- Dark mode supporté (next-themes, class strategy)
- Mobile-first, RGAA accessible

## Modules implémentés
1. **Comptes utilisateurs** (obligatoire) — inscription, profil, admin CRUD, reset password
2. **Informations** (obligatoire) — pages de contenu CMS, CRUD admin
3. **Tracker d'émotions** (au choix) — journal émotionnel, saisies, rapports graphiques

## État d'avancement

### FAIT (backend)
- Projet Laravel initialisé avec JWT configuré
- Config auth.php : guard `api` avec driver `jwt`, provider `utilisateurs` (modèle Utilisateur)
- Config cors.php : frontend localhost:3000 autorisé
- 10 migrations créées (roles, utilisateurs, emotions, trackers, saisie_trackers, feeds, contacts_urgence, audits, cache, sessions)
- 8 modèles Eloquent (Role, Utilisateur avec JWTSubject, Emotion, Tracker, SaisieTracker, Feed, ContactUrgence, Audit)
- 5 seeders (RoleSeeder, AdminSeeder admin@cesizen.fr/Admin123!, EmotionSeeder 7 émotions + sous-émotions, FeedSeeder 4 articles)
- 3 middleware (JwtMiddleware, RoleMiddleware, ForceJsonResponse)
- 5 Form Requests (RegisterRequest, LoginRequest, UpdateProfilRequest, StoreSaisieRequest, StoreFeedRequest)
- 8 controllers (AuthController, ProfilController, FeedController, EmotionController, SaisieTrackerController, + 3 Admin)
- RapportService (stats émotions par période week/month/quarter/year)
- Routes API v1 complètes dans routes/api.php
- bootstrap/app.php configuré avec middleware alias et routing API

### FAIT (frontend)
- Projet Next.js 14 initialisé avec Tailwind, TypeScript, App Router
- tailwind.config.ts avec couleurs candlelight/malachite + polices Inter/Poppins
- globals.css avec import Google Fonts + variables CSS dark/light
- layout.tsx avec providers (ThemeProvider, QueryClientProvider, Toaster)
- Providers.tsx (composant client wrapper)
- .env.local avec NEXT_PUBLIC_API_URL
- src/lib/api.ts (client Axios avec intercepteurs JWT)
- src/lib/auth-store.ts (store Zustand avec persist)
- src/types/index.ts (interfaces TypeScript complètes)
- 5 hooks (useAuth, useFeeds, useTracker, useRapport, useEmotions)
- 7 composants UI (Button, Input, Card, Modal, Badge, Slider, Skeleton, ThemeToggle)
- 3 composants layout (Header, Footer, Sidebar)
- Page d'accueil (landing page avec hero, features, CTA)
- Page /connexion (formulaire login)
- Page /inscription (formulaire register avec consentement RGPD)

### À FAIRE (prioritaire)
- **Lancer Docker PostgreSQL** (`docker compose up -d`) — Docker n'était pas démarré
- **Migrer la BDD** (`cd backend && php artisan migrate --seed`)
- **Tester l'API** (`php artisan serve` puis tester login/register)
- Pages frontend manquantes :
  - `(public)/informations/page.tsx` — liste des articles
  - `(public)/informations/[slug]/page.tsx` — détail article
  - `(protected)/dashboard/page.tsx` — tableau de bord utilisateur
  - `(protected)/profil/page.tsx` — page profil
  - `(protected)/journal/page.tsx` — journal d'émotions (timeline)
  - `(protected)/journal/nouvelle-saisie/page.tsx` — formulaire saisie multi-étapes
  - `(protected)/journal/rapports/page.tsx` — graphiques recharts
  - `(admin)/admin/dashboard/page.tsx` — dashboard admin
  - `(admin)/admin/utilisateurs/page.tsx` — gestion utilisateurs
  - `(admin)/admin/contenus/page.tsx` — gestion contenus
  - `(admin)/admin/emotions/page.tsx` — gestion émotions
- Layout protégé avec sidebar pour les pages (protected) et (admin)
- Middleware Next.js pour protéger les routes auth
- Composants features (EmotionPicker, EmotionChart, TrackerTimeline)

### À FAIRE (bonus)
- EncryptionService AES-256 pour chiffrer les notes en BDD
- AuditMiddleware pour logger les actions admin
- Page mot de passe oublié (forgot/reset password)
- Export données utilisateur (RGPD droit d'accès)
- Tests PHPUnit backend
- Responsive fine-tuning mobile

## Structure du projet
```
Cesizen/
├── backend/                # Laravel 11 API
│   ├── app/Models/         # Eloquent : Utilisateur, Role, Tracker, SaisieTracker, Emotion, Feed, Audit, ContactUrgence
│   ├── app/Http/Controllers/
│   │   ├── AuthController.php
│   │   ├── ProfilController.php
│   │   ├── FeedController.php
│   │   ├── EmotionController.php
│   │   ├── SaisieTrackerController.php
│   │   └── Admin/          # AdminUtilisateurController, AdminFeedController, AdminEmotionController
│   ├── app/Services/       # RapportService (stats émotions)
│   ├── app/Http/Middleware/ # JwtMiddleware, RoleMiddleware, ForceJsonResponse
│   ├── app/Http/Requests/  # RegisterRequest, LoginRequest, StoreSaisieRequest, StoreFeedRequest, UpdateProfilRequest
│   ├── database/migrations/ # 10 fichiers migration
│   ├── database/seeders/   # RoleSeeder, AdminSeeder, EmotionSeeder, FeedSeeder
│   ├── bootstrap/app.php   # Configuré avec middleware alias jwt.auth + role
│   ├── config/auth.php     # Guard api/jwt, provider utilisateurs
│   ├── config/cors.php     # CORS frontend localhost:3000
│   └── routes/api.php      # Toutes les routes API v1
├── frontend/               # Next.js 14
│   ├── src/app/
│   │   ├── layout.tsx      # Layout racine avec Providers
│   │   ├── page.tsx        # Landing page (FAIT)
│   │   ├── (auth)/connexion/page.tsx    # FAIT
│   │   ├── (auth)/inscription/page.tsx  # FAIT
│   │   ├── (public)/informations/       # À FAIRE
│   │   ├── (protected)/dashboard/       # À FAIRE
│   │   ├── (protected)/profil/          # À FAIRE
│   │   ├── (protected)/journal/         # À FAIRE
│   │   └── (admin)/admin/               # À FAIRE
│   ├── src/components/
│   │   ├── Providers.tsx   # Client providers wrapper (FAIT)
│   │   ├── ui/             # Button, Input, Card, Modal, Badge, Slider, Skeleton, ThemeToggle (FAIT)
│   │   ├── layout/         # Header, Footer, Sidebar (FAIT)
│   │   └── features/       # À CRÉER (EmotionPicker, EmotionChart, TrackerTimeline)
│   ├── src/lib/
│   │   ├── api.ts          # Client Axios (FAIT)
│   │   └── auth-store.ts   # Store Zustand (FAIT)
│   ├── src/hooks/          # useAuth, useFeeds, useTracker, useRapport, useEmotions (FAIT)
│   └── src/types/index.ts  # Interfaces TypeScript (FAIT)
├── docker-compose.yml      # PostgreSQL 16
└── .gitignore
```

## API Endpoints (préfixe `/api/v1`)

### Auth (public)
- `POST /auth/register` — Inscription
- `POST /auth/login` — Connexion (retourne JWT) — rate limited 5/min
- `POST /auth/logout` — Déconnexion (auth)
- `GET /auth/me` — Profil courant (auth)
- `POST /auth/refresh` — Rafraîchir token (auth)

### Profil (auth membre)
- `GET /profil` / `PUT /profil` — Lire/modifier profil
- `PUT /profil/password` — Changer mot de passe
- `DELETE /profil` — Supprimer compte (RGPD)

### Informations (public)
- `GET /feeds` — Liste pages publiées
- `GET /feeds/{slug}` — Détail page

### Tracker (auth membre)
- `GET /tracker/saisies` — Mes saisies (filtres: date_debut, date_fin, emotion_id)
- `POST /tracker/saisies` — Nouvelle saisie
- `PUT /tracker/saisies/{id}` — Modifier saisie
- `DELETE /tracker/saisies/{id}` — Supprimer saisie
- `GET /tracker/rapports?period=week|month|quarter|year` — Rapport statistique

### Émotions (auth membre)
- `GET /emotions` — Liste arborescente (niveau 1 + sous-émotions niveau 2)

### Admin (auth admin)
- `GET/POST/PUT/DELETE /admin/utilisateurs` — CRUD utilisateurs
- `PATCH /admin/utilisateurs/{id}/toggle-active` — Activer/désactiver
- `GET/POST/PUT/DELETE /admin/feeds` — CRUD contenus
- `GET/POST/PUT/DELETE /admin/emotions` — CRUD émotions

## Base de données (tables)
1. `roles` — id, nom (visiteur/membre/administrateur), description
2. `utilisateurs` — id, nom, prenom, email, password (bcrypt), role_id, est_actif, consentement_rgpd, soft delete
3. `emotions` — id, nom, couleur, icone, niveau (1 ou 2), parent_id (auto-ref), est_actif
4. `trackers` — id, utilisateur_id, nom
5. `saisie_trackers` — id, tracker_id, emotion_id, intensite (1-10), note, date_saisie
6. `feeds` — id, titre, slug, contenu (HTML), image_url, est_publie, auteur_id, ordre
7. `contacts_urgence` — id, utilisateur_id, nom, telephone, relation
8. `audits` — id, utilisateur_id, action, table_cible, anciennes_valeurs, nouvelles_valeurs, ip_address

## Comptes de test
- **Admin** : admin@cesizen.fr / Admin123!

## Commandes utiles
```bash
# BDD
docker compose up -d                    # Démarrer PostgreSQL

# Backend
cd backend
php artisan migrate --seed              # Créer les tables et données de test
php artisan serve                        # API sur localhost:8000

# Frontend
cd frontend
npm run dev                              # App sur localhost:3000
```

## Conventions
- Parler toujours en français dans les commits et commentaires
- API versionnée `/api/v1/`
- Nommage des tables/colonnes en snake_case français
- Composants React en PascalCase
- Routes frontend en français (connexion, inscription, journal, etc.)
- Icônes : lucide-react
- Notifications : react-hot-toast
- State management : zustand (auth), @tanstack/react-query (data fetching)
