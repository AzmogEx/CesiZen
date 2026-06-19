import { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/auth-store';
import { getApiError } from '@/lib/api';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/lib/theme';
import { AppBar, Button, Card, TextField } from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      const message = getApiError(err).message || 'Identifiants incorrects';
      setError(message);
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AppBar title="Connexion" subtitle="Accédez à votre espace personnel" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <Text style={styles.welcome}>Bienvenue sur CESIZen</Text>
          <Text style={styles.welcomeSub}>Votre compagnon de santé mentale.</Text>
        </View>

        <Card padding={Spacing.xl} elevated>
          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          <TextField
            label="Email"
            value={email}
            onChangeText={(v) => { setEmail(v); setError(null); }}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            required
          />

          <TextField
            label="Mot de passe"
            value={password}
            onChangeText={(v) => { setPassword(v); setError(null); }}
            placeholder="Votre mot de passe"
            secureTextEntry
            autoComplete="password"
            required
          />

          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={loading}
            icon="log-in-outline"
            fullWidth
          />

          <View style={styles.forgotRow}>
            <Button
              title="Mot de passe oublié ?"
              variant="tertiary"
              size="sm"
              onPress={() => router.push('/auth/forgot-password')}
            />
          </View>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <Button
            title="Créer un compte"
            variant="secondary"
            onPress={() => router.push('/auth/register')}
            icon="person-add-outline"
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  intro: { alignItems: 'center', marginBottom: Spacing.xl },
  welcome: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Colors.black, textAlign: 'center' },
  welcomeSub: { fontSize: FontSize.sm, color: Colors.gray[500], marginTop: Spacing.xs, textAlign: 'center' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorBg,
    borderRadius: Radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorBannerText: { flex: 1, fontSize: FontSize.xs, color: Colors.error, fontWeight: FontWeight.medium },
  forgotRow: { alignItems: 'center', marginTop: Spacing.sm },
  footer: { marginTop: Spacing.xl, alignItems: 'center' },
  footerText: { fontSize: FontSize.sm, color: Colors.gray[500], marginBottom: Spacing.sm },
});
