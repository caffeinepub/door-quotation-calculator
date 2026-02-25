import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { parseFractionInput, findCatalogueSize } from '../utils/dimensionConversion';

interface DimensionInputProps {
  label: string;
  heightInches: number;
  widthInches: number;
  onHeightChange: (inches: number) => void;
  onWidthChange: (inches: number) => void;
}

export default function DimensionInput({
  label,
  heightInches,
  widthInches,
  onHeightChange,
  onWidthChange,
}: DimensionInputProps) {
  // Local string state so user can type freely (including fractions)
  const [heightStr, setHeightStr] = useState(heightInches > 0 ? String(heightInches) : '');
  const [widthStr, setWidthStr] = useState(widthInches > 0 ? String(widthInches) : '');

  // Sync if parent resets values (e.g. after form submit)
  useEffect(() => {
    setHeightStr(heightInches > 0 ? String(heightInches) : '');
  }, [heightInches]);

  useEffect(() => {
    setWidthStr(widthInches > 0 ? String(widthInches) : '');
  }, [widthInches]);

  const parsedH = parseFractionInput(heightStr);
  const parsedW = parseFractionInput(widthStr);
  const validH = !isNaN(parsedH) && parsedH > 0;
  const validW = !isNaN(parsedW) && parsedW > 0;

  const catalogueSize =
    validH && validW ? findCatalogueSize(parsedH, parsedW) : null;

  const heightEntered = heightStr.trim() !== '';
  const widthEntered = widthStr.trim() !== '';
  const bothEntered = heightEntered && widthEntered;

  return (
    <div className="space-y-5">
      {label && <p className="text-sm font-semibold text-foreground sr-only">{label}</p>}

      {/* Height Input */}
      <div className="space-y-1.5">
        <Label htmlFor="dim-height" className="text-sm font-semibold text-foreground">
          Door Height (inches)
        </Label>
        <Input
          id="dim-height"
          type="text"
          inputMode="decimal"
          placeholder="79 1/4 or 79.25"
          value={heightStr}
          onChange={(e) => {
            const raw = e.target.value;
            setHeightStr(raw);
            const v = parseFractionInput(raw);
            if (!isNaN(v) && v > 0) onHeightChange(v);
          }}
          className={`min-h-[52px] text-base w-full ${
            heightEntered && !validH
              ? 'border-destructive focus-visible:ring-destructive'
              : ''
          }`}
        />
        <p className="text-xs text-muted-foreground">
          Enter as decimal (79.25) or fraction (79 1/4, 79 3/8)
        </p>
        {heightEntered && !validH && (
          <p className="text-xs text-destructive font-medium">Invalid height — use format like 79.25 or 79 1/4</p>
        )}
      </div>

      {/* Width Input */}
      <div className="space-y-1.5">
        <Label htmlFor="dim-width" className="text-sm font-semibold text-foreground">
          Door Width (inches)
        </Label>
        <Input
          id="dim-width"
          type="text"
          inputMode="decimal"
          placeholder="30 1/4 or 30.25"
          value={widthStr}
          onChange={(e) => {
            const raw = e.target.value;
            setWidthStr(raw);
            const v = parseFractionInput(raw);
            if (!isNaN(v) && v > 0) onWidthChange(v);
          }}
          className={`min-h-[52px] text-base w-full ${
            widthEntered && !validW
              ? 'border-destructive focus-visible:ring-destructive'
              : ''
          }`}
        />
        <p className="text-xs text-muted-foreground">
          Enter as decimal (30.25) or fraction (30 1/4, 30 3/8)
        </p>
        {widthEntered && !validW && (
          <p className="text-xs text-destructive font-medium">Invalid width — use format like 30.25 or 30 1/4</p>
        )}
      </div>

      {/* Catalogue size indicator */}
      {bothEntered && validH && validW && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">
            Actual: {widthStr}" × {heightStr}"
          </span>
          <span className="text-xs text-muted-foreground">→</span>
          {catalogueSize ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber/20 text-amber-dark border border-amber/40">
              Catalogue: {catalogueSize.width}" × {catalogueSize.height}"
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/30">
              Out of catalogue range
            </span>
          )}
        </div>
      )}
    </div>
  );
}
