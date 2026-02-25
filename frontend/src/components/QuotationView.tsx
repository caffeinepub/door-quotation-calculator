import { useMemo } from 'react';
import { Printer, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type DoorEntry, COATING_LABELS, COATING_RATES } from '../types/door';
import { CoatingType } from '../backend';
import { calcSquareFeet, formatInchesAsFraction } from '../utils/dimensionConversion';
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

const COATING_SHORT_LABELS: Record<CoatingType, string> = {
  [CoatingType.single]: 'SINGLE COATING',
  [CoatingType.double_]: 'DOUBLE COATING',
  [CoatingType.doubleSagwanpatti]: 'DOUBLE + SAGWAN',
  [CoatingType.laminate]: 'LAMINATE',
};

const COATING_SUMMARY_LABELS: Record<CoatingType, string> = {
  [CoatingType.single]: 'Single Coating',
  [CoatingType.double_]: 'Double Coating',
  [CoatingType.doubleSagwanpatti]: 'Double Coating + Sagwan Patti',
  [CoatingType.laminate]: 'Laminate',
};

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
      const sqFt = calcSquareFeet(door.catalogueHeight, door.catalogueWidth) * door.quantity;
      const lineTotal = parseFloat((sqFt * rate).toFixed(2));
      return { door, sqFt, lineTotal };
    });
    const totalSqFt = rows.reduce((s, r) => s + r.sqFt, 0);
    const totalAmount = parseFloat(rows.reduce((s, r) => s + r.lineTotal, 0).toFixed(2));
    return { coatingType: ct, rate, totalSqFt, totalAmount, rows };
  });
}

function formatPrice(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Format catalogue door size as fractional inches e.g. "75 5/8\" × 28 5/8\"" */
function formatDoorSizeFractional(heightInches: number, widthInches: number): string {
  const fmt = (val: number) => {
    const whole = Math.floor(val);
    const frac = val - whole;
    const fracStr = formatInchesAsFraction(frac);
    if (fracStr === '0' || fracStr === '') return `${whole}"`;
    return `${whole} ${fracStr}"`;
  };
  return `${fmt(heightInches)} × ${fmt(widthInches)}`;
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

  // Build per-door unified rows for the main table
  const unifiedRows = useMemo(() => {
    return doors.map((door, idx) => {
      const sqFt = calcSquareFeet(door.catalogueHeight, door.catalogueWidth) * door.quantity;
      const prices: Record<CoatingType, number> = {} as Record<CoatingType, number>;
      COATING_ORDER.forEach(ct => {
        const rate = COATING_RATES[ct];
        prices[ct] = parseFloat((sqFt * rate).toFixed(2));
      });
      return { door, idx, sqFt, prices };
    });
  }, [doors]);

  const totalSqFt = unifiedRows.reduce((s, r) => s + r.sqFt, 0);
  const totalsByCoating: Record<CoatingType, number> = useMemo(() => {
    const totals = {} as Record<CoatingType, number>;
    COATING_ORDER.forEach(ct => {
      totals[ct] = parseFloat(unifiedRows.reduce((s, r) => s + r.prices[ct], 0).toFixed(2));
    });
    return totals;
  }, [unifiedRows]);

  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const encoded = formatWhatsAppMessage(coatingBlocks, customerName, mobileNumber);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    setCustomerName('');
    setMobileNumber('');
    onClearDoors();
    onBack();
  };

  return (
    <div className="space-y-4">
      {/* ── Action bar (screen only) ── */}
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
            Download PDF
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          UNIFIED TABLE — shown on BOTH screen and print
          ══════════════════════════════════════════════════ */}
      <div className="quotation-wrapper">
        {/* Document header */}
        <div className="print-doc-header print-only">
          <div>
            <h1 className="print-title">Door Coating Quotation</h1>
            <p className="print-date">{today}</p>
          </div>
          {(customerName || mobileNumber) && (
            <div className="print-customer">
              {customerName && <p className="print-customer-name">{customerName}</p>}
              {mobileNumber && <p className="print-customer-mobile">{mobileNumber}</p>}
            </div>
          )}
        </div>

        {/* Screen header */}
        <div className="print-hidden mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 bg-card border border-border rounded-lg p-4 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-foreground">Door Coating Quotation</h2>
              <p className="text-sm text-muted-foreground mt-1">{today}</p>
            </div>
            {(customerName || mobileNumber) && (
              <div className="text-sm sm:text-right">
                {customerName && <p className="font-semibold text-foreground">{customerName}</p>}
                {mobileNumber && <p className="text-muted-foreground">{mobileNumber}</p>}
              </div>
            )}
          </div>
        </div>

        {/* ── Main Pricing Table ── */}
        <div className="overflow-x-auto rounded-lg border border-border shadow-sm print-table-wrapper">
          <table className="unified-table w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="unified-th">SR</th>
                <th className="unified-th">DOOR SIZE</th>
                <th className="unified-th">SQ.FT</th>
                <th className="unified-th">SINGLE COATING</th>
                <th className="unified-th">DOUBLE COATING</th>
                <th className="unified-th">DOUBLE + SAGWAN</th>
                <th className="unified-th">LAMINATE</th>
              </tr>
            </thead>
            <tbody>
              {unifiedRows.map(({ door, idx, sqFt, prices }) => (
                <tr key={door.id} className="unified-row">
                  <td className="unified-td unified-td-center">{idx + 1}</td>
                  <td className="unified-td unified-td-doorsize">
                    {formatDoorSizeFractional(door.catalogueHeight, door.catalogueWidth)}
                  </td>
                  <td className="unified-td unified-td-center">{sqFt.toFixed(2)}</td>
                  {COATING_ORDER.map(ct => (
                    <td key={ct} className="unified-td unified-td-price">
                      {formatPrice(prices[ct])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="unified-total-row">
                <td className="unified-td unified-td-total" colSpan={2}>Total</td>
                <td className="unified-td unified-td-total unified-td-center">{totalSqFt.toFixed(2)}</td>
                {COATING_ORDER.map(ct => (
                  <td key={ct} className="unified-td unified-td-total unified-td-price">
                    {formatPrice(totalsByCoating[ct])}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ── Coating Type Summary ── */}
        <div className="summary-section mt-6">
          <h3 className="summary-title">Coating Type Summary</h3>
          <hr className="summary-divider" />
          <div className="summary-rows">
            {COATING_ORDER.map(ct => (
              <div key={ct} className="summary-row">
                <span className="summary-label">
                  {COATING_SUMMARY_LABELS[ct]} (@ ₹{COATING_RATES[ct].toFixed(2)}/sq.ft):
                </span>
                <span className="summary-value">{formatPrice(totalsByCoating[ct])}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom action bar (screen only) ── */}
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
          Download PDF
        </Button>
      </div>
    </div>
  );
}
