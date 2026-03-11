'use client';

import Link from 'next/link';
import { Heart, BarChart3, Plus, BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSaisies } from '@/hooks/useTracker';
import { useRapport } from '@/hooks/useRapport';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: saisies, isLoading: saisiesLoading } = useSaisies();
  const { data: rapport, isLoading: rapportLoading } = useRapport('week');

  const recentSaisies = saisies?.slice(0, 5) || [];

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bonjour {user?.prenom} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Voici un aperçu de votre bien-être cette semaine.
        </p>
      </div>

      {/* Actions rapides */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link href="/journal/nouvelle-saisie">
          <Card hover className="flex items-center gap-4 bg-linear-to-r from-candlelight-50 to-candlelight-100 dark:from-candlelight-950/30 dark:to-candlelight-900/20 border-candlelight-200 dark:border-candlelight-800">
            <div className="w-12 h-12 rounded-xl bg-candlelight-200 dark:bg-candlelight-900 flex items-center justify-center">
              <Plus className="text-candlelight-700 dark:text-candlelight-400" size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Nouvelle saisie</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enregistrer une émotion</p>
            </div>
          </Card>
        </Link>

        <Link href="/journal">
          <Card hover className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-malachite-100 dark:bg-malachite-900 flex items-center justify-center">
              <BookOpen className="text-malachite-600 dark:text-malachite-400" size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Mon journal</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Voir toutes mes saisies</p>
            </div>
          </Card>
        </Link>

        <Link href="/journal/rapports">
          <Card hover className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Mes rapports</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visualiser mes tendances</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Stats de la semaine */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {rapportLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))
        ) : (
          <>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Saisies cette semaine</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {rapport?.stats.total_saisies || 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Intensité moyenne</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {rapport?.stats.intensite_moyenne?.toFixed(1) || '—'}
                </p>
                <span className="text-sm text-gray-400">/10</span>
              </div>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Émotion dominante</p>
              {rapport?.stats.emotion_dominante ? (
                <div className="flex items-center gap-2">
                  <Badge color={rapport.stats.emotion_dominante.couleur}>
                    {rapport.stats.emotion_dominante.nom}
                  </Badge>
                  <span className="text-sm text-gray-400">
                    ({rapport.stats.emotion_dominante.count}x)
                  </span>
                </div>
              ) : (
                <p className="text-xl text-gray-300 dark:text-gray-600">—</p>
              )}
            </Card>
          </>
        )}
      </div>

      {/* Saisies récentes */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
            Saisies récentes
          </h2>
          <Link
            href="/journal"
            className="text-sm text-malachite-600 dark:text-malachite-400 hover:underline"
          >
            Voir tout →
          </Link>
        </div>

        {saisiesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton variant="circle" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : recentSaisies.length > 0 ? (
          <div className="space-y-3">
            {recentSaisies.map((saisie) => (
              <div
                key={saisie.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: `${saisie.emotion?.couleur}20` }}
                >
                  {saisie.emotion?.icone || '🔵'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {saisie.emotion?.nom}
                    </span>
                    <span className="text-xs text-gray-400">
                      {saisie.intensite}/10
                    </span>
                  </div>
                  {saisie.note && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {saisie.note}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  {new Date(saisie.date_saisie).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 dark:text-gray-600">
            <Heart size={32} className="mx-auto mb-2 opacity-50" />
            <p>Aucune saisie pour le moment</p>
            <Link
              href="/journal/nouvelle-saisie"
              className="text-sm text-candlelight-600 hover:underline mt-2 inline-block"
            >
              Faire ma première saisie
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
