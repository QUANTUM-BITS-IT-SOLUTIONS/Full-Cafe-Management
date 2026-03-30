import InventoryStats from "@/components/inventory/InventoryStats";
import StockLevelsTab from "@/components/inventory/StockLevelsTab";

export default function StockLevelsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Stock Levels</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage your raw ingredient stock.</p>
      </div>
      <InventoryStats />
      <StockLevelsTab />
    </div>
  );
}
