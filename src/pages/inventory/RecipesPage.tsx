import { useInventory } from "@/context/InventoryContext";
import { menuItems } from "@/data/menu";
import MarginCalculator from "@/components/inventory/MarginCalculator";
import { BookOpen } from "lucide-react";

export default function RecipesPage() {
  const { recipes, ingredients, getMargin, getMenuItemCost } = useInventory();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Recipes</h1>
        <p className="text-muted-foreground mt-1">Ingredient breakdowns and profit margins for each menu item.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {recipes.map((recipe) => {
          const menuItem = menuItems.find((m) => m.id === recipe.menuItemId);
          if (!menuItem) return null;
          const margin = getMargin(recipe.menuItemId);
          const cost = getMenuItemCost(recipe.menuItemId);
          const marginColor = margin.marginPercent >= 60 ? "border-neon-green/20" : margin.marginPercent >= 30 ? "border-neon-yellow/20" : "border-destructive/20";

          return (
            <div key={recipe.menuItemId} className={`glass-card rounded-xl p-5 space-y-4 border ${marginColor}`}>
              <div className="flex items-start gap-3">
                <img src={menuItem.image} alt={menuItem.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg font-semibold">{menuItem.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{menuItem.category.replace("-", " ")}</p>
                </div>
                <MarginCalculator cost={cost} price={menuItem.price} compact />
              </div>

              {/* Ingredient breakdown */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" /> Ingredients per serving
                </div>
                {recipe.ingredients.map((ri) => {
                  const ing = ingredients.find((i) => i.id === ri.ingredientId);
                  if (!ing) return null;
                  const lineCost = ing.costPerUnit * ri.quantityRequired;
                  return (
                    <div key={ri.ingredientId} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{ing.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{ri.quantityRequired} {ing.unit}</span>
                        <span className="text-xs font-medium w-14 text-right">${lineCost.toFixed(3)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cost summary */}
              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Recipe Cost</span>
                  <span className="font-medium">${cost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Menu Price</span>
                  <span className="font-medium">${menuItem.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Gross Margin</span>
                  <span className={margin.marginPercent >= 60 ? "text-neon-green" : margin.marginPercent >= 30 ? "text-neon-yellow" : "text-destructive"}>
                    ${margin.marginDollars.toFixed(2)} ({margin.marginPercent.toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
