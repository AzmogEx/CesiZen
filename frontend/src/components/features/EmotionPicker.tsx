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
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  // Si une émotion parent est sélectionnée et qu'elle a des enfants, afficher les sous-émotions
  if (selectedParent?.enfants && selectedParent.enfants.length > 0) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedParent(null)}
          className="mb-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1"
        >
          ← Retour aux émotions
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Précisez votre émotion de <span className="font-medium" style={{ color: selectedParent.couleur }}>{selectedParent.nom}</span> :
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {selectedParent.enfants.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => onChange(child.id)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                ${value === child.id
                  ? 'border-current shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-current hover:shadow-md'
                }
              `}
              style={{
                color: child.couleur,
                borderColor: value === child.id ? child.couleur : undefined,
              }}
            >
              <span className="text-2xl">{child.icone || '🔵'}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{child.nom}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {emotions?.map((emotion) => {
        const hasChildren = emotion.enfants && emotion.enfants.length > 0;
        const isSelected = value === emotion.id || emotion.enfants?.some(e => e.id === value);

        return (
          <button
            key={emotion.id}
            type="button"
            onClick={() => {
              if (hasChildren) {
                setSelectedParent(emotion);
              } else {
                onChange(emotion.id);
              }
            }}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
              ${isSelected
                ? 'shadow-lg scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
              }
            `}
            style={{
              borderColor: isSelected ? emotion.couleur : undefined,
            }}
          >
            <span className="text-3xl">{emotion.icone || '🔵'}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{emotion.nom}</span>
            {hasChildren && (
              <span className="text-xs text-gray-400">▼</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
