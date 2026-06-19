import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/auth-store';
import { useRapport } from '@/hooks/useRapport';
import { useSaisies } from '@/hooks/useTracker';
import { Colors } from '@/lib/colors';
import { Spacing, Radius, FontSize, FontWeight, MIN_TOUCH } from '@/lib/theme';
import { AppBar, Card, Badge, SectionTitle, EmptyState, Loader } from '@/components/ui';

/** Tailles d'icônes et de pastilles (multiples de l'échelle 4px du DSFR). */
const ICON_LG = 28;
const ACTION_ICON = 56;
const EMOTION_ICON = 44;
const EMOJI_SIZE = 22;

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: rapport } = useRapport('month');
  const { data: saisies, isLoading } = useSaisies();

  const recentSaisies = (saisies || []).slice(0, 3);

  return (
    <View style={styles.screen}>
      <AppBar
        title={`Bonjour ${user?.prenom || ''}`.trim()}
        subtitle="Comment allez-vous aujourd'hui ?"
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Actions rapides */}
        <View style={styles.actionsRow}>
          <Card onPress={() => router.push('/(tabs)/journal/new')} padding={Spacing.lg} style={styles.actionPrimary}>
            <View style={[styles.actionIcon, styles.actionIconPrimary]}>
              <Ionicons name="add-circle" size={ICON_LG} color={Colors.white} />
            </View>
            <Text style={styles.actionTextPrimary}>Nouvelle saisie</Text>
          </Card>
          <Card onPress={() => router.push('/(tabs)/journal/reports')} padding={Spacing.lg} style={styles.actionCard}>
            <View style={[styles.actionIcon, styles.actionIconSecondary]}>
              <Ionicons name="bar-chart" size={ICON_LG} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Mes rapports</Text>
          </Card>
        </View>

        {/* Stats du mois */}
        {rapport && (
          <View style={styles.block}>
            <SectionTitle>Ce mois-ci</SectionTitle>
            <Card padding={Spacing.lg}>
              <View style={styles.statsRow}>
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{rapport.stats.total_saisies}</Text>
                  <Text style={styles.statLabel}>Saisies</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>
                    {rapport.stats.intensite_moyenne?.toFixed(1) || '—'}
                  </Text>
                  <Text style={styles.statLabel}>Intensité moy.</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{rapport.stats.emotion_dominante?.icone || '—'}</Text>
                  <Text style={styles.statLabel} numberOfLines={1}>
                    {rapport.stats.emotion_dominante?.nom || 'Aucune'}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Dernières saisies */}
        <View style={styles.block}>
          <View style={styles.sectionHeader}>
            <SectionTitle>Dernières saisies</SectionTitle>
            {recentSaisies.length > 0 && (
              <Text
                style={styles.seeAll}
                onPress={() => router.push('/(tabs)/journal')}
                accessibilityRole="link"
              >
                Tout voir
              </Text>
            )}
          </View>

          {isLoading ? (
            <Loader label="Chargement…" />
          ) : recentSaisies.length === 0 ? (
            <EmptyState
              icon="sparkles-outline"
              title="Aucune saisie pour l'instant"
              message="Commencez par enregistrer votre première émotion du jour."
              actionLabel="Nouvelle saisie"
              onAction={() => router.push('/(tabs)/journal/new')}
            />
          ) : (
            recentSaisies.map((saisie) => (
              <Card
                key={saisie.id}
                onPress={() => router.push('/(tabs)/journal')}
                padding={Spacing.md}
                style={styles.saisieCard}
              >
                <View style={[styles.emotionIcon, { backgroundColor: `${saisie.emotion?.couleur || Colors.primary}20` }]}>
                  <Text style={styles.emotionEmoji}>{saisie.emotion?.icone || '🔵'}</Text>
                </View>
                <View style={styles.saisieContent}>
                  {saisie.emotion?.couleur ? (
                    <Badge label={saisie.emotion?.nom || ''} color={saisie.emotion.couleur} />
                  ) : (
                    <Badge label={saisie.emotion?.nom || '—'} tone="neutral" />
                  )}
                  <Text style={styles.saisieDate}>
                    {new Date(saisie.date_saisie).toLocaleDateString('fr-FR')} — Intensité {saisie.intensite}/10
                  </Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.gray[50] },
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  actionsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  actionCard: { flex: 1, alignItems: 'center', gap: Spacing.md },
  actionPrimary: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionIcon: { width: ACTION_ICON, height: ACTION_ICON, borderRadius: Radius.sm, justifyContent: 'center', alignItems: 'center' },
  actionIconPrimary: { backgroundColor: Colors.primaryDark },
  actionIconSecondary: { backgroundColor: Colors.gray[100] },
  actionText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.black },
  actionTextPrimary: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.white },
  block: { marginBottom: Spacing.xl },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statCell: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  statDivider: { width: 1, alignSelf: 'stretch', backgroundColor: Colors.gray[200], marginVertical: Spacing.xs },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Colors.primary },
  statLabel: { fontSize: FontSize.tiny, color: Colors.gray[500], textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    textDecorationLine: 'underline',
    minHeight: MIN_TOUCH,
    paddingTop: Spacing.xs,
  },
  saisieCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  emotionIcon: { width: EMOTION_ICON, height: EMOTION_ICON, borderRadius: Radius.sm, justifyContent: 'center', alignItems: 'center' },
  emotionEmoji: { fontSize: EMOJI_SIZE },
  saisieContent: { flex: 1, gap: Spacing.xs, alignItems: 'flex-start' },
  saisieDate: { fontSize: FontSize.xs, color: Colors.gray[500] },
});
