import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFeeds } from '@/hooks/useFeeds';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/lib/theme';
import { AppBar, Card, EmptyState, Loader } from '@/components/ui';
import type { Feed } from '@/types';

export default function InfoListScreen() {
  const { data: feeds, isLoading } = useFeeds();
  const router = useRouter();

  const renderItem = ({ item }: { item: Feed }) => {
    const extrait = (item.contenu ?? '').replace(/<[^>]*>/g, '').trim();
    return (
      <Card onPress={() => router.push(`/(tabs)/info/${item.slug}`)} style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.cardIcon}>
            <Ionicons name="document-text" size={24} color={Colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.titre}</Text>
            {extrait ? (
              <Text style={styles.cardExcerpt} numberOfLines={2}>
                {extrait}
              </Text>
            ) : null}
            <Text style={styles.cardDate}>
              {new Date(item.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <AppBar title="Informations" subtitle="Ressources pour votre santé mentale" />
      {isLoading ? (
        <Loader label="Chargement des articles…" />
      ) : (
        <FlatList
          data={feeds ?? []}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="newspaper-outline"
              title="Aucun article disponible"
              message="Les ressources d'information apparaîtront ici dès leur publication."
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  listContent: { padding: Spacing.lg, gap: Spacing.md },
  card: { padding: Spacing.lg },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: '#E3E3FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.black, marginBottom: Spacing.xs },
  cardExcerpt: { fontSize: FontSize.xs, color: Colors.gray[500], lineHeight: 18 },
  cardDate: { fontSize: FontSize.tiny, color: Colors.gray[400], marginTop: Spacing.xs },
});
