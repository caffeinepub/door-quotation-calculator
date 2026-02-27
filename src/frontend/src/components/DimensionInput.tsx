import { useState, useRef, useEffect } from 'react';
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
      <div ref={containerRef} className="space-y-3">
        {label && <p className="text-sm font-semibold text-foreground sr-only">{label}</p>}

        {/* Two-column table layout for Height and Width */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-1/2 pb-1.5 pr-2 text-left">
                <span className="text-sm font-semibold text-foreground">Door Height (inches)</span>
              </th>
              <th className="w-1/2 pb-1.5 pl-2 text-left">
                <span className="text-sm font-semibold text-foreground">Door Width (inches)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Input fields row */}
            <tr>
              <td className="pr-2 align-top">
                <div
                  id="dim-height"
                  role="textbox"
                  aria-label="Door Height"
                  tabIndex={0}
                  onClick={() => setActiveField('height')}
                  onFocus={() => setActiveField('height')}
                  className={`min-h-[48px] text-base w-full bg-blue-50 border rounded-md px-2.5 py-2.5 cursor-text flex items-center select-none outline-none transition-colors
                    ${activeField === 'height'
                      ? 'border-blue-500 ring-2 ring-blue-300'
                      : heightEntered && !validH
                        ? 'border-destructive ring-1 ring-destructive/40'
                        : 'border-blue-200 focus:border-blue-400'
                    }`}
                >
                  {heightStr ? (
                    <span className="text-foreground text-sm">{heightStr}</span>
                  ) : (
                    <span className="text-muted-foreground/60 text-xs">79.25 or 79 1/4</span>
                  )}
                  {activeField === 'height' && (
                    <span className="ml-0.5 inline-block w-0.5 h-4 bg-blue-600 animate-pulse" />
                  )}
                </div>
              </td>
              <td className="pl-2 align-top">
                <div
                  id="dim-width"
                  role="textbox"
                  aria-label="Door Width"
                  tabIndex={0}
                  onClick={() => setActiveField('width')}
                  onFocus={() => setActiveField('width')}
                  className={`min-h-[48px] text-base w-full bg-blue-50 border rounded-md px-2.5 py-2.5 cursor-text flex items-center select-none outline-none transition-colors
                    ${activeField === 'width'
                      ? 'border-blue-500 ring-2 ring-blue-300'
                      : widthEntered && !validW
                        ? 'border-destructive ring-1 ring-destructive/40'
                        : 'border-blue-200 focus:border-blue-400'
                    }`}
                >
                  {widthStr ? (
                    <span className="text-foreground text-sm">{widthStr}</span>
                  ) : (
                    <span className="text-muted-foreground/60 text-xs">30.25 or 30 1/4</span>
                  )}
                  {activeField === 'width' && (
                    <span className="ml-0.5 inline-block w-0.5 h-4 bg-blue-600 animate-pulse" />
                  )}
                </div>
              </td>
            </tr>

            {/* Hint text row */}
            <tr>
              <td className="pr-2 pt-1">
                <p className="text-xs text-muted-foreground leading-tight">decimal or fraction</p>
                {heightEntered && !validH && (
                  <p className="text-xs text-destructive font-medium mt-0.5">Invalid — e.g. 79.25 or 79 1/4</p>
                )}
              </td>
              <td className="pl-2 pt-1">
                <p className="text-xs text-muted-foreground leading-tight">decimal or fraction</p>
                {widthEntered && !validW && (
                  <p className="text-xs text-destructive font-medium mt-0.5">Invalid — e.g. 30.25 or 30 1/4</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Catalogue size indicator — full width below both columns */}
        {bothEntered && validH && validW && (
          <div className="flex flex-col gap-1 pt-1">
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
