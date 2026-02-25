import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type DoorEntry, COATING_RATES } from '../types/door';
import { CoatingType } from '../backend';
import { calcSquareFeet, formatActualSize } from '../utils/dimensionConversion';

interface DoorListProps {
  doors: DoorEntry[];
  onRemoveDoor: (id: string) => void;
}

export default function DoorList({ doors, onRemoveDoor }: DoorListProps) {
  if (doors.length === 0) return null;

  return (
    <Card className="border border-border shadow-sm bg-card">
      <CardContent className="pt-5 pb-4">
        {/* Section heading */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Door Entries</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {doors.length} door {doors.length === 1 ? 'entry' : 'entries'} added
          </p>
        </div>

        {/* Horizontally scrollable table */}
        <div className="overflow-x-auto -mx-1">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-amber-200">
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground text-xs w-8">Sr</th>
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground text-xs">Size</th>
                <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">Single</th>
                <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">Double</th>
                <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">D+Sag</th>
                <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">Lam</th>
                <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">Sq.Ft</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {doors.map((door, idx) => {
                const sqFt = calcSquareFeet(door.catalogueHeight, door.catalogueWidth);
                const singleTotal = sqFt * COATING_RATES[CoatingType.single] * door.quantity;
                const doubleTotal = sqFt * COATING_RATES[CoatingType.double_] * door.quantity;
                const dSagTotal = sqFt * COATING_RATES[CoatingType.doubleSagwanpatti] * door.quantity;
                const lamTotal = sqFt * COATING_RATES[CoatingType.laminate] * door.quantity;
                const sizeLabel = formatActualSize(door.actualHeightInches, door.actualWidthInches);

                return (
                  <tr
                    key={door.id}
                    className="border-b border-amber-100 last:border-b-0 hover:bg-amber-50/40 transition-colors"
                  >
                    <td className="py-2.5 px-2 text-muted-foreground text-xs font-medium">{idx + 1}</td>
                    <td className="py-2.5 px-2 text-foreground text-xs font-medium whitespace-nowrap">{sizeLabel}</td>
                    <td className="py-2.5 px-2 text-right text-foreground text-xs whitespace-nowrap">
                      ₹{singleTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5 px-2 text-right text-foreground text-xs whitespace-nowrap">
                      ₹{doubleTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5 px-2 text-right text-foreground text-xs whitespace-nowrap">
                      ₹{dSagTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5 px-2 text-right text-foreground text-xs whitespace-nowrap">
                      ₹{lamTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5 px-2 text-right text-foreground text-xs whitespace-nowrap">
                      {sqFt.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-1 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveDoor(door.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label="Remove door"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
