# 🎤 Plan de mon oral CESIZen — quoi dire, étape par étape

**20 min de présentation (avec démo en direct) + 10 min de questions.**
Chaque partie = les **points à aborder**. Je regarde le point, et je parle avec mes mots.

> 🌐 En ligne pour de vrai : **https://cesizen.cleanows.fr** · 🎨 Interface à la charte de l'État (DSFR).

---

## 🔢 Chiffres à caser (mémoriser)
- **1 Français sur 5** touché par un trouble de santé mentale.
- **3 modules** : 2 obligatoires (Comptes, Informations) + 1 au choix (**Tracker d'émotions**).
- **6 émotions** de base + **36 sous-émotions**.
- **1 API** → **2 applis** (web + mobile).
- **29 tests** automatisés.
- Contraintes sujet : **75 000 €**, **12 mois**.

---

## 🗺️ Le déroulé — les sujets à enchaîner

### ⏱ 0:00–2:00 — Introduction
- Me présenter (prénom, CESI).
- Présenter le projet : **CESIZen**, plateforme grand public de santé mentale.
- Dire le commanditaire : **Ministère de la Santé**.
- Annoncer mon plan en 5 temps : **besoin → priorisation → solution + démo → technique → données**.
- ➡️ Transition : « Commençons par le contexte. »

### ⏱ 2:00–4:30 — Contexte & acteurs
- L'enjeu de société : santé mentale, sujet tabou, **1 sur 5**.
- Le but : aider chacun à gérer son stress au quotidien.
- Les acteurs : Ministère / utilisateurs / CNIL.
- Les **3 profils** dans l'appli : visiteur, utilisateur connecté, admin.
- Insister : j'ai **reformulé** le besoin, pas recopié le sujet.
- ➡️ Transition : « Comment j'ai choisi quoi développer ? »

### ⏱ 4:30–6:00 — Mes choix (priorisation)
- Je ne pouvais pas tout faire → j'ai **noté chaque fonctionnalité** (note sur 15).
- Le **Tracker** ressort en tête.
- Mon parti pris : **3 modules aboutis** plutôt que 6 bâclés.
- Les modules écartés = **choix assumé**, pas un oubli.
- ➡️ Transition : « Voyons la solution. »

### ⏱ 6:00–8:30 — La solution : Comptes + Informations
- **Comptes** : inscription, connexion sécurisée, profil, espace admin.
- **Informations** : articles de prévention, lisibles sans compte.
- Point transversal : interface à la **charte de l'État (DSFR)** → en-tête « République Française », accessibilité, crédibilité.
- ➡️ Transition : « Le cœur du projet, le Tracker, je vous le montre en direct. »

### ⏱ 8:30–12:30 — 🎬 DÉMO EN DIRECT (le Tracker)
- *(voir le script de démo plus bas)*
- Idée à répéter : **chaque écran répond à un besoin précis**.
- ➡️ Transition : « Voyons ce qui fait tourner tout ça, côté technique. »

### ⏱ 12:30–16:00 — La technique  ⚠️ *(accélérer ici si en retard)*
- **Cas d'usage** : qui peut faire quoi (visiteur / utilisateur / admin).
- **MCD** (plan de la base) : **8 tables** ; les émotions/sous-émotions dans **une seule table qui se référence elle-même**.
- **Architecture** : **1 API** qui sert **2 applis** → logique écrite une seule fois, plus simple à tester et faire évoluer.
- ➡️ Transition : « Comme ce sont des données de santé, parlons de leur protection. »

### ⏱ 16:00–17:30 — Protection des données (RGPD)
- Données de santé = **sensibles** (article 9 RGPD).
- Ce que j'ai prévu : **consentement**, **export des données**, **suppression du compte**.
- Sécurité : **mots de passe chiffrés**, **journal d'audit** (qui fait quoi, quand).
- Pour la vraie prod : hébergeur de santé + chiffrement complet **prévus**.
- ➡️ Transition : « Ce n'est pas qu'un dossier, c'est une appli qui tourne. »

### ⏱ 17:30–19:00 — Prototype & suite
- Vrai prototype : web + mobile + serveur, **29 tests**.
- **Déployé en ligne pour de vrai** (Docker, HTTPS) → pas une maquette.
- Ouverture : activer les modules écartés plus tard, lien Mon Espace Santé.

### ⏱ 19:00–20:00 — Conclusion
- Résumer le fil : besoin compris → priorisé → solution déployée → archi solide → données protégées.
- Remercier + ouvrir les questions.

---

## 🎬 Script de démo (≈ 4 min) — les actions dans l'ordre

**À préparer AVANT :** onglet ouvert sur **cesizen.cleanows.fr**, **déjà connecté** au compte démo, zoom **125 %**, notifs coupées, journal **déjà rempli**.
🔑 Démo : `demo@cesizen.fr` / `Demo123!` · Admin : `admin@cesizen.fr` / `Admin123!`

**Pendant (je clique + je commente) :**
1. *(20 s)* **Informations** → articles accessibles sans compte.
2. *(30 s)* **Mon journal** → l'historique des émotions.
3. *(90 s)* **Nouvelle saisie** → les **3 étapes** (émotion → sous-émotion + intensité → note) → valider → elle apparaît dans le journal.
4. *(60 s)* **Mes rapports** → camembert + courbe, je change la période → recalculé par l'API.
5. *(20 s, si le temps)* **Admin** → configurer les émotions.

🛟 **Si ça plante :** je bascule sur les **captures des slides**, calmement, sans m'excuser.

---

## ❓ Questions probables — les points à donner en réponse

- **Pourquoi le Tracker ?** → en tête de ma grille · 3 modules aboutis > 6 bâclés · extensible.
- **Pourquoi 1 API pour 2 applis ?** → logique écrite une fois · testable · web et mobile = 2 façades.
- **Quelles technos ?** → Laravel (serveur, sécurisé) · Next.js (web) · Expo (iOS + Android d'un coup) · PostgreSQL (base fiable).
- **Émotions / sous-émotions ?** → une seule table, auto-référencée · niveau 1 sans parent, niveau 2 avec parent.
- **RGPD données de santé ?** → consentement · export · suppression · mots de passe chiffrés · audit · HDS prévu.
- **Sécurité connexion ?** → jeton JWT temporaire (60 min) renvoyé à chaque requête · limite anti-force brute.
- **Vraiment développé ?** → oui : web + mobile + serveur · 29 tests · **en ligne, je peux montrer**.
- **Pourquoi le DSFR ?** → service public → charte gouv.fr · accessibilité · confiance · gain de temps.

### 🛡️ Si une question pique (assumer calmement)
- **Mot de passe oublié** → écran présent, branchement prévu en v2.
- **Tout est chiffré ?** → mots de passe oui ; le reste, chiffrement prévu en prod santé. *(Ne jamais dire « tout est chiffré ».)*
- **Question sans réponse** → l'assumer + proposer une piste, **ne jamais inventer**.

---

## 📖 Glossaire — pour comprendre ce que je dis
- **API** : le cerveau côté serveur (reçoit les demandes, renvoie les données).
- **MCD** : le plan de la base de données (les tables et leurs liens).
- **MVC** : organiser le code en 3 parties (données / logique / affichage).
- **JWT** : jeton temporaire qui prouve qu'on est connecté.
- **DSFR** : charte graphique officielle de l'État (sites gouv.fr).
- **RGPD / CNIL** : la loi sur les données personnelles / l'autorité qui la fait respecter.
- **HDS** : hébergeur certifié pour les données de santé.
- **Soft delete** : suppression douce, récupérable, au lieu d'effacer pour de bon.
- **Docker** : une « boîte » qui fait tourner l'appli pareil partout.
- **Throttle** : limite du nombre de tentatives (anti-abus).

---

## 🧘 Pour bien parler
- Respirer avant d'entrer.
- Rester **debout, posé** · **commenter** les slides, ne pas les lire.
- **Pause** après chaque idée · **regarder** le jury.
- **Repère :** à **12 min**, démo finie · garder **1 min** pour conclure.
- Finir sur l'ouverture, **jamais sur une excuse**.
