import { useInventory } from "@/context/InventoryContext";
import { Ingredient } from "@/data/ingredients";
import { Truck } from "lucide-react";

export default function SuppliersTab() {
  const { suppliers, ingredients } = useInventory();

  const getIngredientsBySupplier = (supplierId: string) =>
    ingredients.filter((i) => i.supplierId === supplierId);

  const getStockValue = (ings: Ingredient[]) =>
    ings.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0);

  const getLowStockCount = (ings: Ingredient[]) =>
    ings.filter((i) => i.currentStock <= i.reorderLevel).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map((supplier) => {
          const supplierIngs = getIngredientsBySupplier(supplier.id);
          const stockValue = getStockValue(supplierIngs);
          const lowCount = getLowStockCount(supplierIngs);

          return (
            <div key={supplier.id} className="glass-card rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{supplier.name}</h3>
                    <p className="text-xs text-muted-foreground">{supplier.email}</p>
                    <p className="text-xs text-muted-foreground">{supplier.contact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gold">${stockValue.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">stock value</p>
                  {lowCount > 0 && <p className="text-xs text-neon-yellow mt-1">{lowCount} low</p>}
                </div>
              </div>

              <div className="divide-y divide-border/50">
                {supplierIngs.map((ing) => (
                  <div key={ing.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <span className="text-sm">{ing.name}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className={ing.currentStock <= ing.reorderLevel ? "text-neon-yellow font-medium" : ""}>
                        {ing.currentStock.toLocaleString()} {ing.unit}
                      </span>
                      <span>${ing.costPerUnit.toFixed(3)}/{ing.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
