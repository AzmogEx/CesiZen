# 🎯 Antisèche oral CESIZen — à garder sous les yeux

**20 min (présentation + démo live de l'app) + 10 min Q/R · 16 slides · checkpoint à 12:30**

> 🌐 App en ligne : **https://cesizen.cleanows.fr** (API : api.cesizen.cleanows.fr) · Interface au **Système de Design de l'État (DSFR)**

---

## 🔢 Chiffres à sortir sans hésiter
- **22 %** des Français = trouble de santé mentale au cours de leur vie (Santé Publique France, 2023)
- **2** modules obligatoires (Comptes, Informations) **+ 1** au choix (Tracker)
- Priorisation **/15** → le Tracker cumule **4 fonctions à 9-10/15**
- **6** émotions de base **+ 36** sous-émotions (référentiel du sujet)
- **8** entités au MCD · **1** API REST → **2** clients (web + mobile)
- JWT **60 min** + refresh · throttle login **5/min**
- **29** tests automatisés (19 back + 6 front + 4 mobile)
- **DSFR** : interface au Système de Design de l'État (charte gouv.fr) — web + mobile
- **Déployé en ligne** : https://cesizen.cleanows.fr (Docker + HTTPS, vrai service en prod)
- Contraintes sujet : budget **75 000 €**, livraison **12 mois**

---

## 🗺️ Déroulé (mots-clés seulement) — démo live intégrée

**0:00–2:00 · Intro (slides 1-2)**
- Qui je suis · commanditaire = Ministère · objet = plateforme grand public santé mentale
- Fil rouge : *« recueil → priorisation → réponse fonctionnelle + démo → modélisation → RGPD »*
- ➡️ *« Commençons par le contexte. »*

**2:00–4:30 · Contexte & parties prenantes (slides 3-4)**
- Enjeu sociétal (22 %, stigmatisation) · 4 objectifs stratégiques
- Parties prenantes : Ministère ↔ apprenant ↔ HDS ↔ utilisateurs ↔ CNIL · 3 acteurs
- 💬 *« le besoin a été reformulé, pas recopié »*
- ➡️ *« Comment ai-je choisi quoi développer ? »*

**4:30–6:00 · Besoins & priorisation (slides 5-6)**
- Périmètre : 2 oblig + Tracker · modules écartés **assumés**
- Grille pondérée /15 → Tracker = plus rentable
- ➡️ *« Voyons la réponse fonctionnelle. »*

**6:00–8:30 · Réponse fonctionnelle Comptes + Informations (slides 7-8)**
- **Comptes** : JWT · RGPD · admin CRUD (maquette)
- **Informations** : feeds · slug auto · modération (maquette)
- 💬 **DSFR transversal** : toute l'interface (web + mobile) suit le **Système de Design de l'État** → en-tête « République Française », accessibilité RGAA, crédibilité institutionnelle
- ➡️ *« Et pour le Tracker, je vais vous le montrer en direct. »*

**8:30–12:30 · 🎬 DÉMO LIVE — le Tracker (voir script ci-dessous)**
- inscription/connexion → journal → wizard 3 étapes → rapport graphique
- 💬 chaque écran = réponse à un besoin précis
- ➡️ *« Voyons maintenant ce qui structure tout ça techniquement. »*

**12:30–16:00 · Modélisation (slides 10-11-12)** — ⚠️ si retard, accélère ici
- **Cas d'usage UML** : couverture par acteur
- **MCD Merise** : 8 entités · cardinalités · hiérarchie émotions auto-référencée (parent_id)
- **MVC découplé** : 1 API → 2 clients · justif = testabilité, évolutivité, non-duplication
- ➡️ *« Ces données étant sensibles, parlons RGPD. »*

**16:00–17:30 · RGPD & sécurité (slide 13)**
- Données de santé = sensibles (art. 9) · consentement · droits CNIL (export/anonymisation)
- bcrypt (mdp) · soft delete · **table audits alimentée** (observers Eloquent : création/modif/suppression tracées) · AES-256 prévu en prod HDS · TLS
- ➡️ *« Tout cela est concrétisé par un prototype. »*

**17:30–19:00 · Prototype & perspectives (slide 14)**
- Stack réelle : Laravel + Next.js + Expo + Docker · **29 tests automatisés**
- **Déployé en ligne** : https://cesizen.cleanows.fr (Coolify, conteneurs Docker, HTTPS) → *« ce n'est pas qu'une maquette, c'est en production »*
- Ouverture : activer les modules écartés sans réécrire · Mon Espace Santé (FHIR) · Open Data

**19:00–20:00 · Conclusion**
- 1 phrase : *besoin reformulé → périmètre priorisé → réponse fonctionnelle → archi pérenne → conformité*
- Remercier · *« Je suis à votre disposition pour vos questions. »*

---

## 🎬 Script de démo (≈ 4 min) — le Tracker en direct

**AVANT de commencer l'oral** (à faire pendant l'installation, app déjà lancée) :
- onglet navigateur ouvert sur **https://cesizen.cleanows.fr** (en ligne) — repli **http://localhost:3000** si pas de réseau (`docker compose up -d`)
- **déjà connecté** sur le compte de démo · zoom navigateur à **125 %** · notifications coupées
- Compte : laisser le **journal pré-rempli** de quelques saisies (sinon le rapport est vide)

