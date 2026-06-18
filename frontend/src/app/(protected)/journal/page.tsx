'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSaisies, useDeleteSaisie } from '@/hooks/useTracker';
import { useEmotions } from '@/hooks/useEmotions';
import TrackerTimeline from '@/components/features/TrackerTimeline';
import EditSaisieModal from '@/components/features/EditSaisieModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import toast from 'react-hot-toast';
import type { SaisieTracker } from '@/types';

function exportSaisiesCsv(saisies: SaisieTracker[]): void {
  const escape = (v: unknown): string => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const headers = ['Date', 'Emotion', 'Emotion parente', 'Intensite', 'Note'];
  const rows = saisies.map((s) => [
    s.date_saisie,
    s.emotion?.nom ?? '',
    s.emotion?.parent?.nom ?? '',
    s.intensite,
    s.note ?? '',
  ]);
  const csv = [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cesizen-saisies-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function JournalPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    date_debut?: string;
    date_fin?: string;
    emotion_id?: number;
  }>({});
  const [editingSaisie, setEditingSaisie] = useState<SaisieTracker | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: saisies, isLoading } = useSaisies(filters);
  const { data: emotions } = useEmotions();
  const deleteSaisie = useDeleteSaisie();

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSaisie.mutateAsync(deleteId);
      toast.success('Saisie supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleExport = () => {
    if (!saisies || saisies.length === 0) {
      toast.error('Aucune saisie à exporter');
      return;
    }
    exportSaisiesCsv(saisies);
    toast.success('Export CSV téléchargé');
  };

  return (
    <div className="fr-container fr-py-6w">
      <div className="fr-grid-row fr-grid-row--middle fr-mb-4w">
        <div className="fr-col-12 fr-col-md">
          <h1 className="fr-mb-1v">Mon journal</h1>
          <p className="fr-text--lead fr-mb-0">
            Historique de vos émotions au quotidien
          </p>
        </div>
        <div className="fr-col-12 fr-col-md--right">
          <ul className="fr-btns-group fr-btns-group--inline-md fr-btns-group--right">
            <li>
              <button
                type="button"
                className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-filter-line fr-btn--icon-left"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtrer
              </button>
            </li>
            <li>
              <button
                type="button"
                className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-download-line fr-btn--icon-left"
                onClick={handleExport}
                title="Exporter mes saisies (RGPD)"
              >
                Export CSV
              </button>
            </li>
            <li>
              <Link
                href="/journal/nouvelle-saisie"
                className="fr-btn fr-btn--sm fr-icon-add-line fr-btn--icon-left"
              >
                Nouvelle saisie
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="fr-card fr-p-3w fr-mb-4w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-4">
              <div className="fr-input-group">
                <label className="fr-label" htmlFor="filtre-date-debut">
                  Date début
                </label>
                <input
                  id="filtre-date-debut"
                  className="fr-input"
                  type="date"
                  value={filters.date_debut || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, date_debut: e.target.value || undefined })
                  }
                />
              </div>
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <div className="fr-input-group">
                <label className="fr-label" htmlFor="filtre-date-fin">
                  Date fin
                </label>
                <input
                  id="filtre-date-fin"
                  className="fr-input"
                  type="date"
                  value={filters.date_fin || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, date_fin: e.target.value || undefined })
                  }
                />
              </div>
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <div className="fr-select-group">
                <label className="fr-label" htmlFor="filtre-emotion">
                  Émotion
                </label>
                <select
                  id="filtre-emotion"
                  className="fr-select"
                  value={filters.emotion_id || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      emotion_id: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
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
          </div>
          <ul className="fr-btns-group fr-btns-group--inline-md fr-mt-2w">
            <li>
              <button
                type="button"
                className="fr-btn fr-btn--tertiary fr-btn--sm"
                onClick={() => setFilters({})}
              >
                Réinitialiser
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <p>Chargement…</p>
      ) : (
        <TrackerTimeline
          saisies={saisies || []}
          onEdit={(saisie) => setEditingSaisie(saisie)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      {/* Modale d'édition */}
      <EditSaisieModal
        saisie={editingSaisie}
        isOpen={!!editingSaisie}
        onClose={() => setEditingSaisie(null)}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Supprimer la saisie"
        message="Cette saisie sera définitivement supprimée de votre journal. Cette action est irréversible."
        confirmLabel="Supprimer"
        destructive
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
