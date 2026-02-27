import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Header from './components/Header';
import Footer from './components/Footer';
import DoorEntryForm from './components/DoorEntryForm';
import DoorList from './components/DoorList';
import QuotationView from './components/QuotationView';
import RateManager from './components/RateManager';
import CustomerInfoSection from './components/CustomerInfoSection';
import { type DoorEntry } from './types/door';

type AppView = 'form' | 'quotation';

export default function App() {
  const [doors, setDoors] = useState<DoorEntry[]>([]);
  const [view, setView] = useState<AppView>('form');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

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
    setView('form');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6 py-6">
        {view === 'form' ? (
          <div className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Door Quotation</h2>

            {/* Customer Info Section — inline on the same page */}
            <CustomerInfoSection
              customerName={customerName}
              mobileNumber={mobileNumber}
              onCustomerNameChange={setCustomerName}
              onMobileNumberChange={setMobileNumber}
            />

            <DoorEntryForm onAddDoor={handleAddDoor} />

            {doors.length > 0 && (
              <>
                <DoorList
                  doors={doors}
                  onRemoveDoor={handleRemoveDoor}
                />
                <button
                  type="button"
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
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
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
