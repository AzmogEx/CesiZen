import { useState } from 'react';
import {
  Alert,
  FlatList,
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
import { Badge, Button, Card, EmptyState, Loader, TextField } from '@/components/ui';
import { useAdminFeeds, useSaveFeed, useDeleteFeed } from '@/hooks/useAdmin';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, HIT_SLOP, Radius, Spacing } from '@/lib/theme';
import type { Feed } from '@/types';

interface FormState {
  id?: number;
  titre: string;
  contenu: string;
  ordre: string;
  est_publie: boolean;
}

const FORM_VIDE: FormState = { titre: '', contenu: '', ordre: '0', est_publie: false };

function messageErreur(e: unknown, defaut: string): string {
  const err = e as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message ?? defaut;
}

export default function AdminContenusScreen() {
  const { data: feeds, isLoading } = useAdminFeeds();
  const saveMut = useSaveFeed();
  const deleteMut = useDeleteFeed();

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_VIDE);

  const ouvrirCreation = () => {
    setForm(FORM_VIDE);
    setModalVisible(true);
  };

  const ouvrirEdition = (f: Feed) => {
    setForm({ id: f.id, titre: f.titre, contenu: f.contenu, ordre: String(f.ordre), est_publie: f.est_publie });
    setModalVisible(true);
  };

  const set = (cle: 'titre' | 'contenu' | 'ordre') => (valeur: string) => setForm((f) => ({ ...f, [cle]: valeur }));

  const soumettre = async () => {
    if (!form.titre.trim() || !form.contenu.trim()) {
      Alert.alert('Champs requis', 'Le titre et le contenu sont obligatoires.');
      return;
    }
    try {
      await saveMut.mutateAsync({
        id: form.id,
        titre: form.titre.trim(),
        contenu: form.contenu.trim(),
        ordre: Number.parseInt(form.ordre, 10) || 0,
        est_publie: form.est_publie,
      });
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Erreur', messageErreur(e, 'Enregistrement impossible.'));
    }
  };

  const supprimer = (f: Feed) => {
    Alert.alert('Supprimer', `Supprimer « ${f.titre} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMut.mutateAsync(f.id);
          } catch (e) {
            Alert.alert('Erreur', messageErreur(e, 'Suppression impossible.'));
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Feed }) => (
    <Card style={styles.card}>
      <Text style={styles.titre}>{item.titre}</Text>
      <View style={styles.badges}>
        <Badge label={item.est_publie ? 'Publié' : 'Brouillon'} tone={item.est_publie ? 'success' : 'warning'} />
        <Badge label={`Ordre ${item.ordre}`} tone="neutral" />
      </View>
      <Text style={styles.extrait} numberOfLines={2}>
        {item.contenu}
      </Text>
      <View style={styles.actions}>
        <Button title="Modifier" variant="secondary" size="sm" icon="create-outline" onPress={() => ouvrirEdition(item)} />
        <Button title="Supprimer" variant="danger" size="sm" icon="trash-outline" onPress={() => supprimer(item)} />
      </View>
    </Card>
  );

  if (isLoading) {
    return <Loader label="Chargement des contenus…" />;
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={feeds ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerAction}>
            <Button title="Nouveau contenu" icon="add" fullWidth onPress={ouvrirCreation} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState icon="newspaper-outline" title="Aucun contenu" message="Créez un premier article d’information." />
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{form.id ? 'Modifier le contenu' : 'Nouveau contenu'}</Text>
              <Pressable hitSlop={HIT_SLOP} onPress={() => setModalVisible(false)} accessibilityLabel="Fermer">
                <Ionicons name="close" size={24} color={Colors.gray[600]} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
              <TextField label="Titre" value={form.titre} onChangeText={set('titre')} required autoCapitalize="sentences" />
              <TextField
                label="Contenu"
                value={form.contenu}
                onChangeText={set('contenu')}
                required
                multiline
                numberOfLines={6}
                autoCapitalize="sentences"
              />
              <TextField label="Ordre d’affichage" value={form.ordre} onChangeText={set('ordre')} keyboardType="numeric" />

              <View style={styles.switchRow}>
                <View style={styles.switchText}>
                  <Text style={styles.fieldLabel}>Publié</Text>
                  <Text style={styles.switchHelper}>
                    {form.est_publie ? 'Visible par le public' : 'Brouillon (masqué)'}
                  </Text>
                </View>
                <Switch
                  value={form.est_publie}
                  onValueChange={(v) => setForm((f) => ({ ...f, est_publie: v }))}
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
  card: { padding: Spacing.lg, gap: Spacing.sm },
  titre: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.black },
  badges: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  extrait: { fontSize: FontSize.sm, color: Colors.gray[500], lineHeight: 20 },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(22,22,22,0.4)' },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    maxHeight: '90%',
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
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.black },
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
