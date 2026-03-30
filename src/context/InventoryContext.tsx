import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import {
  Ingredient, Recipe, StockMovement, Supplier, PurchaseOrder, PurchaseOrderItem,
  initialIngredients, initialRecipes, initialStockMovements, initialSuppliers, initialPurchaseOrders,
} from "@/data/ingredients";
import { menuItems } from "@/data/menu";

interface InventoryContextValue {
  // State
  ingredients: Ingredient[];
  recipes: Recipe[];
  stockMovements: StockMovement[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];

  // Order flow
  checkAvailability: (menuItemId: string, quantity: number) => { available: boolean; shortIngredients: { name: string; need: number; have: number; unit: string }[] };
  deductByOrder: (orderId: string, cartItems: { menuItem: { id: string }; quantity: number }[]) => void;

  // Cost & Margins
  getMenuItemCost: (menuItemId: string) => number;
  getMargin: (menuItemId: string) => { cost: number; price: number; marginDollars: number; marginPercent: number };

  // Stock ops
  restockIngredient: (ingredientId: string, quantity: number, note?: string) => void;
  recordWaste: (ingredientId: string, quantity: number, note: string) => void;
  adjustStock: (ingredientId: string, quantity: number, note: string) => void;

  // Purchase orders
  createPurchaseOrder: (supplierId: string, items: PurchaseOrderItem[], expectedDelivery: string) => void;
  receivePurchaseOrder: (poId: string) => void;
  cancelPurchaseOrder: (poId: string) => void;

  // Alerts & analytics
  getLowStockAlerts: () => Ingredient[];
  getDaysOfStockRemaining: (ingredientId: string) => number;

  // Setters for direct manipulation
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [recipes] = useState<Recipe[]>(initialRecipes);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [suppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);

  const recipeMap = useMemo(() => {
    const m = new Map<string, Recipe>();
    recipes.forEach((r) => m.set(r.menuItemId, r));
    return m;
  }, [recipes]);

  const ingredientMap = useMemo(() => {
    const m = new Map<string, Ingredient>();
    ingredients.forEach((i) => m.set(i.id, i));
    return m;
  }, [ingredients]);

