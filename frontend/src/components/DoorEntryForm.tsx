import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DimensionInput from './DimensionInput';
import { type DoorEntry, STANDARD_THICKNESS_MM } from '../types/door';
import { findCatalogueSize } from '../utils/dimensionConversion';

interface DoorEntryFormProps {
  onAddDoor: (door: DoorEntry) => void;
}

export default function DoorEntryForm({ onAddDoor }: DoorEntryFormProps) {
  const [heightInches, setHeightInches] = useState<number>(0);
  const [widthInches, setWidthInches] = useState<number>(0);
  const [heightStr, setHeightStr] = useState('');
  const [widthStr, setWidthStr] = useState('');

  const catalogueSize =
    heightInches > 0 && widthInches > 0
      ? findCatalogueSize(heightInches, widthInches)
      : null;

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
    };

    onAddDoor(door);
    handleClear();

    if (catalogueSize.wasRounded) {
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
  };

  return (
    <div className="space-y-4">
      {/* Door Entry Form — light off-white card */}
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

          {/* Add button */}
          <Button
            onClick={handleAdd}
            className="w-full min-h-[52px] text-base font-semibold rounded-xl bg-amber-800 hover:bg-amber-900 text-white border-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Door Size
          </Button>

          {/* Clear button */}
          <Button
            variant="outline"
            onClick={handleClear}
            className="min-h-[48px] text-base font-medium rounded-xl border-2 border-amber-800 text-amber-800 hover:bg-amber-50 bg-transparent px-8"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
