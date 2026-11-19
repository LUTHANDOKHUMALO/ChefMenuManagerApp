/**
 * Simple tabs for filtering the menu by course: All, Starters, Mains, Desserts.
 * The selected tab is underlined.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COURSE_FILTERS } from '../constants/courses';
import { colors, courseHeadings, fontSize, spacing } from '../constants/theme';
import type { CourseFilter } from '../types/menu';

type CourseFilterBarProps = {
  selected: CourseFilter;
  onSelect: (filter: CourseFilter) => void;
  counts: Record<CourseFilter, number>;
};

export default function CourseFilterBar({ selected, onSelect, counts }: CourseFilterBarProps) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {COURSE_FILTERS.map((filter) => {
        const isSelected = filter === selected;
        const label = filter === 'All' ? 'All' : courseHeadings[filter];
        return (
          <Pressable
            key={filter}
            onPress={() => onSelect(filter)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${label}, ${counts[filter]} dishes`}
            style={styles.tab}
            hitSlop={{ top: 6, bottom: 6 }}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {label}
              <Text style={styles.count}> {counts[filter]}</Text>
            </Text>
            <View style={[styles.underline, isSelected && styles.underlineSelected]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    marginRight: spacing.xl,
    paddingTop: spacing.md,
  },
  label: {
    fontSize: fontSize.body,
    color: colors.textMuted,
    paddingBottom: spacing.sm + 2,
  },
  labelSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  count: {
    fontSize: fontSize.small,
    color: colors.textMuted,
    fontWeight: '400',
  },
  underline: {
    height: 2,
    marginBottom: -1,
    backgroundColor: 'transparent',
  },
  underlineSelected: {
    backgroundColor: colors.primary,
  },
});
