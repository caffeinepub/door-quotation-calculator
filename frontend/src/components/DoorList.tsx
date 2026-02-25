import { Trash2, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type DoorEntry, COATING_LABELS, COATING_RATES, STANDARD_THICKNESS_MM } from '../types/door';
import { CoatingType } from '../backend';
import { calcSquareFeet } from '../utils/dimensionConversion';

interface DoorListProps {
  doors: DoorEntry[];
  onRemoveDoor: (id: string) => void;
}

const COATING_ORDER: CoatingType[] = [
  CoatingType.single,
  CoatingType.double_,
  CoatingType.doubleSagwanpatti,
  CoatingType.laminate,
];

function formatInches(val: number): string {
  if (val % 1 === 0) return `${val}"`;
  return `${val.toFixed(3).replace(/\.?0+$/, '')}"`;
}

export default function DoorList({ doors, onRemoveDoor }: DoorListProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-amber-color" />
          Added Doors
          <Badge variant="secondary" className="ml-1 text-xs">{doors.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doors.map((door, idx) => {
            const sqFt = calcSquareFeet(door.catalogueHeight, door.catalogueWidth);

            return (
              <div
                key={door.id}
                className="rounded-lg border border-border bg-muted/30 overflow-hidden"
              >
                {/* Card header row */}
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-muted/50 border-b border-border">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber/20 text-amber-dark text-xs font-bold flex items-center justify-center border border-amber/30">
                      {idx + 1}
                    </span>
                    {/* Actual size */}
                    <span className="text-xs text-muted-foreground">
                      Actual: <span className="font-medium text-foreground">{formatInches(door.actualWidthInches)} × {formatInches(door.actualHeightInches)}</span>
                    </span>
                    <span className="text-muted-foreground text-xs">→</span>
                    {/* Catalogue size badge */}
                    <Badge className="bg-amber/20 text-amber-dark border border-amber/40 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {door.catalogueWidth}" × {door.catalogueHeight}"
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveDoor(door.id)}
                    className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Remove door"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Details */}
                <div className="px-3 py-2.5 space-y-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Thickness: <span className="font-medium text-foreground">{STANDARD_THICKNESS_MM} mm</span></span>
                    <span>Sq.ft: <span className="font-medium text-foreground">{sqFt.toFixed(2)}</span></span>
                    <span>Qty: <span className="font-medium text-foreground">{door.quantity}</span></span>
                  </div>

                  {/* All 4 coating amounts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                    {COATING_ORDER.map(ct => {
                      const rate = COATING_RATES[ct];
                      const lineTotal = sqFt * rate * door.quantity;
                      return (
                        <div
                          key={ct}
                          className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md bg-background border border-border text-xs"
                        >
                          <span className="text-muted-foreground truncate">{COATING_LABELS[ct]}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-muted-foreground">₹{rate}/sq.ft</span>
                            <span className="font-semibold text-foreground">
                              ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
