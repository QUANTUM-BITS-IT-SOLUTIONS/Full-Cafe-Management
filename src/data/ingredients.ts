// ==========================================
// Production-Grade Inventory Data Model
// ==========================================

export interface Ingredient {
  id: string;
  name: string;
  unit: string; // g, ml, units, pieces
  currentStock: number;
  reorderLevel: number;
  safetyStock: number;
  costPerUnit: number; // cost per 1 unit (g, ml, etc.)
  supplierId: string;
  lastRestocked: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantityRequired: number; // per 1 menu item
}

export interface Recipe {
  menuItemId: string;
  ingredients: RecipeIngredient[];
}

export interface StockMovement {
  id: string;
  ingredientId: string;
  type: "sale" | "restock" | "waste" | "adjustment" | "spoilage";
  quantity: number; // negative for deductions
  referenceId?: string; // order ID or PO ID
  note: string;
  timestamp: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  ingredientIds: string[];
}

export interface PurchaseOrderItem {
  ingredientId: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  status: "draft" | "ordered" | "received" | "cancelled";
  expectedDelivery: string;
  createdAt: string;
  receivedAt?: string;
  totalCost: number;
}

// ==========================================
// Suppliers
// ==========================================

export const initialSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Origin Roasters",
    contact: "+1 555-0101",
    email: "orders@originroasters.com",
    ingredientIds: ["ing-coffee-beans"],
  },
  {
    id: "sup-2",
    name: "Fresh Dairy Co.",
    contact: "+1 555-0102",
    email: "supply@freshdairy.com",
    ingredientIds: ["ing-whole-milk", "ing-cream"],
  },
  {
    id: "sup-3",
    name: "Plant Milk Plus",
    contact: "+1 555-0103",
    email: "hello@plantmilkplus.com",
    ingredientIds: ["ing-oat-milk", "ing-almond-milk", "ing-soy-milk"],
  },
  {
    id: "sup-4",
    name: "Kyoto Matcha Co.",
    contact: "+1 555-0104",
    email: "wholesale@kyotomatcha.jp",
    ingredientIds: ["ing-matcha"],
  },
  {
    id: "sup-5",
    name: "Sweet & Spice Supplies",
    contact: "+1 555-0105",
    email: "orders@sweetspice.com",
    ingredientIds: ["ing-sugar", "ing-vanilla-syrup", "ing-caramel-syrup", "ing-chocolate-syrup", "ing-cinnamon", "ing-honey", "ing-chili-flakes"],
  },
  {
    id: "sup-6",
    name: "Maison Boulangerie",
    contact: "+1 555-0106",
    email: "supply@maisonboulangerie.com",
    ingredientIds: ["ing-croissant-dough", "ing-chocolate-filling", "ing-almond-flour", "ing-brioche-buns"],
  },
  {
    id: "sup-7",
    name: "Local Farms Produce",
    contact: "+1 555-0107",
    email: "orders@localfarms.com",
    ingredientIds: ["ing-eggs", "ing-avocado", "ing-mixed-greens", "ing-lemons", "ing-berries", "ing-roasted-peppers", "ing-pomegranate", "ing-edamame"],
  },
  {
    id: "sup-8",
    name: "Ocean Fresh Seafood",
    contact: "+1 555-0108",
    email: "orders@oceanfresh.com",
    ingredientIds: ["ing-tuna", "ing-smoked-salmon"],
  },
  {
    id: "sup-9",
    name: "Artisan Dairy & Cheese",
    contact: "+1 555-0109",
    email: "supply@artisandairy.com",
    ingredientIds: ["ing-halloumi", "ing-cheese-blend", "ing-greek-yogurt", "ing-cream-cheese"],
  },
  {
    id: "sup-10",
    name: "Gourmet Essentials",
    contact: "+1 555-0110",
    email: "orders@gourmetessentials.com",
    ingredientIds: ["ing-truffle-oil", "ing-tahini", "ing-sesame-oil", "ing-sourdough", "ing-granola", "ing-rice", "ing-lavender"],
  },
  {
    id: "sup-11",
    name: "PackRight Disposables",
    contact: "+1 555-0111",
    email: "bulk@packright.com",
    ingredientIds: ["ing-paper-cups", "ing-lids", "ing-napkins"],
  },
];

// ==========================================
// Ingredients (Raw Materials)
// ==========================================

