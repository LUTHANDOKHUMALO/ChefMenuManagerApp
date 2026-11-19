import type { Course, CourseFilter } from '../types/menu';

/** The fixed list of courses (used by the Picker, filters and statistics). */
export const COURSES: Course[] = ['Starter', 'Main Course', 'Dessert'];

/** Options for the filter bar on the Home screen. */
export const COURSE_FILTERS: CourseFilter[] = ['All', ...COURSES];

/** Validation limits, kept in one place so they are easy to change. */
export const LIMITS = {
  dishNameMin: 2,
  dishNameMax: 50,
  descriptionMin: 5,
  descriptionMax: 200,
  priceMin: 0.01,
  priceMax: 10000,
};
