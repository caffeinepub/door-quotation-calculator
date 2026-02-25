import { type DoorDimension, CATALOGUE } from '../types/door';

/** Convert a DoorDimension to total inches (as a decimal) */
export function dimensionToInches(dim: DoorDimension): number {
  return dim.feet * 12 + dim.inches + dim.fraction / 8;
}

/**
 * Parse a string input that may be a decimal ("79.25") or a fraction ("79 1/4", "79 3/8").
 * Supports 1/8-inch increments: 1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8.
 * Returns NaN for invalid or unparseable input.
 */
export function parseFractionInput(input: string): number {
  const trimmed = input.trim();
  if (trimmed === '') return NaN;

  // Try plain decimal first (e.g. "79.25" or "79")
  const decimalMatch = trimmed.match(/^(\d+(?:\.\d+)?)$/);
  if (decimalMatch) {
    const val = parseFloat(decimalMatch[1]);
    return isNaN(val) || val <= 0 ? NaN : val;
  }

  // Try fraction format: "79 1/4", "79 3/8", "1/4", "3/8", etc.
  const fractionMatch = trimmed.match(/^(\d+)?\s*(\d+)\s*\/\s*(\d+)$/);
  if (fractionMatch) {
    const whole = fractionMatch[1] ? parseInt(fractionMatch[1], 10) : 0;
    const numerator = parseInt(fractionMatch[2], 10);
    const denominator = parseInt(fractionMatch[3], 10);

    if (denominator === 0) return NaN;

    const val = whole + numerator / denominator;
    return val > 0 ? val : NaN;
  }

  return NaN;
}

/**
 * Format a decimal inches value as a fraction string (e.g. 75.625 → "75 5/8").
 * Rounds to nearest 1/8 inch. Returns whole number string if no fraction part.
 */
export function formatInchesAsFraction(inches: number): string {
  const whole = Math.floor(inches);
  const remainder = inches - whole;

  // Round to nearest 1/8
  const eighths = Math.round(remainder * 8);

  if (eighths === 0) return `${whole}`;
  if (eighths === 8) return `${whole + 1}`;

  // Simplify the fraction
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(eighths, 8);
  const num = eighths / g;
  const den = 8 / g;

  return `${whole} ${num}/${den}`;
}

/**
 * Format actual door dimensions (height × width) as a display string.
 * e.g. actualHeightInches=75.625, actualWidthInches=28.625 → '75 5/8 × 28 5/8"'
 */
export function formatActualSize(actualHeightInches: number, actualWidthInches: number): string {
  const h = formatInchesAsFraction(actualHeightInches);
  const w = formatInchesAsFraction(actualWidthInches);
  return `${h} × ${w}"`;
}

/**
 * Find the nearest catalogue size for given actual dimensions using round-UP logic.
 *
 * Algorithm:
 * 1. Sort catalogue entries by height ascending.
 * 2. For each entry whose height >= actualHeightInches (starting from smallest):
 *    a. Find the smallest width in that entry >= actualWidthInches.
 *    b. If found, return {height, width} — this is the closest round-up match.
 * 3. If no entry satisfies both constraints, return null (truly out of range).
 *
 * This ensures width=37, height=72 resolves to height=78, width=38 instead of
 * showing "Out of catalogue range".
 *
 * Returns an object with the matched catalogue dimensions and a `wasRounded` flag.
 */
export function findCatalogueSize(
  actualHeightInches: number,
  actualWidthInches: number
): { height: number; width: number; wasRounded: boolean } | null {
  // Sort catalogue entries by height ascending
  const sortedEntries = [...CATALOGUE].sort((a, b) => a.height - b.height);

  for (const entry of sortedEntries) {
    // Skip entries whose height is less than the actual height
    if (entry.height < actualHeightInches) continue;

    // Find the smallest width in this entry that is >= actualWidthInches
    const sortedWidths = [...entry.widths].sort((a, b) => a - b);
    const matchedWidth = sortedWidths.find(w => w >= actualWidthInches) ?? null;

    if (matchedWidth !== null) {
      const wasRounded =
        entry.height !== actualHeightInches || matchedWidth !== actualWidthInches;
      return { height: entry.height, width: matchedWidth, wasRounded };
    }
    // If this height entry has no wide-enough width, continue to next (taller) entry
    // which may have wider widths available
  }

  // No catalogue entry can accommodate these dimensions
  return null;
}

/**
 * Calculate square feet from catalogue dimensions (in inches).
 */
export function calcSquareFeet(heightInches: number, widthInches: number): number {
  return (heightInches * widthInches) / 144;
}
