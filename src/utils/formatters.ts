/**
 * Reusable formatting helpers.
 */

/** Formats a number as South African Rand, e.g. 125.5 -> "R125.50". */
export function formatPrice(price: number): string {
  return `R${price.toFixed(2)}`;
}

/** Returns "1 item" or "3 items" etc. */
export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Creates a simple unique id for a new menu item. */
export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
