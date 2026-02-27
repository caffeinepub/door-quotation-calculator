import { useState } from 'react';
import { toast } from 'sonner';
import { Settings, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CoatingType } from '../backend';
import { COATING_OPTIONS, COATING_LABELS, COATING_RATES } from '../types/door';
import { useGetAllCoatingRates, useUpdateCoatingRate } from '../hooks/useQueries';

export default function RateManager() {
  const [coating, setCoating] = useState<CoatingType>(CoatingType.single);
  const [rate, setRate] = useState('');

  const { data: backendRates, isLoading } = useGetAllCoatingRates();
  const updateRate = useUpdateCoatingRate();

  const handleUpdate = async () => {
    const rateNum = parseInt(rate);
    if (isNaN(rateNum) || rateNum < 0) {
      toast.error('Please enter a valid rate.');
      return;
    }
    try {
      await updateRate.mutateAsync({ coatingType: coating, rate: rateNum });
      toast.success(`Rate for ${COATING_LABELS[coating]} updated to ₹${rateNum}/sq.ft`);
      setRate('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      toast.error(msg);
    }
  };

  return (
    <Card className="border-amber/30 shadow-sm bg-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
          <Settings className="w-4 h-4" />
          Admin — Rate Configuration
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Note: App uses hard-coded rates (Single ₹185, Double ₹220, Sagwan Patti ₹270, Laminate ₹450). Backend rates shown below are for reference only.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current hard-coded rates */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COATING_OPTIONS.map(opt => (
            <div key={opt.value} className="p-2 rounded-md bg-background border border-border text-center">
              <p className="text-xs text-muted-foreground truncate">{opt.label}</p>
              <p className="text-sm font-bold text-amber-dark">₹{COATING_RATES[opt.value]}</p>
              <p className="text-xs text-muted-foreground">per sq.ft</p>
            </div>
          ))}
        </div>

        {/* Backend rate update form */}
        <div className="p-3 rounded-md bg-muted/30 border border-border space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Update Backend Rate (Admin Only)</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1 flex-1 min-w-[140px]">
              <Label className="text-xs">Coating Type</Label>
              <Select value={coating} onValueChange={v => setCoating(v as CoatingType)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COATING_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 flex-1 min-w-[100px]">
              <Label className="text-xs">New Rate (₹/sq.ft)</Label>
              <Input
                type="number"
                min={0}
                placeholder="e.g. 185"
                value={rate}
                onChange={e => setRate(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <Button
              onClick={handleUpdate}
              disabled={updateRate.isPending || !rate}
              size="sm"
              variant="outline"
              className="gap-2 h-9"
            >
              {updateRate.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Update
            </Button>
          </div>
        </div>

        {/* Backend rates display */}
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-xs py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading backend rates...
          </div>
        ) : backendRates ? (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Backend stored rates:</p>
            <div className="flex flex-wrap gap-3">
              {COATING_OPTIONS.map(opt => (
                <span key={opt.value}>
                  {opt.label}: ₹{backendRates[opt.value] ?? 0}/sq.ft
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
