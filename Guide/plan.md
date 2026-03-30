

# Production-Grade Inventory Architecture Overhaul

This is a fundamental restructuring of how Aureum tracks stock -- moving from "menu item = stock unit" to a proper **ingredients + recipes** model where orders deduct raw materials, not finished products.

---

## What Changes (The Big Picture)

Currently, each menu item (e.g., "Latte") has a stock count (e.g., 120 shots). When someone orders a Latte, it deducts "1 Latte" from stock. This is unrealistic.

After this change:
- **Ingredients** are tracked (coffee beans in grams, milk in ml, sugar in grams, cups in units)
- **Recipes** define what each menu item needs (a Latte = 18g beans + 200ml milk + 10g sugar + 1 cup)
- **Orders deduct ingredients**, not menu items
- **Availability** is calculated: if any ingredient is insufficient for a recipe, the item shows "Sold Out"
- **Cost and margins** are computed from ingredient costs vs. menu prices

---

## New Data Model

### New file: `src/data/ingredients.ts`

Contains all type definitions and initial data for the new system:

**Ingredient** -- a raw material with stock tracking:
- id, name, unit (g/ml/units), currentStock, reorderLevel, safetyStock, costPerUnit, supplier, lastRestocked

**Recipe** -- links a menu item to its ingredients:
- menuItemId, ingredients: array of { ingredientId, quantityRequired }

**StockMovement** -- replaces the old StockLog, now tracks ingredient movements:
- id, ingredientId, type (sale/restock/waste/adjustment/spoilage), quantity, referenceId (order ID or PO ID), note, timestamp

**PurchaseOrder** -- for restocking:
- id, supplierId, items: array of { ingredientId, quantity, unitCost }, status (draft/ordered/received/cancelled), expectedDelivery, createdAt, receivedAt, totalCost

**Supplier** -- standalone entity:
- id, name, contact, email, ingredients supplied

**Initial data**: ~15 ingredients (coffee beans, whole milk, oat milk, almond milk, soy milk, sugar, matcha powder, chocolate syrup, vanilla syrup, caramel syrup, paper cups, croissant dough, bread/sourdough, eggs, mixed greens, tuna, avocado, halloumi, truffle oil, etc.) with realistic quantities and costs.

**Recipes**: All 19 menu items get ingredient breakdowns (e.g., Espresso = 18g beans + 1 cup; Cappuccino = 18g beans + 150ml milk + 1 cup; Avocado Toast = 200g sourdough + 150g avocado + 2 eggs + 5g chili flakes).

---

## Context Overhaul: `src/context/InventoryContext.tsx`

Complete rewrite to manage the new entities:

**State**: ingredients[], recipes[], stockMovements[], purchaseOrders[], suppliers[]

**Key functions**:
- `deductByOrder(orderId, cartItems)` -- for each cart item, look up recipe, multiply ingredient quantities by order quantity, deduct from ingredient stock, log each deduction as a stock movement
- `checkAvailability(menuItemId, quantity)` -- returns true/false by checking if all recipe ingredients have sufficient stock
- `getMenuItemCost(menuItemId)` -- sum of (ingredient cost x recipe quantity)
- `getMargin(menuItemId)` -- menu price minus recipe cost
- `restockIngredient(ingredientId, quantity)` -- add stock, log movement
- `recordWaste(ingredientId, quantity, note)` -- deduct stock, log as waste/spoilage
- `createPurchaseOrder(...)` / `receivePurchaseOrder(poId)` -- PO lifecycle that updates stock on receive
- `getLowStockAlerts()` -- ingredients where currentStock < reorderLevel
- `getDaysOfStockRemaining(ingredientId)` -- based on average daily consumption from movement history

---

## Order Flow Changes

### `src/pages/OrderPage.tsx`
- Before placing order: call `checkAvailability()` for each cart item -- if any fails, show which ingredient is short and block the order
- On submit: call `deductByOrder(orderId, items)` instead of the old per-menu-item `deductStock()`
- Show cost breakdown in admin order details

### `src/pages/MenuPage.tsx`
- Replace `getStock(item.id)` with `checkAvailability(item.id, 1)` for the "Sold Out" check
- This now checks raw material availability, not a simple counter

---

## Inventory Pages -- Complete Rebuild

### Stock Levels Page (`src/components/inventory/StockLevelsTab.tsx`)
- Table now shows **ingredients** (Coffee Beans, Milk, Sugar...) not menu items
- Columns: Name, Unit, Current Stock, Reorder Level, Safety Stock, Cost/Unit, Supplier, Status, Actions
- Status badges: "OK", "Low", "Critical", "Out of Stock"
- Progress bar based on stock vs. reorder level
- Quick adjust (+/-), waste, and restock actions operate on ingredients
- Search/filter by ingredient name or supplier

### Suppliers Page (`src/components/inventory/SuppliersTab.tsx`)
- Uses new Supplier entities with contact info
- Shows ingredients supplied by each supplier
- Stock value per supplier
- Link to create Purchase Orders from supplier cards

