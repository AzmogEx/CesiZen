import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/auth-store';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, MIN_TOUCH, Radius, Spacing } from '@/lib/theme';
import { AppBar, Badge, Button, Card, SectionTitle } from '@/components/ui';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const isAdmin = user?.role?.nom === 'administrateur';

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const initiales = `${user?.prenom?.[0] ?? ''}${user?.nom?.[0] ?? ''}`.toUpperCase();

  return (
    <View style={styles.screen}>
      <AppBar title="Profil" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Avatar & identité */}
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initiales}</Text>
          </View>
          <Text style={styles.name}>
            {user?.prenom} {user?.nom}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Badge label={user?.role?.nom ?? 'Membre'} tone="primary" />
          </View>
        </Card>

        {/* Entrée admin — visible uniquement pour les administrateurs */}
        {isAdmin ? (
          <View style={styles.section}>
            <SectionTitle>Administration</SectionTitle>
            <Card onPress={() => router.push('/admin')} style={styles.adminCard}>
              <View style={styles.adminIcon}>
                <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
              </View>
              <View style={styles.adminContent}>
                <Text style={styles.adminTitle}>Espace administration</Text>
                <Text style={styles.adminSubtitle}>Gérer les utilisateurs, contenus et émotions</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
            </Card>
          </View>
        ) : null}

        {/* Menu compte */}
        <View style={styles.section}>
          <SectionTitle>Compte</SectionTitle>
          <Card padding={0} style={styles.menuCard}>
            <MenuItem icon="person-outline" label="Informations personnelles" />
            <MenuItem icon="lock-closed-outline" label="Changer le mot de passe" />
            <MenuItem icon="shield-checkmark-outline" label="Données personnelles (RGPD)" last />
          </Card>
        </View>

        {/* Menu application */}
        <View style={styles.section}>
          <SectionTitle>Application</SectionTitle>
          <Card padding={0} style={styles.menuCard}>
            <MenuItem icon="information-circle-outline" label="À propos de CESIZen" />
            <MenuItem icon="document-text-outline" label="Conditions d'utilisation" last />
          </Card>
        </View>

        {/* Déconnexion */}
        <Button title="Se déconnecter" variant="danger" icon="log-out-outline" fullWidth onPress={handleLogout} />

        <Text style={styles.version}>CESIZen v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  last?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.menuItem, last && styles.menuItemLast]} accessibilityRole="button">
      <Ionicons name={icon} size={20} color={Colors.gray[600]} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.gray[50] },
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.xl },
  profileCard: { alignItems: 'center', paddingVertical: Spacing.xl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { fontSize: FontSize.display, fontWeight: FontWeight.heavy, color: Colors.white },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.black },
  email: { fontSize: FontSize.sm, color: Colors.gray[500], marginTop: Spacing.xs },
  roleBadge: { marginTop: Spacing.sm },
  section: { gap: Spacing.sm },
  adminCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
  adminIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: '#E3E3FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminContent: { flex: 1 },
  adminTitle: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.black, marginBottom: 2 },
  adminSubtitle: { fontSize: FontSize.xs, color: Colors.gray[500], lineHeight: 18 },
  menuCard: { overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: MIN_TOUCH,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuLabel: { flex: 1, fontSize: FontSize.body, color: Colors.black },
  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.gray[400] },
});
