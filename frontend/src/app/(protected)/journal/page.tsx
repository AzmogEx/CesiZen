'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Filter, Calendar } from 'lucide-react';
import { useSaisies, useDeleteSaisie } from '@/hooks/useTracker';
import { useEmotions } from '@/hooks/useEmotions';
import TrackerTimeline from '@/components/features/TrackerTimeline';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function JournalPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    date_debut?: string;
    date_fin?: string;
    emotion_id?: number;
  }>({});

  const { data: saisies, isLoading } = useSaisies(filters);
  const { data: emotions } = useEmotions();
  const deleteSaisie = useDeleteSaisie();

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette saisie ?')) return;
    try {
      await deleteSaisie.mutateAsync(id);
      toast.success('Saisie supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Mon journal
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Historique de vos émotions au quotidien
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtrer
          </Button>
          <Link href="/journal/nouvelle-saisie">
            <Button size="sm">
              <Plus size={16} />
              Nouvelle saisie
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <Card className="mb-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Date début
              </label>
              <input
                type="date"
                value={filters.date_debut || ''}
                onChange={(e) => setFilters({ ...filters, date_debut: e.target.value || undefined })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-candlelight-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Date fin
              </label>
              <input
                type="date"
                value={filters.date_fin || ''}
                onChange={(e) => setFilters({ ...filters, date_fin: e.target.value || undefined })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-candlelight-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Émotion
              </label>
              <select
                value={filters.emotion_id || ''}
                onChange={(e) => setFilters({ ...filters, emotion_id: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-candlelight-500"
              >
                <option value="">Toutes</option>
                {emotions?.map((emotion) => (
                  <option key={emotion.id} value={emotion.id}>
                    {emotion.icone} {emotion.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({})}
            >
              Réinitialiser
            </Button>
          </div>
        </Card>
      )}

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl">
              <Skeleton variant="circle" className="w-12 h-12" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <TrackerTimeline
          saisies={saisies || []}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