**Pendant la démo (chemin balisé, ne pas improviser) :**
1. *(20 s)* Page **Informations** publique → *« voici le module Informations, accessible sans compte »*
2. *(30 s)* **Journal de bord** → *« le membre retrouve son historique émotionnel »*
3. *(90 s)* **Nouvelle saisie** → wizard : Étape 1 émotion (Joie) → Étape 2 sous-émotion + intensité (slider) → Étape 3 date + note → **Valider** → *« elle apparaît immédiatement dans le journal »*
4. *(60 s)* **Rapports** → changer la période (semaine → mois) → *« camembert de répartition + courbe d'évolution, calculés côté API »*
5. *(20 s, si le temps)* mention rapide **admin** : config des émotions

🛟 **Filet de sécurité** : si la démo plante, je bascule sur les **maquettes des slides** sans m'excuser → *« je vous montre les écrans clés »*. Zéro stress.

🔑 Admin seedé : `admin@cesizen.fr` / `Admin123!`

---

## ❓ Q/R — réflexes (question → mots-clés de réponse)
- **Pourquoi le Tracker ?** → grille /15 en tête · 3 modules aboutis > 6 superficiels · archi extensible
- **Pourquoi MVC découplé ?** → 1 API → 2 clients · logique non dupliquée · testable
- **Stack ?** → Laravel (MVC mature, sécu native) · Next (SSR/SEO) · Expo (iOS+Android) · Postgres (ACID, HDS)
- **Tracker en 1-1 (HasOne) ?** → journal personnel unique · extensible en 1-N
- **Hiérarchie émotions ?** → 1 table, auto-référence parent_id · niveau 1 NULL / niveau 2 renseigné
- **Données sensibles / RGPD ?** → consentement · droits CNIL implémentés · HDS · bcrypt + AES prévu
- **Soft delete vs anonymisation ?** → soft delete = réversible 30j ; anonymisation = dissocie identité
- **JWT, risques ?** → stateless/scalable · expiration courte + refresh · throttle anti-bruteforce · MFA prévu
- **Où est stocké le token ?** → mobile = SecureStore (chiffré OS) · web = localStorage (limite XSS assumée, cible = cookie HttpOnly en v2)
- **Traçabilité ?** → table audits **réellement alimentée** par observers Eloquent (qui/quoi/quand : action, table, anciennes/nouvelles valeurs, IP) · mdp jamais loggé
- **Scalabilité 5000 users ?** → API stateless · index Postgres · pagination · cache TanStack Query
- **Réellement développé ?** → prototype 3 modules (API+web+mobile) + 29 tests automatisés · **déployé en ligne** (Coolify/Docker/HTTPS)
- **Pourquoi le DSFR ?** → service de l'État → charte obligatoire gouv.fr · accessibilité RGAA native · cohérence + confiance · gain de temps (composants prêts)
- **Vraiment en production ?** → oui : https://cesizen.cleanows.fr · conteneurs Docker · base PostgreSQL · CI de build · HTTPS

### 🛡️ Si une question pique (écarts assumés à défendre calmement)
- **« Mot de passe oublié »** → écran présent, flux backend prévu en v2
- **Chiffrement AES** → honnête : bcrypt aujourd'hui, AES-256 au repos prévu en prod HDS
- **Diagramme d'état-transition** → non inclus, le MCD + séquences couvrent l'essentiel
- *Règle d'or : si je ne sais pas, je l'assume et je propose une piste.*

---

## 🧘 Réflexes de prise de parole
- 3 respirations avant d'entrer (clin d'œil au sujet)
- Debout, ancré · **commenter** les slides, ne pas les lire
- Pause après chaque idée clé · regarder les 3 évaluateurs
- Checkpoint **12:00** = fin réponse fonctionnelle ; garder 1 min pour conclure
- Finir sur l'ouverture, jamais sur une excuse
