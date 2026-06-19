# 🎤 Mon oral CESIZen — ce que je dis, étape par étape

**Format : 20 min de présentation (avec démo en direct) + 10 min de questions.**
Garde cette feuille sous les yeux. À chaque étape : ce que je **dis**, ce que je **montre**, et la phrase pour **enchaîner**.

> 🌐 L'appli est en ligne pour de vrai : **https://cesizen.cleanows.fr**
> 🎨 Toute l'interface suit la charte graphique de l'État (le **DSFR**, comme les sites en gouv.fr).

---

## 🔢 Les chiffres à connaître par cœur (à glisser pour faire pro)

- **1 Français sur 5** (22 %) connaît un trouble de santé mentale au cours de sa vie.
- **3 modules** développés : 2 obligatoires (Comptes, Informations) + 1 au choix (le **Tracker d'émotions**).
- **6 émotions de base** (Joie, Colère, Peur, Tristesse, Surprise, Dégoût) + **36 sous-émotions**.
- **1 seule API** (le cerveau côté serveur) qui alimente **2 applications** : le site web et l'appli mobile.
- **29 tests automatisés** qui vérifient que tout marche (19 serveur + 6 web + 4 mobile).
- Contraintes du sujet : **75 000 €** de budget, **12 mois** de délai.

*Si tu retiens UNE phrase : « 3 modules aboutis, une seule API pour le web et le mobile, et c'est déployé en ligne pour de vrai. »*

---

## 🗺️ Le déroulé — qu'est-ce que je raconte, dans l'ordre ?

> 💡 Astuce : à l'intro, j'annonce mon plan en une phrase simple. C'est ça, le « fil rouge » : je raconte mon projet **comme une histoire** — d'abord le besoin, puis mes choix, puis la solution, puis la technique, puis la sécurité.

### ⏱ 0:00–2:00 — Introduction (slides 1-2)
🎤 **Je dis :**
> « Bonjour, je m'appelle Adam Marzuk, je suis étudiant à CESI. Je vais vous présenter **CESIZen**, une plateforme grand public de santé mentale. Le commanditaire est le **Ministère des Solidarités et de la Santé**. »
>
> « Pour vous présenter mon travail, je vais suivre le cheminement d'un vrai projet : **1)** comprendre le besoin, **2)** choisir quoi développer en priorité, **3)** vous montrer la solution avec une **démonstration en direct**, **4)** l'architecture technique, et **5)** la protection des données. »

👉 **J'enchaîne :** « Commençons par le contexte. »

---

