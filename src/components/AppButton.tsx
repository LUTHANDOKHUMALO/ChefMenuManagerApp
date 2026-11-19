/**
 * One reusable button used everywhere in the app, so every button has the
 * same size and style. Variants:
 * - primary: solid blue, for the main action on a screen
 * - secondary: outlined, for a second choice
 * - text: no background, for small or less important actions
 * - danger: red text, for removing things
 */
import React from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fontSize, radius, spacing, touchTarget } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  accessibilityHint,
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      android_ripple={variant === 'primary' ? { color: 'rgba(255,255,255,0.15)' } : undefined}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, textStyles[variant]]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  text: {
    paddingHorizontal: spacing.sm,
  },
  danger: {
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});

const textStyles = StyleSheet.create({
  primary: { color: colors.white },
  secondary: { color: colors.text },
  text: { color: colors.primary },
  danger: { color: colors.error },
});
