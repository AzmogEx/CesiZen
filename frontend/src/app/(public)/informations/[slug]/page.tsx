'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useFeed } from '@/hooks/useFeeds';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: feed, isLoading, error } = useFeed(slug);

  if (isLoading) {
    return (
      <div className="fr-container fr-py-6w">
        <p className="fr-text--sm">Chargement de l&apos;article…</p>
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className="fr-container fr-py-6w">
        <div className="fr-alert fr-alert--error">
          <h3 className="fr-alert__title">Article introuvable</h3>
          <p>
            L&apos;article demandé n&apos;existe pas ou n&apos;est plus
            disponible.
          </p>
        </div>
        <Link className="fr-link fr-mt-2w" href="/informations">
          Retour aux informations
        </Link>
      </div>
    );
  }

  return (
    <div className="fr-container fr-py-6w">
      <nav
        role="navigation"
        className="fr-breadcrumb"
        aria-label="vous êtes ici :"
      >
        <button
          type="button"
          className="fr-breadcrumb__button"
          aria-expanded="false"
          aria-controls="breadcrumb-article"
        >
          Voir le fil d&apos;Ariane
        </button>
        <div className="fr-collapse" id="breadcrumb-article">
          <ol className="fr-breadcrumb__list">
            <li>
              <Link className="fr-breadcrumb__link" href="/">
                Accueil
              </Link>
            </li>
            <li>
              <Link className="fr-breadcrumb__link" href="/informations">
                Informations
              </Link>
            </li>
            <li>
              <a className="fr-breadcrumb__link" aria-current="page">
                {feed.titre}
              </a>
            </li>
          </ol>
        </div>
      </nav>

      <h1>{feed.titre}</h1>

      <p className="fr-text--sm">
        {feed.auteur && (
          <>
            <span
              className="fr-icon-user-line fr-mr-1w"
              aria-hidden="true"
            />
            {feed.auteur.prenom} {feed.auteur.nom}
            {' — '}
          </>
        )}
        <span
          className="fr-icon-calendar-line fr-mr-1w"
          aria-hidden="true"
        />
        {new Date(feed.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      <hr className="fr-mt-2w fr-mb-4w" />

      <div
        className="fr-col-12 fr-col-md-10"
        dangerouslySetInnerHTML={{ __html: feed.contenu }}
      />
    </div>
  );
}
