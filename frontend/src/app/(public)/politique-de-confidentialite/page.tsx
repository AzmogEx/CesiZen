export default function PolitiqueConfidentialitePage() {
  return (
    <div className="fr-container fr-py-6w">
      <h1>Politique de confidentialité</h1>

      <h2>Conformité RGPD</h2>
      <p>
        CESIZen s&apos;engage à respecter le Règlement Général sur la Protection
        des Données (RGPD) et la loi Informatique et Libertés. La protection de
        vos données personnelles est une priorité.
      </p>

      <h2>Données collectées</h2>
      <p>
        Dans le cadre de l&apos;utilisation de CESIZen, les données suivantes
        sont collectées :
      </p>
      <ul>
        <li>Adresse e-mail</li>
        <li>Nom et prénom</li>
        <li>Données relatives aux émotions enregistrées</li>
      </ul>

      <h2>Finalité du traitement</h2>
      <p>
        Ces données sont collectées uniquement dans le but de fournir un suivi
        personnalisé du bien-être émotionnel. Elles ne sont ni vendues, ni
        partagées avec des tiers à des fins commerciales.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données personnelles sont conservées pendant toute la durée
        d&apos;utilisation du compte. En cas de suppression du compte, les
        données sont effacées dans un délai de 30 jours.
      </p>

      <h2>Sécurité des données</h2>
      <p>
        Les données sont chiffrées en transit (HTTPS) et au repos. Les mots de
        passe sont hachés avec des algorithmes sécurisés. L&apos;accès aux
        données est strictement limité aux personnes habilitées.
      </p>

      <h2>Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li>
          <strong>Droit d&apos;accès :</strong> obtenir une copie de vos données
          personnelles
        </li>
        <li>
          <strong>Droit de rectification :</strong> corriger des données
          inexactes ou incomplètes
        </li>
        <li>
          <strong>Droit de suppression :</strong> demander l&apos;effacement de
          vos données personnelles
        </li>
        <li>
          <strong>Droit à la portabilité :</strong> récupérer vos données dans
          un format structuré
        </li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à l&apos;adresse :{' '}
        <a className="fr-link" href="mailto:contact@cesizen.fr">
          contact@cesizen.fr
        </a>
      </p>
    </div>
  );
}
