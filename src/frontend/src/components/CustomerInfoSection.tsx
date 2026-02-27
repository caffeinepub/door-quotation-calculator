import { User, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerInfoSectionProps {
  customerName: string;
  mobileNumber: string;
  onCustomerNameChange: (value: string) => void;
  onMobileNumberChange: (value: string) => void;
}

export default function CustomerInfoSection({
  customerName,
  mobileNumber,
  onCustomerNameChange,
  onMobileNumberChange,
}: CustomerInfoSectionProps) {
  return (
    <Card className="border border-amber/40 bg-amber/5">
      <CardContent className="pt-4 pb-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber/20 text-amber shrink-0">
            <User className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Customer Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Customer Name */}
          <div className="space-y-1.5">
            <Label htmlFor="customerName" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Customer Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="customerName"
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={e => onCustomerNameChange(e.target.value)}
                className="pl-9 h-11 text-base border-border focus-visible:ring-amber bg-card"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <Label htmlFor="mobileNumber" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Mobile Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={e => onMobileNumberChange(e.target.value)}
                className="pl-9 h-11 text-base border-border focus-visible:ring-amber bg-card"
                autoComplete="off"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
