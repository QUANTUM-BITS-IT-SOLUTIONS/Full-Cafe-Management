import { ClipboardList, DollarSign, TrendingUp, Coffee, Target, Flame, Zap } from "lucide-react";
import { mockOrders } from "@/data/menu";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Today's Orders", value: "24", icon: ClipboardList, change: "+12%" },
  { label: "Revenue", value: "$842", icon: DollarSign, change: "+8%" },
  { label: "Avg. Order", value: "$14.20", icon: TrendingUp, change: "+3%" },
  { label: "Items Sold", value: "67", icon: Coffee, change: "+15%" },
];

const hourlyRevenue = [
  { h: "7", v: 45 }, { h: "8", v: 120 }, { h: "9", v: 180 }, { h: "10", v: 150 },
  { h: "11", v: 95 }, { h: "12", v: 72 }, { h: "13", v: 60 }, { h: "14", v: 50 },
  { h: "15", v: 40 }, { h: "16", v: 30 },
];

const todayRevenue = 842;
const dailyTarget = 1500;
const pct = Math.min(100, (todayRevenue / dailyTarget) * 100);

function getMotivation(p: number) {
  if (p >= 100) return { text: "Target smashed! 🔥", color: "text-neon-green" };
  if (p >= 70) return { text: "Almost there! 💪", color: "text-neon-yellow" };
  if (p >= 30) return { text: "Picking up steam ☕", color: "text-neon-orange" };
  return { text: "Let's go! 🚀", color: "text-muted-foreground" };
}

export default function AdminDashboard() {
  const recentOrders = mockOrders.slice(0, 4);
  const motivation = getMotivation(pct);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's today's overview.</p>
      </div>

      {/* Revenue Target Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-vibe-purple/5 via-transparent to-neon-green/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-vibe-purple" />
              <span className="font-serif text-lg">Daily Revenue Target</span>
            </div>
            <span className={`text-sm font-bold ${motivation.color}`}>{motivation.text}</span>
          </div>
          <div className="flex items-end gap-4 mb-3">
            <div>
              <span className="text-3xl font-serif font-bold text-gold-gradient">${todayRevenue.toLocaleString()}</span>
              <span className="text-muted-foreground text-lg ml-1">/ ${dailyTarget.toLocaleString()}</span>
            </div>
            <span className="text-sm font-mono font-bold text-vibe-purple mb-1">{pct.toFixed(0)}%</span>
          </div>
          <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full rounded-full relative ${
                pct >= 100 ? "bg-gradient-to-r from-neon-green to-neon-cyan" :
                pct >= 70 ? "bg-gradient-to-r from-neon-yellow to-neon-green" :
                pct >= 30 ? "bg-gradient-to-r from-neon-orange to-neon-yellow" :
                "bg-gradient-to-r from-destructive to-neon-orange"
              }`}
            >
              {pct >= 70 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              )}
            </motion.div>
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyRevenue}>
                <defs>
                  <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--vibe-purple)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--vibe-purple)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="var(--vibe-purple)" fill="url(#rv)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-gold" />
              <span className="text-xs text-neon-green font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="font-serif text-xl mb-4">Recent Orders</h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4 font-medium">Order</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Items</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 last:border-0">
                  <td className="p-4 font-medium text-gold">{order.id}</td>
                  <td className="p-4">{order.customerName}</td>
                  <td className="p-4 hidden sm:table-cell text-muted-foreground">{order.items.length} items</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "new" ? "bg-neon-pink/10 text-neon-pink" :
                      order.status === "in-progress" ? "bg-neon-orange/10 text-neon-orange" :
                      order.status === "ready" ? "bg-neon-green/10 text-neon-green" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-semibold">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
