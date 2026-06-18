import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fr-footer" role="contentinfo" id="footer">
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <Link href="/" title="Accueil - CESIZen">
              <p className="fr-logo">
                République
                <br />
                Française
              </p>
            </Link>
          </div>
          <div className="fr-footer__content">
            <p className="fr-footer__content-desc">
              CESIZen est une plateforme publique de prévention et de suivi en
              santé mentale, éditée pour le Ministère des Solidarités et de la
              Santé. En cas de détresse, contactez le 3114 (numéro national de
              prévention du suicide).
            </p>
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener noreferrer external"
                  href="https://legifrance.gouv.fr"
                >
                  legifrance.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener noreferrer external"
                  href="https://gouvernement.fr"
                >
                  gouvernement.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener noreferrer external"
                  href="https://service-public.fr"
                >
                  service-public.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener noreferrer external"
                  href="https://data.gouv.fr"
                >
                  data.gouv.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href="/mentions-legales">
                Mentions légales
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link
                className="fr-footer__bottom-link"
                href="/politique-de-confidentialite"
              >
                Données personnelles
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href="/contacts-urgence">
                Contacts d&apos;urgence
              </Link>
            </li>
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>
              Sauf mention contraire, tous les contenus de ce site sont sous{" "}
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                target="_blank"
                rel="noopener noreferrer external"
              >
                licence etalab-2.0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
