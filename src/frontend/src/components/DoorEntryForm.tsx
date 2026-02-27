import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import DimensionInput from './DimensionInput';
import { type DoorEntry, STANDARD_THICKNESS_MM } from '../types/door';
import { findCatalogueSize, findDoubleDoorCatalogueSize } from '../utils/dimensionConversion';

interface DoorEntryFormProps {
  onAddDoor: (door: DoorEntry) => void;
}

const DD_CARPENTER_CHARGE = 200;

export default function DoorEntryForm({ onAddDoor }: DoorEntryFormProps) {
  const [heightInches, setHeightInches] = useState<number>(0);
  const [widthInches, setWidthInches] = useState<number>(0);
  const [heightStr, setHeightStr] = useState('');
  const [widthStr, setWidthStr] = useState('');
  const [isDoubleDoor, setIsDoubleDoor] = useState(false);

  // Compute both normal and DD catalogue sizes for preview
  const normalCatalogueSize =
    heightInches > 0 && widthInches > 0
      ? findCatalogueSize(heightInches, widthInches)
      : null;

  const ddCatalogueSize =
    heightInches > 0 && widthInches > 0
      ? findDoubleDoorCatalogueSize(heightInches, widthInches)
      : null;

  const catalogueSize = isDoubleDoor ? ddCatalogueSize : normalCatalogueSize;

  const handleAdd = () => {
    if (heightInches <= 0 || widthInches <= 0) {
      toast.error('Please enter valid height and width dimensions.');
      return;
    }

    if (!catalogueSize) {
      toast.error(
        'Door dimensions exceed the maximum catalogue size. Please reduce height or width.'
      );
      return;
    }

    const door: DoorEntry = {
      id: crypto.randomUUID(),
      actualHeightInches: heightInches,
      actualWidthInches: widthInches,
      catalogueHeight: catalogueSize.height,
      catalogueWidth: catalogueSize.width,
      thickness: STANDARD_THICKNESS_MM,
      quantity: 1,
      isDoubleDoor,
      carpenterCharge: isDoubleDoor ? DD_CARPENTER_CHARGE : 0,
    };

    onAddDoor(door);
    handleClear();

    if (isDoubleDoor) {
      toast.success(
        `Double door added. Catalogue size ${catalogueSize.width}" × ${catalogueSize.height}". Carpenter charge ₹${DD_CARPENTER_CHARGE} applied.`
      );
    } else if (catalogueSize.wasRounded) {
      toast.success(
        `Door added. Rounded up to catalogue size ${catalogueSize.width}" × ${catalogueSize.height}".`
      );
    } else {
      toast.success('Door added to quotation.');
    }
  };

  const handleClear = () => {
    setHeightInches(0);
    setWidthInches(0);
    setHeightStr('');
    setWidthStr('');
    setIsDoubleDoor(false);
  };

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm bg-amber-50/60">
        <CardContent className="pt-5 pb-5 space-y-5">
          {/* Title & subtitle */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add New Door Entry</h2>
            <p className="text-sm mt-1.5 text-muted-foreground leading-relaxed">
              Enter door dimensions (supports fractions like 79 1/4, 30 3/8). All 4 coating types will be calculated automatically.
            </p>
          </div>

          {/* Dimension inputs */}
          <DimensionInput
            label="Door Dimensions"
            heightInches={heightInches}
            widthInches={widthInches}
            heightStr={heightStr}
            widthStr={widthStr}
            onHeightChange={setHeightInches}
            onWidthChange={setWidthInches}
            onHeightStrChange={setHeightStr}
            onWidthStrChange={setWidthStr}
          />

          {/* Double Door toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-amber-100/60 border border-amber-200">
              <Checkbox
                id="double-door"
                checked={isDoubleDoor}
                onCheckedChange={(checked) => setIsDoubleDoor(checked === true)}
                className="border-amber-700 data-[state=checked]:bg-amber-800 data-[state=checked]:border-amber-800"
              />
              <Label
                htmlFor="double-door"
                className="text-sm font-semibold text-foreground cursor-pointer select-none flex items-center gap-2"
              >
                Double Door (DD)
                {isDoubleDoor && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white">
                    DD
                  </span>
                )}
              </Label>
            </div>

            {/* DD info — fixed ₹200 carpenter charge note */}
            {isDoubleDoor && (
              <div className="px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-800 space-y-1">
                <p className="font-semibold">Double Door Rules Applied:</p>
                <p>• Width stepped one size higher than normal rounding</p>
                <p>• Carpenter charge: <span className="font-bold">₹{DD_CARPENTER_CHARGE}</span> auto-added per door</p>
                {normalCatalogueSize && ddCatalogueSize && heightInches > 0 && widthInches > 0 && (
                  <p className="pt-1 border-t border-orange-200 mt-1">
                    Normal → {normalCatalogueSize.width}" × {normalCatalogueSize.height}" &nbsp;|&nbsp;
                    <span className="font-bold">DD → {ddCatalogueSize.width}" × {ddCatalogueSize.height}"</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAdd}
              className="flex-1 min-h-[52px] text-base font-semibold rounded-xl bg-amber-800 hover:bg-amber-900 text-white border-0"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Door Size
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              className="min-h-[52px] text-base font-medium rounded-xl border-2 border-amber-800 text-amber-800 hover:bg-amber-50 bg-transparent px-5"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
