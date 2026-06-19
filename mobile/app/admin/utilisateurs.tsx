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
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, EmptyState, Loader, TextField } from '@/components/ui';
import {
  useAdminUtilisateurs,
  useCreateUtilisateur,
  useToggleUtilisateurActif,
  useDeleteUtilisateur,
} from '@/hooks/useAdmin';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, HIT_SLOP, Radius, Spacing } from '@/lib/theme';
import type { Utilisateur } from '@/types';

const ROLE_MEMBRE = 2;
const ROLE_ADMIN = 3;

interface FormState {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id: number;
}

const FORM_VIDE: FormState = {
  prenom: '',
  nom: '',
  email: '',
  password: '',
  password_confirmation: '',
  role_id: ROLE_MEMBRE,
};

/** Extrait le message d'erreur d'une réponse API (422 backend) ou un texte par défaut. */
function messageErreur(e: unknown, defaut: string): string {
  const err = e as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message ?? defaut;
}

export default function AdminUtilisateursScreen() {
  const { data: utilisateurs, isLoading } = useAdminUtilisateurs();
  const createMut = useCreateUtilisateur();
  const toggleMut = useToggleUtilisateurActif();
  const deleteMut = useDeleteUtilisateur();

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_VIDE);

  const ouvrirFormulaire = () => {
    setForm(FORM_VIDE);
    setModalVisible(true);
  };

  const set = (cle: keyof FormState) => (valeur: string) => setForm((f) => ({ ...f, [cle]: valeur }));

  const soumettre = async () => {
    if (!form.prenom.trim() || !form.nom.trim() || !form.email.trim() || !form.password) {
      Alert.alert('Champs requis', 'Merci de renseigner tous les champs.');
      return;
    }
    if (form.password !== form.password_confirmation) {
      Alert.alert('Mots de passe', 'La confirmation ne correspond pas.');
      return;
    }
    try {
      await createMut.mutateAsync(form);
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Erreur', messageErreur(e, 'Impossible de créer l’utilisateur.'));
    }
  };

  const basculerActif = async (u: Utilisateur) => {
    try {
      await toggleMut.mutateAsync(u.id);
    } catch (e) {
      Alert.alert('Erreur', messageErreur(e, 'Action impossible.'));
    }
  };

  const supprimer = (u: Utilisateur) => {
    Alert.alert('Supprimer', `Supprimer ${u.prenom} ${u.nom} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMut.mutateAsync(u.id);
          } catch (e) {
            Alert.alert('Erreur', messageErreur(e, 'Suppression impossible.'));
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Utilisateur }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.nom}>
            {item.prenom} {item.nom}
          </Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.badges}>
        <Badge label={item.role?.nom ?? 'membre'} tone="primary" />
        <Badge label={item.est_actif ? 'Actif' : 'Inactif'} tone={item.est_actif ? 'success' : 'error'} />
      </View>
      <View style={styles.actions}>
        <Button
          title={item.est_actif ? 'Désactiver' : 'Activer'}
          variant="secondary"
          size="sm"
          icon={item.est_actif ? 'pause-outline' : 'play-outline'}
          onPress={() => basculerActif(item)}
        />
        <Button title="Supprimer" variant="danger" size="sm" icon="trash-outline" onPress={() => supprimer(item)} />
      </View>
    </Card>
  );

  if (isLoading) {
    return <Loader label="Chargement des utilisateurs…" />;
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={utilisateurs ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerAction}>
            <Button title="Nouvel utilisateur" icon="person-add-outline" fullWidth onPress={ouvrirFormulaire} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="Aucun utilisateur"
            message="Créez le premier compte avec le bouton ci-dessus."
          />
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvel utilisateur</Text>
              <Pressable hitSlop={HIT_SLOP} onPress={() => setModalVisible(false)} accessibilityLabel="Fermer">
                <Ionicons name="close" size={24} color={Colors.gray[600]} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
              <TextField label="Prénom" value={form.prenom} onChangeText={set('prenom')} required autoCapitalize="words" />
              <TextField label="Nom" value={form.nom} onChangeText={set('nom')} required autoCapitalize="words" />
              <TextField
                label="Email"
                value={form.email}
                onChangeText={set('email')}
                required
                keyboardType="email-address"
              />
              <TextField label="Mot de passe" value={form.password} onChangeText={set('password')} required secureTextEntry />
              <TextField
                label="Confirmation"
                value={form.password_confirmation}
                onChangeText={set('password_confirmation')}
                required
                secureTextEntry
              />

              <Text style={styles.fieldLabel}>Rôle</Text>
              <View style={styles.segment}>
                <Pressable
                  style={[styles.segmentItem, form.role_id === ROLE_MEMBRE && styles.segmentItemActive]}
                  onPress={() => setForm((f) => ({ ...f, role_id: ROLE_MEMBRE }))}
                >
                  <Text style={[styles.segmentText, form.role_id === ROLE_MEMBRE && styles.segmentTextActive]}>
                    Membre
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.segmentItem, form.role_id === ROLE_ADMIN && styles.segmentItemActive]}
                  onPress={() => setForm((f) => ({ ...f, role_id: ROLE_ADMIN }))}
                >
                  <Text style={[styles.segmentText, form.role_id === ROLE_ADMIN && styles.segmentTextActive]}>
                    Administrateur
                  </Text>
                </Pressable>
              </View>

              <View style={styles.modalActions}>
                <Button title="Annuler" variant="tertiary" onPress={() => setModalVisible(false)} />
                <Button title="Créer" icon="checkmark" loading={createMut.isPending} onPress={soumettre} />
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
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  cardHeaderText: { flex: 1 },
  nom: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.black },
  email: { fontSize: FontSize.sm, color: Colors.gray[500], marginTop: 2 },
  badges: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
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
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.black, marginBottom: Spacing.xs },
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
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm, marginTop: Spacing.sm },
});
