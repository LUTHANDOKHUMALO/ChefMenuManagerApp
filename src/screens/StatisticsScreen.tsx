/**
 * Menu overview (statistics) screen.
 * Gives the chef an overview of the menu:
 * - total number of menu items
 * - average price of all menu items
 * - number of items in each course (with share of the menu and average price)
 * - cheapest and most expensive dish
 * Everything is calculated from the shared menu state, so it is always up to date.
 */
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '../components/EmptyState';
import { colors, courseColors, courseHeadings, fontSize, fonts, spacing } from '../constants/theme';
import { useMenu } from '../context/MenuContext';
import type { StatisticsScreenProps } from '../navigation/types';
import { formatPrice, pluralise } from '../utils/formatters';
import { calculateMenuStatistics } from '../utils/menuHelpers';

export default function StatisticsScreen({ navigation }: StatisticsScreenProps) {
  const { items } = useMenu();
  const stats = useMemo(() => calculateMenuStatistics(items), [items]);

  if (stats.totalItems === 0) {
    return (
      <View style={styles.screen}>
        <EmptyState
          title="Nothing to show yet"
          message="Once there are dishes on the menu, you'll see totals, prices and the course breakdown here."
          actionLabel="Add a dish"
          onAction={() => navigation.replace('MenuItemForm')}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Headline numbers */}
        <View style={styles.headline}>
          <View style={styles.headlineItem}>
            <Text style={styles.bigNumber}>{stats.totalItems}</Text>
            <Text style={styles.caption}>
              {stats.totalItems === 1 ? 'dish on the menu' : 'dishes on the menu'}
            </Text>
          </View>
          <View style={styles.headlineDivider} />
          <View style={styles.headlineItem}>
            <Text style={styles.bigNumber}>{formatPrice(stats.averagePrice)}</Text>
            <Text style={styles.caption}>average price</Text>
          </View>
        </View>

        {/* Per course */}
        <Text style={styles.sectionTitle}>By course</Text>
        {stats.byCourse.map((courseStats) => (
          <View
            key={courseStats.course}
            style={styles.courseRow}
            accessible
            accessibilityLabel={`${courseHeadings[courseStats.course]}: ${pluralise(
              courseStats.count,
              'dish',
              'dishes',
            )}${courseStats.count > 0 ? `, average ${formatPrice(courseStats.averagePrice)}` : ''}`}
          >
            <View style={styles.courseLine}>
              <Text style={styles.courseName}>{courseHeadings[courseStats.course]}</Text>
              <Text style={styles.courseCount}>{courseStats.count}</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${courseStats.percentage}%`,
                    backgroundColor: courseColors[courseStats.course],
                  },
                ]}
              />
            </View>
            <Text style={styles.courseDetail}>
              {courseStats.count === 0
                ? 'No dishes yet'
                : `${Math.round(courseStats.percentage)}% of the menu · average ${formatPrice(
                    courseStats.averagePrice,
                  )}`}
            </Text>
          </View>
        ))}

        {/* Price range */}
        <Text style={styles.sectionTitle}>Price range</Text>
        {stats.cheapestItem && (
          <View style={styles.priceRow}>
            <View style={styles.priceText}>
              <Text style={styles.priceLabel}>Cheapest</Text>
              <Text style={styles.priceDish}>{stats.cheapestItem.dishName}</Text>
            </View>
            <Text style={styles.priceValue}>{formatPrice(stats.cheapestItem.price)}</Text>
          </View>
        )}
        {stats.mostExpensiveItem && (
          <View style={styles.priceRow}>
            <View style={styles.priceText}>
              <Text style={styles.priceLabel}>Most expensive</Text>
              <Text style={styles.priceDish}>{stats.mostExpensiveItem.dishName}</Text>
            </View>
            <Text style={styles.priceValue}>{formatPrice(stats.mostExpensiveItem.price)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  headline: {
    flexDirection: 'row',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headlineItem: {
    flex: 1,
  },
  headlineDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  bigNumber: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.text,
  },
  caption: {
    fontSize: fontSize.label,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: fontSize.heading - 2,
    color: colors.text,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  courseRow: {
    paddingVertical: spacing.md,
  },
  courseLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  courseName: {
    fontSize: fontSize.body,
    color: colors.text,
  },
  courseCount: {
    fontFamily: fonts.serif,
    fontSize: fontSize.dish,
    color: colors.text,
  },
  barTrack: {
    height: 4,
    backgroundColor: colors.border,
  },
  barFill: {
    height: 4,
  },
  courseDetail: {
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginTop: spacing.sm - 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  priceText: {
    flex: 1,
    marginRight: spacing.md,
  },
  priceLabel: {
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  priceDish: {
    fontSize: fontSize.body,
    color: colors.text,
    marginTop: 2,
  },
  priceValue: {
    fontFamily: fonts.serif,
    fontSize: fontSize.dish,
    color: colors.text,
  },
});
