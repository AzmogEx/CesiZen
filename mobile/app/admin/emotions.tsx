import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, EmptyState, Loader, SectionTitle, TextField } from '@/components/ui';
import { useAdminEmotions, useSaveEmotion, useDeleteEmotion } from '@/hooks/useAdmin';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, HIT_SLOP, Radius, Spacing } from '@/lib/theme';
import type { Emotion } from '@/types';

interface FormState {
  id?: number;
  nom: string;
  couleur: string;
  icone: string;
  niveau: number;
  parent_id: number | null;
  est_actif: boolean;
}

const FORM_VIDE: FormState = { nom: '', couleur: '#000091', icone: '', niveau: 1, parent_id: null, est_actif: true };

function messageErreur(e: unknown, defaut: string): string {
  const err = e as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message ?? defaut;
}

/** Regroupe une liste d'émotions (plate ou imbriquée) en niveau 1 + leurs enfants. */
function organiser(emotions: Emotion[] | undefined): { parent: Emotion; enfants: Emotion[] }[] {
  if (!emotions) return [];
  const racines = emotions.filter((e) => e.niveau === 1);
  return racines.map((parent) => {
    const depuisEnfants = parent.enfants ?? [];
    const depuisPlat = emotions.filter((e) => e.niveau === 2 && e.parent_id === parent.id);
    // On dédoublonne par id au cas où les deux sources coexistent.
    const map = new Map<number, Emotion>();
    [...depuisEnfants, ...depuisPlat].forEach((e) => map.set(e.id, e));
    return { parent, enfants: Array.from(map.values()) };
  });
}

