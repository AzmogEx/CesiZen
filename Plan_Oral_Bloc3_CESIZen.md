# Plan d'oral — Soutenance CESIZen · Activité 3

**Apprenant :** Adam Marzuk · **Bloc :** INFCDAAL3 — Déployer et sécuriser les applications informatiques
**Format :** 20 min de présentation + ~10 min de questions/réponses
**Support :** `CESIZen_Soutenance_Bloc3.pptx` (14 slides) + **démo live des outils** (Gitea + Coolify)
**Dossier :** `Dossier_Bloc3_CESIZen.docx` · **Guide outils :** `MIGRATION_GITEA.md`
**En ligne :** https://cesizen.cleanows.fr · API https://api.cesizen.cleanows.fr

> Objectif du jury : évaluer le **plan de déploiement**, le **plan de maintenance** et le **plan de sécurisation**, ainsi que la **démonstration** des outils de versioning et de ticketing réellement configurés.

---

## Déroulé minuté (20 min)

| Temps | Slide(s) | Sujet | Messages clés à dire |
|---|---|---|---|
| **0:00 – 1:30** | 1 — 2 | **Introduction** | Se présenter. Rappeler CESIZen (plateforme de santé mentale, Ministère). Annoncer que l'Activité 3 porte sur le **déploiement** et la **sécurisation**, avec 3 livrables + une démo d'outils. Présenter le sommaire. |
| **1:30 – 3:00** | 3 | **Contexte & périmètre** | Situer après Act. 1 (conception) et Act. 2 (dev/test). Prototype = API Laravel + web Next.js + mobile Expo + PostgreSQL. Les 3 livrables : plan de déploiement, de maintenance, de sécurisation. |
| **3:00 – 4:30** | 4 | **Architecture technique** | Architecture **découplée** : 1 API REST, 2 clients. Une seule logique métier → testabilité, évolutivité. Conteneurisation Docker = environnements reproductibles. |
| **4:30 – 7:00** | 5 — 6 | **Plan de déploiement + CI/CD** | Les **3 environnements** (dev local / test = CI / prod = Coolify). Détailler le schéma. Puis **Gitea** (versioning souverain) + **Gitea Actions** (29 tests à chaque push) + **Coolify** (déploiement continu sur merge, HTTPS, migrations auto). Insister : « la prod est **réellement en ligne**. » |
| **7:00 – 9:30** | 7 — 8 | **Plan de maintenance** | Ticketing **Gitea Issues** : gabarits incident/évolution, labels, jalons, Kanban. Cycle de vie d'un ticket + **SLA du contrat** (bloquant/majeur/mineur). Maintenance évolutive (analyse : doc, délai, coût). **Veille** : sécurité (CVE/CERT-FR), dépendances (audit en CI), réglementation (CNIL). |
| **9:30 – 13:00** | 9 — 10 — 11 | **Plan de sécurisation** ⭐ | (Partie la plus notée — 8 pts.) Vulnérabilités **OWASP** avec mesures en place. **Matrice de criticité** (gravité × probabilité) → R1 fuite de données, R7 chiffrement au repos, R2 injection prioritaires. Actions **préventives / correctives** + chiffrement (TLS, bcrypt, AES, JWT). Assumer les axes d'amélioration (chiffrement colonne, headers de sécurité). |
| **13:00 – 14:30** | 12 — 13 | **RGPD & gestion de crise** | Données de santé = **sensibles (art. 9)**. Consentement, droits (export/anonymisation), soft delete, audit immuable, hébergement UE/HDS. **Escalade** N1→N4, notification **CNIL < 72 h**. |
| **14:30 – 18:30** | démo | **🎬 Démo des outils** | Sur Gitea : commits/branches/tags → ouvrir une **PR** → 3 jobs de CI **verts** → créer une **issue** (gabarit incident) + labels + Kanban → **merge** → montrer **Coolify** qui déploie → rafraîchir le site en ligne. 🛟 Si un outil plante : montrer les captures du dossier / `MIGRATION_GITEA.md`. |
| **18:30 – 20:00** | 14 | **Conclusion** | Synthèse : chaîne de déploiement complète et en prod, maintenance cadrée, sécurité par les risques + RGPD. Remercier, ouvrir les questions. |

**Repère de rythme :** checkpoint à **14:30** (début démo). Si retard : raccourcir la maintenance (garder SLA + veille) et garder 4 min de démo + 1 min de conclusion. ⚠️ **Prépare les onglets AVANT d'entrer** : Gitea (dépôt + une PR prête), Coolify (tableau de bord), le site en ligne.

---

## Préparation aux questions / réponses (~10 min)

### Déploiement
**Q. Pourquoi trois environnements alors qu'un seul est réellement déployé ?**
> Le sujet demande de décrire dev/test/prod et d'en déployer **un** réellement : c'est la production, en ligne sur Coolify. Le dev tourne en local (docker-compose), le test correspond au runner de CI (base SQLite en mémoire). Chacun a un rôle distinct dans le cycle de vie.

**Q. Qu'est-ce qui est automatisé exactement ?**
> Deux choses : l'**intégration continue** (Gitea Actions lance les 29 tests + le lint à chaque push) et le **déploiement continu** (un merge sur main déclenche, via webhook, le build des images et le redéploiement Coolify — migrations, seed et génération des secrets étant faits par l'entrypoint au démarrage).

**Q. Comment gérez-vous les secrets et le rollback ?**
> Les secrets de prod (APP_KEY, JWT_SECRET) ne sont **pas versionnés** : ils sont générés au premier démarrage par l'entrypoint. Le rollback consiste à redéployer le tag de la version précédente depuis Coolify.

### Maintenance
**Q. Pourquoi Gitea plutôt que GitHub ou Jira ?**
> Gitea réunit dépôt Git, ticketing et CI/CD dans un outil **souverain et auto-hébergé**, cohérent avec un projet ministériel (données maîtrisées, pas de dépendance SaaS hors UE), léger et gratuit.

**Q. Comment respectez-vous les délais de correction ?**
> La sévérité déclarée dans le gabarit d'issue déclenche le SLA correspondant (bloquant critique = prise en compte 1 h / correction 3 h, etc.). Le Kanban et les jalons donnent au Ministère une visibilité temps réel.

### Sécurisation
**Q. Quelles sont les vraies faiblesses de sécurité aujourd'hui ?**
> Honnêtement : pas encore de chiffrement applicatif au repos des notes de santé, pas d'en-têtes HSTS/CSP, et une politique de mot de passe limitée à 8 caractères. Ce sont mes actions correctives prioritaires — elles figurent dans le plan (R7 notamment).

**Q. Comment calculez-vous la criticité ?**
> Criticité = gravité × probabilité, sur une échelle de 1 à 25. Ça hiérarchise les actions : R7 (chiffrement au repos, 12) et R2 (injection, 9) passent avant R8 (erreur de déploiement, 2).

**Q. Que se passe-t-il en cas de fuite de données de santé ?**
> Escalade N3 : le chef de projet et le DPO sont mobilisés, notification à la **CNIL sous 72 h** (art. 33 RGPD), information des personnes concernées, isolation et préservation des preuves, puis retour d'expérience.

### Général
**Q. Qu'est-ce qui prouve que ce n'est pas que de la théorie ?**
> La production est **en ligne** (cesizen.cleanows.fr), les outils sont configurés (je les montre en démo), les 29 tests tournent en CI, et l'audit de sécurité est réellement alimenté dans l'application.
