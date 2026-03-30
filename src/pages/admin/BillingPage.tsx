import { useState } from "react";
import { mockOrders, Order } from "@/data/menu";
import { useInventory } from "@/context/InventoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Receipt, Search, Download, Eye, X, Calendar, DollarSign, ShoppingBag, TrendingUp,
} from "lucide-react";

interface Invoice {
  id: string;
  order: Order;
  subtotal: number;
  tax: number;
  total: number;
  ingredientCost: number;
  profit: number;
  createdAt: string;
}

function generateInvoice(order: Order, getMenuItemCost: (id: string) => number): Invoice {
  const subtotal = order.total;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const ingredientCost = order.items.reduce(
    (s, item) => s + getMenuItemCost(item.menuItem.id) * item.quantity,
    0
  );
  return {
    id: `INV-${order.id.replace("ORD-", "")}`,
    order,
    subtotal,
    tax,
    total,
    ingredientCost,
    profit: subtotal - ingredientCost,
    createdAt: order.createdAt || new Date().toISOString(),
  };
}

export default function BillingPage() {
  const { getMenuItemCost } = useInventory();
  const [search, setSearch] = useState("");
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const invoices = mockOrders
    .filter((o) => o.status === "completed" || o.status === "ready" || o.status === "in-progress" || o.status === "new")
    .map((o) => generateInvoice(o, getMenuItemCost));

  const filtered = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.order.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = invoices.reduce((s, i) => s + i.subtotal, 0);
  const totalTax = invoices.reduce((s, i) => s + i.tax, 0);
  const totalProfit = invoices.reduce((s, i) => s + i.profit, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Billing</h1>
        <p className="text-muted-foreground mt-1">Invoice management and order billing overview.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-neon-green" },
          { label: "Tax Collected", value: `$${totalTax.toFixed(2)}`, icon: Receipt, color: "text-neon-yellow" },
          { label: "Gross Profit", value: `$${totalProfit.toFixed(2)}`, icon: TrendingUp, color: "text-vibe-purple" },
          { label: "Total Orders", value: invoices.length.toString(), icon: ShoppingBag, color: "text-neon-orange" },
        ].map((card) => (
          <div key={card.label} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <p className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search invoice or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
      </div>

      {/* Invoice table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4 font-medium">Invoice #</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Items</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                <th className="text-right p-4 font-medium">Subtotal</th>
                <th className="text-right p-4 font-medium hidden md:table-cell">Tax</th>
                <th className="text-right p-4 font-medium">Total</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-mono text-xs text-accent-foreground">{inv.id}</td>
                  <td className="p-4 font-medium">{inv.order.customerName}</td>
                  <td className="p-4 hidden sm:table-cell text-muted-foreground text-xs">
                    {inv.order.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(", ")}
                  </td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground text-xs">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right font-mono">${inv.subtotal.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono text-muted-foreground hidden md:table-cell">${inv.tax.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono font-bold text-accent-foreground">${inv.total.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setViewInvoice(inv)} className="p-1.5 text-muted-foreground hover:text-foreground" title="View invoice">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice detail modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="font-serif text-xl font-bold">{viewInvoice.id}</h3>
                <p className="text-xs text-muted-foreground">{new Date(viewInvoice.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewInvoice(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{viewInvoice.order.customerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pickup Time</span>
                <span className="font-medium">{viewInvoice.order.pickupTime}</span>
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</p>
                {viewInvoice.order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.quantity}× {item.menuItem.name}
                      {item.size && <span className="text-muted-foreground text-xs ml-1">({item.size})</span>}
                    </span>
                    <span className="font-mono">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${viewInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-mono">${viewInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ingredient Cost</span>
                  <span className="font-mono text-destructive">-${viewInvoice.ingredientCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-accent-foreground font-mono">${viewInvoice.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Profit Margin</span>
                  <span className="text-neon-green font-mono font-bold">${viewInvoice.profit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewInvoice(null)}>Close</Button>
              <Button size="sm" className="bg-accent text-accent-foreground" onClick={() => {
                toast.success(`Invoice ${viewInvoice.id} exported`);
              }}>
                <Download className="h-3 w-3 mr-1" /> Export
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