### ⏱ 2:00–4:30 — Le contexte et les personnes concernées (slides 3-4)
🎤 **Je dis :**
> « La santé mentale est un enjeu de société majeur : **1 Français sur 5** est concerné, et le sujet reste tabou. L'objectif du Ministère, c'est d'aider chacun à mieux comprendre et gérer son stress au quotidien. »
>
> « Plusieurs acteurs entrent en jeu : le **Ministère** (le commanditaire), les **utilisateurs** (le grand public), et la **CNIL** (le gendarme des données personnelles, qu'on doit respecter). Dans l'appli, il y a **3 profils** : le visiteur non connecté, l'utilisateur connecté, et l'administrateur. »

💬 **Phrase qui montre que j'ai réfléchi :**
> « J'ai **reformulé** le besoin avec mes mots, je ne me suis pas contenté de recopier le sujet. »

👉 **J'enchaîne :** « Maintenant, comment j'ai choisi quoi développer ? »

---

### ⏱ 4:30–6:00 — Mes choix : qu'est-ce que je développe en priorité ? (slides 5-6)
🎤 **Je dis :**
> « Je ne pouvais pas tout faire. J'ai donc **noté chaque fonctionnalité** selon des critères : sa complexité, sa valeur pour le Ministère, sa valeur pour l'utilisateur, etc. — une note sur 15. »
>
> « Résultat : le **Tracker d'émotions** ressort en tête. J'ai préféré faire **3 modules aboutis** plutôt que 6 modules bâclés. Les modules que j'ai écartés, je l'assume : c'est un choix réfléchi, pas un oubli. »

👉 **J'enchaîne :** « Voyons maintenant la solution que j'ai construite. »

---

### ⏱ 6:00–8:30 — La solution : Comptes + Informations (slides 7-8)
🎤 **Je dis :**
> « Le module **Comptes** gère l'inscription, la connexion sécurisée, le profil, et un espace d'administration. »
>
> « Le module **Informations**, ce sont des articles de prévention sur la santé mentale, consultables même sans compte. »
>
> « Petit point important sur tout le projet : l'interface suit le **Système de Design de l'État**, la charte graphique officielle des sites publics français. D'où l'en-tête **"République Française"**. Ça apporte de la **crédibilité** et ça respecte les normes d'**accessibilité**. »

👉 **J'enchaîne :** « Et le cœur du projet, le Tracker, je vais vous le montrer en direct. »

---

### ⏱ 8:30–12:30 — 🎬 LA DÉMO EN DIRECT (le Tracker)
👉 *Voir le script de démo détaillé plus bas.* Idée à répéter pendant que je clique :
> « Chaque écran que je vous montre répond à un besoin précis de l'utilisateur. »

👉 **J'enchaîne :** « Voyons maintenant ce qui fait tourner tout ça, côté technique. »

---

### ⏱ 12:30–16:00 — La technique (slides 10-11-12)
> ⚠️ Si je suis en retard, c'est ici que j'accélère.

🎤 **Je dis (en montrant les schémas) :**
> « Voici le **diagramme des cas d'usage** : il montre qui peut faire quoi (le visiteur, l'utilisateur, l'admin). »
>
> « Voici le **MCD**, le plan de ma base de données : **8 tables** et leurs liens. Détail intéressant : les émotions et sous-émotions sont dans **une seule table** qui se référence elle-même (une émotion peut avoir une émotion "parente"). »
>
> « Et voici mon choix d'architecture : **une seule API** centrale qui sert **deux applications** (le web et le mobile). L'avantage : je n'écris la logique **qu'une seule fois**, c'est plus facile à tester et à faire évoluer. »

👉 **J'enchaîne :** « Comme on manipule des données de santé, parlons de leur protection. »

---

### ⏱ 16:00–17:30 — La protection des données / RGPD (slide 13)
🎤 **Je dis :**
> « Les données de santé sont **sensibles** au sens de la loi (article 9 du RGPD). J'ai donc prévu : le **consentement** à l'inscription, le droit d'**exporter ses données** et de **supprimer son compte**. »
>
> « Côté sécurité : les **mots de passe sont chiffrés**, et toutes les actions importantes sont **tracées** dans un journal d'audit (qui a fait quoi, et quand). Pour une vraie mise en production sur un hébergeur de santé, le **chiffrement complet des données** est prévu. »

👉 **J'enchaîne :** « Tout cela n'est pas qu'un dossier : c'est une appli qui tourne. »

---

### ⏱ 17:30–19:00 — Le prototype et la suite (slide 14)
🎤 **Je dis :**
> « J'ai développé un vrai prototype des 3 modules, en web **et** en mobile, avec **29 tests automatisés**. »
>
> « Et surtout : **c'est déployé en ligne, en vrai**, sur https://cesizen.cleanows.fr, dans des conteneurs Docker, en HTTPS. Ce n'est pas une maquette. »
>
> « Pour la suite, on pourrait activer les modules écartés sans tout réécrire, ou se connecter à Mon Espace Santé. »

---

### ⏱ 19:00–20:00 — Conclusion
🎤 **Je dis :**
> « Pour résumer : j'ai **compris le besoin**, **priorisé** ce qui compte, livré une **solution concrète et déployée**, sur une **architecture solide**, en respectant la **protection des données**. Merci de votre attention, je suis à votre disposition pour vos questions. »

---

## 🎬 Script de la démo (≈ 4 min) — à suivre dans l'ordre

**✅ À préparer AVANT de commencer (pendant l'installation) :**
- Onglet déjà ouvert sur **https://cesizen.cleanows.fr**, **déjà connecté** au compte de démo.
- Zoom du navigateur à **125 %**, notifications coupées.
- Vérifier que le journal a **déjà des saisies** (sinon les rapports sont vides).
- 🔑 Compte démo : `demo@cesizen.fr` / `Demo123!` · Admin : `admin@cesizen.fr` / `Admin123!`

**▶️ Pendant la démo (je clique et je commente) :**
1. *(20 s)* **Page Informations** → « Voici les articles de prévention, accessibles sans même se connecter. »
2. *(30 s)* **Mon journal** → « Ici, l'utilisateur retrouve l'historique de ses émotions. »
3. *(90 s)* **Nouvelle saisie** → « On enregistre une émotion en 3 étapes : 1) on choisit l'émotion (ex. Joie), 2) on précise la sous-émotion et l'intensité, 3) on ajoute une note. Je valide… et elle apparaît tout de suite dans le journal. »
4. *(60 s)* **Mes rapports** → « Et voici les statistiques : un camembert de répartition et une courbe d'évolution. Je change la période, semaine puis mois — tout est recalculé par l'API. »
5. *(20 s, si le temps)* **Espace admin** → « Côté administrateur, on peut configurer les émotions disponibles. »

🛟 **Si la démo plante :** je reste calme et je bascule sur les **captures d'écran de mes slides**, sans m'excuser → « Je vous montre les écrans clés directement. »

---

## ❓ Questions du jury — mes réponses prêtes (en phrases)

