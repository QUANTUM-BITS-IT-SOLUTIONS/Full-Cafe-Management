import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChefHat, CheckCircle, ArrowLeft, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { mockOrders, Order } from "@/data/menu";

type KitchenOrder = Order & { kitchenStatus: "new" | "cooking" | "ready" | "done" };

const statusFlow: KitchenOrder["kitchenStatus"][] = ["new", "cooking", "ready", "done"];
const statusConfig = {
  new: { label: "NEW", bg: "bg-neon-pink/15", border: "border-neon-pink/40", text: "text-neon-pink", icon: Bell },
  cooking: { label: "COOKING", bg: "bg-neon-orange/15", border: "border-neon-orange/40", text: "text-neon-orange", icon: ChefHat },
  ready: { label: "READY", bg: "bg-neon-green/15", border: "border-neon-green/40", text: "text-neon-green", icon: CheckCircle },
  done: { label: "DONE", bg: "bg-muted/30", border: "border-border", text: "text-muted-foreground", icon: CheckCircle },
};

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<KitchenOrder[]>(() =>
    mockOrders.map((o) => ({
      ...o,
      kitchenStatus: o.status === "new" ? "new" : o.status === "in-progress" ? "cooking" : o.status === "ready" ? "ready" : "done",
    }))
  );
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const advance = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = statusFlow.indexOf(o.kitchenStatus);
        if (idx >= statusFlow.length - 1) return o;
        return { ...o, kitchenStatus: statusFlow[idx + 1] };
      })
    );
  };

  const activeOrders = orders.filter((o) => o.kitchenStatus !== "done");
  const doneOrders = orders.filter((o) => o.kitchenStatus === "done");

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl flex items-center gap-2">
              <ChefHat className="h-7 w-7 text-neon-orange" /> Kitchen Display
            </h1>
            <p className="text-muted-foreground text-sm">{activeOrders.length} active orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground font-mono text-lg">
          <Clock className="h-5 w-5" />
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
      </div>

      {/* Active Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <AnimatePresence mode="popLayout">
          {activeOrders.map((order) => {
            const cfg = statusConfig[order.kitchenStatus];
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => advance(order.id)}
                className={`glass-card rounded-2xl p-5 cursor-pointer border-2 ${cfg.border} ${cfg.bg} hover:scale-[1.02] transition-transform relative overflow-hidden`}
              >
                {order.kitchenStatus === "new" && (
                  <div className="absolute inset-0 rounded-2xl animate-pulse border-2 border-neon-pink/30 pointer-events-none" />
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-bold text-foreground">{order.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.text} ${cfg.bg}`}>
                    <StatusIcon className="h-3 w-3" /> {cfg.label}
                  </span>
                </div>
                <p className="font-semibold text-foreground mb-1">{order.customerName}</p>
                <p className="text-xs text-muted-foreground mb-3">Pickup: {order.pickupTime}</p>
                <div className="space-y-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">
                        <span className="font-mono text-vibe-purple font-bold mr-1">{item.quantity}×</span>
                        {item.menuItem.name}
                      </span>
                      {item.size && <span className="text-xs text-muted-foreground">{item.size}</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 text-center">
                  <span className="text-xs text-muted-foreground font-mono">
                    Tap to → {statusFlow[statusFlow.indexOf(order.kitchenStatus) + 1]?.toUpperCase() || "DONE"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Done orders */}
      {doneOrders.length > 0 && (
        <div>
          <h2 className="font-serif text-lg text-muted-foreground mb-3">Completed ({doneOrders.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {doneOrders.map((o) => (
              <div key={o.id} className="glass-card rounded-xl p-3 opacity-50">
                <p className="font-mono text-xs">{o.id}</p>
                <p className="text-xs text-muted-foreground truncate">{o.customerName}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
