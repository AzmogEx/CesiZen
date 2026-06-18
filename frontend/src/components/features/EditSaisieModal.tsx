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
      {/* Émotion */}
      <div className="fr-input-group">
        <p className="fr-label">Émotion</p>
        <EmotionPicker value={emotionId} onChange={setEmotionId} />
      </div>

      {/* Intensité */}
      <div className="fr-input-group">
        <Slider
          value={intensite}
          onChange={setIntensite}
          min={1}
          max={10}
          label="Intensité de l'émotion"
        />
        <div className="fr-grid-row fr-grid-row--middle fr-mt-1v">
          <span className="fr-col fr-text--sm">Faible</span>
          <span className="fr-col fr-text--sm" style={{ textAlign: 'center' }}>
            Modérée
          </span>
          <span className="fr-col fr-text--sm" style={{ textAlign: 'right' }}>
            Forte
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="fr-input-group">
        <label className="fr-label" htmlFor="edit-saisie-date">
          Date de la saisie
        </label>
        <input
          id="edit-saisie-date"
          className="fr-input"
          type="date"
          value={dateSaisie}
          onChange={(e) => setDateSaisie(e.target.value)}
        />
      </div>

      {/* Note */}
      <div className="fr-input-group">
        <label className="fr-label" htmlFor="edit-saisie-note">
          Note (optionnel)
        </label>
        <textarea
          id="edit-saisie-note"
          className="fr-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Décrivez ce que vous ressentez..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <ul className="fr-btns-group fr-btns-group--inline-md fr-btns-group--right">
        <li>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
        </li>
        <li>
          <Button
            onClick={handleSubmit}
            loading={updateSaisie.isPending}
            disabled={!emotionId}
          >
            Enregistrer
          </Button>
        </li>
      </ul>
    </Modal>
  );
}