export const initialIngredients: Ingredient[] = [
  // Coffee & Tea
  { id: "ing-coffee-beans", name: "Coffee Beans", unit: "g", currentStock: 5000, reorderLevel: 1500, safetyStock: 500, costPerUnit: 0.025, supplierId: "sup-1", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-matcha", name: "Matcha Powder", unit: "g", currentStock: 800, reorderLevel: 200, safetyStock: 100, costPerUnit: 0.12, supplierId: "sup-4", lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },

  // Dairy
  { id: "ing-whole-milk", name: "Whole Milk", unit: "ml", currentStock: 15000, reorderLevel: 5000, safetyStock: 2000, costPerUnit: 0.002, supplierId: "sup-2", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-cream", name: "Heavy Cream", unit: "ml", currentStock: 3000, reorderLevel: 1000, safetyStock: 500, costPerUnit: 0.005, supplierId: "sup-2", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },

  // Plant Milks
  { id: "ing-oat-milk", name: "Oat Milk", unit: "ml", currentStock: 8000, reorderLevel: 3000, safetyStock: 1000, costPerUnit: 0.004, supplierId: "sup-3", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-almond-milk", name: "Almond Milk", unit: "ml", currentStock: 5000, reorderLevel: 2000, safetyStock: 800, costPerUnit: 0.005, supplierId: "sup-3", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-soy-milk", name: "Soy Milk", unit: "ml", currentStock: 4000, reorderLevel: 1500, safetyStock: 600, costPerUnit: 0.003, supplierId: "sup-3", lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },

  // Sweeteners & Syrups
  { id: "ing-sugar", name: "Sugar", unit: "g", currentStock: 3000, reorderLevel: 1000, safetyStock: 500, costPerUnit: 0.003, supplierId: "sup-5", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-vanilla-syrup", name: "Vanilla Syrup", unit: "ml", currentStock: 2000, reorderLevel: 500, safetyStock: 200, costPerUnit: 0.008, supplierId: "sup-5", lastRestocked: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "ing-caramel-syrup", name: "Caramel Syrup", unit: "ml", currentStock: 1800, reorderLevel: 500, safetyStock: 200, costPerUnit: 0.009, supplierId: "sup-5", lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "ing-chocolate-syrup", name: "Chocolate Syrup", unit: "ml", currentStock: 1500, reorderLevel: 500, safetyStock: 200, costPerUnit: 0.01, supplierId: "sup-5", lastRestocked: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "ing-honey", name: "Honey", unit: "g", currentStock: 1200, reorderLevel: 400, safetyStock: 150, costPerUnit: 0.015, supplierId: "sup-5", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-cinnamon", name: "Cinnamon", unit: "g", currentStock: 500, reorderLevel: 150, safetyStock: 50, costPerUnit: 0.04, supplierId: "sup-5", lastRestocked: new Date(Date.now() - 6 * 86400000).toISOString() },

  // Bakery
  { id: "ing-croissant-dough", name: "Croissant Dough", unit: "pieces", currentStock: 45, reorderLevel: 15, safetyStock: 5, costPerUnit: 1.2, supplierId: "sup-6", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-chocolate-filling", name: "Chocolate Filling", unit: "g", currentStock: 2000, reorderLevel: 500, safetyStock: 200, costPerUnit: 0.02, supplierId: "sup-6", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-almond-flour", name: "Almond Flour", unit: "g", currentStock: 1500, reorderLevel: 500, safetyStock: 200, costPerUnit: 0.018, supplierId: "sup-6", lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "ing-brioche-buns", name: "Brioche Buns", unit: "pieces", currentStock: 30, reorderLevel: 10, safetyStock: 5, costPerUnit: 0.9, supplierId: "sup-6", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-cream-cheese", name: "Cream Cheese", unit: "g", currentStock: 1500, reorderLevel: 500, safetyStock: 200, costPerUnit: 0.012, supplierId: "sup-9", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },

  // Produce
  { id: "ing-eggs", name: "Eggs", unit: "pieces", currentStock: 120, reorderLevel: 40, safetyStock: 15, costPerUnit: 0.35, supplierId: "sup-7", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-avocado", name: "Avocado", unit: "g", currentStock: 3000, reorderLevel: 1000, safetyStock: 400, costPerUnit: 0.012, supplierId: "sup-7", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-mixed-greens", name: "Mixed Greens", unit: "g", currentStock: 2000, reorderLevel: 600, safetyStock: 200, costPerUnit: 0.008, supplierId: "sup-7", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-lemons", name: "Lemons", unit: "pieces", currentStock: 50, reorderLevel: 15, safetyStock: 5, costPerUnit: 0.4, supplierId: "sup-7", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-berries", name: "Mixed Berries", unit: "g", currentStock: 1500, reorderLevel: 500, safetyStock: 200, costPerUnit: 0.02, supplierId: "sup-7", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-roasted-peppers", name: "Roasted Peppers", unit: "g", currentStock: 1000, reorderLevel: 300, safetyStock: 100, costPerUnit: 0.015, supplierId: "sup-7", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-pomegranate", name: "Pomegranate Seeds", unit: "g", currentStock: 600, reorderLevel: 200, safetyStock: 80, costPerUnit: 0.03, supplierId: "sup-7", lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "ing-edamame", name: "Edamame", unit: "g", currentStock: 800, reorderLevel: 300, safetyStock: 100, costPerUnit: 0.012, supplierId: "sup-7", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-chili-flakes", name: "Chili Flakes", unit: "g", currentStock: 300, reorderLevel: 100, safetyStock: 30, costPerUnit: 0.05, supplierId: "sup-5", lastRestocked: new Date(Date.now() - 5 * 86400000).toISOString() },

  // Protein & Seafood
  { id: "ing-tuna", name: "Fresh Tuna", unit: "g", currentStock: 2000, reorderLevel: 600, safetyStock: 200, costPerUnit: 0.045, supplierId: "sup-8", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-smoked-salmon", name: "Smoked Salmon", unit: "g", currentStock: 1500, reorderLevel: 500, safetyStock: 200, costPerUnit: 0.06, supplierId: "sup-8", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-halloumi", name: "Halloumi Cheese", unit: "g", currentStock: 1200, reorderLevel: 400, safetyStock: 150, costPerUnit: 0.025, supplierId: "sup-9", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-cheese-blend", name: "Three-Cheese Blend", unit: "g", currentStock: 1800, reorderLevel: 600, safetyStock: 200, costPerUnit: 0.022, supplierId: "sup-9", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-greek-yogurt", name: "Greek Yogurt", unit: "g", currentStock: 2500, reorderLevel: 800, safetyStock: 300, costPerUnit: 0.008, supplierId: "sup-9", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },

  // Pantry & Grains
  { id: "ing-sourdough", name: "Sourdough Bread", unit: "g", currentStock: 3000, reorderLevel: 1000, safetyStock: 400, costPerUnit: 0.006, supplierId: "sup-10", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-granola", name: "House Granola", unit: "g", currentStock: 2000, reorderLevel: 600, safetyStock: 200, costPerUnit: 0.01, supplierId: "sup-10", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-rice", name: "Sesame Rice", unit: "g", currentStock: 3000, reorderLevel: 1000, safetyStock: 400, costPerUnit: 0.004, supplierId: "sup-10", lastRestocked: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ing-truffle-oil", name: "Truffle Oil", unit: "ml", currentStock: 400, reorderLevel: 100, safetyStock: 30, costPerUnit: 0.15, supplierId: "sup-10", lastRestocked: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "ing-tahini", name: "Tahini", unit: "g", currentStock: 800, reorderLevel: 250, safetyStock: 100, costPerUnit: 0.02, supplierId: "sup-10", lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "ing-sesame-oil", name: "Sesame Oil", unit: "ml", currentStock: 500, reorderLevel: 150, safetyStock: 50, costPerUnit: 0.03, supplierId: "sup-10", lastRestocked: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "ing-lavender", name: "Dried Lavender", unit: "g", currentStock: 200, reorderLevel: 60, safetyStock: 20, costPerUnit: 0.08, supplierId: "sup-10", lastRestocked: new Date(Date.now() - 5 * 86400000).toISOString() },

  // Disposables
  { id: "ing-paper-cups", name: "Paper Cups", unit: "pieces", currentStock: 500, reorderLevel: 150, safetyStock: 50, costPerUnit: 0.12, supplierId: "sup-11", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-lids", name: "Cup Lids", unit: "pieces", currentStock: 500, reorderLevel: 150, safetyStock: 50, costPerUnit: 0.05, supplierId: "sup-11", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ing-napkins", name: "Napkins", unit: "pieces", currentStock: 1000, reorderLevel: 300, safetyStock: 100, costPerUnit: 0.02, supplierId: "sup-11", lastRestocked: new Date(Date.now() - 1 * 86400000).toISOString() },
];

// ==========================================
// Recipes (Bill of Materials)
// ==========================================

export const initialRecipes: Recipe[] = [
  // 1 - Espresso
  { menuItemId: "1", ingredients: [
    { ingredientId: "ing-coffee-beans", quantityRequired: 18 },
    { ingredientId: "ing-paper-cups", quantityRequired: 1 },
    { ingredientId: "ing-sugar", quantityRequired: 5 },
  ]},
  // 2 - Cappuccino
  { menuItemId: "2", ingredients: [
    { ingredientId: "ing-coffee-beans", quantityRequired: 18 },
    { ingredientId: "ing-whole-milk", quantityRequired: 150 },
    { ingredientId: "ing-paper-cups", quantityRequired: 1 },
    { ingredientId: "ing-sugar", quantityRequired: 8 },
  ]},
  // 3 - Flat White
  { menuItemId: "3", ingredients: [
    { ingredientId: "ing-coffee-beans", quantityRequired: 36 },
    { ingredientId: "ing-whole-milk", quantityRequired: 180 },
    { ingredientId: "ing-paper-cups", quantityRequired: 1 },
  ]},
  // 4 - Pour Over
  { menuItemId: "4", ingredients: [
    { ingredientId: "ing-coffee-beans", quantityRequired: 25 },
    { ingredientId: "ing-paper-cups", quantityRequired: 1 },
  ]},
  // 5 - Matcha Latte
  { menuItemId: "5", ingredients: [
    { ingredientId: "ing-matcha", quantityRequired: 5 },
    { ingredientId: "ing-whole-milk", quantityRequired: 200 },
    { ingredientId: "ing-sugar", quantityRequired: 10 },
    { ingredientId: "ing-paper-cups", quantityRequired: 1 },
  ]},
  // 6 - Iced Americano
  { menuItemId: "6", ingredients: [
    { ingredientId: "ing-coffee-beans", quantityRequired: 36 },
    { ingredientId: "ing-paper-cups", quantityRequired: 1 },
    { ingredientId: "ing-lids", quantityRequired: 1 },
  ]},
  // 7 - Cold Brew
  { menuItemId: "7", ingredients: [
    { ingredientId: "ing-coffee-beans", quantityRequired: 40 },
    { ingredientId: "ing-paper-cups", quantityRequired: 1 },
    { ingredientId: "ing-lids", quantityRequired: 1 },
  ]},
  // 8 - Iced Matcha
  { menuItemId: "8", ingredients: [
    { ingredientId: "ing-matcha", quantityRequired: 5 },
    { ingredientId: "ing-oat-milk", quantityRequired: 200 },
    { ingredientId: "ing-sugar", quantityRequired: 8 },
    { ingredientId: "ing-paper-cups", quantityRequired: 1 },
    { ingredientId: "ing-lids", quantityRequired: 1 },
  ]},
  // 9 - Fresh Lemonade
  { menuItemId: "9", ingredients: [
    { ingredientId: "ing-lemons", quantityRequired: 2 },
    { ingredientId: "ing-sugar", quantityRequired: 20 },
    { ingredientId: "ing-lavender", quantityRequired: 2 },
    { ingredientId: "ing-paper-cups", quantityRequired: 1 },
    { ingredientId: "ing-lids", quantityRequired: 1 },
  ]},
  // 10 - Butter Croissant
  { menuItemId: "10", ingredients: [
    { ingredientId: "ing-croissant-dough", quantityRequired: 1 },
    { ingredientId: "ing-napkins", quantityRequired: 2 },
  ]},
  // 11 - Pain au Chocolat
  { menuItemId: "11", ingredients: [
    { ingredientId: "ing-croissant-dough", quantityRequired: 1 },
    { ingredientId: "ing-chocolate-filling", quantityRequired: 30 },
    { ingredientId: "ing-napkins", quantityRequired: 2 },
  ]},
  // 12 - Cinnamon Roll
  { menuItemId: "12", ingredients: [
    { ingredientId: "ing-croissant-dough", quantityRequired: 1 },
    { ingredientId: "ing-cinnamon", quantityRequired: 8 },
    { ingredientId: "ing-sugar", quantityRequired: 15 },
    { ingredientId: "ing-cream-cheese", quantityRequired: 30 },
    { ingredientId: "ing-napkins", quantityRequired: 2 },
  ]},
  // 13 - Almond Tart
  { menuItemId: "13", ingredients: [
    { ingredientId: "ing-almond-flour", quantityRequired: 60 },
    { ingredientId: "ing-sugar", quantityRequired: 20 },
    { ingredientId: "ing-eggs", quantityRequired: 1 },
    { ingredientId: "ing-napkins", quantityRequired: 2 },
  ]},
  // 14 - Avocado Toast
  { menuItemId: "14", ingredients: [
    { ingredientId: "ing-sourdough", quantityRequired: 200 },
    { ingredientId: "ing-avocado", quantityRequired: 150 },
    { ingredientId: "ing-eggs", quantityRequired: 2 },
    { ingredientId: "ing-chili-flakes", quantityRequired: 3 },
  ]},
  // 15 - Granola Bowl
  { menuItemId: "15", ingredients: [
    { ingredientId: "ing-granola", quantityRequired: 80 },
    { ingredientId: "ing-greek-yogurt", quantityRequired: 150 },
    { ingredientId: "ing-berries", quantityRequired: 60 },
    { ingredientId: "ing-honey", quantityRequired: 15 },
  ]},
  // 16 - Eggs Benedict
  { menuItemId: "16", ingredients: [
    { ingredientId: "ing-eggs", quantityRequired: 2 },
    { ingredientId: "ing-smoked-salmon", quantityRequired: 60 },
    { ingredientId: "ing-brioche-buns", quantityRequired: 1 },
    { ingredientId: "ing-cream", quantityRequired: 30 },
  ]},
  // 17 - Grilled Halloumi Salad
  { menuItemId: "17", ingredients: [
    { ingredientId: "ing-halloumi", quantityRequired: 100 },
    { ingredientId: "ing-mixed-greens", quantityRequired: 80 },
    { ingredientId: "ing-roasted-peppers", quantityRequired: 50 },
    { ingredientId: "ing-pomegranate", quantityRequired: 30 },
    { ingredientId: "ing-tahini", quantityRequired: 20 },
  ]},
  // 18 - Truffle Grilled Cheese
  { menuItemId: "18", ingredients: [
    { ingredientId: "ing-sourdough", quantityRequired: 160 },
    { ingredientId: "ing-cheese-blend", quantityRequired: 80 },
    { ingredientId: "ing-truffle-oil", quantityRequired: 5 },
  ]},
  // 19 - Poke Bowl
  { menuItemId: "19", ingredients: [
    { ingredientId: "ing-tuna", quantityRequired: 120 },
    { ingredientId: "ing-avocado", quantityRequired: 80 },
    { ingredientId: "ing-edamame", quantityRequired: 50 },
    { ingredientId: "ing-rice", quantityRequired: 150 },
    { ingredientId: "ing-sesame-oil", quantityRequired: 5 },
  ]},
];

// ==========================================
// Seed Stock Movements
// ==========================================

export const initialStockMovements: StockMovement[] = [
  { id: "sm-1", ingredientId: "ing-coffee-beans", type: "restock", quantity: 2000, referenceId: "po-seed-1", note: "Weekly delivery from Origin Roasters", timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "sm-2", ingredientId: "ing-whole-milk", type: "restock", quantity: 10000, referenceId: "po-seed-2", note: "Dairy delivery", timestamp: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "sm-3", ingredientId: "ing-coffee-beans", type: "sale", quantity: -180, referenceId: "ORD-001", note: "10 espresso-based drinks", timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: "sm-4", ingredientId: "ing-whole-milk", type: "sale", quantity: -1500, referenceId: "ORD-001", note: "Milk for 10 drinks", timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: "sm-5", ingredientId: "ing-whole-milk", type: "waste", quantity: -500, note: "Expired milk batch", timestamp: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "sm-6", ingredientId: "ing-croissant-dough", type: "waste", quantity: -3, note: "Over-proofed dough", timestamp: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: "sm-7", ingredientId: "ing-matcha", type: "restock", quantity: 400, referenceId: "po-seed-3", note: "Matcha restock", timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "sm-8", ingredientId: "ing-paper-cups", type: "restock", quantity: 200, note: "Cup delivery", timestamp: new Date(Date.now() - 1 * 86400000).toISOString() },
];

// ==========================================
// Seed Purchase Orders
// ==========================================

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    supplierId: "sup-1",
    items: [{ ingredientId: "ing-coffee-beans", quantity: 3000, unitCost: 0.025 }],
    status: "ordered",
    expectedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    totalCost: 75,
  },
  {
    id: "po-2",
    supplierId: "sup-2",
    items: [
      { ingredientId: "ing-whole-milk", quantity: 20000, unitCost: 0.002 },
      { ingredientId: "ing-cream", quantity: 2000, unitCost: 0.005 },
    ],
    status: "draft",
    expectedDelivery: new Date(Date.now() + 3 * 86400000).toISOString(),
    createdAt: new Date(Date.now()).toISOString(),
    totalCost: 50,
  },
];