### Activity Log (`src/components/inventory/ActivityLogTab.tsx`)
- Shows stock movements for **ingredients**
- Columns: Time, Ingredient, Type, Qty, Reference (order ID or PO ID), Note
- Filter by movement type (sale/restock/waste/adjustment/spoilage)

### Reports Page (`src/pages/inventory/ReportsPage.tsx`)
- New sections added:
  - **Top Consumed Ingredients** -- ranked by total quantity used
  - **Ingredient Cost % of Revenue** -- pie/bar breakdown
  - **Waste Cost per Month** -- total waste in dollars
  - **Days of Stock Remaining** -- per ingredient estimate
  - **Most Profitable Menu Items** -- ranked by gross margin (price - recipe cost)
  - **Low Margin Alerts** -- items where margin < 30%
- CSV/PDF exports updated to reflect ingredients model

### Inventory Stats (`src/components/inventory/InventoryStats.tsx`)
- Updated to show: Total Ingredients, Low Stock Alerts, Total Inventory Value, Avg Margin %

### Restock Modal (`src/components/inventory/RestockModal.tsx`)
- Updated to work with ingredients instead of menu items

---

## New Pages & Components

### Purchase Orders Page
- **New file**: `src/pages/inventory/PurchaseOrdersPage.tsx`
- List of all POs with status badges (Draft, Ordered, Received, Cancelled)
- Create PO modal: select supplier, add ingredient lines with quantity and unit cost
- "Mark as Received" action: auto-restocks all ingredients and logs movements
- **New route**: `/inventory/purchase-orders`

### Recipe Management Page
- **New file**: `src/pages/inventory/RecipesPage.tsx`
- Grid of menu items, each showing its recipe (ingredient list with quantities)
- Recipe cost calculation shown per item
- Gross margin displayed (menu price - recipe cost)
- Visual indicator for margin health (green > 60%, yellow 30-60%, red < 30%)
- **New route**: `/inventory/recipes`

### Margin Calculator Component
- **New file**: `src/components/inventory/MarginCalculator.tsx`
- Used in Reports and Recipes pages
- Shows: Recipe Cost, Menu Price, Gross Margin $, Gross Margin %

---

## Navigation Updates

### `src/layouts/InventoryLayout.tsx`
Add two new sidebar items:
- "Recipes" (link to `/inventory/recipes`, icon: BookOpen)
- "Purchase Orders" (link to `/inventory/purchase-orders`, icon: FileText)

### `src/App.tsx`
Add two new routes inside the `/inventory` group:
- `/inventory/recipes` --> RecipesPage
- `/inventory/purchase-orders` --> PurchaseOrdersPage

---

## Files Summary

**New files (6)**:
1. `src/data/ingredients.ts` -- all types, initial ingredients, recipes, suppliers, seed movements
2. `src/pages/inventory/PurchaseOrdersPage.tsx` -- PO management
3. `src/pages/inventory/RecipesPage.tsx` -- recipe viewer with margins
4. `src/components/inventory/MarginCalculator.tsx` -- reusable margin display
5. `src/components/inventory/PurchaseOrderModal.tsx` -- create/edit PO modal
6. `src/components/inventory/WasteEntryModal.tsx` -- waste/spoilage recording modal

**Major rewrites (5)**:
1. `src/context/InventoryContext.tsx` -- completely new state model
2. `src/components/inventory/StockLevelsTab.tsx` -- ingredients-based table
3. `src/components/inventory/SuppliersTab.tsx` -- new supplier entity model
4. `src/components/inventory/ActivityLogTab.tsx` -- ingredient-based movements
5. `src/components/inventory/RestockModal.tsx` -- ingredient-based restock

**Significant updates (7)**:
1. `src/pages/OrderPage.tsx` -- availability check + ingredient deduction
2. `src/pages/MenuPage.tsx` -- recipe-based availability
3. `src/pages/inventory/ReportsPage.tsx` -- new analytics sections
4. `src/components/inventory/InventoryStats.tsx` -- new metrics
5. `src/layouts/InventoryLayout.tsx` -- 2 new nav items
6. `src/App.tsx` -- 2 new routes
7. `src/pages/admin/AdminInventory.tsx` -- update to use new data model

**Deleted data**:
- `src/data/inventory.ts` -- replaced entirely by `src/data/ingredients.ts`

---

## Technical Notes

- All data remains in-memory (useState) with the same localStorage-ready pattern -- no backend required
- The old `InventoryItem` type (menuItemId-based) is fully replaced by `Ingredient` (raw material-based)
- Recipe lookups use a Map for O(1) access during order processing
- Stock movement history enables calculating consumption rates and days-of-stock-remaining
- The margin calculation is: `menuPrice - SUM(ingredient.costPerUnit * recipe.quantityRequired)`
- Availability check: for each ingredient in a recipe, verify `currentStock >= quantityRequired * orderQuantity`

