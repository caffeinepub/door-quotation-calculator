export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-xs print-hidden">
      <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-amber text-amber-foreground font-bold text-xl shadow-sm">
          🚪
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">SHIVKRUPA TRADERS ( Narangi KHED)</h1>
          <p className="text-xs text-muted-foreground">Professional door pricing & quotation tool</p>
        </div>
      </div>
    </header>
  );
}
