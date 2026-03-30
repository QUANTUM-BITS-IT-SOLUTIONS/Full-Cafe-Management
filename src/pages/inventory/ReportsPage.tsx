import { useMemo, useCallback } from "react";
import { useInventory } from "@/context/InventoryContext";
import { menuItems } from "@/data/menu";
import { DollarSign, TrendingDown, Package, AlertTriangle, Download, FileText, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MarginCalculator from "@/components/inventory/MarginCalculator";

export default function ReportsPage() {
  const { ingredients, stockMovements, getMargin, getMenuItemCost, recipes, getDaysOfStockRemaining } = useInventory();

  const stats = useMemo(() => {
    const totalValue = ingredients.reduce((sum, i) => sum + i.currentStock * i.costPerUnit, 0);
    const wasteMovements = stockMovements.filter((m) => m.type === "waste" || m.type === "spoilage");
    const wasteCount = wasteMovements.length;
    const wasteCost = wasteMovements.reduce((sum, m) => {
      const ing = ingredients.find((i) => i.id === m.ingredientId);
      return sum + Math.abs(m.quantity) * (ing?.costPerUnit ?? 0);
    }, 0);
    const restockCount = stockMovements.filter((m) => m.type === "restock").length;
    const lowStockItems = ingredients.filter((i) => i.currentStock > 0 && i.currentStock <= i.reorderLevel);

    // Top consumed ingredients
    const consumptionMap = new Map<string, number>();
    stockMovements.filter((m) => m.type === "sale").forEach((m) => {
      consumptionMap.set(m.ingredientId, (consumptionMap.get(m.ingredientId) || 0) + Math.abs(m.quantity));
    });
    const topConsumed = Array.from(consumptionMap.entries())
      .map(([id, qty]) => ({ name: ingredients.find((i) => i.id === id)?.name ?? id, qty, unit: ingredients.find((i) => i.id === id)?.unit ?? "" }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);

    // Top waste items (by ingredient)
    const wasteMap = new Map<string, number>();
    wasteMovements.forEach((m) => {
      wasteMap.set(m.ingredientId, (wasteMap.get(m.ingredientId) || 0) + Math.abs(m.quantity));
    });
    const topWasteList = Array.from(wasteMap.entries())
      .map(([id, count]) => ({ name: ingredients.find((i) => i.id === id)?.name ?? id, count, unit: ingredients.find((i) => i.id === id)?.unit ?? "" }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Menu item margins
    const margins = recipes.map((r) => {
      const item = menuItems.find((m) => m.id === r.menuItemId);
      const m = getMargin(r.menuItemId);
      return { name: item?.name ?? r.menuItemId, ...m };
    }).sort((a, b) => b.marginPercent - a.marginPercent);

    const lowMarginItems = margins.filter((m) => m.marginPercent < 30);

    return { totalValue, wasteCount, wasteCost, restockCount, lowStockItems, topWasteList, topConsumed, margins, lowMarginItems };
  }, [ingredients, stockMovements, getMargin, recipes]);

  const exportCSV = useCallback(() => {
    const header = "Ingredient,Stock,Unit,Supplier,Cost/Unit,Value,Reorder Level,Status\n";
    const rows = ingredients.map((ing) => {
      const value = (ing.currentStock * ing.costPerUnit).toFixed(2);
      const status = ing.currentStock === 0 ? "Out of Stock" : ing.currentStock <= ing.reorderLevel ? "Low Stock" : "In Stock";
      return `"${ing.name}",${ing.currentStock},"${ing.unit}","${ing.supplierId}",${ing.costPerUnit.toFixed(4)},${value},${ing.reorderLevel},"${status}"`;
    });
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV report downloaded");
  }, [ingredients]);

  const exportPDF = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) { toast.error("Please allow popups to download PDF"); return; }

    const inventoryRows = ingredients.map((ing) => {
      const status = ing.currentStock === 0 ? "Out of Stock" : ing.currentStock <= ing.reorderLevel ? "Low Stock" : "In Stock";
      return `<tr><td>${ing.name}</td><td>${ing.currentStock}</td><td>${ing.unit}</td><td>$${ing.costPerUnit.toFixed(4)}</td><td>$${(ing.currentStock * ing.costPerUnit).toFixed(2)}</td><td>${status}</td></tr>`;
    }).join("");

    const marginRows = stats.margins.map((m) =>
      `<tr><td>${m.name}</td><td>$${m.cost.toFixed(2)}</td><td>$${m.price.toFixed(2)}</td><td>$${m.marginDollars.toFixed(2)}</td><td>${m.marginPercent.toFixed(0)}%</td></tr>`
    ).join("");

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Inventory Report</title>
      <style>body{font-family:Georgia,serif;padding:40px;color:#1a1a1a}h1{font-size:24px}h2{font-size:18px;margin-top:32px;border-bottom:1px solid #ddd;padding-bottom:6px}p.subtitle{color:#888;font-size:13px;margin-bottom:24px}.stats{display:flex;gap:20px;margin-bottom:24px}.stat{background:#f5f5f5;padding:16px;border-radius:8px;flex:1}.stat-label{font-size:12px;color:#888}.stat-value{font-size:22px;font-weight:bold;margin-top:4px}table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #eee}th{background:#f9f9f9;font-weight:600}@media print{body{padding:20px}}</style></head><body>
      <h1>Inventory Report — Ingredients Model</h1>
      <p class="subtitle">Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      <div class="stats">
        <div class="stat"><div class="stat-label">Total Value</div><div class="stat-value">$${stats.totalValue.toFixed(0)}</div></div>
        <div class="stat"><div class="stat-label">Waste Cost</div><div class="stat-value">$${stats.wasteCost.toFixed(2)}</div></div>
        <div class="stat"><div class="stat-label">Restocks</div><div class="stat-value">${stats.restockCount}</div></div>
        <div class="stat"><div class="stat-label">Low Stock</div><div class="stat-value">${stats.lowStockItems.length}</div></div>
      </div>
      <h2>All Ingredients</h2>
      <table><thead><tr><th>Ingredient</th><th>Stock</th><th>Unit</th><th>Cost/Unit</th><th>Value</th><th>Status</th></tr></thead><tbody>${inventoryRows}</tbody></table>
      <h2>Menu Item Margins</h2>
      <table><thead><tr><th>Item</th><th>Cost</th><th>Price</th><th>Margin $</th><th>Margin %</th></tr></thead><tbody>${marginRows}</tbody></table>
      </body></html>`);
    printWindow.document.close();
    printWindow.print();
    toast.success("PDF report opened for printing");
  }, [ingredients, stats]);

  const cards = [
    { label: "Inventory Value", value: `$${stats.totalValue.toFixed(0)}`, icon: DollarSign, color: "text-neon-green" },
    { label: "Waste Cost", value: `$${stats.wasteCost.toFixed(2)}`, icon: TrendingDown, color: "text-destructive" },
    { label: "Restocks", value: stats.restockCount, icon: Package, color: "text-gold" },
    { label: "Low Stock Items", value: stats.lowStockItems.length, icon: AlertTriangle, color: "text-neon-yellow" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl">Reports</h1>
          <p className="text-muted-foreground mt-1">Inventory intelligence & profitability analytics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="border-border"><Download className="h-4 w-4 mr-1.5" />CSV</Button>
          <Button variant="outline" size="sm" onClick={exportPDF} className="border-border"><FileText className="h-4 w-4 mr-1.5" />PDF</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <c.icon className={`h-5 w-5 ${c.color}`} />
              <span className="text-xs text-muted-foreground">{c.label}</span>
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Top Consumed Ingredients */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-vibe-purple" />
          <h2 className="font-serif text-xl">Top Consumed Ingredients</h2>
        </div>
        {stats.topConsumed.length === 0 ? (
          <p className="text-muted-foreground text-sm">No consumption data yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.topConsumed.map((item, i) => {
              const maxQty = stats.topConsumed[0]?.qty ?? 1;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-vibe-purple font-semibold">{item.qty.toLocaleString()} {item.unit}</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full">
                    <div className="h-full bg-vibe-purple/60 rounded-full" style={{ width: `${(item.qty / maxQty) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Most Profitable Menu Items */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-serif text-xl mb-4">Menu Item Profitability</h2>
        <div className="space-y-3">
          {stats.margins.map((m) => (
            <div key={m.name} className="flex items-center justify-between">
              <span className="text-sm font-medium">{m.name}</span>
              <MarginCalculator cost={m.cost} price={m.price} compact />
            </div>
          ))}
        </div>
      </div>

      {/* Low Margin Alerts */}
      {stats.lowMarginItems.length > 0 && (
        <div className="glass-card rounded-xl p-6 border border-destructive/20">
          <h2 className="font-serif text-xl mb-4 text-destructive">⚠️ Low Margin Alerts (&lt;30%)</h2>
          <div className="space-y-3">
            {stats.lowMarginItems.map((m) => (
              <div key={m.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{m.name}</span>
                <MarginCalculator cost={m.cost} price={m.price} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Days of Stock Remaining */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-neon-cyan" />
          <h2 className="font-serif text-xl">Days of Stock Remaining</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ingredients.slice(0, 16).map((ing) => {
            const days = getDaysOfStockRemaining(ing.id);
            const color = days < 3 ? "text-destructive" : days < 7 ? "text-neon-yellow" : "text-neon-green";
            return (
              <div key={ing.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                <span className="text-xs text-muted-foreground truncate mr-2">{ing.name}</span>
                <span className={`text-xs font-bold ${color}`}>{days >= 999 ? "∞" : `${days}d`}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Waste Items */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-serif text-xl mb-4">Top Waste Items</h2>
        {stats.topWasteList.length === 0 ? (
          <p className="text-muted-foreground text-sm">No waste recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.topWasteList.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm text-destructive font-semibold">{item.count} {item.unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Low Stock Alert List */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-serif text-xl mb-4">Low Stock Alerts</h2>
        {stats.lowStockItems.length === 0 ? (
          <p className="text-muted-foreground text-sm">All ingredients are well stocked.</p>
        ) : (
          <div className="space-y-3">
            {stats.lowStockItems.map((ing) => (
              <div key={ing.id} className="flex items-center justify-between">
                <span className="text-sm font-medium">{ing.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neon-yellow font-semibold">{ing.currentStock} {ing.unit}</span>
                  <span className="text-xs text-muted-foreground">(reorder at {ing.reorderLevel})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
