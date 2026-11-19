/**
 * One dish in the menu list, laid out like a line on a printed menu:
 *
 *   Durban Lamb Curry . . . . . . . . . . R165.00
 *   Slow-cooked lamb curry with basmati rice...
 *
 * Tap the row to edit the dish. Long-press for Edit / Delete options.
 */
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, courseColors, fontSize, fonts, spacing } from '../constants/theme';
import type { MenuItem } from '../types/menu';
import { formatPrice } from '../utils/formatters';

type MenuItemRowProps = {
  item: MenuItem;
  /** Show the course name under the dish (used when the list is not grouped). */
  showCourse?: boolean;
  onPress: (item: MenuItem) => void;
  onLongPress: (item: MenuItem) => void;
};

// A long row of dots that gets cut off to fill the gap between name and price.
const DOT_LEADER = ' .'.repeat(80);

function MenuItemRow({ item, showCourse = false, onPress, onLongPress }: MenuItemRowProps) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      delayLongPress={350}
      android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${item.dishName}, ${item.course}, ${formatPrice(item.price)}. ${item.description}`}
      accessibilityHint="Tap to edit. Long-press for more options."
    >
      <View style={styles.titleLine}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Text style={styles.leader} numberOfLines={1} ellipsizeMode="clip">
          {DOT_LEADER}
        </Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      {showCourse && (
        <Text style={[styles.course, { color: courseColors[item.course] }]}>{item.course}</Text>
      )}
    </Pressable>
  );
}

export default memo(MenuItemRow);

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
  },
  pressed: {
    backgroundColor: 'rgba(31, 78, 121, 0.05)',
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  dishName: {
    flexShrink: 1,
    fontFamily: fonts.serif,
    fontSize: fontSize.dish,
    color: colors.text,
  },
  leader: {
    flex: 1,
    minWidth: 16,
    color: colors.borderStrong,
    fontSize: fontSize.small,
    marginHorizontal: spacing.xs,
    marginBottom: 3,
  },
  price: {
    fontFamily: fonts.serif,
    fontSize: fontSize.dish,
    color: colors.text,
  },
  description: {
    fontSize: fontSize.label,
    lineHeight: 20,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginRight: spacing.xxl,
  },
  course: {
    fontSize: fontSize.small,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
