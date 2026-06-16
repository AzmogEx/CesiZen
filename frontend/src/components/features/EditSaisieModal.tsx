'use client';

import React, { useState } from 'react';
import type { SaisieTracker } from '@/types';
import { useUpdateSaisie } from '@/hooks/useTracker';
import EmotionPicker from '@/components/features/EmotionPicker';
import Slider from '@/components/ui/Slider';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface EditSaisieModalProps {
  saisie: SaisieTracker | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditSaisieModal({ saisie, isOpen, onClose }: EditSaisieModalProps) {
  const updateSaisie = useUpdateSaisie();
  const [emotionId, setEmotionId] = useState<number | undefined>();
  const [intensite, setIntensite] = useState(5);
  const [note, setNote] = useState('');
  const [dateSaisie, setDateSaisie] = useState('');

  // Synchronise le formulaire quand une nouvelle saisie est passée : ajustement
  // d'état pendant le rendu (pattern recommandé par React, sans effet).
  // À la fermeture (saisie = null) on réinitialise prevSaisieId pour que la
  // réouverture de la MÊME saisie réaffiche bien ses valeurs d'origine.
  const [prevSaisieId, setPrevSaisieId] = useState<number | null>(null);
  if (saisie && saisie.id !== prevSaisieId) {
    setPrevSaisieId(saisie.id);
    setEmotionId(saisie.emotion_id);
    setIntensite(saisie.intensite);
    setNote(saisie.note || '');
    setDateSaisie(saisie.date_saisie.split('T')[0]);
  } else if (!saisie && prevSaisieId !== null) {
    setPrevSaisieId(null);
  }

  const handleSubmit = async () => {
    if (!saisie || !emotionId) return;

    try {
      await updateSaisie.mutateAsync({
        id: saisie.id,
        emotion_id: emotionId,
        intensite,
        note: note.trim() || undefined,
        date_saisie: dateSaisie,
      });
      toast.success('Saisie modifiée !');
      onClose();
    } catch {
      toast.error('Erreur lors de la modification');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier la saisie" size="lg">
      <div className="space-y-6">
        {/* Émotion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Émotion
          </label>
          <EmotionPicker value={emotionId} onChange={setEmotionId} />
        </div>

        {/* Intensité */}
        <div>
          <Slider
            value={intensite}
            onChange={setIntensite}
            min={1}
            max={10}
            label="Intensité de l'émotion"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Faible</span>
            <span>Modérée</span>
            <span>Forte</span>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Date de la saisie
          </label>
          <input
            type="date"
            value={dateSaisie}
            onChange={(e) => setDateSaisie(e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-candlelight-500"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Note (optionnel)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Décrivez ce que vous ressentez..."
            rows={3}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-candlelight-500 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            loading={updateSaisie.isPending}
            disabled={!emotionId}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
