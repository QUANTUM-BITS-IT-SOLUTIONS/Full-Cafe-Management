import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import PurchaseOrderModal from "@/components/inventory/PurchaseOrderModal";

export default function PurchaseOrdersPage() {
  const { purchaseOrders, suppliers, ingredients, createPurchaseOrder, receivePurchaseOrder, cancelPurchaseOrder } = useInventory();
  const [showCreate, setShowCreate] = useState(false);

  const getSupplierName = (id: string) => suppliers.find((s) => s.id === id)?.name ?? id;
  const getIngName = (id: string) => ingredients.find((i) => i.id === id)?.name ?? id;

  const statusConfig: Record<string, { icon: typeof Clock; cls: string; label: string }> = {
    draft: { icon: FileText, cls: "bg-secondary text-muted-foreground", label: "Draft" },
    ordered: { icon: Clock, cls: "bg-neon-yellow/10 text-neon-yellow", label: "Ordered" },
    received: { icon: CheckCircle, cls: "bg-neon-green/10 text-neon-green", label: "Received" },
    cancelled: { icon: XCircle, cls: "bg-destructive/10 text-destructive", label: "Cancelled" },
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl">Purchase Orders</h1>
          <p className="text-muted-foreground mt-1">Manage supplier orders and restock deliveries.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-gold text-primary-foreground hover:bg-gold-dark">
          <Plus className="h-4 w-4 mr-1.5" /> New PO
        </Button>
      </div>

      <div className="space-y-4">
        {purchaseOrders.map((po) => {
          const config = statusConfig[po.status] ?? statusConfig.draft;
          const StatusIcon = config.icon;
          return (
            <div key={po.id} className="glass-card rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-semibold">{po.id}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.cls}`}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{getSupplierName(po.supplierId)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${po.totalCost.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Expected: {formatDate(po.expectedDelivery)}</p>
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-1">
                {po.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{getIngName(item.ingredientId)}</span>
                    <span className="text-xs">{item.quantity} × ${item.unitCost.toFixed(3)} = ${(item.quantity * item.unitCost).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {po.status === "ordered" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" onClick={() => receivePurchaseOrder(po.id)} className="bg-neon-green/10 text-neon-green hover:bg-neon-green/20 border border-neon-green/20">
                    <CheckCircle className="h-3 w-3 mr-1" /> Mark Received
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => cancelPurchaseOrder(po.id)} className="text-destructive hover:text-destructive">
                    <XCircle className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
              )}
              {po.receivedAt && (
                <p className="text-xs text-neon-green">Received on {formatDate(po.receivedAt)}</p>
              )}
            </div>
          );
        })}

        {purchaseOrders.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No purchase orders yet.</p>
          </div>
        )}
      </div>

      {showCreate && (
        <PurchaseOrderModal
          suppliers={suppliers}
          ingredients={ingredients}
          onClose={() => setShowCreate(false)}
          onCreate={(supplierId, items, expectedDelivery) => {
            createPurchaseOrder(supplierId, items, expectedDelivery);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}
