import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCreateSaisie } from '@/hooks/useTracker';
import EmotionPicker from '@/components/EmotionPicker';
import { Colors } from '@/lib/colors';
import { Spacing, Radius, FontSize, FontWeight } from '@/lib/theme';
import { Button, TextField } from '@/components/ui';

/** Dimensions locales (multiples de l'échelle 4px du DSFR). */
const STEP_CIRCLE = 36;
const STEP_LINE_WIDTH = 40;
const STEP_LINE_HEIGHT = 3;
const STEP_CHECK_ICON = 18;
const INTENSITY_LINE_HEIGHT = 60;
const DOT_SIZE = 44;

export default function NewEntryScreen() {
  const router = useRouter();
  const createSaisie = useCreateSaisie();
  const [step, setStep] = useState(1);
  const [emotionId, setEmotionId] = useState<number | undefined>();
  const [intensite, setIntensite] = useState(5);
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    if (!emotionId) return;
    try {
      await createSaisie.mutateAsync({
        emotion_id: emotionId,
        intensite,
        note: note.trim() || undefined,
        date_saisie: new Date().toISOString().split('T')[0],
      });
      Alert.alert('Succès', 'Saisie enregistrée !', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Erreur', "Impossible d'enregistrer la saisie");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Stepper */}
      <View
        style={styles.stepper}
        accessibilityRole="progressbar"
        accessibilityLabel={`Étape ${step} sur 3`}
      >
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.stepRow}>
            <View style={[styles.stepCircle, step >= s && styles.stepActive]}>
              {step > s ? (
                <Ionicons name="checkmark" size={STEP_CHECK_ICON} color={Colors.white} />
              ) : (
                <Text style={[styles.stepNumber, step >= s && styles.stepNumberActive]}>{s}</Text>
              )}
            </View>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      {/* Step 1: Émotion */}
      {step === 1 && (
        <View>
          <Text style={styles.stepTitle}>Comment vous sentez-vous ?</Text>
          <EmotionPicker value={emotionId} onChange={setEmotionId} />
          <View style={styles.navRowEnd}>
            <Button
              title="Suivant"
              icon="arrow-forward"
              onPress={() => emotionId && setStep(2)}
              disabled={!emotionId}
            />
          </View>
        </View>
      )}

      {/* Step 2: Intensité */}
      {step === 2 && (
        <View>
          <Text style={styles.stepTitle}>À quel point ressentez-vous cette émotion ?</Text>
          <View style={styles.intensityContainer}>
            <Text style={styles.intensityValue}>{intensite}</Text>
            <Text style={styles.intensityLabel}>/10</Text>
          </View>
          <IntensityPicker value={intensite} onChange={setIntensite} />
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Faible</Text>
            <Text style={styles.scaleLabel}>Forte</Text>
          </View>
          <View style={styles.navRow}>
            <Button title="Retour" variant="secondary" icon="arrow-back" onPress={() => setStep(1)} />
            <Button title="Suivant" icon="arrow-forward" onPress={() => setStep(3)} />
          </View>
        </View>
      )}

      {/* Step 3: Note */}
      {step === 3 && (
        <View>
          <Text style={styles.stepTitle}>Souhaitez-vous ajouter un commentaire ?</Text>
          <TextField
            label="Note (optionnel)"
            value={note}
            onChangeText={setNote}
            placeholder="Décrivez ce que vous ressentez, ce qui a déclenché cette émotion…"
            multiline
            numberOfLines={5}
          />
          <View style={styles.navRow}>
            <Button title="Retour" variant="secondary" icon="arrow-back" onPress={() => setStep(2)} />
            <Button
              title="Enregistrer"
              icon="checkmark"
              loading={createSaisie.isPending}
              onPress={handleSubmit}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

/** Sélecteur d'intensité 1–10, boutons ≥40px, sur deux rangées (wrap). */
export function IntensityPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={pickerStyles.grid}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => {
        const active = value === v;
        return (
          <TouchableOpacity
            key={v}
            style={[pickerStyles.dot, active && pickerStyles.dotActive]}
            onPress={() => onChange(v)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Intensité ${v}`}
          >
            <Text style={[pickerStyles.dotText, active && pickerStyles.dotTextActive]}>{v}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: Radius.sm,
    backgroundColor: Colors.gray[100],
    borderWidth: 1,
    borderColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dotText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.gray[500] },
  dotTextActive: { color: Colors.white },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: STEP_CIRCLE,
    height: STEP_CIRCLE,
    borderRadius: Radius.pill,
    backgroundColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: { backgroundColor: Colors.primary },
  stepNumber: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.gray[500] },
  stepNumberActive: { color: Colors.white },
  stepLine: { width: STEP_LINE_WIDTH, height: STEP_LINE_HEIGHT, backgroundColor: Colors.gray[200], marginHorizontal: Spacing.xs },
  stepLineActive: { backgroundColor: Colors.primary },
  stepTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.black, marginBottom: Spacing.xl },
  intensityContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: Spacing.xl },
  intensityValue: { fontSize: FontSize.display, fontWeight: FontWeight.heavy, color: Colors.primary, lineHeight: INTENSITY_LINE_HEIGHT },
  intensityLabel: { fontSize: FontSize.xxl, color: Colors.gray[400], marginLeft: Spacing.xs },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md, marginBottom: Spacing.xxl },
  scaleLabel: { fontSize: FontSize.xs, color: Colors.gray[500] },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md, marginTop: Spacing.md },
  navRowEnd: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: Spacing.xl },
});
