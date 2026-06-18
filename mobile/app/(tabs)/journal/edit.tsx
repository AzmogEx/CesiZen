import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSaisies, useUpdateSaisie } from '@/hooks/useTracker';
import EmotionPicker from '@/components/EmotionPicker';
import { Colors } from '@/lib/colors';

export default function EditEntryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: saisies } = useSaisies();
  const updateSaisie = useUpdateSaisie();

  const saisie = saisies?.find((s) => s.id === Number(id));

  const [emotionId, setEmotionId] = useState<number | undefined>();
  const [intensite, setIntensite] = useState(5);
  const [note, setNote] = useState('');
  const [dateSaisie, setDateSaisie] = useState('');

  useEffect(() => {
    if (saisie) {
      setEmotionId(saisie.emotion_id);
      setIntensite(saisie.intensite);
      setNote(saisie.note || '');
      setDateSaisie(saisie.date_saisie.split('T')[0]);
    }
  }, [saisie]);

  const handleSubmit = async () => {
    if (!emotionId || !id) return;
    try {
      await updateSaisie.mutateAsync({
        id: Number(id),
        emotion_id: emotionId,
        intensite,
        note: note.trim() || undefined,
        date_saisie: dateSaisie,
      });
      Alert.alert('Succes', 'Saisie modifiee !', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erreur', 'Impossible de modifier la saisie');
    }
  };

  if (!saisie) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Modifier la saisie</Text>

      {/* Emotion */}
      <View style={styles.section}>
        <Text style={styles.label}>Emotion</Text>
        <EmotionPicker value={emotionId} onChange={setEmotionId} />
      </View>

      {/* Intensite */}
      <View style={styles.section}>
        <Text style={styles.label}>Intensite</Text>
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityValue}>{intensite}</Text>
          <Text style={styles.intensityUnit}>/10</Text>
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
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>Faible</Text>
          <Text style={styles.sliderLabel}>Forte</Text>
        </View>
      </View>

      {/* Note */}
      <View style={styles.section}>
        <Text style={styles.label}>Note (optionnel)</Text>
        <TextInput
          style={styles.textArea}
          value={note}
          onChangeText={setNote}
          placeholder="Decrivez ce que vous ressentez..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, updateSaisie.isPending && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={updateSaisie.isPending || !emotionId}
        >
          <Ionicons name="checkmark" size={20} color={Colors.white} />
          <Text style={styles.submitBtnText}>
            {updateSaisie.isPending ? 'Envoi...' : 'Enregistrer'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingBottom: 40 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.gray[400], fontSize: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.black, marginBottom: 24 },
  section: { marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 10 },
  intensityContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 16 },
  intensityValue: { fontSize: 48, fontWeight: '800', color: Colors.black },
  intensityUnit: { fontSize: 20, color: Colors.gray[400], marginLeft: 4 },
  sliderButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sliderDot: {
    width: 28, height: 28, borderRadius: 4,
    backgroundColor: Colors.gray[100], justifyContent: 'center', alignItems: 'center',
  },
  sliderDotActive: { backgroundColor: Colors.primary },
  sliderDotText: { fontSize: 12, fontWeight: '600', color: Colors.gray[500] },
  sliderDotTextActive: { color: Colors.white },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  sliderLabel: { fontSize: 12, color: Colors.gray[400] },
  textArea: {
    backgroundColor: Colors.gray[100], borderTopLeftRadius: 4, borderTopRightRadius: 4,
    borderBottomWidth: 2, borderBottomColor: Colors.black,
    padding: 16, fontSize: 15, color: Colors.black, minHeight: 100,
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 12 },
  cancelBtn: {
    flex: 1, paddingVertical: 16, borderRadius: 4,
    backgroundColor: Colors.white, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary,
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: Colors.primary },
  submitBtn: {
    flex: 1, flexDirection: 'row', gap: 8, paddingVertical: 16, borderRadius: 4,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  btnDisabled: { opacity: 0.5 },
});
