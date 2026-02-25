import { CoatingType } from '../backend';

export interface DoorDimension {
  feet: number;
  inches: number;
  fraction: number; // numerator of x/8
}

export interface DoorEntry {
  id: string;
  actualHeightInches: number;
  actualWidthInches: number;
  catalogueHeight: number;
  catalogueWidth: number;
  thickness: number; // always 30
  quantity: number;
}

export const COATING_LABELS: Record<CoatingType, string> = {
  [CoatingType.single]: 'Single Coating',
  [CoatingType.double_]: 'Double Coating',
  [CoatingType.doubleSagwanpatti]: 'Double Coating Sagwan Patti',
  [CoatingType.laminate]: 'Laminate',
};

export const COATING_OPTIONS = [
  { value: CoatingType.single, label: 'Single Coating' },
  { value: CoatingType.double_, label: 'Double Coating' },
  { value: CoatingType.doubleSagwanpatti, label: 'Double Coating Sagwan Patti' },
  { value: CoatingType.laminate, label: 'Laminate' },
];

// Fixed coating rates in ₹/sq.ft (hard-coded per spec)
export const COATING_RATES: Record<CoatingType, number> = {
  [CoatingType.single]: 185,
  [CoatingType.double_]: 220,
  [CoatingType.doubleSagwanpatti]: 270,
  [CoatingType.laminate]: 450,
};

// Strict catalogue: HEIGHT → available WIDTHS (all in inches)
export const CATALOGUE: { height: number; widths: number[] }[] = [
  { height: 72, widths: [30, 32, 34, 36] },
  { height: 75, widths: [30, 32, 34, 36] },
  { height: 78, widths: [30, 32, 34, 36, 38] },
  { height: 80, widths: [30, 32, 34, 36, 38, 40, 42] },
  { height: 84, widths: [30, 32, 34, 36, 38, 40, 42] },
];

// Flat list of all standard heights
export const STANDARD_HEIGHTS_INCHES = CATALOGUE.map(c => c.height);

// All unique standard widths across catalogue
export const STANDARD_WIDTHS_INCHES = [30, 32, 34, 36, 38, 40, 42];

// Fixed thickness
export const STANDARD_THICKNESS_MM = 30;
