'use client';

import { useState } from 'react';
import { useRapport } from '@/hooks/useRapport';
import EmotionChart from '@/components/features/EmotionChart';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Mes rapports
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Analysez vos tendances émotionnelles
          </p>
        </div>

        {/* Sélecteur de période */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${period === p.value
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }
              `}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </div>
          <Card>
            <Skeleton variant="rect" className="h-80" />
          </Card>
        </div>
      ) : rapport ? (
        <div className="space-y-6">
          {/* Stats résumées */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 size={18} className="text-candlelight-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Total saisies</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {rapport.stats.total_saisies}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Du {new Date(rapport.date_debut).toLocaleDateString('fr-FR')} au {new Date(rapport.date_fin).toLocaleDateString('fr-FR')}
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={18} className="text-malachite-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Intensité moyenne</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {rapport.stats.intensite_moyenne?.toFixed(1) || '—'}
                </p>
                <span className="text-sm text-gray-400">/10</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-2">
                <PieChart size={18} className="text-blue-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Émotion dominante</p>
              </div>
              {rapport.stats.emotion_dominante ? (
                <div>
                  <Badge color={rapport.stats.emotion_dominante.couleur}>
                    {rapport.stats.emotion_dominante.nom}
                  </Badge>
                  <p className="text-xs text-gray-400 mt-1">
                    {rapport.stats.emotion_dominante.count} fois
                  </p>
                </div>
              ) : (
                <p className="text-xl text-gray-300 dark:text-gray-600">—</p>
              )}
            </Card>
          </div>

          {/* Répartition (Camembert) */}
          <Card>
            <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Répartition des émotions
            </h2>
            <EmotionChart data={rapport} type="repartition" />
          </Card>

          {/* Évolution (Lignes) */}
          <Card>
            <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Évolution dans le temps
            </h2>
            <EmotionChart data={rapport} type="evolution" />
          </Card>

          {/* Intensité moyenne (Barres) */}
          <Card>
            <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Intensité moyenne par période
            </h2>
            <EmotionChart data={rapport} type="intensite" />
          </Card>

          {/* Détail répartition */}
          {rapport.repartition.length > 0 && (
            <Card>
              <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Détail par émotion
              </h2>
              <div className="space-y-3">
                {rapport.repartition.map((item) => (
                  <div key={item.nom} className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.couleur }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32">
                      {item.nom}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.pourcentage}%`,
                          backgroundColor: item.couleur,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-16 text-right">
                      {item.pourcentage}%
                    </span>
                    <span className="text-xs text-gray-400 w-20 text-right">
                      Moy: {item.intensite_moyenne.toFixed(1)}/10
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="text-center py-16">
          <BarChart3 size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Pas de données pour cette période
          </p>
        </Card>
      )}
    </div>
  );
}
