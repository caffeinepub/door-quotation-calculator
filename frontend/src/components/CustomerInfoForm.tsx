import { useState } from 'react';
import { User, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CustomerInfoFormProps {
  onSubmit: (customerName: string, mobileNumber: string) => void;
}

export default function CustomerInfoForm({ onSubmit }: CustomerInfoFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; mobile?: string } = {};
    if (!customerName.trim()) newErrors.name = 'Customer name is required';
    if (!mobileNumber.trim()) newErrors.mobile = 'Mobile number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(customerName.trim(), mobileNumber.trim());
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-3">
      <Card className="w-full max-w-sm border border-border shadow-card bg-card">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-amber/15 flex items-center justify-center">
            <span className="text-3xl">🚪</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Customer Details</CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">
            Enter customer information to start the quotation
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Name */}
            <div className="space-y-1.5">
              <Label htmlFor="customerName" className="text-sm font-medium text-foreground">
                Customer Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={e => {
                    setCustomerName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  className="pl-9 h-11 text-base border-border focus-visible:ring-amber"
                  autoComplete="off"
                />
              </div>
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <Label htmlFor="mobileNumber" className="text-sm font-medium text-foreground">
                Mobile Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={e => {
                    setMobileNumber(e.target.value);
                    if (errors.mobile) setErrors(prev => ({ ...prev, mobile: undefined }));
                  }}
                  className="pl-9 h-11 text-base border-border focus-visible:ring-amber"
                  autoComplete="off"
                  inputMode="numeric"
                />
              </div>
              {errors.mobile && <p className="text-xs text-destructive mt-1">{errors.mobile}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-amber text-amber-foreground hover:bg-amber-hover transition-colors shadow-md mt-2 rounded-lg"
            >
              Start Quotation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
