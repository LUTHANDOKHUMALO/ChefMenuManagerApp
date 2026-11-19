/**
 * Validation for the Add / Edit menu item form.
 * Returns a message for every field that is missing or invalid, so the
 * form can show the message in red directly beneath that field.
 */
import { COURSES, LIMITS } from '../constants/courses';
import type { MenuItem, MenuItemFormErrors, MenuItemFormValues } from '../types/menu';

/** Accepts whole numbers or up to two decimal places, e.g. 85, 85.5, 85.50 */
const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Allows "85,50" as well as "85.50" because many South Africans type a comma. */
export function normalisePriceInput(price: string): string {
  return price.trim().replace(',', '.');
}

export function validateMenuItem(
  values: MenuItemFormValues,
  existingItems: MenuItem[],
  editingId?: string,
): MenuItemFormErrors {
  const errors: MenuItemFormErrors = {};
  const dishName = values.dishName.trim();
  const description = values.description.trim();
  const price = normalisePriceInput(values.price);

  // Dish name
  if (!dishName) {
    errors.dishName = 'Please enter a dish name.';
  } else if (dishName.length < LIMITS.dishNameMin) {
    errors.dishName = `Dish name must be at least ${LIMITS.dishNameMin} characters.`;
  } else if (dishName.length > LIMITS.dishNameMax) {
    errors.dishName = `Dish name can be at most ${LIMITS.dishNameMax} characters.`;
  } else {
    const duplicate = existingItems.some(
      (item) =>
        item.id !== editingId && item.dishName.toLowerCase() === dishName.toLowerCase(),
    );
    if (duplicate) {
      errors.dishName = 'A dish with this name is already on the menu.';
    }
  }

  // Description
  if (!description) {
    errors.description = 'Please enter a short description of the dish.';
  } else if (description.length < LIMITS.descriptionMin) {
    errors.description = `Description must be at least ${LIMITS.descriptionMin} characters.`;
  } else if (description.length > LIMITS.descriptionMax) {
    errors.description = `Description can be at most ${LIMITS.descriptionMax} characters.`;
  }

  // Course
  if (!values.course || !COURSES.includes(values.course)) {
    errors.course = 'Please select a course.';
  }

  // Price
  if (!price) {
    errors.price = 'Please enter a price.';
  } else if (!PRICE_PATTERN.test(price)) {
    errors.price = 'Price must be a number, e.g. 85 or 85.50.';
  } else {
    const amount = Number(price);
    if (amount < LIMITS.priceMin) {
      errors.price = 'Price must be greater than R0.';
    } else if (amount > LIMITS.priceMax) {
      errors.price = `Price cannot be more than R${LIMITS.priceMax}.`;
    }
  }

  return errors;
}

export function hasErrors(errors: MenuItemFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
