'use client';

import React from 'react';
import type { SaisieTracker } from '@/types';
import Badge from '@/components/ui/Badge';
import { Trash2, Edit2 } from 'lucide-react';

interface TrackerTimelineProps {
  saisies: SaisieTracker[];
  onEdit?: (saisie: SaisieTracker) => void;
  onDelete?: (id: number) => void;
}

export default function TrackerTimeline({ saisies, onEdit, onDelete }: TrackerTimelineProps) {
  if (saisies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-600">
        <p className="text-lg mb-2">Aucune saisie enregistrée</p>
        <p className="text-sm">Commencez par enregistrer votre première émotion</p>
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
    <div className="space-y-8">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            {date}
          </h3>
          <div className="space-y-3">
            {items.map((saisie) => (
              <div
                key={saisie.id}
                className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-200"
              >
                {/* Icône émotion */}
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${saisie.emotion?.couleur}20` }}
                >
                  {saisie.emotion?.icone || '🔵'}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color={saisie.emotion?.couleur}>
                      {saisie.emotion?.nom}
                    </Badge>
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      Intensité : {saisie.intensite}/10
                    </span>
                  </div>
                  {/* Barre d'intensité */}
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${saisie.intensite * 10}%`,
                        backgroundColor: saisie.emotion?.couleur || '#fce117',
                      }}
                    />
                  </div>
                  {saisie.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {saisie.note}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(saisie)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(saisie.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
