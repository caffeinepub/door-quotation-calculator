import { User, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber/20 text-amber shrink-0">
            <User className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Customer Details</h3>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-1/2 pr-2 pb-1.5 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer Name</span>
              </th>
              <th className="w-1/2 pl-2 pb-1.5 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mobile Number</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-2 align-top">
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="customerName"
                    type="text"
                    placeholder="Customer name"
                    value={customerName}
                    onChange={e => onCustomerNameChange(e.target.value)}
                    className="pl-8 h-10 text-sm border-border focus-visible:ring-amber bg-card"
                    autoComplete="off"
                  />
                </div>
              </td>
              <td className="pl-2 align-top">
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="Mobile number"
                    value={mobileNumber}
                    onChange={e => onMobileNumberChange(e.target.value)}
                    className="pl-8 h-10 text-sm border-border focus-visible:ring-amber bg-card"
                    autoComplete="off"
                    inputMode="numeric"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
