/**
 * Search box for finding a dish by name, with a "Clear" button.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fontSize, radius, spacing, touchTarget } from '../constants/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search by dish name'}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Search dishes by name"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingLeft: spacing.md + 2,
    minHeight: touchTarget,
  },
  input: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    paddingHorizontal: spacing.md + 2,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  clearText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: fontSize.label,
  },
});
