import { useState } from 'react';
import {
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
import { FontSize, FontWeight, Radius, Spacing } from '@/lib/theme';

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
  const borderColor = error ? Colors.error : focused ? Colors.primary : Colors.gray[600];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray[400]}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        style={[
          styles.input,
          { borderBottomColor: borderColor },
          multiline && styles.multiline,
          !editable && styles.readonly,
        ]}
      />
      {error ? (
        <View style={styles.messageRow}>
          <Ionicons name="alert-circle" size={14} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
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
  input: {
    backgroundColor: Colors.gray[50],
    borderTopLeftRadius: Radius.sm,
    borderTopRightRadius: Radius.sm,
    borderBottomWidth: 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.body,
    color: Colors.black,
    minHeight: 44,
  },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  readonly: { color: Colors.gray[500], backgroundColor: Colors.gray[100] },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs },
  errorText: { fontSize: FontSize.xs, color: Colors.error },
  helperText: { fontSize: FontSize.xs, color: Colors.gray[500], marginTop: Spacing.xs },
});