> Pour chaque question : une réponse courte que je peux dire telle quelle.

**« Pourquoi avoir choisi le Tracker d'émotions ? »**
> « Parce qu'il ressort en tête de ma grille de priorisation, et qu'il valait mieux faire 3 modules aboutis que 6 superficiels. En plus, mon architecture permet d'ajouter les autres plus tard. »

**« Pourquoi une seule API pour deux applications ? »**
> « Pour ne pas écrire deux fois la même logique. La règle métier est au même endroit, c'est plus simple à tester, à corriger et à faire évoluer. Le web et le mobile ne sont que deux "façades" sur le même cerveau. »

**« Quelles technologies, et pourquoi ? »**
> « **Laravel** côté serveur, car c'est un framework mature et sécurisé. **Next.js** pour le web. **Expo / React Native** pour avoir iOS et Android avec un seul code. Et **PostgreSQL** comme base de données, fiable pour des données sensibles. »

**« Comment gérez-vous les émotions et sous-émotions ? »**
> « Tout est dans une seule table qui se référence elle-même : une émotion de niveau 1 n'a pas de parent, une sous-émotion de niveau 2 pointe vers son émotion parente. C'est souple et facile à étendre. »

**« Et le RGPD, sur des données de santé ? »**
> « Consentement à l'inscription, possibilité d'exporter ses données et de supprimer son compte, mots de passe chiffrés, et un journal d'audit qui trace les actions. Pour la vraie production, un hébergement agréé santé (HDS) et le chiffrement complet sont prévus. »

**« La sécurité de la connexion ? »**
> « J'utilise des **jetons JWT** : à la connexion, le serveur donne un jeton temporaire (60 min) que l'appli renvoie à chaque requête. J'ai aussi une limite de tentatives de connexion pour bloquer les attaques par force brute. »

**« Est-ce vraiment développé ? »**
> « Oui, complètement : web, mobile et serveur, avec 29 tests automatisés. Et c'est **déployé en ligne**, je peux vous le montrer en direct. »

**« Pourquoi la charte de l'État (DSFR) ? »**
> « Parce que c'est un service public : la charte gouv.fr est la référence, elle garantit l'accessibilité et inspire confiance. Et elle m'a fait gagner du temps grâce à des composants prêts à l'emploi. »

### 🛡️ Si une question me met en difficulté (à assumer calmement)
- **« Mot de passe oublié »** → « L'écran existe, le branchement complet est prévu dans une prochaine version. »
- **« Les données sont-elles chiffrées ? »** → « Les mots de passe oui. Le chiffrement complet du reste est prévu pour la mise en production sur hébergeur de santé. » *(Ne jamais dire "tout est chiffré".)*
- **Une question dont je n'ai pas la réponse** → « C'est une bonne question, je ne l'ai pas traitée en détail, mais je partirais sur telle piste… » *(Assumer + proposer une piste, jamais inventer.)*

---

## 📖 Glossaire — comprendre les mots que je dis

| Mot | En une phrase simple |
|---|---|
| **API** | Le "cerveau" côté serveur : il reçoit les demandes du web/mobile et renvoie les données. |
| **MVC** | Une façon d'organiser le code en 3 parties (données / logique / affichage) pour s'y retrouver. |
| **MCD** | Le plan de la base de données : quelles tables, et comment elles sont reliées. |
| **JWT** | Un jeton temporaire prouvant qu'on est connecté, renvoyé à chaque requête. |
| **DSFR** | La charte graphique officielle de l'État (sites gouv.fr) : couleurs, polices, composants. |
| **RGPD** | La loi européenne qui protège les données personnelles. |
| **CNIL** | L'autorité française qui veille au respect du RGPD. |
| **HDS** | "Hébergeur de Données de Santé" : un hébergement certifié, obligatoire pour de vraies données médicales. |
| **Soft delete** | Suppression "douce" : la donnée est masquée mais récupérable, au lieu d'être effacée définitivement. |
| **Anonymisation** | On garde la donnée mais on enlève tout ce qui permet d'identifier la personne. |
| **Docker / conteneur** | Une "boîte" qui embarque l'appli et tout ce qu'il lui faut, pour qu'elle tourne pareil partout. |
| **Throttle** | Une limite du nombre de tentatives (ex. connexions) pour bloquer les abus. |

---

## 🧘 Réflexes pour bien parler
- Je respire un grand coup avant d'entrer.
- Je reste **debout, posé**. Je **commente** mes slides, je ne les **lis pas**.
- Je fais une **pause** après chaque idée importante, et je **regarde** les évaluateurs.
- **Repère de temps :** à **12 minutes**, j'ai fini la démo. Je garde **1 minute** pour conclure.
- Je termine sur l'ouverture (la suite du projet), **jamais sur une excuse**.
