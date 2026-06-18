import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="fr-container fr-py-8w">
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div className="fr-col-12 fr-col-md-7">
            <h1>
              CESIZen, prenez soin de votre santé mentale
            </h1>
            <p className="fr-text--lead">
              Une plateforme publique pour suivre vos émotions au quotidien,
              comprendre vos tendances et accéder à des ressources fiables sur la
              prévention du stress.
            </p>
            <ul className="fr-btns-group fr-btns-group--inline-md">
              <li>
                <Link className="fr-btn fr-btn--lg" href="/inscription">
                  Créer un compte gratuitement
                </Link>
              </li>
              <li>
                <Link
                  className="fr-btn fr-btn--lg fr-btn--secondary"
                  href="/informations"
                >
                  Consulter les ressources
                </Link>
              </li>
            </ul>
          </div>
          <div className="fr-col-12 fr-col-md-5">
            <div className="fr-callout">
              <p className="fr-callout__title">Pourquoi suivre ses émotions ?</p>
              <p className="fr-callout__text">
                Nommer une émotion réduit son intensité (affect labeling, UCLA).
                Le suivi régulier aide à identifier ses tendances et à mieux gérer
                son stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Comment ça marche ─── */}
      <section className="fr-background-alt--grey fr-py-8w">
        <div className="fr-container">
          <h2>Comment ça marche ?</h2>
          <p className="fr-text--lead fr-mb-6w">
            Trois étapes simples pour prendre soin de votre bien-être émotionnel.
          </p>
          <div className="fr-grid-row fr-grid-row--gutters">
            {[
              {
                step: "1",
                title: "Identifiez votre émotion",
                desc: "Choisissez parmi un référentiel d'émotions et sous-émotions, puis notez l'intensité ressentie de 1 à 10.",
              },
              {
                step: "2",
                title: "Ajoutez du contexte",
                desc: "Notez ce qui a déclenché cette émotion. Quelques mots suffisent à mieux comprendre vos tendances.",
              },
              {
                step: "3",
                title: "Suivez votre évolution",
                desc: "Consultez des rapports visuels (semaine, mois, trimestre, année) pour identifier vos tendances.",
              },
            ].map((s) => (
              <div className="fr-col-12 fr-col-md-4" key={s.step}>
                <div className="fr-card fr-enlarge-link">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h3 className="fr-card__title">
                        <span className="fr-badge fr-badge--blue-ecume fr-mb-1w">
                          Étape {s.step}
                        </span>
                        <br />
                        {s.title}
                      </h3>
                      <p className="fr-card__desc">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Fonctionnalités ─── */}
      <section className="fr-container fr-py-8w">
        <h2>Tout ce dont vous avez besoin</h2>
        <p className="fr-text--lead fr-mb-6w">
          Des outils conçus pour vous accompagner dans la gestion de votre
          bien-être émotionnel.
        </p>
        <div className="fr-grid-row fr-grid-row--gutters">
          {[
            {
              icon: "fr-icon-heart-line",
              title: "Journal d'émotions",
              desc: "Enregistrez vos émotions quotidiennes et suivez leur évolution dans un journal sécurisé.",
            },
            {
              icon: "fr-icon-line-chart-line",
              title: "Rapports visuels",
              desc: "Visualisez vos tendances : répartition, évolution et intensité de vos émotions.",
            },
            {
              icon: "fr-icon-book-2-line",
              title: "Ressources fiables",
              desc: "Accédez à des contenus validés sur la santé mentale et la gestion du stress.",
            },
            {
              icon: "fr-icon-shield-line",
              title: "Données protégées",
              desc: "Vos données sont protégées conformément au RGPD. Vous en gardez le contrôle total.",
            },
          ].map((f) => (
            <div className="fr-col-12 fr-col-md-6 fr-col-lg-3" key={f.title}>
              <div className="fr-tile fr-tile--vertical">
                <div className="fr-tile__body">
                  <div className="fr-tile__content">
                    <h3 className="fr-tile__title">
                      <span
                        className={`${f.icon} fr-mr-1w`}
                        aria-hidden="true"
                      />
                      {f.title}
                    </h3>
                    <p className="fr-tile__detail">{f.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Engagements ─── */}
      <section className="fr-background-alt--grey fr-py-8w">
        <div className="fr-container">
          <h2>Une application pensée pour vous</h2>
          <p className="fr-text--lead fr-mb-4w">
            CESIZen est édité pour le Ministère des Solidarités et de la Santé :
            un outil fiable, accessible et respectueux de votre vie privée.
          </p>
          <div className="fr-grid-row fr-grid-row--gutters">
            {[
              "Totalement gratuit et sans publicité",
              "Conforme RGPD — vos données vous appartiennent",
              "Interface accessible et inclusive (RGAA)",
              "Rapports visuels pour comprendre vos tendances",
              "Contenus validés par des professionnels de santé",
              "Export et suppression de vos données à tout moment",
            ].map((item) => (
              <div className="fr-col-12 fr-col-md-6" key={item}>
                <p>
                  <span
                    className="fr-icon-check-line fr-mr-1w"
                    aria-hidden="true"
                  />
                  {item}
                </p>
              </div>
            ))}
          </div>
          <ul className="fr-btns-group fr-btns-group--inline-md fr-mt-4w">
            <li>
              <Link className="fr-btn fr-btn--lg" href="/inscription">
                Créer mon compte
              </Link>
            </li>
            <li>
              <Link
                className="fr-btn fr-btn--lg fr-btn--secondary"
                href="/connexion"
              >
                Se connecter
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ─── Urgence ─── */}
      <section className="fr-container fr-py-6w">
        <div className="fr-callout fr-callout--brown-caramel fr-icon-information-line">
          <p className="fr-callout__title">En cas d&apos;urgence ou de détresse</p>
          <p className="fr-callout__text">
            Appelez le <strong>3114</strong> (numéro national de prévention du
            suicide, gratuit, 24h/24) ou le <strong>15</strong> (SAMU). Vous
            n&apos;êtes pas seul·e.
          </p>
        </div>
      </section>
    </>
  );
}
