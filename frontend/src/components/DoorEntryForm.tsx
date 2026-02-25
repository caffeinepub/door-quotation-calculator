import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DimensionInput from './DimensionInput';
import { type DoorEntry, COATING_RATES, STANDARD_THICKNESS_MM } from '../types/door';
import { CoatingType } from '../backend';
import { findCatalogueSize, calcSquareFeet, parseFractionInput } from '../utils/dimensionConversion';

interface DoorEntryFormProps {
  onAddDoor: (door: DoorEntry) => void;
  customerName: string;
  setCustomerName: (v: string) => void;
  mobileNumber: string;
  setMobileNumber: (v: string) => void;
}

const DEFAULT_HEIGHT_INCHES = 80;
const DEFAULT_WIDTH_INCHES = 30;

export default function DoorEntryForm({
  onAddDoor,
  customerName,
  setCustomerName,
  mobileNumber,
  setMobileNumber,
}: DoorEntryFormProps) {
  const [heightInches, setHeightInches] = useState<number>(DEFAULT_HEIGHT_INCHES);
  const [widthInches, setWidthInches] = useState<number>(DEFAULT_WIDTH_INCHES);
  const [quantity, setQuantity] = useState(1);

  const catalogueSize =
    heightInches > 0 && widthInches > 0
      ? findCatalogueSize(heightInches, widthInches)
      : null;
  const sqFt = catalogueSize ? calcSquareFeet(catalogueSize.height, catalogueSize.width) : null;

  const handleAdd = () => {
    if (quantity < 1) {
      toast.error('Quantity must be at least 1.');
      return;
    }

    if (!catalogueSize) {
      toast.error('Door dimensions are out of catalogue range. Please adjust height or width.');
      return;
    }

    const door: DoorEntry = {
      id: crypto.randomUUID(),
      actualHeightInches: heightInches,
      actualWidthInches: widthInches,
      catalogueHeight: catalogueSize.height,
      catalogueWidth: catalogueSize.width,
      thickness: STANDARD_THICKNESS_MM,
      quantity,
    };

    onAddDoor(door);
    setHeightInches(DEFAULT_HEIGHT_INCHES);
    setWidthInches(DEFAULT_WIDTH_INCHES);
    setQuantity(1);
    toast.success('Door added to quotation.');
  };

  return (
    <div className="space-y-4">
      {/* Customer Details */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-amber-color" />
            Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="customer-name" className="text-sm font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Customer Name
              </Label>
              <Input
                id="customer-name"
                placeholder="Enter customer name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="min-h-[44px] text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mobile-number" className="text-sm font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Mobile Number
              </Label>
              <Input
                id="mobile-number"
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value)}
                className="min-h-[44px] text-base"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Door Entry Form — dark warm brown card matching reference image */}
      <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: '#2a1a10' }}>
        <div>
          <h3 className="text-xl font-bold text-white">Add New Door Entry</h3>
          <p className="text-sm mt-1" style={{ color: '#a08070' }}>
            Enter door dimensions (supports fractions like 79 1/4, 30 3/8). All 4 coating types will be calculated automatically.
          </p>
        </div>

        {/* Dimensions — vertical stacking */}
        <DimensionInput
          label="Door Dimensions"
          heightInches={heightInches}
          widthInches={widthInches}
          onHeightChange={setHeightInches}
          onWidthChange={setWidthInches}
        />

        {/* Quantity */}
        <div className="space-y-1.5">
          <Label htmlFor="quantity" className="text-sm font-semibold text-white">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="min-h-[44px] text-base w-full sm:w-32 bg-transparent border-white/20 text-white placeholder:text-white/40"
          />
        </div>

        {/* Preview — all 4 coatings */}
        {sqFt !== null && catalogueSize && (
          <div className="p-3 rounded-md border text-sm space-y-2" style={{ backgroundColor: '#3a2518', borderColor: '#5a3520' }}>
            <p className="text-xs font-semibold" style={{ color: '#d4a070' }}>
              Catalogue: {catalogueSize.width}" × {catalogueSize.height}" · Sq.ft: {sqFt.toFixed(2)} · Qty: {quantity}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs" style={{ color: '#c49060' }}>
              {([
                [CoatingType.single, COATING_RATES[CoatingType.single]],
                [CoatingType.double_, COATING_RATES[CoatingType.double_]],
                [CoatingType.doubleSagwanpatti, COATING_RATES[CoatingType.doubleSagwanpatti]],
                [CoatingType.laminate, COATING_RATES[CoatingType.laminate]],
              ] as [CoatingType, number][]).map(([ct, rate]) => {
                const total = sqFt * rate * quantity;
                const lbl =
                  ct === CoatingType.single ? 'Single' :
                  ct === CoatingType.double_ ? 'Double' :
                  ct === CoatingType.doubleSagwanpatti ? 'Sagwan Patti' : 'Laminate';
                return (
                  <span key={ct}>
                    {lbl}: ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <Separator style={{ backgroundColor: '#4a2a18' }} />

        <Button
          onClick={handleAdd}
          className="w-full min-h-[52px] text-base font-semibold rounded-xl"
          style={{ backgroundColor: '#c8845a', color: '#2a1a10' }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Door Size
        </Button>
      </div>
    </div>
  );
}
