# Plan d'oral — Soutenance CESIZen

**Apprenant :** Adam Marzuk · **Bloc :** INFCDAAL1 — Concevoir les solutions logicielles
**Format :** 20 min de présentation + ~10 min de questions/réponses
**Support :** `CESIZen_Soutenance.pptx` (16 slides : 14 + 2 annexes)

> Objectif : montrer la **démarche** (recueil → analyse → modélisation) autant que le résultat.
> Le jury note aussi la **prise de parole** : posture, voix, regard, gestion du temps.

---

## Déroulé minuté (20 min)

| Temps | Slide(s) | Sujet | Messages clés à dire |
|---|---|---|---|
| **0:00 – 2:00** (2′) | 1 — 2 | **Introduction** | Se présenter. Annoncer le commanditaire (Ministère) et l'objet : une plateforme grand public de santé mentale. Donner le fil rouge : « je vais dérouler le recueil du besoin, la priorisation, la réponse fonctionnelle, puis la modélisation technique et la conformité RGPD. » Présenter le sommaire (slide 2). |
| **2:00 – 5:00** (3′) | 3 — 4 | **Contexte, enjeux, parties prenantes** | Rappeler l'enjeu sociétal (22 % des Français, SPF 2023) et la stigmatisation. Énoncer les 4 objectifs stratégiques. Présenter les parties prenantes et les 3 acteurs (Visiteur, Utilisateur, Administrateur). Insister : « le besoin a été **reformulé**, pas recopié. » |
| **5:00 – 7:00** (2′) | 5 — 6 | **Besoins & priorisation** | Périmètre : 2 modules obligatoires + Tracker au choix ; modules écartés assumés. Présenter la grille pondérée /15 (5 critères). Conclusion argumentée : « le Tracker cumule 4 fonctionnalités à 9-10/15, c'est le module au choix le plus rentable. » |
| **7:00 – 12:00** (5′) | 7 — 8 — 9 | **Réponse fonctionnelle** | Module Comptes : JWT, RGPD, admin (slide 7 + maquette). Module Informations : feeds, modération, slug auto (slide 8). Module Tracker : wizard 3 étapes, journal, rapports 4 périodes, 7+33 émotions (slide 9 + maquettes). Montrer que chaque écran répond à un besoin précis. |
| **12:00 – 16:00** (4′) | 10 — 11 — 12 | **Modélisation** | Cas d'usage UML (slide 10) : couverture par acteur. MCD Merise (slide 11) : 8 entités, cardinalités, hiérarchie d'émotions auto-référencée. Architecture MVC découplée (slide 12) : 1 API REST Laravel → 2 clients ; justifier le pattern (testabilité, évolutivité, non-duplication). |
| **16:00 – 17:30** (1′30) | 13 | **RGPD & données sensibles** | Données de santé = sensibles (art. 9). Consentement, droits CNIL (export/anonymisation), soft delete. Sécurité : chiffrement AES-256/TLS, JWT, HDS, table audits. |
| **17:30 – 19:00** (1′30) | 14 | **Prototype & perspectives** | Prototype fonctionnel (Laravel + Next.js + Expo + Docker). Ouverture : activer les modules écartés sans réécrire le modèle, Open Data, Mon Espace Santé (FHIR), i18n. |
| **19:00 – 20:00** (1′) | 14 | **Conclusion** | Synthèse : besoin reformulé → périmètre priorisé → réponse fonctionnelle → architecture pérenne → conformité. Remercier, ouvrir les questions. |

