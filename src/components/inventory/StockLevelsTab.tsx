import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Ingredient } from "@/data/ingredients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Minus, Trash2, ArrowUpDown, PlusCircle, Pencil } from "lucide-react";
import RestockModal from "./RestockModal";
import WasteEntryModal from "./WasteEntryModal";
import IngredientFormModal from "./IngredientFormModal";

type SortKey = "name" | "stock" | "supplier" | "cost";

export default function StockLevelsTab() {
  const { ingredients, restockIngredient, recordWaste, adjustStock, suppliers, getDaysOfStockRemaining } = useInventory();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [restockItem, setRestockItem] = useState<Ingredient | null>(null);
  const [wasteItem, setWasteItem] = useState<Ingredient | null>(null);
  const [formItem, setFormItem] = useState<Ingredient | null | undefined>(undefined); // undefined=closed, null=add, Ingredient=edit

  const getSupplierName = (supplierId: string) => suppliers.find((s) => s.id === supplierId)?.name ?? supplierId;

  const filtered = ingredients
    .filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || getSupplierName(i.supplierId).toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (filter === "low") return i.currentStock > 0 && i.currentStock <= i.reorderLevel;
      if (filter === "out") return i.currentStock === 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stock") return a.currentStock - b.currentStock;
      if (sortBy === "supplier") return getSupplierName(a.supplierId).localeCompare(getSupplierName(b.supplierId));
      if (sortBy === "cost") return a.costPerUnit - b.costPerUnit;
      return 0;
    });

  const getStatus = (i: Ingredient) => {
    if (i.currentStock === 0) return { label: "Out of Stock", cls: "bg-destructive/10 text-destructive" };
    if (i.currentStock <= i.safetyStock) return { label: "Critical", cls: "bg-destructive/10 text-destructive" };
    if (i.currentStock <= i.reorderLevel) return { label: "Low", cls: "bg-neon-yellow/10 text-neon-yellow" };
    return { label: "OK", cls: "bg-neon-green/10 text-neon-green" };
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="sm" onClick={() => setFormItem(null)} className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5">
          <PlusCircle className="h-4 w-4" /> Add Ingredient
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ingredients or suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
        </div>
        <div className="flex gap-2">
          {(["all", "low", "out"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-gold text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {f === "all" ? "All" : f === "low" ? "Low Stock" : "Out of Stock"}
            </button>
          ))}
        </div>
        <button onClick={() => setSortBy((s) => (s === "stock" ? "name" : s === "name" ? "supplier" : s === "supplier" ? "cost" : "stock"))} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary text-xs text-muted-foreground hover:text-foreground">
          <ArrowUpDown className="h-3 w-3" /> Sort: {sortBy}
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4 font-medium">Ingredient</th>
                <th className="text-left p-4 font-medium">Stock</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Reorder Lvl</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Cost/Unit</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Supplier</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Days Left</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ing) => {
                const status = getStatus(ing);
                const daysLeft = getDaysOfStockRemaining(ing.id);
                const stockPct = ing.reorderLevel > 0 ? Math.min(100, (ing.currentStock / (ing.reorderLevel * 3)) * 100) : 100;
                return (
                  <tr key={ing.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{ing.name}</div>
                      <div className="text-xs text-muted-foreground">{ing.unit}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{ing.currentStock.toLocaleString()}</div>
                      <div className="w-24 h-1.5 bg-secondary rounded-full mt-1">
                        <div
                          className={`h-full rounded-full transition-all ${stockPct > 50 ? "bg-neon-green" : stockPct > 25 ? "bg-neon-yellow" : "bg-destructive"}`}
                          style={{ width: `${stockPct}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{ing.reorderLevel}</td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground">${ing.costPerUnit.toFixed(3)}</td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground text-xs">{getSupplierName(ing.supplierId)}</td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-xs font-medium ${daysLeft < 3 ? "text-destructive" : daysLeft < 7 ? "text-neon-yellow" : "text-muted-foreground"}`}>
                        {daysLeft >= 999 ? "∞" : `${daysLeft}d`}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => adjustStock(ing.id, 1, "Quick +1")} className="p-1.5 text-muted-foreground hover:text-foreground" title="Add 1"><Plus className="h-4 w-4" /></button>
                        <button onClick={() => adjustStock(ing.id, -1, "Quick -1")} className="p-1.5 text-muted-foreground hover:text-foreground" title="Remove 1"><Minus className="h-4 w-4" /></button>
                        <button onClick={() => setWasteItem(ing)} className="p-1.5 text-muted-foreground hover:text-destructive" title="Record waste"><Trash2 className="h-4 w-4" /></button>
                        <button onClick={() => setFormItem(ing)} className="p-1.5 text-muted-foreground hover:text-accent-foreground" title="Edit ingredient"><Pencil className="h-4 w-4" /></button>
                        <Button size="sm" variant="outline" className="ml-1 border-gold/30 text-gold hover:bg-gold hover:text-primary-foreground text-xs" onClick={() => setRestockItem(ing)}>
                          Restock
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No ingredients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {restockItem && (
        <RestockModal
          ingredient={restockItem}
          onClose={() => setRestockItem(null)}
          onRestock={(id, qty) => { restockIngredient(id, qty); setRestockItem(null); }}
        />
      )}
      {wasteItem && (
        <WasteEntryModal
          ingredient={wasteItem}
          onClose={() => setWasteItem(null)}
          onRecord={(id, qty, note) => { recordWaste(id, qty, note); }}
        />
      )}
      {formItem !== undefined && (
        <IngredientFormModal
          ingredient={formItem}
          onClose={() => setFormItem(undefined)}
        />
      )}
    </div>
  );
}
