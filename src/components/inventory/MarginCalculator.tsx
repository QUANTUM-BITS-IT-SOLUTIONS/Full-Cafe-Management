interface Props {
  cost: number;
  price: number;
  compact?: boolean;
}

export default function MarginCalculator({ cost, price, compact = false }: Props) {
  const margin = price - cost;
  const pct = price > 0 ? (margin / price) * 100 : 0;

  const color = pct >= 60 ? "text-neon-green" : pct >= 30 ? "text-neon-yellow" : "text-destructive";
  const bgColor = pct >= 60 ? "bg-neon-green/10" : pct >= 30 ? "bg-neon-yellow/10" : "bg-destructive/10";

  if (compact) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${color}`}>
        {pct.toFixed(0)}%
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">Cost: <span className="text-foreground font-medium">${cost.toFixed(2)}</span></span>
      <span className="text-muted-foreground">Price: <span className="text-foreground font-medium">${price.toFixed(2)}</span></span>
      <span className="text-muted-foreground">Margin: <span className={`font-bold ${color}`}>${margin.toFixed(2)} ({pct.toFixed(0)}%)</span></span>
    </div>
  );
}
