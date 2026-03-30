export interface InventoryItem {
  menuItemId: string;
  stock: number;
  reorderLevel: number;
  unit: string;
  supplier: string;
  costPerUnit: number;
  lastRestocked: string;
}

export interface StockLog {
  id: string;
  menuItemId: string;
  type: "restock" | "sold" | "waste" | "adjustment";
  quantity: number;
  note: string;
  timestamp: string;
}

export const initialInventory: InventoryItem[] = [
  { menuItemId: "1", stock: 120, reorderLevel: 30, unit: "shots", supplier: "Origin Roasters", costPerUnit: 0.45, lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { menuItemId: "2", stock: 85, reorderLevel: 25, unit: "cups", supplier: "Origin Roasters", costPerUnit: 0.6, lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },
  { menuItemId: "3", stock: 70, reorderLevel: 20, unit: "cups", supplier: "Origin Roasters", costPerUnit: 0.65, lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { menuItemId: "4", stock: 40, reorderLevel: 15, unit: "cups", supplier: "Origin Roasters", costPerUnit: 0.8, lastRestocked: new Date(Date.now() - 4 * 86400000).toISOString() },
  { menuItemId: "5", stock: 55, reorderLevel: 20, unit: "cups", supplier: "Kyoto Matcha Co.", costPerUnit: 1.2, lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { menuItemId: "6", stock: 90, reorderLevel: 30, unit: "cups", supplier: "Origin Roasters", costPerUnit: 0.5, lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { menuItemId: "7", stock: 60, reorderLevel: 20, unit: "cups", supplier: "Origin Roasters", costPerUnit: 0.55, lastRestocked: new Date(Date.now() - 5 * 86400000).toISOString() },
  { menuItemId: "8", stock: 35, reorderLevel: 15, unit: "cups", supplier: "Kyoto Matcha Co.", costPerUnit: 1.1, lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },
  { menuItemId: "9", stock: 50, reorderLevel: 20, unit: "servings", supplier: "Local Farms", costPerUnit: 0.4, lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { menuItemId: "10", stock: 18, reorderLevel: 20, unit: "pieces", supplier: "Maison Boulangerie", costPerUnit: 1.5, lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { menuItemId: "11", stock: 12, reorderLevel: 15, unit: "pieces", supplier: "Maison Boulangerie", costPerUnit: 1.8, lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { menuItemId: "12", stock: 8, reorderLevel: 10, unit: "pieces", supplier: "Maison Boulangerie", costPerUnit: 1.6, lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },
  { menuItemId: "13", stock: 0, reorderLevel: 10, unit: "pieces", supplier: "Maison Boulangerie", costPerUnit: 2.0, lastRestocked: new Date(Date.now() - 7 * 86400000).toISOString() },
  { menuItemId: "14", stock: 25, reorderLevel: 10, unit: "servings", supplier: "Local Farms", costPerUnit: 3.5, lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { menuItemId: "15", stock: 20, reorderLevel: 10, unit: "bowls", supplier: "Local Farms", costPerUnit: 2.8, lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { menuItemId: "16", stock: 15, reorderLevel: 8, unit: "servings", supplier: "Local Farms", costPerUnit: 4.0, lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { menuItemId: "17", stock: 18, reorderLevel: 8, unit: "servings", supplier: "Local Farms", costPerUnit: 3.2, lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { menuItemId: "18", stock: 22, reorderLevel: 10, unit: "servings", supplier: "Artisan Dairy", costPerUnit: 2.5, lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { menuItemId: "19", stock: 14, reorderLevel: 8, unit: "bowls", supplier: "Ocean Fresh", costPerUnit: 5.0, lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
];

export const initialStockLogs: StockLog[] = [
  { id: "sl-1", menuItemId: "10", type: "sold", quantity: -2, note: "Order ORD-005", timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: "sl-2", menuItemId: "1", type: "restock", quantity: 50, note: "Weekly delivery from Origin Roasters", timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "sl-3", menuItemId: "13", type: "waste", quantity: -3, note: "Expired stock", timestamp: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "sl-4", menuItemId: "11", type: "sold", quantity: -1, note: "Order ORD-003", timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: "sl-5", menuItemId: "5", type: "restock", quantity: 30, note: "Matcha restock", timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
];
