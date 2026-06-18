'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateSaisie } from '@/hooks/useTracker';
import EmotionPicker from '@/components/features/EmotionPicker';
import Slider from '@/components/ui/Slider';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, title: 'Émotion', description: 'Comment vous sentez-vous ?' },
  { id: 2, title: 'Intensité', description: 'À quel point ressentez-vous cette émotion ?' },
  { id: 3, title: 'Note', description: 'Souhaitez-vous ajouter un commentaire ?' },
];

export default function NouvelleSaisiePage() {
  const router = useRouter();
  const createSaisie = useCreateSaisie();
  const [step, setStep] = useState(1);
  const [emotionId, setEmotionId] = useState<number | undefined>();
  const [intensite, setIntensite] = useState(5);
  const [note, setNote] = useState('');
  const [dateSaisie, setDateSaisie] = useState(
    new Date().toISOString().split('T')[0]
  );

  const canNext = () => {
    if (step === 1) return !!emotionId;
    return true;
  };

  const handleSubmit = async () => {
    if (!emotionId) return;

    try {
      await createSaisie.mutateAsync({
        emotion_id: emotionId,
        intensite,
        note: note.trim() || undefined,
        date_saisie: dateSaisie,
      });
      toast.success('Saisie enregistrée !');
      router.push('/journal');
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const nextStep = STEPS[step]?.title;

  return (
    <div className="fr-container fr-py-6w">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-md-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-arrow-left-line fr-btn--icon-left fr-mb-2w"
          >
            Retour
          </button>

          <h1>Nouvelle saisie</h1>
          <p className="fr-text--lead">
            Enregistrez votre émotion en quelques étapes simples.
          </p>

          {/* Stepper DSFR */}
          <div className="fr-stepper">
            <h2 className="fr-stepper__title">
              {STEPS[step - 1].title}
              <span className="fr-stepper__state">
                Étape {step} sur {STEPS.length}
              </span>
            </h2>
            <div
              className="fr-stepper__steps"
              data-fr-current-step={step}
              data-fr-steps={STEPS.length}
            />
            {nextStep && (
              <p className="fr-stepper__details">
                <span className="fr-text--bold">Étape suivante :</span> {nextStep}
              </p>
            )}
          </div>

          {/* Étape actuelle */}
          <div className="app-panel fr-p-3w fr-mb-3w">
            <p className="fr-text--sm fr-text-mention--grey fr-mb-3w">
              {STEPS[step - 1].description}
            </p>

            {step === 1 && (
              <EmotionPicker value={emotionId} onChange={setEmotionId} />
            )}

            {step === 2 && (
              <div>
                <Slider
                  value={intensite}
                  onChange={setIntensite}
                  min={1}
                  max={10}
                  label="Intensité de l'émotion"
                />
                <div className="fr-grid-row fr-grid-row--middle fr-mt-1w">
                  <span className="fr-col fr-text--sm">Faible</span>
                  <span className="fr-col fr-text--sm" style={{ textAlign: 'center' }}>
                    Modérée
                  </span>
                  <span className="fr-col fr-text--sm" style={{ textAlign: 'right' }}>
                    Forte
                  </span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="saisie-date">
                    Date de la saisie
                  </label>
                  <input
                    id="saisie-date"
                    className="fr-input"
                    type="date"
                    value={dateSaisie}
                    onChange={(e) => setDateSaisie(e.target.value)}
                  />
                </div>
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="saisie-note">
                    Note (optionnel)
                  </label>
                  <textarea
                    id="saisie-note"
                    className="fr-input"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Décrivez ce que vous ressentez, ce qui a déclenché cette émotion..."
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation (flex simple pour éviter le rognage des libellés
              dans un groupe DSFR avec boutons à icône) */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-arrow-left-line"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Précédent
            </button>
            {step < 3 ? (
              <button
                type="button"
                className="fr-btn fr-btn--icon-right fr-icon-arrow-right-line"
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                className="fr-btn fr-btn--icon-left fr-icon-check-line"
                onClick={handleSubmit}
                disabled={!emotionId || createSaisie.isPending}
              >
                Enregistrer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
