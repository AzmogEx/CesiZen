import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/auth-store';
import { useRapport } from '@/hooks/useRapport';
import { useSaisies } from '@/hooks/useTracker';
import { Colors } from '@/lib/colors';
import RepubliqueHeader from '@/components/RepubliqueHeader';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: rapport } = useRapport('month');
  const { data: saisies } = useSaisies();

  const recentSaisies = (saisies || []).slice(0, 3);

  return (
    <View style={styles.screen}>
      <RepubliqueHeader />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Bonjour, {user?.prenom} 👋</Text>
      <Text style={styles.subtitle}>Comment allez-vous aujourd'hui ?</Text>

      {/* Actions rapides */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/journal/new')}>
          <View style={[styles.actionIcon, { backgroundColor: `${Colors.primary}30` }]}>
            <Ionicons name="add-circle" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.actionText}>Nouvelle saisie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/journal/reports')}>
          <View style={[styles.actionIcon, { backgroundColor: `${Colors.secondary}30` }]}>
            <Ionicons name="bar-chart" size={28} color={Colors.secondary} />
          </View>
          <Text style={styles.actionText}>Mes rapports</Text>
        </TouchableOpacity>
      </View>

      {/* Stats du mois */}
      {rapport && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Ce mois-ci</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{rapport.stats.total_saisies}</Text>
              <Text style={styles.statLabel}>Saisies</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{rapport.stats.intensite_moyenne?.toFixed(1) || '—'}</Text>
              <Text style={styles.statLabel}>Intensité moy.</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{rapport.stats.emotion_dominante?.icone || '—'}</Text>
              <Text style={styles.statLabel}>{rapport.stats.emotion_dominante?.nom || 'Aucune'}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Dernieres saisies */}
      {recentSaisies.length > 0 && (
        <View style={styles.recentContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dernières émotions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          {recentSaisies.map((saisie) => (
            <View key={saisie.id} style={styles.saisieItem}>
              <View style={[styles.emotionIcon, { backgroundColor: `${saisie.emotion?.couleur}20` }]}>
                <Text style={styles.emotionEmoji}>{saisie.emotion?.icone || '🔵'}</Text>
              </View>
              <View style={styles.saisieContent}>
                <Text style={styles.saisieEmotion}>{saisie.emotion?.nom}</Text>
                <Text style={styles.saisieDate}>
                  {new Date(saisie.date_saisie).toLocaleDateString('fr-FR')} — Intensité: {saisie.intensite}/10
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20 },
  greeting: { fontSize: 28, fontWeight: '800', color: Colors.black, marginTop: 8 },
  subtitle: { fontSize: 16, color: Colors.gray[500], marginTop: 4, marginBottom: 24 },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 4, padding: 20,
    alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.gray[200],
  },
  actionIcon: { width: 56, height: 56, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '600', color: Colors.black },
  statsContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.black, marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: Colors.gray[50], borderRadius: 4, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.gray[200],
  },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 12, color: Colors.gray[500], marginTop: 4 },
  recentContainer: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: '600', color: Colors.primary, textDecorationLine: 'underline' },
  saisieItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: Colors.white, borderRadius: 4, marginBottom: 8,
    borderWidth: 1, borderColor: Colors.gray[200],
  },
  emotionIcon: { width: 44, height: 44, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  emotionEmoji: { fontSize: 22 },
  saisieContent: { flex: 1 },
  saisieEmotion: { fontSize: 15, fontWeight: '600', color: Colors.black },
  saisieDate: { fontSize: 13, color: Colors.gray[500], marginTop: 2 },
});
