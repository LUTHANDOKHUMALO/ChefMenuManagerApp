/**
 * Central theme for the app. Every screen and component takes its colours,
 * spacing and fonts from here, so the look and feel stays consistent.
 *
 * The style is based on a printed restaurant menu: warm paper background,
 * deep blue ink (the calm blue from the Part 1 design) and a serif font for
 * dish names and headings.
 */
import { Platform } from 'react-native';

import type { Course } from '../types/menu';

export const colors = {
  primary: '#1F4E79',
  primaryDark: '#163A5C',
  primaryLight: '#E9EEF4',
  background: '#FAF8F4',
  surface: '#FFFFFF',
  text: '#1C2430',
  textMuted: '#6F6A63',
  border: '#E4DED4',
  borderStrong: '#CFC7BA',
  error: '#B3261E',
  errorLight: '#FBEDEB',
  success: '#2F6B3B',
  snackbar: '#22262B',
  white: '#FFFFFF',
};

/** A muted colour for each course, used for small markers only. */
export const courseColors: Record<Course, string> = {
  Starter: '#5B7F5A',
  'Main Course': '#1F4E79',
  Dessert: '#8A4B6B',
};

/** Plural headings used for menu sections and filter tabs. */
export const courseHeadings: Record<Course, string> = {
  Starter: 'Starters',
  'Main Course': 'Mains',
  Dessert: 'Desserts',
};

export const fonts = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const fontSize = {
  small: 13,
  label: 14,
  body: 16,
  dish: 18,
  heading: 22,
  title: 32,
};

export const radius = {
  sm: 6,
  md: 10,
};

/** Minimum height for anything the chef taps (large touch targets). */
export const touchTarget = 48;
