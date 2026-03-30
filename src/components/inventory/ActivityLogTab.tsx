import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";

export default function ActivityLogTab() {
  const { stockMovements, ingredients } = useInventory();
  const [filter, setFilter] = useState<string>("all");

  const getIngName = (id: string) => ingredients.find((i) => i.id === id)?.name ?? id;

  const formatTime = (iso: string) => {
    const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${Math.floor(diffHr / 24)}d ago`;
  };

  const typeLabel: Record<string, string> = {
    restock: "Restocked",
    sale: "Sale",
    waste: "Waste",
    adjustment: "Adjusted",
    spoilage: "Spoilage",
  };

  const typeBadge: Record<string, string> = {
    restock: "bg-neon-green/10 text-neon-green",
    sale: "bg-vibe-purple/10 text-vibe-purple",
    waste: "bg-destructive/10 text-destructive",
    adjustment: "bg-neon-yellow/10 text-neon-yellow",
    spoilage: "bg-neon-orange/10 text-neon-orange",
  };

  const types = ["all", "sale", "restock", "waste", "adjustment", "spoilage"];

  const filtered = filter === "all" ? stockMovements : stockMovements.filter((m) => m.type === filter);

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === t ? "bg-gold text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "all" ? "All" : typeLabel[t] ?? t}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4 font-medium">Time</th>
                <th className="text-left p-4 font-medium">Ingredient</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Qty</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Reference</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border/50 last:border-0">
                  <td className="p-4 text-muted-foreground text-xs whitespace-nowrap">{formatTime(m.timestamp)}</td>
                  <td className="p-4 font-medium">{getIngName(m.ingredientId)}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge[m.type] ?? ""}`}>
                      {typeLabel[m.type] ?? m.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${m.quantity > 0 ? "text-neon-green" : "text-destructive"}`}>
                      {m.quantity > 0 ? "+" : ""}{m.quantity}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground text-xs hidden sm:table-cell">{m.referenceId ?? "—"}</td>
                  <td className="p-4 text-muted-foreground text-xs hidden md:table-cell">{m.note}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No activity yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
