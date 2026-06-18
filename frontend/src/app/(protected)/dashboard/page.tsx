'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useSaisies } from '@/hooks/useTracker';
import { useRapport } from '@/hooks/useRapport';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: saisies, isLoading: saisiesLoading } = useSaisies();
  const { data: rapport, isLoading: rapportLoading } = useRapport('week');

  const recentSaisies = saisies?.slice(0, 5) || [];

  return (
    <div className="fr-container fr-py-6w">
      {/* En-tête */}
      <h1>Bonjour {user?.prenom}</h1>
      <p className="fr-text--lead">
        Voici un aperçu de votre bien-être cette semaine.
      </p>

      {/* Actions rapides */}
      <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
        <div className="fr-col-12 fr-col-md-4">
          <div className="fr-tile fr-tile--horizontal fr-enlarge-link">
            <div className="fr-tile__body">
              <div className="fr-tile__content">
                <h3 className="fr-tile__title">
                  <Link href="/journal/nouvelle-saisie">
                    <span
                      className="fr-icon-add-line fr-mr-1w"
                      aria-hidden="true"
                    />
                    Nouvelle saisie
                  </Link>
                </h3>
                <p className="fr-tile__detail">Enregistrer une émotion</p>
              </div>
            </div>
          </div>
        </div>

        <div className="fr-col-12 fr-col-md-4">
          <div className="fr-tile fr-tile--horizontal fr-enlarge-link">
            <div className="fr-tile__body">
              <div className="fr-tile__content">
                <h3 className="fr-tile__title">
                  <Link href="/journal">
                    <span
                      className="fr-icon-book-2-line fr-mr-1w"
                      aria-hidden="true"
                    />
                    Mon journal
                  </Link>
                </h3>
                <p className="fr-tile__detail">Voir toutes mes saisies</p>
              </div>
            </div>
          </div>
        </div>

        <div className="fr-col-12 fr-col-md-4">
          <div className="fr-tile fr-tile--horizontal fr-enlarge-link">
            <div className="fr-tile__body">
              <div className="fr-tile__content">
                <h3 className="fr-tile__title">
                  <Link href="/journal/rapports">
                    <span
                      className="fr-icon-line-chart-line fr-mr-1w"
                      aria-hidden="true"
                    />
                    Mes rapports
                  </Link>
                </h3>
                <p className="fr-tile__detail">Visualiser mes tendances</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats de la semaine */}
      <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
        {rapportLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div className="fr-col-12 fr-col-md-4" key={i}>
              <div className="fr-tile fr-tile--vertical">
                <div className="fr-tile__body">
                  <div className="fr-tile__content">
                    <p className="fr-tile__detail">Chargement…</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="fr-col-12 fr-col-md-4">
              <div className="fr-tile fr-tile--vertical">
                <div className="fr-tile__body">
                  <div className="fr-tile__content">
                    <p className="fr-tile__detail">Saisies cette semaine</p>
                    <p className="fr-h2 fr-mb-0">
                      {rapport?.stats.total_saisies || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <div className="fr-tile fr-tile--vertical">
                <div className="fr-tile__body">
                  <div className="fr-tile__content">
                    <p className="fr-tile__detail">Intensité moyenne</p>
                    <p className="fr-h2 fr-mb-0">
                      {rapport?.stats.intensite_moyenne?.toFixed(1) || '—'}
                      <span className="fr-text--sm"> /10</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <div className="fr-tile fr-tile--vertical">
                <div className="fr-tile__body">
                  <div className="fr-tile__content">
                    <p className="fr-tile__detail">Émotion dominante</p>
                    {rapport?.stats.emotion_dominante ? (
                      <p className="fr-mb-0">
                        <span className="fr-badge fr-badge--info">
                          {rapport.stats.emotion_dominante.nom}
                        </span>
                        <span className="fr-text--sm">
                          {' '}
                          ({rapport.stats.emotion_dominante.count}x)
                        </span>
                      </p>
                    ) : (
                      <p className="fr-h4 fr-mb-0">—</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Saisies récentes */}
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div className="fr-grid-row fr-grid-row--middle fr-mb-2w">
              <h2 className="fr-col fr-h5 fr-mb-0">Saisies récentes</h2>
              <p className="fr-col--right fr-mb-0">
                <Link href="/journal" className="fr-link">
                  Voir tout
                </Link>
              </p>
            </div>

            {saisiesLoading ? (
              <p>Chargement…</p>
            ) : recentSaisies.length > 0 ? (
              <ul className="fr-raw-list">
                {recentSaisies.map((saisie) => (
                  <li
                    key={saisie.id}
                    className="fr-py-1w"
                    style={{ borderBottom: '1px solid var(--border-default-grey)' }}
                  >
                    <div className="fr-grid-row fr-grid-row--middle">
                      <span className="fr-mr-2w" style={{ fontSize: '1.5rem' }}>
                        {saisie.emotion?.icone || '🔵'}
                      </span>
                      <span className="fr-col">
                        <strong>{saisie.emotion?.nom}</strong>{' '}
                        <span className="fr-text--sm">
                          {saisie.intensite}/10
                        </span>
                        {saisie.note && (
                          <span className="fr-text--sm fr-text-mention--grey fr-display-block">
                            {saisie.note}
                          </span>
                        )}
                      </span>
                      <span className="fr-text--sm fr-text-mention--grey">
                        {new Date(saisie.date_saisie).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="fr-callout">
                <p className="fr-callout__text">Aucune saisie pour le moment.</p>
                <Link
                  className="fr-btn fr-btn--sm fr-icon-add-line fr-btn--icon-left"
                  href="/journal/nouvelle-saisie"
                >
                  Faire ma première saisie
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
