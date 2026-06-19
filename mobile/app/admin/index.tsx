import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, SectionTitle } from '@/components/ui';
import { useAdminUtilisateurs, useAdminFeeds, useAdminEmotions } from '@/hooks/useAdmin';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/lib/theme';

interface HubItem {
  href: '/admin/utilisateurs' | '/admin/contenus' | '/admin/emotions';
  icon: keyof typeof Ionicons.glyphMap;
  titre: string;
  sousTitre: string;
  compteur?: number;
}

/** Hub d'administration : accès aux trois sections de gestion. */
export default function AdminHubScreen() {
  const router = useRouter();
  const { data: utilisateurs } = useAdminUtilisateurs();
  const { data: feeds } = useAdminFeeds();
  const { data: emotions } = useAdminEmotions();

  const items: HubItem[] = [
    {
      href: '/admin/utilisateurs',
      icon: 'people-outline',
      titre: 'Utilisateurs',
      sousTitre: 'Comptes, rôles et activation',
      compteur: utilisateurs?.length,
    },
    {
      href: '/admin/contenus',
      icon: 'newspaper-outline',
      titre: 'Contenus',
      sousTitre: 'Articles d’information santé mentale',
      compteur: feeds?.length,
    },
    {
      href: '/admin/emotions',
      icon: 'color-palette-outline',
      titre: 'Émotions',
      sousTitre: 'Référentiel des émotions et sous-émotions',
      compteur: emotions?.length,
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionTitle>Espace d’administration</SectionTitle>
      <Text style={styles.intro}>Gérez les utilisateurs, les contenus et le référentiel des émotions.</Text>

      <View style={styles.list}>
        {items.map((item) => (
          <Card key={item.href} onPress={() => router.push(item.href)} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={26} color={Colors.primary} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.titre}</Text>
                <Text style={styles.cardSubtitle}>{item.sousTitre}</Text>
              </View>
              <View style={styles.cardEnd}>
                {typeof item.compteur === 'number' ? (
                  <Text style={styles.count}>{item.compteur}</Text>
                ) : null}
                <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.gray[50] },
  content: { padding: Spacing.lg, gap: Spacing.md },
  intro: { fontSize: FontSize.sm, color: Colors.gray[500], marginBottom: Spacing.sm, lineHeight: 20 },
  list: { gap: Spacing.md },
  card: { padding: Spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: '#E3E3FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.black },
  cardSubtitle: { fontSize: FontSize.xs, color: Colors.gray[500], marginTop: 2, lineHeight: 18 },
  cardEnd: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  count: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    minWidth: 22,
    textAlign: 'right',
  },
});
