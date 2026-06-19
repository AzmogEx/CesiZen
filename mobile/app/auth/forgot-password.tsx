import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, ICON_CIRCLE, IconSize, LineHeight, Radius, Spacing, Tint } from '@/lib/theme';
import { AppBar, Button, Card, TextField } from '@/components/ui';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (!email.trim()) {
      setError('Veuillez renseigner votre adresse email.');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError('Format d\'email invalide.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <AppBar title="Demande enregistrée" />
        <View style={styles.successWrap}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-open" size={IconSize.xl} color={Colors.primary} />
          </View>
          <Text style={styles.successTitle}>Vérifiez votre boîte mail</Text>
          <Text style={styles.successText}>
            Si l'adresse <Text style={styles.bold}>{email}</Text> est associée à un compte CESIZen,
            un email contenant les instructions de réinitialisation sera envoyé.
          </Text>
          <Text style={styles.successText}>
            Si vous ne recevez rien sous 24h, contactez votre administrateur.
          </Text>
          <View style={styles.successAction}>
            <Button
              title="Retour à la connexion"
              icon="arrow-back-outline"
              onPress={() => router.replace('/auth/login')}
              fullWidth
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AppBar title="Mot de passe oublié" subtitle="Réinitialisez votre accès" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>
          Entrez votre adresse email. Si elle est associée à un compte, vous recevrez les
          instructions pour réinitialiser votre mot de passe.
        </Text>

        <Card padding={Spacing.xl} elevated>
          <TextField
            label="Email"
            value={email}
            onChangeText={(v) => { setEmail(v); setError(null); }}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={error ?? undefined}
            required
          />

          <Button
            title="Envoyer les instructions"
            onPress={handleSubmit}
            icon="paper-plane-outline"
            fullWidth
          />

          <View style={styles.backRow}>
            <Button
              title="Retour à la connexion"
              variant="tertiary"
              size="sm"
              onPress={() => router.replace('/auth/login')}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  intro: { fontSize: FontSize.sm, color: Colors.gray[600], lineHeight: LineHeight.normal, marginBottom: Spacing.xl, textAlign: 'center' },
  backRow: { alignItems: 'center', marginTop: Spacing.sm },
  successWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  iconCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: Radius.pill,
    backgroundColor: Tint.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy, color: Colors.black, marginBottom: Spacing.md, textAlign: 'center' },
  successText: { fontSize: FontSize.sm, color: Colors.gray[600], textAlign: 'center', lineHeight: LineHeight.normal, marginBottom: Spacing.md },
  bold: { fontWeight: FontWeight.bold, color: Colors.black },
  successAction: { alignSelf: 'stretch', marginTop: Spacing.lg },
});
