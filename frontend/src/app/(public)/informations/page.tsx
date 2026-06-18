'use client';

import Link from 'next/link';
import { useFeeds } from '@/hooks/useFeeds';

export default function InformationsPage() {
  const { data: feeds, isLoading } = useFeeds();

  return (
    <div className="fr-container fr-py-6w">
      <h1>Informations &amp; Ressources</h1>
      <p className="fr-text--lead">
        Des contenus validés sur la santé mentale, la gestion du stress et le
        bien-être émotionnel.
      </p>

      {isLoading ? (
        <p className="fr-text--sm">Chargement des articles…</p>
      ) : feeds && feeds.length > 0 ? (
        <div className="fr-grid-row fr-grid-row--gutters">
          {feeds.map((feed) => (
            <div className="fr-col-12 fr-col-md-6" key={feed.id}>
              <div className="fr-card fr-enlarge-link">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h2 className="fr-card__title">
                      <Link href={`/informations/${feed.slug}`}>
                        {feed.titre}
                      </Link>
                    </h2>
                    <p className="fr-card__desc">
                      {(feed.contenu ?? '')
                        .replace(/<[^>]*>/g, '')
                        .substring(0, 200) + '…'}
                    </p>
                    <div className="fr-card__end">
                      <p className="fr-card__detail">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="fr-callout">
          <p className="fr-callout__text">
            Aucun article disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
