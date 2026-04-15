import Card from '@/components/ui/Card';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Politique de confidentialité
      </h1>

      <div className="space-y-6">
        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Conformité RGPD
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            CESIZen s&apos;engage à respecter le Règlement Général sur la Protection
            des Données (RGPD) et la loi Informatique et Libertés. La protection
            de vos données personnelles est une priorité.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Données collectées
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Dans le cadre de l&apos;utilisation de CESIZen, les données suivantes
            sont collectées :
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
            <li>Adresse e-mail</li>
            <li>Nom et prénom</li>
            <li>Données relatives aux émotions enregistrées</li>
          </ul>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Finalité du traitement
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Ces données sont collectées uniquement dans le but de fournir un suivi
            personnalisé du bien-être émotionnel. Elles ne sont ni vendues, ni
            partagées avec des tiers à des fins commerciales.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Durée de conservation
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Les données personnelles sont conservées pendant toute la durée
            d&apos;utilisation du compte. En cas de suppression du compte, les
            données sont effacées dans un délai de 30 jours.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Sécurité des données
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Les données sont chiffrées en transit (HTTPS) et au repos. Les mots de
            passe sont hachés avec des algorithmes sécurisés. L&apos;accès aux
            données est strictement limité aux personnes habilitées.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Vos droits
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
            <li>
              <strong>Droit d&apos;accès :</strong> obtenir une copie de vos
              données personnelles
            </li>
            <li>
              <strong>Droit de rectification :</strong> corriger des données
              inexactes ou incomplètes
            </li>
            <li>
              <strong>Droit de suppression :</strong> demander l&apos;effacement
              de vos données personnelles
            </li>
            <li>
              <strong>Droit à la portabilité :</strong> récupérer vos données dans
              un format structuré
            </li>
          </ul>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
            Pour exercer ces droits, contactez-nous à l&apos;adresse :{' '}
            <span className="text-malachite-600 dark:text-malachite-400">
              contact@cesizen.fr
            </span>
          </p>
        </Card>
      </div>
    </div>
  );
}
