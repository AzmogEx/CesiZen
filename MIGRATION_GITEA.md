# Migration vers Gitea & mise en place des outils (Bloc 3)

Ce guide décrit la mise en place de **Gitea** comme plateforme unique de **versioning**, de
**gestion des tickets** (maintenance) et d'**intégration continue** (Gitea Actions), ainsi que le
raccordement au déploiement continu **Coolify**. Il sert de support à la démonstration de soutenance.

> Instance utilisée : Gitea auto-hébergée. Dépôt cible : `https://<instance-gitea>/adam/cesizen`.

---

## 1. Migrer le dépôt GitHub → Gitea

### Option A — Migration assistée (recommandée, conserve issues & historique)
1. Se connecter à Gitea → **+ → Nouvelle migration → GitHub**.
2. URL source : `https://github.com/AzmogEx/CesiZen.git`.
3. Cocher : *Éléments à migrer* → dépôt Git, **Issues**, **Pull requests**, **Releases**, **Labels**, **Milestones**.
4. Renseigner un jeton d'accès GitHub (lecture) si le dépôt est privé. Lancer.

### Option B — Push manuel (miroir du code seul)
```bash
cd /chemin/vers/CesiZen
git remote add gitea https://<instance-gitea>/adam/cesizen.git
git push gitea --all      # toutes les branches
git push gitea --tags     # tous les tags/releases
# Faire de Gitea le dépôt de référence :
git remote set-url origin https://<instance-gitea>/adam/cesizen.git
```

Vérifier ensuite que `.gitea/` (workflows + gabarits d'issues) est bien présent à la racine.

---

## 2. Activer l'intégration continue (Gitea Actions)

1. **Côté serveur Gitea** : Actions doit être activé (`app.ini` → `[actions] ENABLED = true`).
2. **Enregistrer un runner** (une fois) :
   ```bash
   # Récupérer le jeton dans Gitea → Administration → Actions → Runners
   act_runner register --instance https://<instance-gitea> --token <TOKEN> \
       --name cesizen-runner --labels ubuntu-latest:docker://node:20-bookworm
   act_runner daemon
   ```
3. Le workflow **`.gitea/workflows/ci.yml`** se déclenche alors à chaque `push` / `pull request` et
   exécute les 3 jobs : **backend** (PHPUnit + Pint), **frontend** (ESLint + Vitest), **mobile** (Jest).
4. Une pastille verte/rouge s'affiche sur chaque commit et chaque PR (démo).

---

## 3. Configurer le ticketing (maintenance)

### Labels à créer (Issues → Labels → « Créer un label »)
| Label | Couleur | Usage |
|---|---|---|
| `type/incident` | rouge | Anomalie (maintenance corrective) — posé automatiquement par le gabarit |
| `type/évolution` | bleu | Nouvelle fonctionnalité (maintenance évolutive) |
| `gravité/bloquant` | #C8102E | Service inutilisable |
| `gravité/majeur` | #E4801C | Service dégradé, contournement possible |
| `gravité/mineur` | #F0C808 | Altération mineure |
| `priorité/critique` · `priorité/forte` · `priorité/normale` | dégradé | Ordonnancement |
| `statut/à-qualifier` · `statut/en-cours` · `statut/en-revue` · `statut/résolu` | gris→vert | Suivi Kanban |
| `module/comptes` · `module/informations` · `module/tracker` · `module/infra` | vert | Domaine |

Les **gabarits d'issues** sont déjà versionnés dans `.gitea/issue_template/` (`incident.yaml`,
`evolution.yaml`) : ils apparaissent automatiquement au clic sur **« Nouvelle issue »**.

### Milestones (= versions)
Créer un jalon par version livrée : `v1.0`, `v1.1`, … Chaque issue/PR est rattachée à un jalon → suivi
de l'avancement par version.

### Tableau de bord Kanban (pilotage)
Onglet **Projects → Nouveau projet** (type *Board*) avec les colonnes :
`À qualifier` → `À faire` → `En cours` → `En revue (PR)` → `Résolu`.
Les issues glissent d'une colonne à l'autre ; les labels de statut sont synchronisés.

---

## 4. Raccorder le déploiement continu (Coolify)

Coolify build les images depuis le dépôt Git et redéploie à chaque nouveau commit sur `main` :

1. Dans Coolify → application CESIZen → **Source** : pointer sur le dépôt Gitea (`main`).
2. Activer le **webhook de déploiement** : Coolify fournit une URL de type
   `https://<coolify>/api/v1/deploy?uuid=…&force=false`.
3. Dans Gitea → dépôt → **Paramètres → Webhooks → Ajouter** : coller l'URL, événement *Push*, branche `main`.
4. Résultat : `merge sur main` → CI verte → webhook → Coolify build + déploie en production
   (`cesizen.cleanows.fr` / `api.cesizen.cleanows.fr`), avec migrations, seed et génération des
   secrets automatisés par `backend/docker/entrypoint.sh`.

---

## 5. Script de démonstration (soutenance)

1. **Versioning** : montrer l'arbre des commits Gitea, les branches, un tag de version.
2. **CI** : ouvrir une PR triviale → montrer les 3 jobs qui tournent → pastille verte.
3. **Ticketing** : créer une issue via le gabarit *incident*, la qualifier (labels + jalon),
   la déplacer sur le board Kanban.
4. **CD** : merger la PR → montrer le déploiement Coolify déclenché → rafraîchir le site en ligne.
