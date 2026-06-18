'use client';

import React, { useState } from 'react';
import { useEmotions } from '@/hooks/useEmotions';
import type { Emotion } from '@/types';

interface EmotionPickerProps {
  value?: number;
  onChange: (emotionId: number) => void;
}

export default function EmotionPicker({ value, onChange }: EmotionPickerProps) {
  const { data: emotions, isLoading } = useEmotions();
  const [selectedParent, setSelectedParent] = useState<Emotion | null>(null);

  if (isLoading) {
    return <p className="fr-text--sm fr-text-mention--grey">Chargement des émotions…</p>;
  }

  // Si une émotion parent est sélectionnée et qu'elle a des enfants, afficher les sous-émotions
  if (selectedParent?.enfants && selectedParent.enfants.length > 0) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedParent(null)}
          className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-arrow-left-line fr-btn--icon-left fr-mb-2w"
        >
          Retour aux émotions
        </button>
        <p className="fr-text--sm fr-mb-2w">
          Précisez votre émotion de{' '}
          <span className="fr-text--bold" style={{ color: selectedParent.couleur }}>
            {selectedParent.nom}
          </span>{' '}
          :
        </p>
        <ul className="fr-tags-group">
          {selectedParent.enfants.map((child) => {
            const isSelected = value === child.id;
            return (
              <li key={child.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onChange(child.id)}
                  className={`fr-tag${isSelected ? ' fr-tag--green-emeraude' : ''}`}
                >
                  <span aria-hidden="true" className="fr-mr-1v">
                    {child.icone || '🔵'}
                  </span>
                  {child.nom}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <ul className="fr-tags-group">
      {emotions?.map((emotion) => {
        const hasChildren = emotion.enfants && emotion.enfants.length > 0;
        const isSelected =
          value === emotion.id || emotion.enfants?.some((e) => e.id === value);

        return (
          <li key={emotion.id}>
            <button
              type="button"
              aria-pressed={!!isSelected}
              onClick={() => {
                if (hasChildren) {
                  setSelectedParent(emotion);
                } else {
                  onChange(emotion.id);
                }
              }}
              className={`fr-tag fr-tag--md${isSelected ? ' fr-tag--green-emeraude' : ''}`}
            >
              <span aria-hidden="true" className="fr-mr-1v">
                {emotion.icone || '🔵'}
              </span>
              {emotion.nom}
              {hasChildren && (
                <span aria-hidden="true" className="fr-ml-1v">
                  ▾
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
