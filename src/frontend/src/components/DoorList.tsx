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
        <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
          <table className="unified-table w-full" style={{ minWidth: '640px' }}>
            <thead>
              <tr>
                <th className="unified-th unified-td-center" style={{ width: '36px' }}>SR</th>
                <th className="unified-th">DOOR SIZE</th>
                <th className="unified-th unified-td-center">SQ.FT</th>
                <th className="unified-th" style={{ color: '#90caf9' }}>SINGLE</th>
                <th className="unified-th" style={{ color: '#a5d6a7' }}>DOUBLE</th>
                <th className="unified-th" style={{ color: '#ce93d8' }}>D+SAGWAN</th>
                <th className="unified-th" style={{ color: '#ffcc80' }}>LAMINATE</th>
                <th className="unified-th unified-td-center">CARP.</th>
                <th className="unified-th" style={{ width: '32px' }}></th>
              </tr>
            </thead>
            <tbody>
              {doors.map((door, idx) => {
                const sqFt = calcSquareFeet(door.catalogueHeight, door.catalogueWidth);
                const singleTotal = sqFt * COATING_RATES[CoatingType.single] * door.quantity;
                const doubleTotal = sqFt * COATING_RATES[CoatingType.double_] * door.quantity;
                const dSagTotal = sqFt * COATING_RATES[CoatingType.doubleSagwanpatti] * door.quantity;
                const lamTotal = sqFt * COATING_RATES[CoatingType.laminate] * door.quantity;
                const actualSizeLabel = formatActualSize(door.actualHeightInches, door.actualWidthInches);

                return (
                  <tr
                    key={door.id}
                    className="unified-row"
                  >
                    <td className="unified-td unified-td-center">{idx + 1}</td>
                    <td className="unified-td unified-td-actualsize">
                      {actualSizeLabel}
                      {door.isDoubleDoor && (
                        <span className="ml-1 font-bold" style={{ color: '#c2410c' }}>(DD)</span>
                      )}
                    </td>
                    <td className="unified-td unified-td-center">{sqFt.toFixed(2)}</td>
                    <td className="unified-td unified-td-price" style={{ color: '#1e40af' }}>
                      ₹{singleTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="unified-td unified-td-price" style={{ color: '#166534' }}>
                      ₹{doubleTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="unified-td unified-td-price" style={{ color: '#5b21b6' }}>
                      ₹{dSagTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="unified-td unified-td-price" style={{ color: '#9a3412' }}>
                      ₹{lamTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="unified-td unified-td-center">
                      {door.isDoubleDoor && door.carpenterCharge > 0
                        ? <span style={{ color: '#9a3412' }}>₹{door.carpenterCharge.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        : <span style={{ color: '#9ca3af' }}>–</span>
                      }
                    </td>
                    <td className="unified-td unified-td-center" style={{ padding: '4px' }}>
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
