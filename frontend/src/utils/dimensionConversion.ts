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
  // Pattern: optional whole number, then fraction numerator/denominator
  const fractionMatch = trimmed.match(/^(\d+)?\s*(\d+)\s*\/\s*(\d+)$/);
  if (fractionMatch) {
    const whole = fractionMatch[1] ? parseInt(fractionMatch[1], 10) : 0;
    const numerator = parseInt(fractionMatch[2], 10);
    const denominator = parseInt(fractionMatch[3], 10);

    if (denominator === 0) return NaN;

    const fractionValue = numerator / denominator;
    // Validate it's a reasonable fraction (0 < fraction < 1)
    if (fractionValue <= 0 || fractionValue >= 1) return NaN;

    const total = whole + fractionValue;
    return total > 0 ? total : NaN;
  }

  return NaN;
}

/**
 * Strict catalogue-based size selection.
 * Given actual height and width in inches (decimals allowed),
 * finds the catalogue entry where:
 *   - catalogue_height >= actual_height
 *   - catalogue_width >= actual_width
 * Selects the one with smallest height first, then smallest width.
 * Returns null if no valid candidate exists.
 */
export function findCatalogueSize(
  actualHeightInches: number,
  actualWidthInches: number
): { height: number; width: number } | null {
  const candidates: { height: number; width: number }[] = [];

  for (const entry of CATALOGUE) {
    if (entry.height >= actualHeightInches) {
      for (const w of entry.widths) {
        if (w >= actualWidthInches) {
          candidates.push({ height: entry.height, width: w });
        }
      }
    }
  }

  if (candidates.length === 0) return null;

  // Sort by height first, then width — pick the smallest valid combination
  candidates.sort((a, b) => a.height !== b.height ? a.height - b.height : a.width - b.width);
  return candidates[0];
}

/** Get the catalogue size for a given DoorDimension pair */
export function getCatalogueSize(
  heightDim: DoorDimension,
  widthDim: DoorDimension
): { height: number; width: number } | null {
  const actualH = dimensionToInches(heightDim);
  const actualW = dimensionToInches(widthDim);
  return findCatalogueSize(actualH, actualW);
}

/** Calculate square feet from catalogue dimensions */
export function calcSquareFeet(catalogueHeightInches: number, catalogueWidthInches: number): number {
  return (catalogueWidthInches * catalogueHeightInches) / 144;
}

/** Format total inches as a simple inches string, e.g. 72 → 72" */
export function inchesToString(totalInches: number): string {
  return `${totalInches}"`;
}

/** Format total inches as feet and inches string, e.g. 72 → 6'0" */
export function inchesToFeetString(totalInches: number): string {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
}

/** Format a DoorDimension as total inches with optional fraction */
export function formatDimensionInches(dim: DoorDimension): string {
  const total = dimensionToInches(dim);
  // Display as decimal if fractional, else as integer
  if (dim.fraction > 0) {
    return `${total.toFixed(3).replace(/\.?0+$/, '')}"`;
  }
  return `${dim.feet * 12 + dim.inches}"`;
}

/** Format actual size as W" × H" */
export function formatActualSize(heightDim: DoorDimension, widthDim: DoorDimension): string {
  return `${formatDimensionInches(widthDim)} × ${formatDimensionInches(heightDim)}`;
}

/** Format catalogue size as W" × H" */
export function formatCatalogueSize(heightInches: number, widthInches: number): string {
  return `${widthInches}" × ${heightInches}"`;
}

/** Legacy: round up to nearest standard from a sorted list */
export function roundUpToStandard(totalInches: number, standards: number[]): number {
  for (const s of standards) {
    if (totalInches <= s) return s;
  }
  return standards[standards.length - 1];
}

/** Legacy: format a DoorDimension as a readable string */
export function formatDimension(dim: DoorDimension): string {
  if (dim.fraction > 0) {
    return `${dim.feet}'${dim.inches} ${dim.fraction}/8"`;
  }
  return `${dim.feet}'${dim.inches}"`;
}
