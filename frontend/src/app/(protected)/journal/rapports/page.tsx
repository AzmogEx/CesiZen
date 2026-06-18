'use client';

import { useState } from 'react';
import { useRapport } from '@/hooks/useRapport';
import EmotionChart from '@/components/features/EmotionChart';

type Period = 'week' | 'month' | 'quarter' | 'year';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'year', label: 'Année' },
];

export default function RapportsPage() {
  const [period, setPeriod] = useState<Period>('month');
  const { data: rapport, isLoading } = useRapport(period);

  return (
    <div className="fr-container fr-py-6w">
      <div className="fr-grid-row fr-grid-row--middle fr-mb-4w">
        <div className="fr-col-12 fr-col-md">
          <h1 className="fr-mb-1v">Mes rapports</h1>
          <p className="fr-text--lead fr-mb-0">
            Analysez vos tendances émotionnelles
          </p>
        </div>

        {/* Sélecteur de période */}
        <div className="fr-col-12 fr-col-md--right">
          <fieldset className="fr-segmented fr-segmented--sm">
            <legend className="fr-segmented__legend">Période</legend>
            <div className="fr-segmented__elements">
              {PERIODS.map((p) => (
                <div className="fr-segmented__element" key={p.value}>
                  <input
                    type="radio"
                    id={`period-${p.value}`}
                    name="period"
                    checked={period === p.value}
                    onChange={() => setPeriod(p.value)}
                  />
                  <label className="fr-label" htmlFor={`period-${p.value}`}>
                    {p.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {isLoading ? (
        <p>Chargement…</p>
      ) : rapport ? (
        <>
          {/* Stats résumées */}
          <div className="fr-grid-row fr-grid-row--gutters fr-mb-3w">
            <div className="fr-col-12 fr-col-md-4">
              <div className="fr-tile fr-tile--vertical">
                <div className="fr-tile__body">
                  <div className="fr-tile__content">
                    <h3 className="fr-tile__title">
                      <span
                        className="fr-icon-bar-chart-box-line fr-mr-1w"
                        aria-hidden="true"
                      />
                      Total saisies
                    </h3>
                    <p className="fr-h3 fr-mb-1v">{rapport.stats.total_saisies}</p>
                    <p className="fr-tile__detail">
                      Du {new Date(rapport.date_debut).toLocaleDateString('fr-FR')} au{' '}
                      {new Date(rapport.date_fin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fr-col-12 fr-col-md-4">
              <div className="fr-tile fr-tile--vertical">
                <div className="fr-tile__body">
                  <div className="fr-tile__content">
                    <h3 className="fr-tile__title">
                      <span
                        className="fr-icon-line-chart-line fr-mr-1w"
                        aria-hidden="true"
                      />
                      Intensité moyenne
                    </h3>
                    <p className="fr-h3 fr-mb-0">
                      {rapport.stats.intensite_moyenne?.toFixed(1) || '—'}
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
                    <h3 className="fr-tile__title">
                      <span
                        className="fr-icon-pie-chart-2-line fr-mr-1w"
                        aria-hidden="true"
                      />
                      Émotion dominante
                    </h3>
                    {rapport.stats.emotion_dominante ? (
                      <p className="fr-mb-0">
                        <span className="fr-badge fr-badge--info">
                          {rapport.stats.emotion_dominante.nom}
                        </span>
                        <span className="fr-text--sm fr-display-block fr-mt-1v">
                          {rapport.stats.emotion_dominante.count} fois
                        </span>
                      </p>
                    ) : (
                      <p className="fr-h4 fr-mb-0">—</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Répartition (Camembert) */}
          <div className="app-panel fr-p-3w fr-mb-3w">
            <h2 className="fr-h5">Répartition des émotions</h2>
            <EmotionChart data={rapport} type="repartition" />
          </div>

          {/* Évolution (Lignes) */}
          <div className="app-panel fr-p-3w fr-mb-3w">
            <h2 className="fr-h5">Évolution dans le temps</h2>
            <EmotionChart data={rapport} type="evolution" />
          </div>

          {/* Intensité moyenne (Barres) */}
          <div className="app-panel fr-p-3w fr-mb-3w">
            <h2 className="fr-h5">Intensité moyenne par période</h2>
            <EmotionChart data={rapport} type="intensite" />
          </div>

          {/* Détail répartition */}
          {rapport.repartition.length > 0 && (
            <div className="app-panel fr-p-3w">
              <h2 className="fr-h5">Détail par émotion</h2>
              <ul className="fr-raw-list">
                {rapport.repartition.map((item) => (
                  <li key={item.nom} className="fr-py-1w">
                    <div className="fr-grid-row fr-grid-row--middle">
                      <span
                        className="fr-mr-2w"
                        aria-hidden="true"
                        style={{
                          display: 'inline-block',
                          width: '0.75rem',
                          height: '0.75rem',
                          borderRadius: '50%',
                          backgroundColor: item.couleur,
                        }}
                      />
                      <span className="fr-col">
                        <strong>{item.nom}</strong>
                      </span>
                      <span className="fr-text--sm fr-mr-3w">
                        {item.pourcentage}%
                      </span>
                      <span className="fr-text--sm fr-text-mention--grey">
                        Moy : {item.intensite_moyenne.toFixed(1)}/10
                      </span>
                    </div>
                    <div
                      className="fr-mt-1v"
                      style={{
                        height: '0.5rem',
                        borderRadius: '0.25rem',
                        backgroundColor: 'var(--background-contrast-grey)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${item.pourcentage}%`,
                          backgroundColor: item.couleur,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="fr-callout">
          <p className="fr-callout__title">Pas de données pour cette période</p>
          <p className="fr-callout__text">
            Enregistrez des saisies pour visualiser vos tendances.
          </p>
        </div>
      )}
    </div>
  );
}
