# 🧠 CESIZen

**Plateforme web de gestion du stress et suivi émotionnel**

Projet réalisé dans le cadre du bloc « Concevoir les solutions logicielles » (INFCDAAL1) — CESI École d'Ingénieurs, pour le Ministère des Solidarités et de la Santé.

---

## 📋 Présentation

CESIZen est une application web permettant aux utilisateurs de :

- **Suivre leurs émotions** au quotidien via un tracker émotionnel
- **Visualiser leurs tendances** grâce à des graphiques et rapports statistiques
- **Consulter des ressources** d'information sur la santé mentale
- **Gérer leur profil** avec respect du RGPD (droit de suppression)

L'application propose également un **espace administrateur** pour gérer les utilisateurs, les contenus et les émotions.

---

## 🛠 Stack technique

| Couche | Technologie |
|--------|------------|
| **Backend** | Laravel 11 (PHP 8.2+) — API REST |
| **Frontend** | Next.js 14 (React, TypeScript, Tailwind CSS) — App Router |
| **Base de données** | PostgreSQL 16 |
| **Authentification** | JWT (`tymon/jwt-auth`) |
| **Conteneurisation** | Docker & Docker Compose |

### Dépendances frontend notables

- `zustand` — gestion d'état (authentification)
- `@tanstack/react-query` — data fetching & cache
- `recharts` — graphiques et visualisations
- `next-themes` — dark mode
- `lucide-react` — icônes
- `react-hot-toast` — notifications

---

## 🚀 Installation & Lancement

### Prérequis

- [Docker](https://www.docker.com/) & Docker Compose
- Ou bien : PHP 8.2+, Composer, Node.js 20+, PostgreSQL 16

### Avec Docker (recommandé)

```bash
# Cloner le projet
git clone https://github.com/AzmogEx/CesiZen.git
cd CesiZen

# Lancer les 3 services (PostgreSQL, backend, frontend)
docker compose up -d
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3000
- **API Backend** : http://localhost:8000

### Sans Docker (développement local)

```bash
# 1. Base de données PostgreSQL
# Créer une base "cesizen" sur votre instance PostgreSQL locale

# 2. Backend
cd backend
cp .env.example .env
# Configurer les variables DB_* dans .env
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve    # → http://localhost:8000

# 3. Frontend
cd frontend
cp .env.local.example .env.local
# Vérifier NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
npm install
npm run dev          # → http://localhost:3000
```

---

## 📁 Structure du projet

```
CesiZen/
├── backend/                  # API Laravel 11
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # 8 controllers (Auth, Profil, Feed, Emotion, Tracker, 3 Admin)
│   │   │   ├── Middleware/    # JWT, Role, ForceJsonResponse
│   │   │   └── Requests/     # 5 Form Requests avec validation
│   │   ├── Models/            # 8 modèles Eloquent
│   │   └── Services/         # RapportService (statistiques)
│   ├── database/
│   │   ├── migrations/       # 10 migrations
│   │   └── seeders/          # Rôles, admin, émotions, articles
│   └── routes/api.php        # Routes API v1
│
├── frontend/                  # App Next.js 14
│   └── src/
│       ├── app/               # Pages (App Router)
│       │   ├── (auth)/        # Connexion, inscription
│       │   ├── (protected)/   # Dashboard, journal, profil, rapports
│       │   ├── (admin)/       # Admin (utilisateurs, contenus, émotions)
│       │   └── informations/  # Pages d'information publiques
│       ├── components/        # Composants UI & layout
│       ├── hooks/             # Hooks React (auth, feeds, tracker, émotions)
│       ├── lib/               # Client API (Axios), store Zustand
│       └── types/             # Interfaces TypeScript
│
└── docker-compose.yml         # Orchestration des 3 services
```

---

## 🔌 API Endpoints

Préfixe : `/api/v1`

### Publiques
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/auth/register` | Inscription |
| `POST` | `/auth/login` | Connexion (retourne JWT) |
| `GET` | `/feeds` | Liste des articles publiés |
| `GET` | `/feeds/{slug}` | Détail d'un article |

### Authentifiées (membre)
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/auth/me` | Profil courant |
| `POST` | `/auth/logout` | Déconnexion |
| `GET/PUT` | `/profil` | Lire / modifier profil |
| `PUT` | `/profil/password` | Changer mot de passe |
| `DELETE` | `/profil` | Supprimer compte (RGPD) |
| `GET` | `/emotions` | Liste des émotions |
| `GET/POST` | `/tracker/saisies` | Lister / créer une saisie |
| `PUT/DELETE` | `/tracker/saisies/{id}` | Modifier / supprimer une saisie |
| `GET` | `/tracker/rapports` | Rapport statistique |

### Administration
| Méthode | Route | Description |
|---------|-------|-------------|
| `CRUD` | `/admin/utilisateurs` | Gestion des utilisateurs |
| `CRUD` | `/admin/feeds` | Gestion des contenus |
| `CRUD` | `/admin/emotions` | Gestion des émotions |

---

## 🎨 Charte graphique

| Élément | Valeur |
|---------|--------|
| Couleur principale | `#fce117` (Candlelight — jaune) |
| Couleur secondaire | `#06c656` (Malachite — vert) |
| Couleur tertiaire | `#000000` (noir) |
| Police body | Inter |
| Police titres | Poppins |
| Dark mode | ✅ Supporté |
| Responsive | ✅ Mobile-first |

---

## 👤 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | `admin@cesizen.fr` | `Admin123!` |

---

## 📦 Modules

1. **Comptes utilisateurs** — inscription, connexion, profil, admin CRUD, suppression RGPD
2. **Informations** — pages de contenu (CMS), CRUD admin
3. **Tracker d'émotions** — journal émotionnel, saisies avec intensité, rapports graphiques (camembert, courbes, barres)

---

## 📄 Licence

Projet académique — CESI École d'Ingénieurs © 2026
