# CESIZen - Application de santé mentale

## Contexte du projet
Projet individuel CESI École d'Ingénieurs — Bloc "Concevoir les solutions logicielles" (INFCDAAL1).
Commanditaire fictif : Ministère des Solidarités et de la Santé.
L'objectif est de proposer une plateforme grand public pour accompagner le quotidien de chacun et l'aider à mieux comprendre les enjeux de sa santé mentale et agir sur son stress.

## Module choisi
**Tracker d'émotions** (module facultatif au choix) + modules obligatoires (Comptes utilisateurs, Informations).

## Architecture technique

### Stack
- **Backend** : Laravel 11 (PHP 8.2+) — API REST JSON, JWT Auth (`tymon/jwt-auth`)
- **Frontend Web** : Next.js 16 (React 19, TypeScript, Tailwind CSS 4, Zustand, TanStack Query, Recharts)
- **Mobile natif** : React Native / Expo 53 (Expo Router, Zustand, SecureStore, TanStack Query)
- **Base de données** : PostgreSQL 16
- **Conteneurisation** : Docker Compose (postgres:5432, backend:8000, frontend:3000)

### Design Pattern
MVC côté backend (Models → Controllers → Routes, Service Layer pour les rapports).
Frontend : App Router, Custom Hooks, Component Composition, Zustand Store.

### Structure du projet
```
Cesizen/
├── backend/          # Laravel 11 API
├── frontend/         # Next.js (web)
├── mobile/           # React Native Expo (iOS + Android)
├── docker-compose.yml
└── generate_pdf.py   # Génération du cahier de tests (Python/fpdf)
```

## Fonctionnalités implémentées

### Modules obligatoires
- **Comptes utilisateurs** : inscription, connexion JWT, gestion profil, reset password, admin CRUD, désactivation/suppression, RGPD (soft delete + droit à la suppression)
- **Informations** : pages de contenu santé mentale (feeds), CRUD admin, affichage public

### Module au choix : Tracker d'émotions
| Fonctionnalité | Acteur | Web | Mobile |
|---|---|---|---|
| Afficher le journal de bord | Utilisateur | ✅ | ✅ |
| Ajouter une saisie (wizard 3 étapes) | Utilisateur | ✅ | ✅ |
| Modifier une saisie | Utilisateur | ✅ (modale) | ✅ (écran edit) |
| Supprimer une saisie | Utilisateur | ✅ | ✅ |
| Rapports par période (semaine/mois/trimestre/année) | Utilisateur | ✅ (graphiques) | ✅ |
| Configurer les émotions (2 niveaux) | Admin | ✅ | N/A |

### Hiérarchie des émotions (seed)
7 émotions de base (niveau 1) avec 31 sous-émotions (niveau 2) :
Joie, Tristesse, Colère, Peur, Dégoût, Surprise, Amour.

## Grille de priorisation des besoins
Critères utilisés : Complexité (0-3), Valeur ajoutée Ministère (0-3), Valeur ajoutée Utilisateur (0-3), Nécessité (0-2), Interdépendance (0-2). Total sur 15.

Top priorités :
- Diagnostic de stress / Journal émotions / Rapports d'émotions (10/15)
- Cryptage données / Inscription / Cohérence cardiaque / Activités détente / Ajout tracker (9/15)
- Conformité RGPD (8/15)

## Évaluation — Barème (/34 → note lettre)
| Domaine | Livrable | Pts |
|---|---|---|
| Recueil du besoin | Reformulation (contexte, enjeux, contraintes) | 6 |
| | Identification des besoins logiciels | 3 |
| | Critères de priorités et pondération | 2 |
| Analyse des besoins | Complétude du CdC, contraintes, opportunités | 4 |
| | Réponse fonctionnelle adaptée et originale | 4 |
| | Schématisation et reformulation visuelle | 2 |
| Modélisation | MCD (Merise/UML) | 3 |
| | Conception technique MVC | 2 |
| | Spécifications fonctionnelles et techniques | 4 |
| | Données personnelles et sensibles | 1 |
| Dossier et soutenance | Qualité dossier + oral (20 min + 10 Q/R) | 3 |

Conversion : A (27-34) | B (20-26,99) | C (14-19,99) | D (0-13,99)

## Livrables attendus
1. **Cahier des charges** (15-20 pages) : contexte, parties prenantes, besoins reformulés, priorisation, contraintes
2. **Spécifications fonctionnelles et techniques** : UML, analyse détaillée (2 obligatoires + 1 au choix), MCD, MVC, RGPD
3. **Soutenance orale** : 20 min + 10 min Q/R

## Acteurs du système
- **Visiteur anonyme** : consultation informations, accès public
- **Utilisateur connecté** : tracker émotions, journal, rapports, profil
- **Administrateur** : gestion utilisateurs, contenus, émotions

## Conventions de code
- Backend : PHP PSR-12, noms en français (utilisateur, saisie_tracker, émotion)
- Frontend : TypeScript strict, composants fonctionnels, hooks customs
- Mobile : même conventions que le frontend web
- Langue de l'interface : français
- Langue de l'instruction CLAUDE.md globale : toujours répondre en français

## Commandes utiles
```bash
# Backend
cd backend && php artisan serve          # API sur :8000
cd backend && php artisan migrate:fresh --seed  # Reset + seed DB

# Frontend Web
cd frontend && npm run dev               # Dev server sur :3000

# Mobile
cd mobile && npm install && npx expo start  # Expo dev server

# Docker (tout lancer)
docker-compose up -d
```