  const addMovement = useCallback((m: Omit<StockMovement, "id">) => {
    const movement: StockMovement = { ...m, id: `sm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    setStockMovements((prev) => [movement, ...prev]);
  }, []);

  const checkAvailability = useCallback((menuItemId: string, quantity: number) => {
    const recipe = recipeMap.get(menuItemId);
    if (!recipe) return { available: true, shortIngredients: [] };
    const shortIngredients: { name: string; need: number; have: number; unit: string }[] = [];
    for (const ri of recipe.ingredients) {
      const ing = ingredientMap.get(ri.ingredientId);
      if (!ing) continue;
      const need = ri.quantityRequired * quantity;
      if (ing.currentStock < need) {
        shortIngredients.push({ name: ing.name, need, have: ing.currentStock, unit: ing.unit });
      }
    }
    return { available: shortIngredients.length === 0, shortIngredients };
  }, [recipeMap, ingredientMap]);

  const deductByOrder = useCallback((orderId: string, cartItems: { menuItem: { id: string }; quantity: number }[]) => {
    const deductions = new Map<string, number>();
    cartItems.forEach(({ menuItem, quantity }) => {
      const recipe = recipeMap.get(menuItem.id);
      if (!recipe) return;
      recipe.ingredients.forEach((ri) => {
        const prev = deductions.get(ri.ingredientId) || 0;
        deductions.set(ri.ingredientId, prev + ri.quantityRequired * quantity);
      });
    });

    setIngredients((prev) =>
      prev.map((ing) => {
        const deduct = deductions.get(ing.id);
        if (!deduct) return ing;
        return { ...ing, currentStock: Math.max(0, ing.currentStock - deduct) };
      })
    );

    deductions.forEach((qty, ingredientId) => {
      const ing = ingredientMap.get(ingredientId);
      addMovement({
        ingredientId,
        type: "sale",
        quantity: -qty,
        referenceId: orderId,
        note: `Order ${orderId} — ${ing?.name ?? ingredientId}`,
        timestamp: new Date().toISOString(),
      });
    });
  }, [recipeMap, ingredientMap, addMovement]);

  const getMenuItemCost = useCallback((menuItemId: string) => {
    const recipe = recipeMap.get(menuItemId);
    if (!recipe) return 0;
    return recipe.ingredients.reduce((sum, ri) => {
      const ing = ingredientMap.get(ri.ingredientId);
      return sum + (ing ? ing.costPerUnit * ri.quantityRequired : 0);
    }, 0);
  }, [recipeMap, ingredientMap]);

  const getMargin = useCallback((menuItemId: string) => {
    const cost = getMenuItemCost(menuItemId);
    const item = menuItems.find((m) => m.id === menuItemId);
    const price = item?.price ?? 0;
    const marginDollars = price - cost;
    const marginPercent = price > 0 ? (marginDollars / price) * 100 : 0;
    return { cost, price, marginDollars, marginPercent };
  }, [getMenuItemCost]);

  const restockIngredient = useCallback((ingredientId: string, quantity: number, note?: string) => {
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredientId
          ? { ...i, currentStock: i.currentStock + quantity, lastRestocked: new Date().toISOString() }
          : i
      )
    );
    addMovement({
      ingredientId,
      type: "restock",
      quantity,
      note: note || "Manual restock",
      timestamp: new Date().toISOString(),
    });
  }, [addMovement]);

  const recordWaste = useCallback((ingredientId: string, quantity: number, note: string) => {
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredientId
          ? { ...i, currentStock: Math.max(0, i.currentStock - quantity) }
          : i
      )
    );
    addMovement({
      ingredientId,
      type: "waste",
      quantity: -quantity,
      note,
      timestamp: new Date().toISOString(),
    });
  }, [addMovement]);

  const adjustStock = useCallback((ingredientId: string, quantity: number, note: string) => {
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredientId
          ? { ...i, currentStock: Math.max(0, i.currentStock + quantity) }
          : i
      )
    );
    addMovement({
      ingredientId,
      type: "adjustment",
      quantity,
      note,
      timestamp: new Date().toISOString(),
    });
  }, [addMovement]);

  const createPurchaseOrder = useCallback((supplierId: string, items: PurchaseOrderItem[], expectedDelivery: string) => {
    const totalCost = items.reduce((s, i) => s + i.quantity * i.unitCost, 0);
    const po: PurchaseOrder = {
      id: `po-${Date.now()}`,
      supplierId,
      items,
      status: "ordered",
      expectedDelivery,
      createdAt: new Date().toISOString(),
      totalCost,
    };
    setPurchaseOrders((prev) => [po, ...prev]);
  }, []);

  const receivePurchaseOrder = useCallback((poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== poId || po.status !== "ordered") return po;
        // Restock each ingredient
        po.items.forEach((item) => {
          restockIngredient(item.ingredientId, item.quantity, `PO ${po.id} received`);
        });
        return { ...po, status: "received" as const, receivedAt: new Date().toISOString() };
      })
    );
  }, [restockIngredient]);

  const cancelPurchaseOrder = useCallback((poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => po.id === poId ? { ...po, status: "cancelled" as const } : po)
    );
  }, []);

  const getLowStockAlerts = useCallback(() => {
    return ingredients.filter((i) => i.currentStock <= i.reorderLevel);
  }, [ingredients]);

  const getDaysOfStockRemaining = useCallback((ingredientId: string) => {
    const ing = ingredientMap.get(ingredientId);
    if (!ing) return 0;
    // Calculate avg daily consumption from last 7 days of sale movements
    const sevenDaysAgo = Date.now() - 7 * 86400000;
    const recentSales = stockMovements.filter(
      (m) => m.ingredientId === ingredientId && m.type === "sale" && new Date(m.timestamp).getTime() > sevenDaysAgo
    );
    const totalConsumed = recentSales.reduce((s, m) => s + Math.abs(m.quantity), 0);
    const avgDaily = totalConsumed / 7;
    if (avgDaily === 0) return 999;
    return Math.floor(ing.currentStock / avgDaily);
  }, [ingredientMap, stockMovements]);

  const value: InventoryContextValue = {
    ingredients, recipes, stockMovements, suppliers, purchaseOrders,
    checkAvailability, deductByOrder,
    getMenuItemCost, getMargin,
    restockIngredient, recordWaste, adjustStock,
    createPurchaseOrder, receivePurchaseOrder, cancelPurchaseOrder,
    getLowStockAlerts, getDaysOfStockRemaining,
    setIngredients,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
