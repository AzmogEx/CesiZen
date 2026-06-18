import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRapport } from '@/hooks/useRapport';
import { Colors } from '@/lib/colors';

type Period = 'week' | 'month' | 'quarter' | 'year';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'year', label: 'Annee' },
];

export default function ReportsScreen() {
  const [period, setPeriod] = useState<Period>('month');
  const { data: rapport, isLoading } = useRapport(period);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Period selector */}
      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[styles.periodBtn, period === p.value && styles.periodBtnActive]}
            onPress={() => setPeriod(p.value)}
          >
            <Text style={[styles.periodText, period === p.value && styles.periodTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : rapport ? (
        <>
          {/* Stats cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="bar-chart" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{rapport.stats.total_saisies}</Text>
              <Text style={styles.statLabel}>Saisies</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={20} color={Colors.secondary} />
              <Text style={styles.statValue}>{rapport.stats.intensite_moyenne?.toFixed(1) || '—'}</Text>
              <Text style={styles.statLabel}>Intensite moy.</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="heart" size={20} color={Colors.rougeMarianne} />
              <Text style={styles.statValue}>{rapport.stats.emotion_dominante?.icone || '—'}</Text>
              <Text style={styles.statLabel}>{rapport.stats.emotion_dominante?.nom || 'Aucune'}</Text>
            </View>
          </View>

          {/* Period info */}
          <View style={styles.periodInfo}>
            <Text style={styles.periodInfoText}>
              Du {new Date(rapport.date_debut).toLocaleDateString('fr-FR')} au {new Date(rapport.date_fin).toLocaleDateString('fr-FR')}
            </Text>
          </View>

          {/* Repartition */}
          {rapport.repartition.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Repartition des emotions</Text>
              {rapport.repartition.map((item) => (
                <View key={item.nom} style={styles.repartitionItem}>
                  <View style={styles.repartitionHeader}>
                    <View style={[styles.colorDot, { backgroundColor: item.couleur }]} />
                    <Text style={styles.repartitionName}>{item.nom}</Text>
                    <Text style={styles.repartitionPct}>{item.pourcentage}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.pourcentage}%`, backgroundColor: item.couleur }]} />
                  </View>
                  <View style={styles.repartitionFooter}>
                    <Text style={styles.repartitionDetail}>{item.count} saisies</Text>
                    <Text style={styles.repartitionDetail}>Moy: {item.intensite_moyenne.toFixed(1)}/10</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <View style={styles.empty}>
          <Ionicons name="bar-chart-outline" size={48} color={Colors.gray[300]} />
          <Text style={styles.emptyText}>Pas de donnees pour cette periode</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingBottom: 40 },
  periodRow: { flexDirection: 'row', backgroundColor: Colors.gray[100], borderRadius: 4, padding: 4, marginBottom: 20 },
  periodBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 4 },
  periodBtnActive: { backgroundColor: Colors.primary },
  periodText: { fontSize: 13, fontWeight: '600', color: Colors.gray[500] },
  periodTextActive: { color: Colors.white },
  loading: { padding: 40, alignItems: 'center' },
  loadingText: { color: Colors.gray[400] },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: Colors.gray[50], borderRadius: 4, padding: 16,
    alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.gray[200],
  },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.black },
  statLabel: { fontSize: 11, color: Colors.gray[500] },
  periodInfo: { marginBottom: 20 },
  periodInfoText: { fontSize: 13, color: Colors.gray[400], textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.black, marginBottom: 16 },
  repartitionItem: { marginBottom: 16 },
  repartitionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  repartitionName: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.black },
  repartitionPct: { fontSize: 14, fontWeight: '700', color: Colors.black },
  progressBar: { height: 6, backgroundColor: Colors.gray[200], borderRadius: 3, marginBottom: 4 },
  progressFill: { height: 6, borderRadius: 3 },
  repartitionFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  repartitionDetail: { fontSize: 12, color: Colors.gray[400] },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: Colors.gray[400], marginTop: 12 },
});
