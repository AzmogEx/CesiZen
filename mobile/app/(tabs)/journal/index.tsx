import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSaisies, useDeleteSaisie } from '@/hooks/useTracker';
import { Colors } from '@/lib/colors';
import type { SaisieTracker } from '@/types';

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
    <View style={styles.saisieCard}>
      <View style={[styles.emotionIcon, { backgroundColor: `${item.emotion?.couleur}20` }]}>
        <Text style={styles.emotionEmoji}>{item.emotion?.icone || '🔵'}</Text>
      </View>
      <View style={styles.saisieContent}>
        <View style={styles.saisieHeader}>
          <View style={[styles.badge, { backgroundColor: `${item.emotion?.couleur}20` }]}>
            <Text style={[styles.badgeText, { color: item.emotion?.couleur }]}>{item.emotion?.nom}</Text>
          </View>
          <Text style={styles.intensityText}>Intensite: {item.intensite}/10</Text>
        </View>
        <View style={styles.intensityBar}>
          <View style={[styles.intensityFill, { width: `${item.intensite * 10}%`, backgroundColor: item.emotion?.couleur || Colors.primary }]} />
        </View>
        {item.note && <Text style={styles.note} numberOfLines={2}>{item.note}</Text>}
        <Text style={styles.date}>{new Date(item.date_saisie).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/(tabs)/journal/edit', params: { id: String(item.id) } })}>
          <Ionicons name="create-outline" size={18} color={Colors.gray[400]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={18} color={Colors.gray[400]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={saisies || []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={48} color={Colors.gray[300]} />
            <Text style={styles.emptyTitle}>Aucune saisie</Text>
            <Text style={styles.emptyText}>Commencez par enregistrer votre premiere emotion</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/journal/new')}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  listContent: { padding: 16, paddingBottom: 80 },
  saisieCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16,
    backgroundColor: Colors.white, borderRadius: 4, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.gray[200],
  },
  emotionIcon: { width: 48, height: 48, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  emotionEmoji: { fontSize: 24 },
  saisieContent: { flex: 1 },
  saisieHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4 },
  badgeText: { fontSize: 13, fontWeight: '600' },
  intensityText: { fontSize: 12, color: Colors.gray[400] },
  intensityBar: { height: 4, backgroundColor: Colors.gray[200], borderRadius: 2, marginBottom: 6 },
  intensityFill: { height: 4, borderRadius: 2 },
  note: { fontSize: 13, color: Colors.gray[600], marginBottom: 4 },
  date: { fontSize: 12, color: Colors.gray[400] },
  actions: { gap: 4 },
  actionBtn: { padding: 6, borderRadius: 8 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.gray[400], marginTop: 12 },
  emptyText: { fontSize: 14, color: Colors.gray[400], marginTop: 4 },
  fab: {
    position: 'absolute', right: 20, bottom: 20,
    width: 56, height: 56, borderRadius: 4,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,
    elevation: 6,
  },
});
