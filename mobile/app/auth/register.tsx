import { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/auth-store';
import { getApiError } from '@/lib/api';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, IconSize, LineHeight, MIN_TOUCH, Radius, Spacing } from '@/lib/theme';
import { AppBar, Button, Card, TextField } from '@/components/ui';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [consentement, setConsentement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!nom.trim()) e.nom = 'Le nom est obligatoire';
    if (!prenom.trim()) e.prenom = 'Le prénom est obligatoire';
    if (!email.trim()) e.email = 'L\'email est obligatoire';
    else if (!EMAIL_REGEX.test(email)) e.email = 'Format d\'email invalide';
    if (!password) e.password = 'Le mot de passe est obligatoire';
    else if (password.length < 8) e.password = 'Le mot de passe doit faire au moins 8 caractères';
    if (password !== passwordConfirmation) e.passwordConfirmation = 'Les mots de passe ne correspondent pas';
    if (!consentement) e.consentement = 'Vous devez accepter le traitement de vos données (RGPD)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        nom, prenom, email, password,
        password_confirmation: passwordConfirmation,
        consentement_rgpd: consentement,
      });
      router.replace('/(tabs)');
    } catch (error) {
      const data = getApiError(error);
      const msg = data.message || 'Erreur lors de l\'inscription';
      const apiErrors = data.errors;
      if (apiErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] as string : String(v); });
        setErrors(mapped);
      }
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  const consentError = errors.consentement || errors.consentement_rgpd;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AppBar title="Inscription" subtitle="Créez votre compte CESIZen" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Card padding={Spacing.xl} elevated>
          <View style={styles.nameRow}>
            <TextField
              label="Nom"
              value={nom}
              onChangeText={setNom}
              placeholder="Dupont"
              autoCapitalize="words"
              error={errors.nom}
              required
              style={styles.nameField}
            />
            <TextField
              label="Prénom"
              value={prenom}
              onChangeText={setPrenom}
              placeholder="Jean"
              autoCapitalize="words"
              error={errors.prenom}
              required
              style={styles.nameField}
            />
          </View>

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            required
          />

          <TextField
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="Mot de passe"
            secureTextEntry
            error={errors.password}
            helper="Au moins 8 caractères"
            required
          />

          <TextField
            label="Confirmer le mot de passe"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            placeholder="Confirmer"
            secureTextEntry
            error={errors.passwordConfirmation}
            required
          />

          <Pressable
            style={styles.consentRow}
            onPress={() => setConsentement(!consentement)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: consentement }}
          >
            <Ionicons
              name={consentement ? 'checkbox' : 'square-outline'}
              size={IconSize.lg}
              color={consentement ? Colors.primary : Colors.gray[500]}
              style={styles.consentIcon}
            />
            <Text style={styles.consentText}>
              J'accepte le traitement de mes données de bien-être conformément à la{' '}
              <Text style={styles.consentLink}>politique de confidentialité</Text> (RGPD).
            </Text>
          </Pressable>
          {consentError ? (
            <View style={styles.consentErrorRow}>
              <Ionicons name="alert-circle" size={IconSize.sm} color={Colors.error} />
              <Text style={styles.consentErrorText}>{consentError}</Text>
            </View>
          ) : null}

          <View style={styles.submit}>
            <Button
              title="Créer mon compte"
              onPress={handleRegister}
              loading={loading}
              icon="person-add-outline"
              fullWidth
            />
          </View>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <Button
            title="Se connecter"
            variant="tertiary"
            size="sm"
            onPress={() => router.push('/auth/login')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  nameField: { flexGrow: 1, flexBasis: 130 },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    minHeight: MIN_TOUCH,
  },
  consentIcon: { marginTop: Spacing.xs / 4 },
  consentText: { flex: 1, fontSize: FontSize.xs, color: Colors.black, lineHeight: LineHeight.snug },
  consentLink: { color: Colors.primary, fontWeight: FontWeight.semibold, textDecorationLine: 'underline' },
  consentErrorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs },
  consentErrorText: { fontSize: FontSize.xs, color: Colors.error },
  submit: { marginTop: Spacing.lg },
  footer: { marginTop: Spacing.xl, alignItems: 'center' },
  footerText: { fontSize: FontSize.sm, color: Colors.gray[500] },
});
