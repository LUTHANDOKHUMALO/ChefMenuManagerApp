/**
 * Reusable labelled form field. Shows the label above the input and an
 * inline red error message beneath it when the value is invalid.
 * The input itself is passed in as children (TextInput, Picker, ...).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, spacing } from '../constants/theme';

type FormFieldProps = {
  label: string;
  error?: string;
  /** Small grey text on the right of the label, e.g. a character count. */
  hint?: string;
  children: React.ReactNode;
};

export default function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {children}
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.label,
    fontWeight: '600',
    color: colors.text,
  },
  hint: {
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  error: {
    color: colors.error,
    fontSize: fontSize.small,
    marginTop: spacing.sm - 2,
  },
});
