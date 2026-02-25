import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'door-quotation-calculator');

  return (
    <footer className="border-t border-border bg-card mt-auto print-hidden">
      <div className="container max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>© {year} Door Quotation Calculator</span>
        <span className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 fill-amber-color text-amber-color" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-amber-color transition-colors"
          >
            caffeine.ai
          </a>
        </span>
      </div>
    </footer>
  );
}
