/**
 * Home screen ("Chef's Menu").
 * - Shows the whole menu in a FlatList, grouped under Starters, Mains and Desserts
 * - Search by dish name, filter by course, clear search/filter
 * - Tap a dish to edit it; long-press for Edit / Delete
 * - Short summary with a link to the Menu overview (statistics) screen
 * - "Add menu item" button fixed at the bottom
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import CourseFilterBar from '../components/CourseFilterBar';
import EmptyState from '../components/EmptyState';
import MenuItemRow from '../components/MenuItemRow';
import SearchBar from '../components/SearchBar';
import { COURSES } from '../constants/courses';
import { colors, courseColors, courseHeadings, fontSize, fonts, spacing } from '../constants/theme';
import { useFeedback } from '../context/FeedbackContext';
import { useMenu } from '../context/MenuContext';
import { useDeleteMenuItem } from '../hooks/useDeleteMenuItem';
import type { HomeScreenProps } from '../navigation/types';
import type { Course, CourseFilter, MenuItem } from '../types/menu';
import { formatPrice, pluralise } from '../utils/formatters';
import { calculateAveragePrice, filterMenuItems, sortMenuItems } from '../utils/menuHelpers';

/** The list mixes course headings and dishes, like a printed menu. */
type ListRow =
  | { type: 'heading'; key: string; course: Course }
  | { type: 'dish'; key: string; item: MenuItem };

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { items, isLoading, loadSampleMenu } = useMenu();
  const { showFeedback } = useFeedback();
  const confirmDelete = useDeleteMenuItem();

  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState<CourseFilter>('All');

  const sortedItems = useMemo(() => sortMenuItems(items), [items]);

  const visibleItems = useMemo(
    () => filterMenuItems(sortedItems, searchText, courseFilter),
    [sortedItems, searchText, courseFilter],
  );

  // Add a heading before each course when all courses are shown.
  const rows = useMemo<ListRow[]>(() => {
    const result: ListRow[] = [];
    let currentCourse: Course | null = null;
    for (const item of visibleItems) {
      if (courseFilter === 'All' && item.course !== currentCourse) {
        currentCourse = item.course;
        result.push({ type: 'heading', key: `heading-${item.course}`, course: item.course });
      }
      result.push({ type: 'dish', key: item.id, item });
    }
    return result;
  }, [visibleItems, courseFilter]);

  // Counts on each tab respect the current search text.
  const filterCounts = useMemo(() => {
    const searched = filterMenuItems(sortedItems, searchText, 'All');
    const counts = { All: searched.length } as Record<CourseFilter, number>;
    COURSES.forEach((course) => {
      counts[course] = searched.filter((item) => item.course === course).length;
    });
    return counts;
  }, [sortedItems, searchText]);

  const isFiltering = searchText.trim() !== '' || courseFilter !== 'All';

  const clearSearchAndFilter = useCallback(() => {
    setSearchText('');
    setCourseFilter('All');
    Keyboard.dismiss();
  }, []);

  const openEdit = useCallback(
    (item: MenuItem) => navigation.navigate('MenuItemForm', { itemId: item.id }),
    [navigation],
  );

  const showItemOptions = useCallback(
    (item: MenuItem) => {
      Alert.alert(item.dishName, `${item.course} · ${formatPrice(item.price)}`, [
        { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(item) },
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => openEdit(item) },
      ]);
    },
    [confirmDelete, openEdit],
  );

  const handleLoadSample = useCallback(() => {
    loadSampleMenu();
    showFeedback('Sample menu loaded', 'success');
  }, [loadSampleMenu, showFeedback]);

  const renderRow = useCallback(
    ({ item: row }: { item: ListRow }) => {
      if (row.type === 'heading') {
        return (
          <View style={styles.sectionHeading} accessibilityRole="header">
            <View style={[styles.sectionMarker, { backgroundColor: courseColors[row.course] }]} />
            <Text style={styles.sectionTitle}>{courseHeadings[row.course]}</Text>
          </View>
        );
      }
      return <MenuItemRow item={row.item} onPress={openEdit} onLongPress={showItemOptions} />;
    },
    [openEdit, showItemOptions],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const averagePrice = calculateAveragePrice(items);

  const listHeader = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title} accessibilityRole="header">
          Chef&apos;s Menu
        </Text>
        <Pressable
          onPress={() => navigation.navigate('Statistics')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Open menu overview and statistics"
        >
          <Text style={styles.link}>Overview</Text>
        </Pressable>
      </View>
      <Text style={styles.summary}>
        {items.length === 0
          ? 'No dishes yet'
          : `${pluralise(items.length, 'dish', 'dishes')} · average ${formatPrice(averagePrice)}`}
      </Text>

      {items.length > 0 && (
        <View style={styles.controls}>
          <SearchBar value={searchText} onChangeText={setSearchText} />
          <CourseFilterBar selected={courseFilter} onSelect={setCourseFilter} counts={filterCounts} />
          {isFiltering && visibleItems.length > 0 && (
            <View style={styles.resultsRow}>
              <Text style={styles.resultsText}>
                Showing {visibleItems.length} of {items.length}
              </Text>
              <Pressable
                onPress={clearSearchAndFilter}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Clear search and filter"
              >
                <Text style={styles.link}>Show all</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const emptyComponent =
    items.length === 0 ? (
      <EmptyState
        title="Nothing on the menu yet"
        message="Add your first dish with the button below, or start with a few sample dishes to see how it works."
        actionLabel="Load sample menu"
        onAction={handleLoadSample}
      />
    ) : (
      <EmptyState
        title="No dishes found"
        message={
          searchText.trim()
            ? `Nothing on the menu matches "${searchText.trim()}"${
                courseFilter === 'All' ? '' : ` in ${courseHeadings[courseFilter].toLowerCase()}`
              }.`
            : courseFilter === 'All'
              ? 'There are no dishes on the menu yet.'
              : `There are no ${courseHeadings[courseFilter].toLowerCase()} on the menu yet.`
        }
        actionLabel="Clear search and filter"
        onAction={clearSearchAndFilter}
      />
    );

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom', 'left', 'right']}>
      <FlatList
        data={rows}
        keyExtractor={(row) => row.key}
        renderItem={renderRow}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={emptyComponent}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        style={styles.list}
      />

      {items.length > 0 && !isFiltering && (
        <Text style={styles.tip}>Tap a dish to edit · hold for more options</Text>
      )}

      <View style={styles.footer}>
        <AppButton
          title="+  Add menu item"
          onPress={() => navigation.navigate('MenuItemForm')}
          accessibilityHint="Opens the form to add a new dish"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: fontSize.title,
    color: colors.text,
  },
  link: {
    fontSize: fontSize.label,
    fontWeight: '600',
    color: colors.primary,
  },
  summary: {
    fontSize: fontSize.label,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  controls: {
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resultsText: {
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl + spacing.sm,
    paddingBottom: spacing.xs,
  },
  sectionMarker: {
    width: 14,
    height: 2,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: fontSize.heading - 2,
    color: colors.text,
  },
  tip: {
    textAlign: 'center',
    fontSize: fontSize.small,
    color: colors.textMuted,
    paddingBottom: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
});
