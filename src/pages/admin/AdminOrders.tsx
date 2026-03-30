import { useState } from "react";
import { mockOrders, Order } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const statusFlow: Order["status"][] = ["new", "in-progress", "ready", "completed"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<string>("all");

  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = statusFlow.indexOf(o.status);
        if (idx < statusFlow.length - 1) return { ...o, status: statusFlow[idx + 1] };
        return o;
      })
    );
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage incoming and active orders.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", ...statusFlow].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? "bg-gold text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-gold font-semibold">{order.id}</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "new" ? "bg-blue-500/10 text-blue-400" :
                    order.status === "in-progress" ? "bg-gold/10 text-gold" :
                    order.status === "ready" ? "bg-green-500/10 text-green-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{order.customerName} · Pickup: {order.pickupTime}</p>
              </div>
              <p className="text-lg font-bold text-gold">${order.total.toFixed(2)}</p>
            </div>

            <div className="space-y-1 mb-3">
              {order.items.map((item, i) => (
                <p key={i} className="text-sm text-foreground">
                  {item.quantity}× {item.menuItem.name}
                  {item.size && <span className="text-muted-foreground"> · {item.size}</span>}
                  {item.milk && <span className="text-muted-foreground"> · {item.milk}</span>}
                </p>
              ))}
            </div>

            {order.status !== "completed" && (
              <Button
                size="sm"
                onClick={() => advanceStatus(order.id)}
                className="bg-gold/10 text-gold hover:bg-gold hover:text-primary-foreground border border-gold/20"
              >
                Move to {statusFlow[statusFlow.indexOf(order.status) + 1]}
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