export default function AdminEmotionsScreen() {
  const { data: emotions, isLoading } = useAdminEmotions();
  const saveMut = useSaveEmotion();
  const deleteMut = useDeleteEmotion();

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_VIDE);

  const groupes = useMemo(() => organiser(emotions), [emotions]);
  const parents = useMemo(() => (emotions ?? []).filter((e) => e.niveau === 1), [emotions]);

  const ouvrirCreation = () => {
    setForm(FORM_VIDE);
    setModalVisible(true);
  };

  const ouvrirEdition = (e: Emotion) => {
    setForm({
      id: e.id,
      nom: e.nom,
      couleur: e.couleur,
      icone: e.icone ?? '',
      niveau: e.niveau,
      parent_id: e.parent_id,
      est_actif: e.est_actif,
    });
    setModalVisible(true);
  };

  const soumettre = async () => {
    if (!form.nom.trim()) {
      Alert.alert('Champs requis', 'Le nom est obligatoire.');
      return;
    }
    if (!/^#([0-9A-Fa-f]{6})$/.test(form.couleur.trim())) {
      Alert.alert('Couleur', 'Saisissez une couleur hexadécimale (ex. #000091).');
      return;
    }
    if (form.niveau === 2 && !form.parent_id) {
      Alert.alert('Émotion parente', 'Choisissez l’émotion parente pour une sous-émotion.');
      return;
    }
    try {
      await saveMut.mutateAsync({
        id: form.id,
        nom: form.nom.trim(),
        couleur: form.couleur.trim(),
        icone: form.icone.trim() || null,
        niveau: form.niveau,
        parent_id: form.niveau === 2 ? form.parent_id : null,
        est_actif: form.est_actif,
      });
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Erreur', messageErreur(e, 'Enregistrement impossible.'));
    }
  };

  const supprimer = (e: Emotion) => {
    Alert.alert('Supprimer', `Supprimer « ${e.nom} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMut.mutateAsync(e.id);
          } catch (err) {
            Alert.alert('Erreur', messageErreur(err, 'Suppression impossible.'));
          }
        },
      },
    ]);
  };

  const renderEmotion = (e: Emotion, estEnfant: boolean) => (
    <Card key={e.id} style={[styles.emotionCard, estEnfant && styles.emotionEnfant]}>
      <View style={styles.emotionRow}>
        <View style={[styles.pastille, { backgroundColor: e.couleur }]}>
          {e.icone ? <Text style={styles.pastilleIcone}>{e.icone}</Text> : null}
        </View>
        <View style={styles.emotionInfo}>
          <Text style={styles.emotionNom}>{e.nom}</Text>
          <Text style={styles.emotionMeta}>
            Niveau {e.niveau} · {e.est_actif ? 'Actif' : 'Inactif'} · {e.couleur}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button title="Modifier" variant="secondary" size="sm" icon="create-outline" onPress={() => ouvrirEdition(e)} />
        <Button title="Supprimer" variant="danger" size="sm" icon="trash-outline" onPress={() => supprimer(e)} />
      </View>
    </Card>
  );

  if (isLoading) {
    return <Loader label="Chargement des émotions…" />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.headerAction}>
          <Button title="Nouvelle émotion" icon="add" fullWidth onPress={ouvrirCreation} />
        </View>

        {groupes.length === 0 ? (
          <EmptyState icon="color-palette-outline" title="Aucune émotion" message="Créez la première émotion du référentiel." />
        ) : (
          groupes.map(({ parent, enfants }) => (
            <View key={parent.id} style={styles.groupe}>
              <SectionTitle>{parent.nom}</SectionTitle>
              {renderEmotion(parent, false)}
              {enfants.map((enfant) => renderEmotion(enfant, true))}
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{form.id ? 'Modifier l’émotion' : 'Nouvelle émotion'}</Text>
              <Pressable hitSlop={HIT_SLOP} onPress={() => setModalVisible(false)} accessibilityLabel="Fermer">
                <Ionicons name="close" size={24} color={Colors.gray[600]} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
              <TextField
                label="Nom"
                value={form.nom}
                onChangeText={(v) => setForm((f) => ({ ...f, nom: v }))}
                required
                autoCapitalize="words"
              />
              <View style={styles.couleurRow}>
                <View style={styles.couleurField}>
                  <TextField
                    label="Couleur (hex)"
                    value={form.couleur}
                    onChangeText={(v) => setForm((f) => ({ ...f, couleur: v }))}
                    placeholder="#000091"
                    required
                  />
                </View>
                <View style={[styles.couleurApercu, { backgroundColor: /^#([0-9A-Fa-f]{6})$/.test(form.couleur) ? form.couleur : Colors.gray[200] }]} />
              </View>
              <TextField
                label="Icône (emoji, optionnel)"
                value={form.icone}
                onChangeText={(v) => setForm((f) => ({ ...f, icone: v }))}
                placeholder="😊"
                autoCapitalize="none"
              />

              <Text style={styles.fieldLabel}>Niveau</Text>
              <View style={styles.segment}>
                <Pressable
                  style={[styles.segmentItem, form.niveau === 1 && styles.segmentItemActive]}
                  onPress={() => setForm((f) => ({ ...f, niveau: 1, parent_id: null }))}
                >
                  <Text style={[styles.segmentText, form.niveau === 1 && styles.segmentTextActive]}>
                    1 · Émotion
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.segmentItem, form.niveau === 2 && styles.segmentItemActive]}
                  onPress={() => setForm((f) => ({ ...f, niveau: 2 }))}
                >
                  <Text style={[styles.segmentText, form.niveau === 2 && styles.segmentTextActive]}>
                    2 · Sous-émotion
                  </Text>
                </Pressable>
              </View>

              {form.niveau === 2 ? (
                <>
                  <Text style={styles.fieldLabel}>Émotion parente</Text>
                  <View style={styles.parentList}>
                    {parents.length === 0 ? (
                      <Text style={styles.switchHelper}>Aucune émotion de niveau 1 disponible.</Text>
                    ) : (
                      parents.map((p) => {
                        const actif = form.parent_id === p.id;
                        return (
                          <Pressable
                            key={p.id}
                            style={[styles.parentChip, actif && styles.parentChipActive]}
                            onPress={() => setForm((f) => ({ ...f, parent_id: p.id }))}
                          >
                            <View style={[styles.parentDot, { backgroundColor: p.couleur }]} />
                            <Text style={[styles.parentChipText, actif && styles.parentChipTextActive]}>{p.nom}</Text>
                          </Pressable>
                        );
                      })
                    )}
                  </View>
                </>
              ) : null}

              <View style={styles.switchRow}>
                <View style={styles.switchText}>
                  <Text style={styles.fieldLabel}>Actif</Text>
                  <Text style={styles.switchHelper}>
                    {form.est_actif ? 'Disponible dans le tracker' : 'Masqué du tracker'}
                  </Text>
                </View>
                <Switch
                  value={form.est_actif}
                  onValueChange={(v) => setForm((f) => ({ ...f, est_actif: v }))}
                  trackColor={{ true: Colors.primary, false: Colors.gray[300] }}
                  thumbColor={Colors.white}
                />
              </View>

              <View style={styles.modalActions}>
                <Button title="Annuler" variant="tertiary" onPress={() => setModalVisible(false)} />
                <Button title="Enregistrer" icon="checkmark" loading={saveMut.isPending} onPress={soumettre} />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.gray[50] },
  list: { padding: Spacing.lg, gap: Spacing.md },
  headerAction: { marginBottom: Spacing.md },
  groupe: { gap: Spacing.sm, marginBottom: Spacing.md },
  emotionCard: { padding: Spacing.md, gap: Spacing.sm },
  emotionEnfant: { marginLeft: Spacing.xl, borderColor: Colors.gray[100] },
  emotionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  pastille: { width: 36, height: 36, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  pastilleIcone: { fontSize: 18 },
  emotionInfo: { flex: 1 },
  emotionNom: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.black },
  emotionMeta: { fontSize: FontSize.xs, color: Colors.gray[500], marginTop: 2 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(22,22,22,0.4)' },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.black },
  modalBody: { padding: Spacing.lg },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.black, marginBottom: Spacing.xs },
  couleurRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  couleurField: { flex: 1 },
  couleurApercu: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    marginTop: 24,
  },
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  segmentItem: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', backgroundColor: Colors.white },
  segmentItemActive: { backgroundColor: Colors.primary },
  segmentText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
  segmentTextActive: { color: Colors.white },
  parentList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  parentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
    minHeight: 44,
  },
  parentChipActive: { borderColor: Colors.primary, backgroundColor: '#E3E3FD' },
  parentDot: { width: 14, height: 14, borderRadius: Radius.pill },
  parentChipText: { fontSize: FontSize.sm, color: Colors.gray[600] },
  parentChipTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  switchText: { flex: 1, paddingRight: Spacing.md },
  switchHelper: { fontSize: FontSize.xs, color: Colors.gray[500], marginTop: 2 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm, marginTop: Spacing.sm },
});
