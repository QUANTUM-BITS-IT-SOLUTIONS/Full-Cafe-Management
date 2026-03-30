import { useState, useEffect } from "react";
import { Ingredient } from "@/data/ingredients";
import { useInventory } from "@/context/InventoryContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  ingredient?: Ingredient | null; // null = add mode
  onClose: () => void;
}

export default function IngredientFormModal({ ingredient, onClose }: Props) {
  const { suppliers, setIngredients } = useInventory();
  const isEdit = !!ingredient;

  const [form, setForm] = useState({
    name: "",
    unit: "g",
    currentStock: 0,
    reorderLevel: 0,
    safetyStock: 0,
    costPerUnit: 0,
    supplierId: suppliers[0]?.id ?? "",
  });

  useEffect(() => {
    if (ingredient) {
      setForm({
        name: ingredient.name,
        unit: ingredient.unit,
        currentStock: ingredient.currentStock,
        reorderLevel: ingredient.reorderLevel,
        safetyStock: ingredient.safetyStock,
        costPerUnit: ingredient.costPerUnit,
        supplierId: ingredient.supplierId,
      });
    }
  }, [ingredient]);

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (isEdit && ingredient) {
      setIngredients((prev) =>
        prev.map((i) =>
          i.id === ingredient.id
            ? { ...i, ...form }
            : i
        )
      );
      toast.success(`Updated ${form.name}`);
    } else {
      const newIng: Ingredient = {
        id: `ing-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        ...form,
        lastRestocked: new Date().toISOString(),
      };
      setIngredients((prev) => [...prev, newIng]);
      toast.success(`Added ${form.name}`);
    }
    onClose();
  };

  const handleDelete = () => {
    if (ingredient && confirm(`Delete "${ingredient.name}"? This cannot be undone.`)) {
      setIngredients((prev) => prev.filter((i) => i.id !== ingredient.id));
      toast.success(`Deleted ${ingredient.name}`);
      onClose();
    }
  };

  const set = (key: string, value: string | number) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-serif text-xl font-bold">{isEdit ? "Edit Ingredient" : "Add Ingredient"}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-secondary border-border" placeholder="e.g. Coffee Beans" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Unit</label>
              <select value={form.unit} onChange={(e) => set("unit", e.target.value)} className="w-full h-10 rounded-md border border-border bg-secondary px-3 text-sm">
                <option value="g">Grams (g)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="pieces">Pieces</option>
                <option value="units">Units</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="L">Liters (L)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Cost per Unit ($)</label>
              <Input type="number" step="0.001" min="0" value={form.costPerUnit} onChange={(e) => set("costPerUnit", parseFloat(e.target.value) || 0)} className="bg-secondary border-border" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Current Stock</label>
              <Input type="number" min="0" value={form.currentStock} onChange={(e) => set("currentStock", parseFloat(e.target.value) || 0)} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Reorder Level</label>
              <Input type="number" min="0" value={form.reorderLevel} onChange={(e) => set("reorderLevel", parseFloat(e.target.value) || 0)} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Safety Stock</label>
              <Input type="number" min="0" value={form.safetyStock} onChange={(e) => set("safetyStock", parseFloat(e.target.value) || 0)} className="bg-secondary border-border" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Supplier</label>
            <select value={form.supplierId} onChange={(e) => set("supplierId", e.target.value)} className="w-full h-10 rounded-md border border-border bg-secondary px-3 text-sm">
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-border flex items-center gap-2">
          {isEdit && (
            <Button variant="destructive" size="sm" onClick={handleDelete} className="mr-auto">
              Delete
            </Button>
          )}
          <div className={`flex gap-2 ${!isEdit ? "ml-auto" : ""}`}>
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/80">
              {isEdit ? "Save Changes" : "Add Ingredient"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
