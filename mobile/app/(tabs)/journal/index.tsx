import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSaisies, useDeleteSaisie } from '@/hooks/useTracker';
import { Colors } from '@/lib/colors';
import { Spacing, Radius, FontSize, FontWeight, Shadow, MIN_TOUCH, HIT_SLOP } from '@/lib/theme';
import { AppBar, Card, Badge, EmptyState, Loader } from '@/components/ui';
import type { SaisieTracker } from '@/types';

/** Dimensions locales (multiples de l'échelle 4px du DSFR). */
const EMOTION_ICON = 48;
const EMOJI_SIZE = 24;
const ACTION_ICON_SIZE = 20;
const FAB_SIZE = 56;
const FAB_ICON = 30;
const BAR_HEIGHT = 6;
/** Marge basse de la liste : laisse passer le FAB sans qu'il chevauche le contenu. */
const LIST_BOTTOM_GAP = FAB_SIZE + Spacing.xl + Spacing.lg;

export default function JournalScreen() {
  const router = useRouter();
  const { data: saisies, isLoading, refetch } = useSaisies();
  const deleteSaisie = useDeleteSaisie();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleDelete = (id: number) => {
    Alert.alert('Supprimer', 'Supprimer cette saisie ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSaisie.mutateAsync(id);
          } catch {
            Alert.alert('Erreur', 'Impossible de supprimer');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: SaisieTracker }) => (
    <Card padding={Spacing.lg} style={styles.saisieCard}>
      <View style={[styles.emotionIcon, { backgroundColor: `${item.emotion?.couleur || Colors.primary}20` }]}>
        <Text style={styles.emotionEmoji}>{item.emotion?.icone || '🔵'}</Text>
      </View>
      <View style={styles.saisieContent}>
        <View style={styles.saisieHeader}>
          {item.emotion?.couleur ? (
            <Badge label={item.emotion?.nom || ''} color={item.emotion.couleur} />
          ) : (
            <Badge label={item.emotion?.nom || '—'} tone="neutral" />
          )}
          <Text style={styles.intensityText}>Intensité {item.intensite}/10</Text>
        </View>
        <View style={styles.intensityBar}>
          <View
            style={[
              styles.intensityFill,
              { width: `${item.intensite * 10}%`, backgroundColor: item.emotion?.couleur || Colors.primary },
            ]}
          />
        </View>
        {item.note ? (
          <Text style={styles.note} numberOfLines={2}>
            {item.note}
          </Text>
        ) : null}
        <Text style={styles.date}>
          {new Date(item.date_saisie).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          hitSlop={HIT_SLOP}
          accessibilityLabel="Modifier la saisie"
          onPress={() => router.push({ pathname: '/(tabs)/journal/edit', params: { id: String(item.id) } })}
        >
          <Ionicons name="create-outline" size={ACTION_ICON_SIZE} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          hitSlop={HIT_SLOP}
          accessibilityLabel="Supprimer la saisie"
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={ACTION_ICON_SIZE} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.screen}>
      <AppBar title="Mon journal" subtitle="Vos émotions au fil du temps" />
      {isLoading ? (
        <Loader label="Chargement du journal…" />
      ) : (
        <FlatList
          data={saisies || []}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="book-outline"
              title="Aucune saisie"
              message="Commencez par enregistrer votre première émotion."
              actionLabel="Nouvelle saisie"
              onAction={() => router.push('/(tabs)/journal/new')}
            />
          }
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel="Nouvelle saisie"
        hitSlop={HIT_SLOP}
        onPress={() => router.push('/(tabs)/journal/new')}
      >
        <Ionicons name="add" size={FAB_ICON} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.gray[50] },
  listContent: { padding: Spacing.lg, paddingBottom: LIST_BOTTOM_GAP },
  saisieCard: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
  emotionIcon: { width: EMOTION_ICON, height: EMOTION_ICON, borderRadius: Radius.sm, justifyContent: 'center', alignItems: 'center' },
  emotionEmoji: { fontSize: EMOJI_SIZE },
  saisieContent: { flex: 1 },
  saisieHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm, flexWrap: 'wrap' },
  intensityText: { fontSize: FontSize.xs, color: Colors.gray[500] },
  intensityBar: { height: BAR_HEIGHT, backgroundColor: Colors.gray[200], borderRadius: Radius.sm, marginBottom: Spacing.sm },
  intensityFill: { height: BAR_HEIGHT, borderRadius: Radius.sm },
  note: { fontSize: FontSize.xs, color: Colors.gray[600], marginBottom: Spacing.xs, lineHeight: 19 },
  date: { fontSize: FontSize.xs, color: Colors.gray[400], textTransform: 'capitalize' },
  actions: { gap: Spacing.sm },
  actionBtn: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.xl,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.raised,
  },
});
