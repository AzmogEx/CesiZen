import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, HIT_SLOP, IconSize, MIN_TOUCH, Radius, Spacing } from '@/lib/theme';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Champ de saisie DSFR : libellé au-dessus, fond gris clair, bordure basse
 * accentuée (bleu au focus, rouge en erreur), message d'erreur sous le champ.
 */
export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  required = false,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
  multiline = false,
  numberOfLines,
  editable = true,
  style,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const borderColor = error ? Colors.error : focused ? Colors.primary : Colors.gray[600];
  const isSecure = secureTextEntry && !revealed;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray[400]}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          accessibilityLabel={label}
          accessibilityState={{ disabled: !editable }}
          style={[
            styles.input,
            { borderBottomColor: borderColor },
            secureTextEntry && styles.inputWithIcon,
            multiline && styles.multiline,
            !editable && styles.readonly,
          ]}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setRevealed((r) => !r)}
            hitSlop={HIT_SLOP}
            style={styles.toggle}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            <Ionicons
              name={revealed ? 'eye-off-outline' : 'eye-outline'}
              size={IconSize.lg}
              color={Colors.gray[500]}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.messageRow}>
          <Ionicons name="alert-circle" size={IconSize.sm} color={Colors.error} />
          <Text style={styles.errorText} accessibilityLiveRegion="polite">
            {error}
          </Text>
        </View>
      ) : helper ? (
        <Text style={styles.helperText}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  required: { color: Colors.error },
  inputRow: { position: 'relative', justifyContent: 'center' },
  input: {
    backgroundColor: Colors.gray[50],
    borderTopLeftRadius: Radius.sm,
    borderTopRightRadius: Radius.sm,
    borderBottomWidth: 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.body,
    color: Colors.black,
    minHeight: MIN_TOUCH,
  },
  inputWithIcon: { paddingRight: Spacing.xxl + Spacing.md },
  toggle: {
    position: 'absolute',
    right: Spacing.md,
    height: MIN_TOUCH,
    justifyContent: 'center',
  },
  multiline: { minHeight: MIN_TOUCH * 2.5, textAlignVertical: 'top' },
  readonly: { color: Colors.gray[500], backgroundColor: Colors.gray[100] },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs },
  errorText: { fontSize: FontSize.xs, color: Colors.error },
  helperText: { fontSize: FontSize.xs, color: Colors.gray[500], marginTop: Spacing.xs },
});
