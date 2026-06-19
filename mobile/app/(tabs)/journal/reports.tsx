import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRapport } from '@/hooks/useRapport';
import { Colors } from '@/lib/colors';
import { Spacing, Radius, FontSize, FontWeight, MIN_TOUCH } from '@/lib/theme';
import { AppBar, Card, Badge, SectionTitle, EmptyState, Loader } from '@/components/ui';
import EmotionPieChart from '@/components/EmotionPieChart';

/** Dimensions locales (multiples de l'échelle 4px du DSFR). */
const STAT_ICON = 20;
const SEGMENT_MIN_HEIGHT = MIN_TOUCH;
const BAR_HEIGHT = 6;

type Period = 'week' | 'month' | 'quarter' | 'year';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'year', label: 'Année' },
];

export default function ReportsScreen() {
  const [period, setPeriod] = useState<Period>('month');
  const { data: rapport, isLoading } = useRapport(period);

  return (
    <View style={styles.screen}>
      <AppBar title="Mes rapports" subtitle="Analyse de vos émotions" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Sélecteur de période — boutons segmentés */}
        <View style={styles.segment}>
          {PERIODS.map((p) => {
            const active = period === p.value;
            return (
              <TouchableOpacity
                key={p.value}
                style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                onPress={() => setPeriod(p.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={p.label}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{p.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isLoading ? (
          <Loader label="Chargement du rapport…" />
        ) : rapport && rapport.stats.total_saisies > 0 ? (
          <>
            {/* Stats */}
            <Card padding={Spacing.lg} style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statCell}>
                  <Ionicons name="bar-chart" size={STAT_ICON} color={Colors.primary} />
                  <Text style={styles.statValue}>{rapport.stats.total_saisies}</Text>
                  <Text style={styles.statLabel}>Saisies</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Ionicons name="trending-up" size={STAT_ICON} color={Colors.primary} />
                  <Text style={styles.statValue}>{rapport.stats.intensite_moyenne?.toFixed(1) || '—'}</Text>
                  <Text style={styles.statLabel}>Intensité moy.</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Text style={styles.statEmoji}>{rapport.stats.emotion_dominante?.icone || '—'}</Text>
                  <Text style={styles.statLabel} numberOfLines={1}>
                    {rapport.stats.emotion_dominante?.nom || 'Aucune'}
                  </Text>
                </View>
              </View>
              <Text style={styles.periodInfo}>
                Du {new Date(rapport.date_debut).toLocaleDateString('fr-FR')} au{' '}
                {new Date(rapport.date_fin).toLocaleDateString('fr-FR')}
              </Text>
            </Card>

            {/* Répartition */}
            {rapport.repartition.length > 0 && (
              <View style={styles.block}>
                <SectionTitle>Répartition des émotions</SectionTitle>

                <Card padding={Spacing.lg}>
                  <EmotionPieChart
                    data={rapport.repartition.map((item) => ({
                      nom: item.nom,
                      couleur: item.couleur,
                      count: item.count,
                      pourcentage: item.pourcentage,
                    }))}
                  />
                </Card>

                <View style={styles.detailHeader}>
                  <SectionTitle>Détail par émotion</SectionTitle>
                </View>
                <Card padding={Spacing.lg}>
                  {rapport.repartition.map((item, idx) => (
                    <View
                      key={item.nom}
                      style={[styles.repItem, idx > 0 && styles.repItemBorder]}
                    >
                      <View style={styles.repHeader}>
                        <Badge label={item.nom} color={item.couleur} />
                        <Text style={styles.repPct}>{item.pourcentage}%</Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View
                          style={[styles.progressFill, { width: `${item.pourcentage}%`, backgroundColor: item.couleur }]}
                        />
                      </View>
                      <View style={styles.repFooter}>
                        <Text style={styles.repDetail}>{item.count} saisies</Text>
                        <Text style={styles.repDetail}>Moy. {item.intensite_moyenne.toFixed(1)}/10</Text>
                      </View>
                    </View>
                  ))}
                </Card>
              </View>
            )}
          </>
        ) : (
          <EmptyState
            icon="bar-chart-outline"
            title="Aucune donnée"
            message="Pas de saisie pour cette période. Changez de période ou ajoutez une émotion."
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.gray[50] },
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  segment: { flexDirection: 'row', backgroundColor: Colors.gray[100], borderRadius: Radius.sm, padding: Spacing.xs, marginBottom: Spacing.lg },
  segmentBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: Radius.sm, minHeight: SEGMENT_MIN_HEIGHT, justifyContent: 'center' },
  segmentBtnActive: { backgroundColor: Colors.primary },
  segmentText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.gray[500] },
  segmentTextActive: { color: Colors.white },
  statsCard: { marginBottom: Spacing.xl },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statCell: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  statDivider: { width: 1, alignSelf: 'stretch', backgroundColor: Colors.gray[200], marginVertical: Spacing.xs },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Colors.black },
  statEmoji: { fontSize: FontSize.xxl },
  statLabel: { fontSize: FontSize.tiny, color: Colors.gray[500], textAlign: 'center' },
  periodInfo: { fontSize: FontSize.xs, color: Colors.gray[400], textAlign: 'center', marginTop: Spacing.md },
  block: { marginBottom: Spacing.xl },
  detailHeader: { marginTop: Spacing.lg },
  repItem: { paddingVertical: Spacing.md },
  repItemBorder: { borderTopWidth: 1, borderTopColor: Colors.gray[200] },
  repHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  repPct: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.black },
  progressBar: { height: BAR_HEIGHT, backgroundColor: Colors.gray[200], borderRadius: Radius.sm, marginBottom: Spacing.xs },
  progressFill: { height: BAR_HEIGHT, borderRadius: Radius.sm },
  repFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  repDetail: { fontSize: FontSize.xs, color: Colors.gray[500] },
});
