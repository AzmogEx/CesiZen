import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useFeed } from '@/hooks/useFeeds';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, Spacing } from '@/lib/theme';
import { Badge, EmptyState, Loader } from '@/components/ui';

export default function FeedDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: feed, isLoading, isError } = useFeed(slug);

  if (isLoading) {
    return (
      <View style={styles.fill}>
        <Stack.Screen options={{ title: 'Article' }} />
        <Loader label="Chargement de l'article…" />
      </View>
    );
  }

  if (isError || !feed) {
    return (
      <View style={styles.fill}>
        <Stack.Screen options={{ title: 'Article' }} />
        <EmptyState
          icon="alert-circle-outline"
          title="Article introuvable"
          message="Cet article n'existe plus ou n'est pas accessible."
        />
      </View>
    );
  }

  const texteNettoye = (feed.contenu ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return (
    <View style={styles.fill}>
      <Stack.Screen options={{ title: feed.titre ?? 'Article' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Badge label="Information santé mentale" tone="primary" />

        <Text style={styles.title}>{feed.titre}</Text>

        <Text style={styles.date}>
          Publié le{' '}
          {new Date(feed.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        <Text style={styles.body}>{texteNettoye}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: Colors.gray[50] },
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.black,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    lineHeight: 30,
  },
  date: { fontSize: FontSize.xs, color: Colors.gray[400], marginBottom: Spacing.xl },
  body: { fontSize: FontSize.body, lineHeight: 24, color: Colors.black },
});
