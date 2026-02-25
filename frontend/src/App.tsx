import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import Header from './components/Header';
import Footer from './components/Footer';
import CustomerInfoForm from './components/CustomerInfoForm';
import DoorEntryForm from './components/DoorEntryForm';
import DoorList from './components/DoorList';
import QuotationView from './components/QuotationView';
import RateManager from './components/RateManager';
import { type DoorEntry } from './types/door';
import { User, Phone } from 'lucide-react';

type AppView = 'customerInfo' | 'form' | 'quotation';

export default function App() {
  const [doors, setDoors] = useState<DoorEntry[]>([]);
  const [view, setView] = useState<AppView>('customerInfo');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  const handleCustomerInfoSubmit = (name: string, mobile: string) => {
    setCustomerName(name);
    setMobileNumber(mobile);
    setView('form');
  };

  const handleAddDoor = (door: DoorEntry) => {
    setDoors(prev => [...prev, door]);
  };

  const handleRemoveDoor = (id: string) => {
    setDoors(prev => prev.filter(d => d.id !== id));
  };

  const handleGenerateQuotation = () => {
    if (doors.length > 0) setView('quotation');
  };

  const handleBackToForm = () => {
    setView('form');
  };

  const handleClearDoors = () => {
    setDoors([]);
    setCustomerName('');
    setMobileNumber('');
    setView('customerInfo');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 py-6">
        {view === 'customerInfo' ? (
          <CustomerInfoForm onSubmit={handleCustomerInfoSubmit} />
        ) : view === 'form' ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Door Quotation</h2>

              {/* Customer Details Card */}
              <Card className="border border-amber/40 bg-amber/5">
                <CardContent className="py-3 px-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber/20 text-amber shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-none mb-0.5">Customer</p>
                        <p className="text-sm font-semibold text-foreground leading-tight">{customerName}</p>
                      </div>
                    </div>
                    {mobileNumber && (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber/20 text-amber shrink-0">
                          <Phone className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-none mb-0.5">Mobile</p>
                          <p className="text-sm font-semibold text-foreground leading-tight">{mobileNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <DoorEntryForm onAddDoor={handleAddDoor} />

            {doors.length > 0 && (
              <>
                <DoorList
                  doors={doors}
                  onRemoveDoor={handleRemoveDoor}
                />
                <button
                  onClick={handleGenerateQuotation}
                  className="w-full py-3.5 rounded-lg font-semibold text-base bg-amber text-amber-foreground hover:bg-amber-hover transition-colors shadow-md min-h-[48px]"
                >
                  Generate Quotation ({doors.length} door{doors.length !== 1 ? 's' : ''}) →
                </button>
              </>
            )}

            {/* Admin toggle — de-emphasised */}
            <div className="pt-2">
              <Collapsible open={showAdmin} onOpenChange={setShowAdmin}>
                <CollapsibleTrigger asChild>
                  <button className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                    {showAdmin ? 'Hide Admin Panel' : 'Admin Settings'}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <RateManager />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        ) : (
          <QuotationView
            doors={doors}
            onBack={handleBackToForm}
            customerName={customerName}
            mobileNumber={mobileNumber}
            setCustomerName={setCustomerName}
            setMobileNumber={setMobileNumber}
            onClearDoors={handleClearDoors}
          />
        )}
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}
