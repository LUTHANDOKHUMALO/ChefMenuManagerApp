/**
 * Message shown when there is nothing to display in a list.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fonts, spacing } from '../constants/theme';
import AppButton from './AppButton';

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <AppButton title={actionLabel} onPress={onAction} variant="text" style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl * 1.5,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: fontSize.heading,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 23,
  },
  action: {
    marginTop: spacing.md,
  },
});
