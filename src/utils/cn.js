/**
 * Utility to combine class names, filtering out falsy values.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Converts a size value (number or string) to a CSS-compatible string.
 * Numbers are treated as pixels.
 */
export function toCssSize(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return value;
}
