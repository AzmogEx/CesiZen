'use client';

import React from 'react';
import type { SaisieTracker } from '@/types';

interface TrackerTimelineProps {
  saisies: SaisieTracker[];
  onEdit?: (saisie: SaisieTracker) => void;
  onDelete?: (id: number) => void;
}

export default function TrackerTimeline({ saisies, onEdit, onDelete }: TrackerTimelineProps) {
  if (saisies.length === 0) {
    return (
      <div className="fr-callout">
        <p className="fr-callout__title">Aucune saisie enregistrée</p>
        <p className="fr-callout__text">
          Commencez par enregistrer votre première émotion.
        </p>
      </div>
    );
  }

  // Grouper les saisies par date
  const grouped = saisies.reduce<Record<string, SaisieTracker[]>>((acc, saisie) => {
    const date = new Date(saisie.date_saisie).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(saisie);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([date, items]) => (
        <section key={date} className="fr-mb-4w">
          <h3 className="fr-h6 fr-text-mention--grey fr-mb-2w" style={{ textTransform: 'uppercase' }}>
            {date}
          </h3>
          <div className="fr-grid-row fr-grid-row--gutters">
            {items.map((saisie) => (
              <div key={saisie.id} className="fr-col-12">
                <div className="app-panel fr-p-2w">
                  <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--top">
                    {/* Icône émotion */}
                    <div className="fr-col-auto">
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '0.5rem',
                          fontSize: '1.5rem',
                          backgroundColor: `${saisie.emotion?.couleur}20`,
                        }}
                      >
                        {saisie.emotion?.icone || '🔵'}
                      </span>
                    </div>

                    {/* Contenu */}
                    <div className="fr-col">
                      <p className="fr-mb-1v">
                        <span className="fr-badge fr-badge--info fr-mr-2v">
                          {saisie.emotion?.nom}
                        </span>
                        <span className="fr-text--sm fr-text-mention--grey">
                          Intensité : {saisie.intensite}/10
                        </span>
                      </p>
                      {/* Barre d'intensité */}
                      <div
                        className="fr-mb-1w"
                        style={{
                          width: '100%',
                          height: '0.375rem',
                          borderRadius: '0.25rem',
                          backgroundColor: 'var(--background-contrast-grey)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${saisie.intensite * 10}%`,
                            backgroundColor: saisie.emotion?.couleur || '#000091',
                          }}
                        />
                      </div>
                      {saisie.note && (
                        <p className="fr-text--sm fr-mb-0">{saisie.note}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="fr-col-auto">
                      <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
                        {onEdit && (
                          <li>
                            <button
                              type="button"
                              onClick={() => onEdit(saisie)}
                              className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-edit-line"
                              title="Modifier"
                            >
                              Modifier
                            </button>
                          </li>
                        )}
                        {onDelete && (
                          <li>
                            <button
                              type="button"
                              onClick={() => onDelete(saisie.id)}
                              className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-delete-line"
                              title="Supprimer"
                            >
                              Supprimer
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
