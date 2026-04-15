import Card from '@/components/ui/Card';

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Mentions légales
      </h1>

      <div className="space-y-6">
        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Éditeur de l&apos;application
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            CESIZen est une application développée dans le cadre d&apos;un projet
            pédagogique au sein de{' '}
            <strong>CESI École d&apos;Ingénieurs</strong>. Cette application est
            réalisée à but éducatif et n&apos;a pas de vocation commerciale.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Hébergement
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            L&apos;application est hébergée dans le cadre de l&apos;infrastructure
            pédagogique de CESI. Les données sont stockées sur des serveurs
            sécurisés situés en France.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Propriété intellectuelle
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            L&apos;ensemble des contenus présents sur CESIZen (textes, images,
            graphismes, logo, icônes) sont la propriété exclusive de leurs auteurs
            respectifs et sont protégés par les lois françaises et internationales
            relatives à la propriété intellectuelle.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Responsabilité
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            CESIZen est un outil de suivi du bien-être et ne se substitue en aucun
            cas à un avis médical professionnel. En cas de détresse psychologique,
            veuillez contacter les services d&apos;urgence ou un professionnel de
            santé.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Contact
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Pour toute question relative aux mentions légales, vous pouvez nous
            contacter via l&apos;adresse suivante :{' '}
            <span className="text-malachite-600 dark:text-malachite-400">
              contact@cesizen.fr
            </span>
          </p>
        </Card>
      </div>
    </div>
  );
}
