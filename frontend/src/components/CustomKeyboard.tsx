import { Delete, Check } from 'lucide-react';

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onDone: () => void;
}

// Phone-style 3×4 numeric keypad:
// Row 1:  1   2   3
// Row 2:  4   5   6
// Row 3:  7   8   9
// Row 4:  /   0   ⌫
// Row 5:  .  [SPACE BAR]

export default function CustomKeyboard({ onKeyPress, onBackspace, onDone }: CustomKeyboardProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-stone-100 border-t-2 border-amber-800/30 shadow-2xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-amber-800/10 border-b border-amber-800/20">
        <span className="text-xs font-semibold text-amber-900 tracking-wide uppercase">
          Door Dimensions
        </span>
        <button
          onPointerDown={(e) => { e.preventDefault(); onDone(); }}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-800 text-white text-sm font-semibold active:bg-amber-900 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          Done
        </button>
      </div>

      {/* Key grid — centred, max width so keys aren't too wide on tablets */}
      <div className="px-3 py-2.5 max-w-sm mx-auto space-y-1.5">
        {/* Row 1: 1 2 3 */}
        <div className="grid grid-cols-3 gap-1.5">
          <KeyButton label="1" onPress={() => onKeyPress('1')} />
          <KeyButton label="2" onPress={() => onKeyPress('2')} />
          <KeyButton label="3" onPress={() => onKeyPress('3')} />
        </div>

        {/* Row 2: 4 5 6 */}
        <div className="grid grid-cols-3 gap-1.5">
          <KeyButton label="4" onPress={() => onKeyPress('4')} />
          <KeyButton label="5" onPress={() => onKeyPress('5')} />
          <KeyButton label="6" onPress={() => onKeyPress('6')} />
        </div>

        {/* Row 3: 7 8 9 */}
        <div className="grid grid-cols-3 gap-1.5">
          <KeyButton label="7" onPress={() => onKeyPress('7')} />
          <KeyButton label="8" onPress={() => onKeyPress('8')} />
          <KeyButton label="9" onPress={() => onKeyPress('9')} />
        </div>

        {/* Row 4: / (fraction)  |  0  |  ⌫ */}
        <div className="grid grid-cols-3 gap-1.5">
          <KeyButton label="/" sublabel="frac" onPress={() => onKeyPress('/')} />
          <KeyButton label="0" onPress={() => onKeyPress('0')} />
          <button
            onPointerDown={(e) => { e.preventDefault(); onBackspace(); }}
            className="flex flex-col items-center justify-center min-h-[52px] rounded-xl bg-red-100 border border-red-200 active:bg-red-200 transition-colors gap-0.5"
          >
            <Delete className="w-5 h-5 text-red-700" />
            <span className="text-[9px] text-red-600 font-medium leading-none">del</span>
          </button>
        </div>

        {/* Row 5: .  |  SPACE BAR */}
        <div className="grid grid-cols-3 gap-1.5">
          <KeyButton label="." sublabel="dec" onPress={() => onKeyPress('.')} />
          {/* Spacebar — spans 2 columns */}
          <button
            onPointerDown={(e) => { e.preventDefault(); onKeyPress(' '); }}
            className="col-span-2 flex flex-col items-center justify-center min-h-[52px] rounded-xl bg-white border border-stone-300 shadow-sm active:bg-amber-50 active:border-amber-400 transition-colors gap-0.5"
          >
            <span className="text-sm font-semibold text-stone-600 leading-none tracking-widest">SPACE</span>
            <span className="text-[9px] text-stone-400 font-medium leading-none">space</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface KeyButtonProps {
  label: string;
  sublabel?: string;
  onPress: () => void;
  className?: string;
}

function KeyButton({ label, sublabel, onPress, className = '' }: KeyButtonProps) {
  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); onPress(); }}
      className={`flex flex-col items-center justify-center min-h-[52px] rounded-xl bg-white border border-stone-300 shadow-sm active:bg-amber-50 active:border-amber-400 transition-colors gap-0.5 ${className}`}
    >
      <span className="text-xl font-semibold text-stone-800 leading-none">{label}</span>
      {sublabel && (
        <span className="text-[9px] text-stone-400 font-medium leading-none">{sublabel}</span>
      )}
    </button>
  );
}
