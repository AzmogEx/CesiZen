import { View, Text, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/lib/theme';
import { AppBar, Button, Card } from '@/components/ui';

type Contact = {
  nom: string;
  numero: string;
  description: string;
  disponibilite: string;
};

const CONTACTS: Contact[] = [
  {
    nom: 'Prévention du suicide',
    numero: '3114',
    description: 'Numéro national gratuit et confidentiel pour les personnes en détresse psychologique et leur entourage.',
    disponibilite: '24h/24 — 7j/7',
  },
  {
    nom: 'SOS Amitié',
    numero: '0972394050',
    description: 'Écoute et soutien pour les personnes en souffrance, solitude ou détresse morale.',
    disponibilite: '24h/24',
  },
  {
    nom: 'Fil Santé Jeunes',
    numero: '0800235236',
    description: 'Ligne d\'écoute gratuite et anonyme pour les 12-25 ans.',
    disponibilite: 'Lun-Dim, 9h-23h',
  },
  {
    nom: 'SAMU',
    numero: '15',
    description: 'Service d\'aide médicale urgente. En cas d\'urgence vitale.',
    disponibilite: '24h/24 — 7j/7',
  },
  {
    nom: 'SOS Médecins',
    numero: '3624',
    description: 'Consultations médicales à domicile.',
    disponibilite: '24h/24 — 7j/7',
  },
  {
    nom: 'Numéro européen d\'urgence',
    numero: '112',
    description: 'Police, pompiers, SAMU. À utiliser en cas d\'urgence vitale.',
    disponibilite: '24h/24 — 7j/7',
  },
];

function formatNumero(n: string): string {
  if (n.length <= 4) return n;
  return n.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

export default function UrgenceScreen() {
  const appeler = async (numero: string, nom: string) => {
    const url = `tel:${numero}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Impossible d\'appeler', `Composez manuellement le ${formatNumero(numero)} pour joindre ${nom}.`);
    }
  };

  return (
    <View style={styles.screen}>
      <AppBar title="Urgence" subtitle="Vous n'êtes pas seul(e)" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Si vous ou un proche traversez une période difficile, ces services sont là pour vous écouter.
        </Text>

        {CONTACTS.map((c) => (
          <Card key={c.numero} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="call" size={22} color={Colors.error} />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardName}>{c.nom}</Text>
                <Text style={styles.cardNumber}>{formatNumero(c.numero)}</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>{c.description}</Text>
            <View style={styles.cardAvailabilityRow}>
              <Ionicons name="time-outline" size={14} color={Colors.gray[500]} />
              <Text style={styles.cardAvailability}>{c.disponibilite}</Text>
            </View>
            <Button
              title={`Appeler le ${formatNumero(c.numero)}`}
              variant="danger"
              icon="call"
              fullWidth
              onPress={() => appeler(c.numero, c.nom)}
              style={styles.cardButton}
            />
          </Card>
        ))}

        <Card style={styles.warning} padding={Spacing.lg}>
          <View style={styles.warningRow}>
            <Ionicons name="warning" size={20} color={Colors.error} />
            <Text style={styles.warningText}>
              En cas d'urgence vitale, appelez immédiatement le <Text style={styles.bold}>15</Text> (SAMU) ou le{' '}
              <Text style={styles.bold}>112</Text>.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.gray[50] },
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md },
  intro: { fontSize: FontSize.sm, color: Colors.gray[500], lineHeight: 20, marginBottom: Spacing.xs },
  card: { padding: Spacing.lg, gap: Spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: { flex: 1 },
  cardName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.black, marginBottom: 2 },
  cardNumber: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy, color: Colors.error },
  cardDescription: { fontSize: FontSize.xs, color: Colors.gray[600], lineHeight: 19 },
  cardAvailabilityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  cardAvailability: { fontSize: FontSize.tiny, color: Colors.gray[500], fontWeight: FontWeight.semibold },
  cardButton: { marginTop: Spacing.xs },
  warning: { backgroundColor: Colors.errorBg, borderColor: Colors.error },
  warningRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  warningText: { flex: 1, fontSize: FontSize.xs, color: Colors.error, lineHeight: 19 },
  bold: { fontWeight: FontWeight.heavy },
});
