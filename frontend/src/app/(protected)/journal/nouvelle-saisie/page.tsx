'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useCreateSaisie } from '@/hooks/useTracker';
import EmotionPicker from '@/components/features/EmotionPicker';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
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

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Nouvelle saisie
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Enregistrez votre émotion en quelques étapes simples.
      </p>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0
                ${step > s.id
                  ? 'bg-malachite-500 text-white'
                  : step === s.id
                  ? 'bg-candlelight-500 text-black'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }
              `}
            >
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            {s.id < STEPS.length && (
              <div
                className={`flex-1 h-0.5 ${
                  step > s.id ? 'bg-malachite-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Étape actuelle */}
      <Card className="mb-6">
        <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {STEPS[step - 1].title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {STEPS[step - 1].description}
        </p>

        {step === 1 && (
          <EmotionPicker value={emotionId} onChange={setEmotionId} />
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Slider
              value={intensite}
              onChange={setIntensite}
              min={1}
              max={10}
              label="Intensité de l'émotion"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Faible</span>
              <span>Modérée</span>
              <span>Forte</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Note (optionnel)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Décrivez ce que vous ressentez, ce qui a déclenché cette émotion..."
                rows={4}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-candlelight-500 placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          <ArrowLeft size={16} />
          Précédent
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
          >
            Suivant
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={createSaisie.isPending}
            disabled={!emotionId}
          >
            <Check size={16} />
            Enregistrer
          </Button>
        )}
      </div>
    </div>
  );
}
