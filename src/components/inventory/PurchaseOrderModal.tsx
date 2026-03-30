import { useState } from "react";
import { Supplier, Ingredient, PurchaseOrderItem } from "@/data/ingredients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2 } from "lucide-react";

interface Props {
  suppliers: Supplier[];
  ingredients: Ingredient[];
  onClose: () => void;
  onCreate: (supplierId: string, items: PurchaseOrderItem[], expectedDelivery: string) => void;
}

export default function PurchaseOrderModal({ suppliers, ingredients, onClose, onCreate }: Props) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? "");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [lines, setLines] = useState<{ ingredientId: string; quantity: string; unitCost: string }[]>([
    { ingredientId: "", quantity: "", unitCost: "" },
  ]);

  const supplier = suppliers.find((s) => s.id === supplierId);
  const supplierIngredients = ingredients.filter((i) => i.supplierId === supplierId);

  const addLine = () => setLines((p) => [...p, { ingredientId: "", quantity: "", unitCost: "" }]);
  const removeLine = (i: number) => setLines((p) => p.filter((_, idx) => idx !== i));

  const updateLine = (i: number, field: string, value: string) => {
    setLines((prev) => prev.map((l, idx) => {
      if (idx !== i) return l;
      const updated = { ...l, [field]: value };
      // Auto-fill unit cost when ingredient selected
      if (field === "ingredientId") {
        const ing = ingredients.find((x) => x.id === value);
        if (ing) updated.unitCost = ing.costPerUnit.toString();
      }
      return updated;
    }));
  };

  const totalCost = lines.reduce((s, l) => {
    const q = parseFloat(l.quantity) || 0;
    const c = parseFloat(l.unitCost) || 0;
    return s + q * c;
  }, 0);

  const handleSubmit = () => {
    if (!supplierId || !expectedDelivery) return;
    const validLines = lines.filter((l) => l.ingredientId && parseFloat(l.quantity) > 0);
    if (validLines.length === 0) return;
    const items: PurchaseOrderItem[] = validLines.map((l) => ({
      ingredientId: l.ingredientId,
      quantity: parseFloat(l.quantity),
      unitCost: parseFloat(l.unitCost) || 0,
    }));
    onCreate(supplierId, items, expectedDelivery);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="glass-card rounded-xl p-6 w-full max-w-lg space-y-4 border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl">New Purchase Order</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>

        {/* Supplier select */}
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Supplier</label>
          <select
            value={supplierId}
            onChange={(e) => { setSupplierId(e.target.value); setLines([{ ingredientId: "", quantity: "", unitCost: "" }]); }}
            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground"
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Expected delivery */}
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Expected Delivery</label>
          <Input type="date" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} className="bg-secondary border-border" />
        </div>

        {/* Line items */}
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">Items</label>
          {lines.map((line, i) => (
            <div key={i} className="flex gap-2 items-start">
              <select
                value={line.ingredientId}
                onChange={(e) => updateLine(i, "ingredientId", e.target.value)}
                className="flex-1 bg-secondary border border-border rounded-md px-2 py-2 text-sm text-foreground"
              >
                <option value="">Select ingredient</option>
                {supplierIngredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Qty"
                value={line.quantity}
                onChange={(e) => updateLine(i, "quantity", e.target.value)}
                className="w-20 bg-secondary border-border"
                min="1"
              />
              <Input
                type="number"
                placeholder="Cost"
                value={line.unitCost}
                onChange={(e) => updateLine(i, "unitCost", e.target.value)}
                className="w-20 bg-secondary border-border"
                step="0.001"
              />
              {lines.length > 1 && (
                <button onClick={() => removeLine(i)} className="text-muted-foreground hover:text-destructive mt-2">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addLine} className="text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add Line
          </Button>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Total Cost</span>
          <span className="font-bold text-foreground">${totalCost.toFixed(2)}</span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-gold text-primary-foreground hover:bg-gold-dark" onClick={handleSubmit}>Create PO</Button>
        </div>
      </div>
    </div>
  );
}