**Repères de rythme :** ~1 slide / 1 min 20. Si retard à 12:00, raccourcir la modélisation (garder MCD + MVC, survoler les cas d'usage).

---

## Préparation aux questions / réponses (~10 min)

### Recueil & analyse du besoin
**Q1. Comment avez-vous reformulé le besoin plutôt que recopié le sujet ?**
> J'ai structuré le recueil en 4 blocs (contexte, contraintes, livrables, besoins logiciels), ajouté des personas (Claire, Karim, Samia) et une grille de priorisation pondérée qui justifie un périmètre — ce sont des apports personnels, pas dans l'énoncé.

**Q2. Pourquoi avoir retenu le Tracker et écarté Diagnostic / Cohérence cardiaque / Activités ?**
> La grille /15 le classe en tête (4 fonctionnalités à 9-10). En individuel sur 3 mois, mieux vaut 3 modules aboutis que 6 superficiels. L'architecture découplée permet d'ajouter les autres plus tard sans refonte.

**Q3. Vos critères de priorisation sont-ils objectifs ?**
> Ils sont explicites et pondérés (Complexité, Valeur Ministère, Valeur Utilisateur, Nécessité, Interdépendance). La part de subjectivité est assumée mais tracée, donc discutable et reproductible.

### Conception & architecture
**Q4. Pourquoi MVC découplé plutôt qu'un monolithe rendu côté serveur ?**
> Une seule API REST alimente web ET mobile : la logique métier n'est pas dupliquée. Séparation Modèle/Vue/Contrôleur = testabilité et maintenabilité. On peut ajouter un client (TV, vocal) sans toucher au modèle.

**Q5. Pourquoi Laravel, Next.js, React Native, PostgreSQL ?**
> Laravel : framework MVC mature, sécurité native (CSRF/XSS/SQLi), Eloquent, écosystème JWT. Next.js : SSR/SEO, App Router, accessibilité. React Native/Expo : code partagé, iOS+Android sans double dev natif. PostgreSQL : ACID, JSON, certifiable HDS.

**Q6. Le Tracker est en relation 1-1 avec l'utilisateur (HasOne) — pourquoi un seul journal ?**
> Le besoin est un journal personnel unique ; le tracker est créé automatiquement à l'inscription. Le modèle reste extensible (passer en 1-N) si un jour on veut plusieurs journaux thématiques.

**Q7. Comment gérez-vous la hiérarchie d'émotions à 2 niveaux ?**
> Une seule table `emotions` avec auto-référence `parent_id` : niveau 1 = parent_id NULL, niveau 2 = parent_id renseigné. 7 émotions de base + 33 sous-émotions. L'admin la configure via le CRUD émotions.

### Données & sécurité (RGPD)
**Q8. Les données émotionnelles sont sensibles — comment êtes-vous conforme ?**
> Consentement explicite à l'inscription (case non pré-cochée), finalités documentées, droits CNIL implémentés (accès, rectification, effacement, portabilité via export JSON, anonymisation). Hébergement HDS, chiffrement AES-256 au repos et TLS en transit, table `audits` pour la traçabilité.

**Q9. Différence entre soft delete et anonymisation ?**
> Soft delete (`deleted_at`) = suppression réversible 30 j puis purge — pour le droit à l'effacement avec fenêtre de rétractation. Anonymisation = on dissocie les données de l'identité (note vidée, contacts supprimés) tout en gardant des statistiques agrégées non identifiantes.

**Q10. Pourquoi le hard delete sur les saisies du tracker ?**
> Ce sont des données personnelles sensibles : quand l'utilisateur supprime une saisie, il attend une suppression réelle et immédiate, pas une conservation cachée.

### Sécurité technique
**Q11. Pourquoi JWT et quels risques ?**
> Stateless donc scalable, claims (rôle) embarqués. Risques maîtrisés : expiration courte (60 min) + refresh, signature HS256, HTTPS strict, throttle sur le login (5/min) contre le brute force. Évolution prévue : MFA (TOTP) pour les admins.

**Q12. Comment tenir 5000 utilisateurs simultanés ?**
> API stateless horizontalement scalable, PostgreSQL avec index, requêtes paginées, cache côté client (TanStack Query). Cibles : API < 300 ms (p95), dashboard < 1,5 s.

### Questions « piège » fréquentes
**Q13. Qu'est-ce qui est réellement développé vs spécifié ?**
> Un prototype fonctionnel des 3 modules (API + web + mobile) accompagne le dossier ; les spécifications détaillées couvrent les 2 modules obligatoires + le Tracker, conformément à la consigne.

**Q14. Si c'était à refaire, que changeriez-vous ?**
> J'ajouterais des tests automatisés d'accessibilité RGAA dès le début, et je formaliserais un diagramme de classes en complément du MCD pour la couche métier.

---

## Conseils de prise de parole (la santé mentale… commence par la vôtre)

- **Respiration** : avant d'entrer, 3 respirations lentes (cohérence cardiaque) — clin d'œil au sujet, ça pose la voix.
- **Posture** : debout, ancré, épaules ouvertes ; ne pas lire les slides, les commenter.
- **Rythme** : marquer une pause après chaque idée clé ; regarder les 3 évaluateurs à tour de rôle.
- **Slides** : peu de texte à l'écran, c'est vous qui portez le contenu ; les schémas sont des appuis.
- **Temps** : repère mental à 12:00 (fin réponse fonctionnelle) ; garder 1 min de marge pour la conclusion.
- **Q/R** : reformuler la question avant de répondre ; si on ne sait pas, l'assumer et proposer une piste.
- **Clôture** : finir sur l'ouverture (perspectives), pas sur une excuse.
