import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFeed } from '@/hooks/useFeeds';
import { Colors } from '@/lib/colors';

export default function FeedDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: feed, isLoading, isError } = useFeed(slug);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (isError || !feed) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.gray[400]} />
        <Text style={styles.errorText}>Article introuvable</Text>
      </View>
    );
  }

  const texteNettoye = (feed.contenu ?? '').replace(/<[^>]*>/g, '');

  return (
    <>
      <Stack.Screen options={{ title: feed.titre ?? '' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="information-circle" size={14} color={Colors.secondary} />
          <Text style={styles.badgeText}>Information santé mentale</Text>
        </View>

        <Text style={styles.title}>{feed.titre}</Text>

        <Text style={styles.date}>
          Publié le {new Date(feed.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>

        <Text style={styles.body}>{texteNettoye}</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: `${Colors.secondary}15`, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, marginBottom: 12 },
  badgeText: { fontSize: 12, fontWeight: '600', color: Colors.secondary },
  title: { fontSize: 24, fontWeight: '800', color: Colors.black, marginBottom: 8, lineHeight: 30 },
  date: { fontSize: 13, color: Colors.gray[400], marginBottom: 20 },
  body: { fontSize: 15, lineHeight: 24, color: Colors.gray[700] ?? '#374151' },
  errorText: { marginTop: 12, fontSize: 16, color: Colors.gray[400] },
});
