import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSaisies, useUpdateSaisie } from '@/hooks/useTracker';
import EmotionPicker from '@/components/EmotionPicker';
import { IntensityPicker } from './new';
import { Colors } from '@/lib/colors';
import { Spacing, FontSize, FontWeight } from '@/lib/theme';
import { Button, TextField, Loader } from '@/components/ui';

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
      Alert.alert('Succès', 'Saisie modifiée !', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Erreur', 'Impossible de modifier la saisie');
    }
  };

  if (!saisie) {
    return <Loader label="Chargement…" />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Émotion */}
      <View style={styles.section}>
        <Text style={styles.label}>Émotion</Text>
        <EmotionPicker value={emotionId} onChange={setEmotionId} />
      </View>

      {/* Intensité */}
      <View style={styles.section}>
        <Text style={styles.label}>Intensité</Text>
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityValue}>{intensite}</Text>
          <Text style={styles.intensityUnit}>/10</Text>
        </View>
        <IntensityPicker value={intensite} onChange={setIntensite} />
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>Faible</Text>
          <Text style={styles.scaleLabel}>Forte</Text>
        </View>
      </View>

      {/* Note */}
      <View style={styles.section}>
        <TextField
          label="Note (optionnel)"
          value={note}
          onChangeText={setNote}
          placeholder="Décrivez ce que vous ressentez…"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Button title="Annuler" variant="secondary" onPress={() => router.back()} style={styles.flex} />
        <Button
          title="Enregistrer"
          icon="checkmark"
          loading={updateSaisie.isPending}
          disabled={!emotionId}
          onPress={handleSubmit}
          style={styles.flex}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  section: { marginBottom: Spacing.xl },
  label: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.black, marginBottom: Spacing.md },
  intensityContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: Spacing.lg },
  intensityValue: { fontSize: FontSize.display, fontWeight: FontWeight.heavy, color: Colors.primary, lineHeight: 56 },
  intensityUnit: { fontSize: FontSize.xl, color: Colors.gray[400], marginLeft: Spacing.xs },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  scaleLabel: { fontSize: FontSize.xs, color: Colors.gray[500] },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md, marginTop: Spacing.sm },
  flex: { flex: 1 },
});
