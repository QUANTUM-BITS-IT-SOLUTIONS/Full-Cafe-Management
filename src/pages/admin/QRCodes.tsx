import { useState } from "react";
import { ArrowLeft, QrCode, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function QRPlaceholder({ table }: { table: number }) {
  // Simple deterministic SVG grid as QR placeholder
  const size = 21;
  const cells: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    cells[r] = [];
    for (let c = 0; c < size; c++) {
      // Finder patterns
      const inFinder =
        (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
      const finderBorder =
        inFinder &&
        (r === 0 || r === 6 || c === 0 || c === 6 ||
         r === size - 7 || r === size - 1 || c === size - 7 || c === size - 1 ||
         (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
         (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3) ||
         (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4));
      // Pseudo-random data based on table number
      const seed = (r * 31 + c * 17 + table * 7) % 5;
      cells[r][c] = inFinder ? finderBorder : seed < 2;
    }
  }

  return (
    <svg viewBox={`0 0 ${size + 2} ${size + 2}`} className="w-full h-full">
      <rect x="0" y="0" width={size + 2} height={size + 2} fill="white" />
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? <rect key={`${r}-${c}`} x={c + 1} y={r + 1} width={1} height={1} fill="black" /> : null
        )
      )}
    </svg>
  );
}

export default function QRCodes() {
  const [tables] = useState(() => Array.from({ length: 12 }, (_, i) => i + 1));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link to="/admin" className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl flex items-center gap-2">
            <QrCode className="h-7 w-7 text-vibe-purple" /> Table QR Codes
          </h1>
          <p className="text-muted-foreground mt-1">Print and place on tables for scan-to-order.</p>
        </div>
      </div>

      <Button variant="outline" className="border-vibe-purple/30 text-vibe-purple" onClick={() => window.print()}>
        <Printer className="h-4 w-4 mr-2" /> Print All
      </Button>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-3">
        {tables.map((t) => (
          <div key={t} className="glass-card rounded-2xl p-6 text-center space-y-3 print:border print:border-black print:rounded-lg">
            <div className="w-32 h-32 mx-auto">
              <QRPlaceholder table={t} />
            </div>
            <p className="font-serif text-xl font-bold">Table {t}</p>
            <p className="text-xs text-muted-foreground font-mono">/table/{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
