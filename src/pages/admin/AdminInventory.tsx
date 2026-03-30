import InventoryStats from "@/components/inventory/InventoryStats";
import StockLevelsTab from "@/components/inventory/StockLevelsTab";
import SuppliersTab from "@/components/inventory/SuppliersTab";
import ActivityLogTab from "@/components/inventory/ActivityLogTab";
import { useState } from "react";
import { Package, Truck, ClipboardList } from "lucide-react";

const tabs = [
  { id: "stock", label: "Stock Levels", icon: Package },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "activity", label: "Activity Log", icon: ClipboardList },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminInventory() {
  const [activeTab, setActiveTab] = useState<TabId>("stock");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Inventory</h1>
        <p className="text-muted-foreground mt-1">Track ingredient stock levels, suppliers, and activity.</p>
      </div>

      <InventoryStats />

      <div className="border-b border-border">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "stock" && <StockLevelsTab />}
      {activeTab === "suppliers" && <SuppliersTab />}
      {activeTab === "activity" && <ActivityLogTab />}
    </div>
  );
}
