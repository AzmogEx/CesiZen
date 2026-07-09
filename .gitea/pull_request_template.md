<!-- Modèle de Pull Request CESIZen — la CI (Gitea Actions) doit être verte avant merge. -->

## Objet
<!-- Décrire brièvement le changement. -->

## Ticket lié
<!-- Ex. : Closes #12 -->
Closes #

## Type de changement
- [ ] 🐞 Correctif (maintenance corrective)
- [ ] ✨ Évolution (maintenance évolutive)
- [ ] ♻️ Refactorisation / dette technique
- [ ] 🔒 Sécurité
- [ ] 📖 Documentation

## Vérifications
- [ ] Les tests automatisés passent en local (`php artisan test`, `npm test`)
- [ ] Le style de code est respecté (`vendor/bin/pint`, `npm run lint`)
- [ ] La CI Gitea Actions est verte
- [ ] Pas de secret ni de donnée personnelle commitée
- [ ] Documentation mise à jour si nécessaire

## Impact sécurité / données personnelles
<!-- Le changement touche-t-il à l'authentification, aux données de santé, au RGPD ? -->
