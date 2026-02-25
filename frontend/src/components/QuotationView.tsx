import { useMemo } from 'react';
import { Printer, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type DoorEntry, COATING_LABELS, COATING_RATES, STANDARD_THICKNESS_MM } from '../types/door';
import { CoatingType } from '../backend';
import { calcSquareFeet } from '../utils/dimensionConversion';
import { formatWhatsAppMessage } from '../utils/whatsappFormatter';

interface QuotationViewProps {
  doors: DoorEntry[];
  onBack: () => void;
  customerName: string;
  mobileNumber: string;
  setCustomerName: (v: string) => void;
  setMobileNumber: (v: string) => void;
  onClearDoors: () => void;
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

interface CoatingBlock {
  coatingType: CoatingType;
  rate: number;
  totalSqFt: number;
  totalAmount: number;
  rows: { door: DoorEntry; sqFt: number; lineTotal: number }[];
}

function buildCoatingBlocks(doors: DoorEntry[]): CoatingBlock[] {
  return COATING_ORDER.map(ct => {
    const rate = COATING_RATES[ct];
    const rows = doors.map(door => {
      const sqFt = calcSquareFeet(door.catalogueHeight, door.catalogueWidth);
      const lineTotal = parseFloat((sqFt * rate * door.quantity).toFixed(2));
      return { door, sqFt, lineTotal };
    });
    const totalSqFt = rows.reduce((s, r) => s + r.sqFt * r.door.quantity, 0);
    const totalAmount = rows.reduce((s, r) => s + r.lineTotal, 0);
    return { coatingType: ct, rate, totalSqFt, totalAmount, rows };
  });
}

export default function QuotationView({
  doors,
  onBack,
  customerName,
  mobileNumber,
  setCustomerName,
  setMobileNumber,
  onClearDoors,
}: QuotationViewProps) {
  const coatingBlocks = useMemo(() => buildCoatingBlocks(doors), [doors]);

  const handlePrint = () => {
    window.print();
    setTimeout(() => {
      setCustomerName('');
      setMobileNumber('');
    }, 500);
  };

  const handleWhatsApp = () => {
    const encoded = formatWhatsAppMessage(coatingBlocks, customerName, mobileNumber);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    // Clear all state after sharing
    setCustomerName('');
    setMobileNumber('');
    onClearDoors();
    onBack();
  };

  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Action bar - hidden on print */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 print-hidden">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground justify-start min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Form
        </Button>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleWhatsApp}
            className="gap-2 border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-950 min-h-[44px] w-full sm:w-auto"
          >
            <Share2 className="w-4 h-4" />
            WhatsApp Share
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="gap-2 min-h-[44px] w-full sm:w-auto"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Quotation Header */}
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Door Coating Quotation</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{today}</p>
            </div>
            {(customerName || mobileNumber) && (
              <div className="text-sm text-right">
                {customerName && <p className="font-semibold text-foreground">{customerName}</p>}
                {mobileNumber && <p className="text-muted-foreground">{mobileNumber}</p>}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Coating Blocks */}
      {coatingBlocks.map((block) => (
        <Card key={block.coatingType} className="border-border shadow-sm overflow-hidden">
          <CardHeader className="pb-2 bg-amber/10 border-b border-amber/20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base font-bold text-foreground">
                {COATING_LABELS[block.coatingType]}
              </CardTitle>
              <Badge variant="outline" className="text-xs border-amber/40 text-amber-dark">
                ₹{block.rate}/sq.ft
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">#</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">Actual Size</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">Catalogue</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">Sq.ft</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">Qty</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map(({ door, sqFt, lineTotal }, idx) => (
                    <tr key={door.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">{idx + 1}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-xs">
                        {formatInches(door.actualWidthInches)} × {formatInches(door.actualHeightInches)}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber/15 text-amber-dark border border-amber/30">
                          {door.catalogueWidth}" × {door.catalogueHeight}"
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">{sqFt.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-right text-xs">{door.quantity}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-xs">
                        ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-amber/10 border-t border-amber/30">
                    <td colSpan={3} className="px-3 py-2 text-xs font-bold text-foreground">Subtotal</td>
                    <td className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground">{block.totalSqFt.toFixed(2)}</td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2 text-right text-xs font-bold text-foreground">
                      ₹{block.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Grand Total Summary */}
      <Card className="border-amber/40 shadow-card bg-amber/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-foreground">Grand Total Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber/20 bg-amber/10">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Coating Type</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Rate/sq.ft</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Total Sq.ft</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {coatingBlocks.map((block) => (
                  <tr key={block.coatingType} className="border-b border-border/50">
                    <td className="px-4 py-2.5 font-medium text-sm">{COATING_LABELS[block.coatingType]}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-muted-foreground">₹{block.rate}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-muted-foreground">{block.totalSqFt.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-sm">
                      ₹{block.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom action bar */}
      <div className="flex flex-col sm:flex-row gap-2 print-hidden pb-4">
        <Button
          variant="outline"
          onClick={handleWhatsApp}
          className="gap-2 border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-950 min-h-[48px] flex-1"
        >
          <Share2 className="w-4 h-4" />
          Share via WhatsApp &amp; Clear
        </Button>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="gap-2 min-h-[48px] flex-1"
        >
          <Printer className="w-4 h-4" />
          Print Quotation
        </Button>
      </div>
    </div>
  );
}
