/**
 * Shared types for the Chef's Menu Manager app.
 */

/** The three courses a dish can belong to. */
export type Course = 'Starter' | 'Main Course' | 'Dessert';

/** A single dish on the restaurant menu. */
export interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  course: Course;
  price: number;
}

/** The data the chef types into the form (before it becomes a MenuItem). */
export interface MenuItemFormValues {
  dishName: string;
  description: string;
  course: Course | '';
  price: string;
}

/** Validation error messages, one optional message per form field. */
export type MenuItemFormErrors = Partial<Record<keyof MenuItemFormValues, string>>;

/** The course filter on the Home screen can also be "All". */
export type CourseFilter = Course | 'All';
