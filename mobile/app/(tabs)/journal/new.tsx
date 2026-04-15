import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCreateSaisie } from '@/hooks/useTracker';
import EmotionPicker from '@/components/EmotionPicker';
import { Colors } from '@/lib/colors';
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
      Alert.alert('Succes', 'Saisie enregistree !', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erreur', 'Impossible d\'enregistrer la saisie');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Stepper */}
      <View style={styles.stepper}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.stepRow}>
            <View style={[styles.stepCircle, step >= s && styles.stepActive]}>
              {step > s ? (
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              ) : (
                <Text style={[styles.stepNumber, step >= s && styles.stepNumberActive]}>{s}</Text>
              )}
            </View>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      {/* Step 1: Emotion */}
      {step === 1 && (
        <View>
          <Text style={styles.stepTitle}>Comment vous sentez-vous ?</Text>
          <EmotionPicker value={emotionId} onChange={setEmotionId} />
          <TouchableOpacity
            style={[styles.nextBtn, !emotionId && styles.btnDisabled]}
            onPress={() => emotionId && setStep(2)}
            disabled={!emotionId}
          >
            <Text style={styles.nextBtnText}>Suivant</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Intensity */}
      {step === 2 && (
        <View>
          <Text style={styles.stepTitle}>A quel point ressentez-vous cette emotion ?</Text>
          <View style={styles.intensityContainer}>
            <Text style={styles.intensityValue}>{intensite}</Text>
            <Text style={styles.intensityLabel}>/10</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Faible</Text>
            <View style={styles.sliderWrapper}>
              <View style={styles.nativeSlider}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${(intensite - 1) * 11.11}%` }]} />
                </View>
                <View style={styles.sliderButtons}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                    <TouchableOpacity
                      key={v}
                      style={[styles.sliderDot, intensite === v && styles.sliderDotActive]}
                      onPress={() => setIntensite(v)}
                    >
                      <Text style={[styles.sliderDotText, intensite === v && styles.sliderDotTextActive]}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.sliderLabel}>Forte</Text>
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
              <Ionicons name="arrow-back" size={20} color={Colors.gray[600]} />
              <Text style={styles.backBtnText}>Retour</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}>
              <Text style={styles.nextBtnText}>Suivant</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 3: Note */}
      {step === 3 && (
        <View>
          <Text style={styles.stepTitle}>Souhaitez-vous ajouter un commentaire ?</Text>
          <TextInput
            style={styles.textArea}
            value={note}
            onChangeText={setNote}
            placeholder="Decrivez ce que vous ressentez, ce qui a declenche cette emotion..."
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
              <Ionicons name="arrow-back" size={20} color={Colors.gray[600]} />
              <Text style={styles.backBtnText}>Retour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, createSaisie.isPending && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={createSaisie.isPending}
            >
              <Ionicons name="checkmark" size={20} color={Colors.black} />
              <Text style={styles.nextBtnText}>{createSaisie.isPending ? 'Envoi...' : 'Enregistrer'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingBottom: 40 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.gray[200],
    justifyContent: 'center', alignItems: 'center',
  },
  stepActive: { backgroundColor: Colors.secondary },
  stepNumber: { fontSize: 14, fontWeight: '700', color: Colors.gray[500] },
  stepNumberActive: { color: Colors.white },
  stepLine: { width: 40, height: 3, backgroundColor: Colors.gray[200], marginHorizontal: 4 },
  stepLineActive: { backgroundColor: Colors.secondary },
  stepTitle: { fontSize: 20, fontWeight: '700', color: Colors.black, marginBottom: 20 },
  intensityContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 24 },
  intensityValue: { fontSize: 64, fontWeight: '800', color: Colors.black },
  intensityLabel: { fontSize: 24, color: Colors.gray[400], marginLeft: 4 },
  sliderContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 32 },
  sliderLabel: { fontSize: 12, color: Colors.gray[400] },
  sliderWrapper: { flex: 1 },
  nativeSlider: {},
  sliderTrack: { height: 6, backgroundColor: Colors.gray[200], borderRadius: 3, marginBottom: 8 },
  sliderFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  sliderButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gray[100], justifyContent: 'center', alignItems: 'center' },
  sliderDotActive: { backgroundColor: Colors.primary },
  sliderDotText: { fontSize: 12, fontWeight: '600', color: Colors.gray[500] },
  sliderDotTextActive: { color: Colors.black },
  textArea: {
    backgroundColor: Colors.gray[50], borderWidth: 1, borderColor: Colors.gray[200],
    borderRadius: 16, padding: 16, fontSize: 15, color: Colors.black,
    minHeight: 120, marginBottom: 24,
  },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, backgroundColor: Colors.gray[100] },
  backBtnText: { fontSize: 15, fontWeight: '600', color: Colors.gray[600] },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, backgroundColor: Colors.primary },
  submitBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, backgroundColor: Colors.secondary },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: Colors.black },
  btnDisabled: { opacity: 0.5 },
});
