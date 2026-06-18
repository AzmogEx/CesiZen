# 🚀 Guide de lancement CESIZen — web, API, mobile & démo

> Tout se lance en **une commande** pour la partie web/API (Docker). Le mobile se lance à part (Expo).

---

## 0. Prérequis (à vérifier une fois)
- **Docker Desktop** installé et **lancé** (l'icône baleine doit être active dans la barre de menu).
- Pour le mobile uniquement : **Node.js** (déjà installé : v22) et l'app **Expo Go** sur ton téléphone (App Store / Play Store).
- Se placer dans le dossier du projet :
  ```bash
  cd ~/Desktop/CESI/Cesizen
  ```

---

## 1. 🌐 Lancer le site web + l'API + la base (Docker)

Une seule commande construit et démarre **tout** (PostgreSQL + Redis + API Laravel + front Next.js), applique les migrations et le seed (dont le compte de démo) :

```bash
docker compose up -d
```

- `-d` = en arrière-plan (tu récupères ton terminal).
- Le **premier** lancement build les images (quelques minutes). Les suivants démarrent en ~20 s.

**Vérifier que c'est prêt :**
```bash
docker compose ps          # les 4 services doivent être "Up" / "healthy"
```

**Adresses une fois lancé :**
| Service | URL |
|---|---|
| 🖥️ Site web | **http://localhost:3000** |
| 🔌 API (REST JSON) | http://localhost:8000/api/v1 |
| 🗄️ PostgreSQL | localhost:5432 (db `cesizen` / user `cesizen`) |

➡️ Ouvre **http://localhost:3000** dans ton navigateur.

---

## 2. 🔑 Comptes de démonstration (déjà créés par le seed)

| Rôle | Email | Mot de passe | Pour montrer… |
|---|---|---|---|
| **Membre** (démo) | `demo@cesizen.fr` | `Demo123!` | Le **Tracker** : journal déjà rempli (18 saisies) + rapports parlants |
| **Admin** | `admin@cesizen.fr` | `Admin123!` | Le **back-office** : gestion users / contenus / émotions |

> 💡 Pour la démo de soutenance, connecte-toi avec **`demo@cesizen.fr`** : son journal et ses rapports sont déjà fournis (camembert + courbe), pas besoin de saisir en direct.

---

## 3. 🎬 Le parcours de démo (≈ 4 min, sur le web)

Connecté en `demo@cesizen.fr`, déroule dans cet ordre :
1. **Informations** (accessible même sans compte) → *« voici le module Informations »*
2. **Journal de bord** → l'historique des saisies (déjà rempli)
3. **Nouvelle saisie** → wizard **3 étapes** : émotion → sous-émotion + intensité (slider) → date + note → **Valider** (elle apparaît dans le journal)
4. **Rapports** → changer la période (Semaine / Mois / …) → **camembert** de répartition + **courbe** d'évolution
5. *(option)* Connecté en **admin**, montrer la **configuration des émotions**

🛟 **Si la démo plante** : bascule sur les **maquettes des slides** (slide 9), sans t'excuser.

---

## 4. 📱 Lancer l'application mobile (Expo)

> La partie Docker (API) doit **déjà tourner** (étape 1), car l'app mobile interroge l'API.

```bash
cd ~/Desktop/CESI/Cesizen/mobile
npm install        # la première fois seulement
npx expo start     # démarre le serveur Expo + affiche un QR code
```

Ensuite, **3 façons** de voir l'app :

### a) Sur ton téléphone (le plus simple pour une démo)
1. Téléphone et Mac sur le **même WiFi**.
2. L'app doit pointer vers l'API via l'**IP locale du Mac** (pas `localhost`, qui désigne le téléphone). Lance plutôt :
   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.1.127:8000/api/v1 npx expo start
   ```
   *(192.168.1.127 = IP actuelle de ton Mac. Si elle change, retrouve-la avec `ipconfig getifaddr en0`.)*
3. Ouvre **Expo Go** sur le téléphone → scanne le **QR code** affiché dans le terminal.

### b) Sur simulateur iOS (Mac avec Xcode)
- Dans le terminal Expo, appuie sur **`i`** → l'app s'ouvre dans le simulateur. (Ici `localhost` fonctionne tel quel.)

### c) Sur émulateur Android (Android Studio)
- Appuie sur **`a`**. (L'app utilise automatiquement `10.0.2.2` pour joindre l'API du Mac.)

> Pour la soutenance, le plus fiable est de **montrer le web** (projeté) et d'**évoquer le mobile** avec 1-2 écrans (téléphone ou simulateur). Une double démo live = double risque.

---

## 5. ⏹️ Arrêter / relancer

```bash
docker compose down        # arrête tout (les données de démo sont CONSERVÉES)
docker compose up -d       # relance (le compte démo + les 18 saisies reviennent)
```

- ⚠️ **Ne jamais** faire `docker compose down -v` : le `-v` **efface** la base (tu perdrais les données de démo). Sans `-v`, tout est conservé dans le volume.
- Mobile : `Ctrl + C` dans le terminal Expo pour l'arrêter.

---

## 6. 🧪 Lancer les tests (si on te le demande)

```bash
# API (Laravel) — 15 tests
docker compose exec backend php artisan test
# ou en local : cd backend && php artisan test

# Web (Next.js) — 6 tests
cd frontend && npm test

# Mobile (Expo) — 4 tests
cd mobile && npm test
```

---

## 7. 🆘 Dépannage rapide

| Problème | Solution |
|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop n'est pas lancé → ouvre-le, attends que la baleine soit active. |
| Port `3000`/`8000` déjà utilisé | Une appli occupe le port. Ferme-la, ou : `lsof -nP -iTCP:3000 -sTCP:LISTEN` pour l'identifier. |
| Le site charge mais « erreur réseau » | L'API n'est pas prête → `docker compose ps` (backend doit être Up) ; relance `docker compose up -d`. |
| Le mobile n'atteint pas l'API | Mauvaise URL → utilise `EXPO_PUBLIC_API_URL=http://<IP_du_Mac>:8000/api/v1` (étape 4a). |
| Repartir d'une base propre | `docker compose down -v && docker compose up -d` (⚠️ efface puis recrée tout, démo comprise). |

---

### ✅ Checklist « 5 min avant l'oral »
- [ ] Docker Desktop lancé
- [ ] `docker compose up -d` exécuté · `docker compose ps` = tout **Up**
- [ ] Navigateur ouvert sur **http://localhost:3000**, **déjà connecté** en `demo@cesizen.fr`
- [ ] Page **Journal de bord** affichée, zoom à **125 %**, notifications coupées
- [ ] Slides ouvertes en second (`.pptx` + un export **PDF** de secours)
