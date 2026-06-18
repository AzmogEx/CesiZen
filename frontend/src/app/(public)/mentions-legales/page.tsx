export default function MentionsLegalesPage() {
  return (
    <div className="fr-container fr-py-6w">
      <h1>Mentions légales</h1>

      <h2>Éditeur de l&apos;application</h2>
      <p>
        CESIZen est une application développée dans le cadre d&apos;un projet
        pédagogique au sein de <strong>CESI École d&apos;Ingénieurs</strong>.
        Cette application est réalisée à but éducatif et n&apos;a pas de vocation
        commerciale.
      </p>

      <h2>Hébergement</h2>
      <p>
        L&apos;application est hébergée dans le cadre de l&apos;infrastructure
        pédagogique de CESI. Les données sont stockées sur des serveurs
        sécurisés situés en France.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur CESIZen (textes, images,
        graphismes, logo, icônes) sont la propriété exclusive de leurs auteurs
        respectifs et sont protégés par les lois françaises et internationales
        relatives à la propriété intellectuelle.
      </p>

      <h2>Responsabilité</h2>
      <p>
        CESIZen est un outil de suivi du bien-être et ne se substitue en aucun
        cas à un avis médical professionnel. En cas de détresse psychologique,
        veuillez contacter les services d&apos;urgence ou un professionnel de
        santé.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative aux mentions légales, vous pouvez nous
        contacter via l&apos;adresse suivante :{' '}
        <a className="fr-link" href="mailto:contact@cesizen.fr">
          contact@cesizen.fr
        </a>
      </p>
    </div>
  );
}
