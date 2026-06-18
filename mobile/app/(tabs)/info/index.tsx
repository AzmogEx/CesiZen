import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFeeds } from '@/hooks/useFeeds';
import { Colors } from '@/lib/colors';
import type { Feed } from '@/types';

export default function InfoListScreen() {
  const { data: feeds, isLoading } = useFeeds();
  const router = useRouter();

  const renderItem = ({ item }: { item: Feed }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(tabs)/info/${item.slug}`)}
    >
      <View style={styles.cardIcon}>
        <Ionicons name="document-text" size={24} color={Colors.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titre}</Text>
        <Text style={styles.cardExcerpt} numberOfLines={2}>
          {item.contenu?.replace(/<[^>]*>/g, '').substring(0, 120)}...
        </Text>
        <Text style={styles.cardDate}>
          {new Date(item.created_at).toLocaleDateString('fr-FR')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray[300]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={feeds || []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Santé mentale</Text>
            <Text style={styles.headerSubtitle}>Ressources et informations pour votre bien-être</Text>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loading}><Text style={styles.loadingText}>Chargement...</Text></View>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="newspaper-outline" size={48} color={Colors.gray[300]} />
              <Text style={styles.emptyText}>Aucun article disponible</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  listContent: { padding: 16 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
  headerSubtitle: { fontSize: 15, color: Colors.gray[500], marginTop: 4 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
    backgroundColor: Colors.white, borderRadius: 4, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.gray[200],
  },
  cardIcon: { width: 48, height: 48, borderRadius: 4, backgroundColor: `${Colors.primary}15`, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  cardExcerpt: { fontSize: 13, color: Colors.gray[500], lineHeight: 18 },
  cardDate: { fontSize: 11, color: Colors.gray[400], marginTop: 4 },
  loading: { padding: 40, alignItems: 'center' },
  loadingText: { color: Colors.gray[400] },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: Colors.gray[400], marginTop: 12 },
});
