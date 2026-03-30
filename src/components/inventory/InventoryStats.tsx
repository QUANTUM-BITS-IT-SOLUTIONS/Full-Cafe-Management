import { useInventory } from "@/context/InventoryContext";
import { Package, AlertTriangle, TrendingDown, DollarSign } from "lucide-react";

export default function InventoryStats() {
  const { ingredients, getLowStockAlerts, getMargin, recipes } = useInventory();

  const totalIngredients = ingredients.length;
  const lowStockCount = getLowStockAlerts().length;
  const outOfStockCount = ingredients.filter((i) => i.currentStock === 0).length;
  const totalValue = ingredients.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0);

  // Avg margin across all recipes
  const margins = recipes.map((r) => getMargin(r.menuItemId).marginPercent);
  const avgMargin = margins.length > 0 ? margins.reduce((a, b) => a + b, 0) / margins.length : 0;

  const stats = [
    { label: "Ingredients", value: totalIngredients, icon: Package, accent: "text-gold" },
    { label: "Low Stock", value: lowStockCount, icon: AlertTriangle, accent: "text-neon-yellow" },
    { label: "Out of Stock", value: outOfStockCount, icon: TrendingDown, accent: "text-destructive" },
    { label: "Inventory Value", value: `$${totalValue.toFixed(2)}`, icon: DollarSign, accent: "text-neon-green" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass-card rounded-xl p-5">
          <s.icon className={`h-5 w-5 ${s.accent} mb-3`} />
          <p className="text-2xl font-bold">{s.value}</p>
          <p className="text-sm text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
