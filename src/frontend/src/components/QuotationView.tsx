import { useMemo } from 'react';
import { Printer, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type DoorEntry, COATING_RATES } from '../types/door';
import { CoatingType } from '../backend';
import { calcSquareFeet, formatInchesAsFraction, formatActualSize } from '../utils/dimensionConversion';
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
      // finalTotals = coating amount + carpenter charge per coating type
      const finalTotals: Record<CoatingType, number> = {} as Record<CoatingType, number>;
      COATING_ORDER.forEach(ct => {
        finalTotals[ct] = parseFloat((prices[ct] + door.carpenterCharge).toFixed(2));
      });
      return { door, idx, sqFt, prices, finalTotals };
    });
  }, [doors]);

  const totalSqFt = unifiedRows.reduce((s, r) => s + r.sqFt, 0);

  // Total carpenter charges across all doors
  const totalCarpenterCharges = doors.reduce((s, d) => s + d.carpenterCharge, 0);
  const hasAnyDoubleDoor = doors.some(d => d.isDoubleDoor);

  const totalsByCoating: Record<CoatingType, number> = useMemo(() => {
    const totals = {} as Record<CoatingType, number>;
    COATING_ORDER.forEach(ct => {
      totals[ct] = parseFloat(unifiedRows.reduce((s, r) => s + r.prices[ct], 0).toFixed(2));
    });
    return totals;
  }, [unifiedRows]);

  // Grand totals per coating = coating total + all carpenter charges
  const grandTotalsByCoating: Record<CoatingType, number> = useMemo(() => {
    const gt = {} as Record<CoatingType, number>;
    COATING_ORDER.forEach(ct => {
      gt[ct] = parseFloat((totalsByCoating[ct] + totalCarpenterCharges).toFixed(2));
    });
    return gt;
  }, [totalsByCoating, totalCarpenterCharges]);

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
                <th className="unified-th">ACTUAL SIZE</th>
                <th className="unified-th cat-size-col">CAT. SIZE</th>
                <th className="unified-th">SQ.FT</th>
                <th className="unified-th bg-blue-100 text-blue-800">SINGLE COATING</th>
                <th className="unified-th bg-green-100 text-green-800">DOUBLE COATING</th>
                <th className="unified-th bg-violet-100 text-violet-800">DOUBLE + SAGWAN</th>
                <th className="unified-th bg-orange-100 text-orange-800">LAMINATE</th>
                {hasAnyDoubleDoor && <th className="unified-th">CARP. CHARGE</th>}
                {hasAnyDoubleDoor && <th className="unified-th">FINAL TOTAL<br /><span className="text-[9px] font-normal opacity-70">(Single)</span></th>}
              </tr>
            </thead>
            <tbody>
              {unifiedRows.map(({ door, idx, sqFt, prices, finalTotals }) => (
                <tr key={door.id} className="unified-row">
                  <td className="unified-td unified-td-center">{idx + 1}</td>
                  <td className="unified-td unified-td-actualsize">
                    {formatActualSize(door.actualHeightInches, door.actualWidthInches)}
                    {door.isDoubleDoor && (
                      <span className="ml-1 font-bold" style={{ color: '#c2410c' }}>(DD)</span>
                    )}
                  </td>
                  <td className="unified-td unified-td-doorsize cat-size-col">
                    {formatDoorSizeFractional(door.catalogueHeight, door.catalogueWidth)}
                  </td>
                  <td className="unified-td unified-td-center">{sqFt.toFixed(2)}</td>
                  <td className="unified-td unified-td-price bg-blue-50 text-blue-800">
                    {formatPrice(prices[CoatingType.single])}
                  </td>
                  <td className="unified-td unified-td-price bg-green-50 text-green-800">
                    {formatPrice(prices[CoatingType.double_])}
                  </td>
                  <td className="unified-td unified-td-price bg-violet-50 text-violet-800">
                    {formatPrice(prices[CoatingType.doubleSagwanpatti])}
                  </td>
                  <td className="unified-td unified-td-price bg-orange-50 text-orange-800">
                    {formatPrice(prices[CoatingType.laminate])}
                  </td>
                  {hasAnyDoubleDoor && (
                    <td className="unified-td unified-td-price">
                      {door.isDoubleDoor && door.carpenterCharge > 0
                        ? formatPrice(door.carpenterCharge)
                        : <span className="text-muted-foreground">–</span>
                      }
                    </td>
                  )}
                  {hasAnyDoubleDoor && (
                    <td className="unified-td unified-td-price font-semibold">
                      {formatPrice(finalTotals[CoatingType.single])}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {/* Coating subtotals row */}
              <tr className="unified-total-row">
                <td className="unified-td unified-td-total" colSpan={2}>Coating Total</td>
                <td className="unified-td unified-td-total cat-size-col"></td>
                <td className="unified-td unified-td-total unified-td-center">{totalSqFt.toFixed(2)}</td>
                <td className="unified-td unified-td-total unified-td-price bg-blue-100 text-blue-900 font-bold">
                  {formatPrice(totalsByCoating[CoatingType.single])}
                </td>
                <td className="unified-td unified-td-total unified-td-price bg-green-100 text-green-900 font-bold">
                  {formatPrice(totalsByCoating[CoatingType.double_])}
                </td>
                <td className="unified-td unified-td-total unified-td-price bg-violet-100 text-violet-900 font-bold">
                  {formatPrice(totalsByCoating[CoatingType.doubleSagwanpatti])}
                </td>
                <td className="unified-td unified-td-total unified-td-price bg-orange-100 text-orange-900 font-bold">
                  {formatPrice(totalsByCoating[CoatingType.laminate])}
                </td>
                {hasAnyDoubleDoor && (
                  <td className="unified-td unified-td-total unified-td-price">
                    {totalCarpenterCharges > 0 ? formatPrice(totalCarpenterCharges) : <span className="opacity-50">–</span>}
                  </td>
                )}
                {hasAnyDoubleDoor && <td className="unified-td unified-td-total"></td>}
              </tr>
              {/* Grand total row (only when there are double doors) */}
              {hasAnyDoubleDoor && totalCarpenterCharges > 0 && (
                <tr className="unified-total-row" style={{ background: 'var(--color-amber-100, #fef3c7)' }}>
                  <td className="unified-td unified-td-total" colSpan={4} style={{ fontWeight: 700, color: 'var(--color-amber-900, #78350f)' }}>
                    Grand Total (Coating + Carpenter)
                  </td>
                  <td className="unified-td unified-td-total unified-td-price bg-blue-200 text-blue-900" style={{ fontWeight: 700 }}>
                    {formatPrice(grandTotalsByCoating[CoatingType.single])}
                  </td>
                  <td className="unified-td unified-td-total unified-td-price bg-green-200 text-green-900" style={{ fontWeight: 700 }}>
                    {formatPrice(grandTotalsByCoating[CoatingType.double_])}
                  </td>
                  <td className="unified-td unified-td-total unified-td-price bg-violet-200 text-violet-900" style={{ fontWeight: 700 }}>
                    {formatPrice(grandTotalsByCoating[CoatingType.doubleSagwanpatti])}
                  </td>
                  <td className="unified-td unified-td-total unified-td-price bg-orange-200 text-orange-900" style={{ fontWeight: 700 }}>
                    {formatPrice(grandTotalsByCoating[CoatingType.laminate])}
                  </td>
                  <td className="unified-td unified-td-total"></td>
                  <td className="unified-td unified-td-total"></td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>

        {/* ── Coating Type Summary ── */}
        <div className="summary-section mt-6">
          <h3 className="summary-title">Coating Type Summary</h3>
          <hr className="summary-divider" />
          <div className="summary-rows">
            {COATING_ORDER.map((ct, i) => {
              const colorMap: Record<string, { bg: string; border: string; dot: string; text: string }> = {
                [CoatingType.single]:           { bg: 'bg-blue-50',   border: 'border-l-4 border-blue-400',   dot: 'bg-blue-400',   text: 'text-blue-900' },
                [CoatingType.double_]:          { bg: 'bg-green-50',  border: 'border-l-4 border-green-400',  dot: 'bg-green-400',  text: 'text-green-900' },
                [CoatingType.doubleSagwanpatti]:{ bg: 'bg-violet-50', border: 'border-l-4 border-violet-400', dot: 'bg-violet-400', text: 'text-violet-900' },
                [CoatingType.laminate]:         { bg: 'bg-orange-50', border: 'border-l-4 border-orange-400', dot: 'bg-orange-400', text: 'text-orange-900' },
              };
              const c = colorMap[ct] ?? { bg: '', border: '', dot: 'bg-gray-400', text: '' };
              return (
                <div key={ct} className={`summary-row rounded-md px-3 py-2 mb-1 ${c.bg} ${c.border}`}>
                  <span className={`summary-label flex items-center gap-2 ${c.text}`}>
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${c.dot} flex-shrink-0`}></span>
                    {COATING_SUMMARY_LABELS[ct]}:
                  </span>
                  <span className={`summary-value font-bold ${c.text}`}>{formatPrice(totalsByCoating[ct])}</span>
                </div>
              );
            })}

            {/* Carpenter charges total */}
            {hasAnyDoubleDoor && totalCarpenterCharges > 0 && (
              <>
                <hr className="summary-divider" />
                <div className="summary-row">
                  <span className="summary-label font-semibold text-orange-700">
                    Total Carpenter Charges (DD):
                  </span>
                  <span className="summary-value font-semibold text-orange-700">
                    {formatPrice(totalCarpenterCharges)}
                  </span>
                </div>
                <hr className="summary-divider" />

                {/* Grand totals per coating */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-1">
                  Grand Total (Coating + Carpenter)
                </p>
                {COATING_ORDER.map(ct => (
                  <div key={`gt-${ct}`} className="summary-row">
                    <span className="summary-label font-bold">
                      {COATING_SUMMARY_LABELS[ct]}:
                    </span>
                    <span className="summary-value font-bold text-amber-900">
                      {formatPrice(grandTotalsByCoating[ct])}
                    </span>
                  </div>
                ))}
              </>
            )}
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
