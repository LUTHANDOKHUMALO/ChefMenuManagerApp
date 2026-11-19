/**
 * Pure helper functions for searching, filtering, sorting and summarising
 * menu items. Keeping them here (instead of inside screens) avoids repeated
 * code and makes the logic easy to test.
 */
import { COURSES } from '../constants/courses';
import type { Course, CourseFilter, MenuItem } from '../types/menu';

/** Search by dish name (case-insensitive) and filter by course. */
export function filterMenuItems(
  items: MenuItem[],
  searchText: string,
  courseFilter: CourseFilter,
): MenuItem[] {
  const query = searchText.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCourse = courseFilter === 'All' || item.course === courseFilter;
    const matchesSearch = query === '' || item.dishName.toLowerCase().includes(query);
    return matchesCourse && matchesSearch;
  });
}

/** Sorts by course order (Starter, Main, Dessert) and then by dish name. */
export function sortMenuItems(items: MenuItem[]): MenuItem[] {
  return [...items].sort((a, b) => {
    const courseDifference = COURSES.indexOf(a.course) - COURSES.indexOf(b.course);
    return courseDifference !== 0 ? courseDifference : a.dishName.localeCompare(b.dishName);
  });
}

export function calculateAveragePrice(items: MenuItem[]): number {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total / items.length;
}

export interface CourseStatistics {
  course: Course;
  count: number;
  averagePrice: number;
  percentage: number;
}

export interface MenuStatistics {
  totalItems: number;
  averagePrice: number;
  byCourse: CourseStatistics[];
  cheapestItem: MenuItem | null;
  mostExpensiveItem: MenuItem | null;
}

/** Builds every statistic shown on the Statistics screen. */
export function calculateMenuStatistics(items: MenuItem[]): MenuStatistics {
  const byCourse = COURSES.map((course) => {
    const courseItems = items.filter((item) => item.course === course);
    return {
      course,
      count: courseItems.length,
      averagePrice: calculateAveragePrice(courseItems),
      percentage: items.length === 0 ? 0 : (courseItems.length / items.length) * 100,
    };
  });

  let cheapestItem: MenuItem | null = null;
  let mostExpensiveItem: MenuItem | null = null;
  for (const item of items) {
    if (!cheapestItem || item.price < cheapestItem.price) cheapestItem = item;
    if (!mostExpensiveItem || item.price > mostExpensiveItem.price) mostExpensiveItem = item;
  }

  return {
    totalItems: items.length,
    averagePrice: calculateAveragePrice(items),
    byCourse,
    cheapestItem,
    mostExpensiveItem,
  };
}
