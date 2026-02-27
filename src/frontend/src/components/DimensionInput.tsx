import { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { parseFractionInput, findCatalogueSize } from '../utils/dimensionConversion';
import CustomKeyboard from './CustomKeyboard';

interface DimensionInputProps {
  label: string;
  heightInches: number;
  widthInches: number;
  heightStr: string;
  widthStr: string;
  onHeightChange: (inches: number) => void;
  onWidthChange: (inches: number) => void;
  onHeightStrChange: (s: string) => void;
  onWidthStrChange: (s: string) => void;
}

type ActiveField = 'height' | 'width' | null;

export default function DimensionInput({
  label,
  heightInches,
  widthInches,
  heightStr,
  widthStr,
  onHeightChange,
  onWidthChange,
  onHeightStrChange,
  onWidthStrChange,
}: DimensionInputProps) {
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedH = parseFractionInput(heightStr);
  const parsedW = parseFractionInput(widthStr);
  const validH = !isNaN(parsedH) && parsedH > 0;
  const validW = !isNaN(parsedW) && parsedW > 0;

  const catalogueSize =
    validH && validW ? findCatalogueSize(parsedH, parsedW) : null;

  const heightEntered = heightStr.trim() !== '';
  const widthEntered = widthStr.trim() !== '';
  const bothEntered = heightEntered && widthEntered;

  // Suppress unused warnings
  void heightInches;
  void widthInches;

  // Close keyboard when clicking outside the component
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // Check if click is on the keyboard itself (fixed overlay)
        const target = e.target as HTMLElement;
        if (!target.closest('[data-custom-keyboard]')) {
          setActiveField(null);
        }
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleKeyPress = (key: string) => {
    if (activeField === 'height') {
      const newVal = heightStr + key;
      onHeightStrChange(newVal);
      const v = parseFractionInput(newVal);
      onHeightChange(!isNaN(v) && v > 0 ? v : 0);
    } else if (activeField === 'width') {
      const newVal = widthStr + key;
      onWidthStrChange(newVal);
      const v = parseFractionInput(newVal);
      onWidthChange(!isNaN(v) && v > 0 ? v : 0);
    }
  };

  const handleBackspace = () => {
    if (activeField === 'height') {
      const newVal = heightStr.slice(0, -1);
      onHeightStrChange(newVal);
      const v = parseFractionInput(newVal);
      onHeightChange(!isNaN(v) && v > 0 ? v : 0);
    } else if (activeField === 'width') {
      const newVal = widthStr.slice(0, -1);
      onWidthStrChange(newVal);
      const v = parseFractionInput(newVal);
      onWidthChange(!isNaN(v) && v > 0 ? v : 0);
    }
  };

  const handleDone = () => {
    setActiveField(null);
  };

  return (
    <>
      <div ref={containerRef} className="space-y-5">
        {label && <p className="text-sm font-semibold text-foreground sr-only">{label}</p>}

        {/* Height Input */}
        <div className="space-y-1.5">
          <Label htmlFor="dim-height" className="text-sm font-semibold text-foreground">
            Door Height (inches)
          </Label>
          <div
            id="dim-height"
            role="textbox"
            aria-label="Door Height"
            tabIndex={0}
            onClick={() => setActiveField('height')}
            onFocus={() => setActiveField('height')}
            className={`min-h-[52px] text-base w-full bg-blue-50 border rounded-md px-3 py-3 cursor-text flex items-center select-none outline-none transition-colors
              ${activeField === 'height'
                ? 'border-blue-500 ring-2 ring-blue-300'
                : heightEntered && !validH
                  ? 'border-destructive ring-1 ring-destructive/40'
                  : 'border-blue-200 focus:border-blue-400'
              }`}
          >
            {heightStr ? (
              <span className="text-foreground">{heightStr}</span>
            ) : (
              <span className="text-muted-foreground/60">79 1/4 or 79.25</span>
            )}
            {activeField === 'height' && (
              <span className="ml-0.5 inline-block w-0.5 h-5 bg-blue-600 animate-pulse" />
            )}
          </div>
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
          <div
            id="dim-width"
            role="textbox"
            aria-label="Door Width"
            tabIndex={0}
            onClick={() => setActiveField('width')}
            onFocus={() => setActiveField('width')}
            className={`min-h-[52px] text-base w-full bg-blue-50 border rounded-md px-3 py-3 cursor-text flex items-center select-none outline-none transition-colors
              ${activeField === 'width'
                ? 'border-blue-500 ring-2 ring-blue-300'
                : widthEntered && !validW
                  ? 'border-destructive ring-1 ring-destructive/40'
                  : 'border-blue-200 focus:border-blue-400'
              }`}
          >
            {widthStr ? (
              <span className="text-foreground">{widthStr}</span>
            ) : (
              <span className="text-muted-foreground/60">30 1/4 or 30.25</span>
            )}
            {activeField === 'width' && (
              <span className="ml-0.5 inline-block w-0.5 h-5 bg-blue-600 animate-pulse" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Enter as decimal (30.25) or fraction (30 1/4, 30 3/8)
          </p>
          {widthEntered && !validW && (
            <p className="text-xs text-destructive font-medium">Invalid width — use format like 30.25 or 30 1/4</p>
          )}
        </div>

        {/* Catalogue size indicator */}
        {bothEntered && validH && validW && (
          <div className="flex flex-col gap-1.5">
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
            {/* Show rounding note when dimensions were rounded up */}
            {catalogueSize && catalogueSize.wasRounded && (
              <p className="text-xs text-amber-700 font-medium">
                ↑ Rounded up to nearest catalogue size
              </p>
            )}
          </div>
        )}

        {/* Spacer so content isn't hidden behind the keyboard when open */}
        {activeField && <div className="h-40" />}
      </div>

      {/* Custom QWERTY keyboard overlay */}
      {activeField && (
        <div data-custom-keyboard>
          <CustomKeyboard
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onDone={handleDone}
          />
        </div>
      )}
    </>
  );
}
