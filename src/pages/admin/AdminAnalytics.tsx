import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { motion } from "framer-motion";

const revenueData = [
  { day: "Mon", revenue: 420 }, { day: "Tue", revenue: 380 }, { day: "Wed", revenue: 510 },
  { day: "Thu", revenue: 470 }, { day: "Fri", revenue: 620 }, { day: "Sat", revenue: 780 }, { day: "Sun", revenue: 690 },
];

const ordersData = [
  { day: "Mon", orders: 28 }, { day: "Tue", orders: 24 }, { day: "Wed", orders: 35 },
  { day: "Thu", orders: 32 }, { day: "Fri", orders: 42 }, { day: "Sat", orders: 55 }, { day: "Sun", orders: 48 },
];

const topItems = [
  { name: "Cappuccino", sold: 156, revenue: 702 },
  { name: "Flat White", sold: 132, revenue: 627 },
  { name: "Avocado Toast", sold: 98, revenue: 1176 },
  { name: "Croissant", sold: 87, revenue: 326 },
  { name: "Cold Brew", sold: 76, revenue: 361 },
];

// Heatmap data: days x hours (7AM-7PM)
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => `${i + 7}:00`);
const heatmapData: number[][] = [
  [3, 8, 12, 9, 6, 4, 3, 5, 4, 3, 2, 1],   // Mon
  [2, 7, 10, 8, 5, 3, 4, 4, 3, 2, 2, 1],   // Tue
  [4, 9, 14, 11, 7, 5, 4, 6, 5, 4, 3, 2],  // Wed
  [3, 8, 11, 10, 6, 4, 5, 5, 4, 3, 2, 1],  // Thu
  [5, 10, 15, 12, 8, 6, 5, 7, 6, 5, 4, 3], // Fri
  [8, 14, 18, 16, 12, 9, 7, 9, 8, 6, 5, 4],// Sat
  [7, 12, 16, 14, 10, 8, 6, 8, 7, 5, 4, 3],// Sun
];

// Item popularity treemap
const itemPopularity = [
  { name: "Cappuccino", value: 156, cat: "hot" },
  { name: "Flat White", value: 132, cat: "hot" },
  { name: "Avo Toast", value: 98, cat: "food" },
  { name: "Croissant", value: 87, cat: "pastry" },
  { name: "Cold Brew", value: 76, cat: "cold" },
  { name: "Espresso", value: 68, cat: "hot" },
  { name: "Matcha", value: 62, cat: "hot" },
  { name: "Poke Bowl", value: 45, cat: "food" },
  { name: "Lemonade", value: 42, cat: "cold" },
  { name: "Pain au Choc", value: 38, cat: "pastry" },
];

const maxHeat = Math.max(...heatmapData.flat());

function heatColor(value: number) {
  const ratio = value / maxHeat;
  if (ratio > 0.75) return "bg-neon-pink";
  if (ratio > 0.5) return "bg-neon-orange";
  if (ratio > 0.25) return "bg-vibe-purple";
  return "bg-vibe-violet/30";
}

function heatOpacity(value: number) {
  const ratio = value / maxHeat;
  return 0.3 + ratio * 0.7;
}

const catColors: Record<string, string> = {
  hot: "bg-neon-orange",
  cold: "bg-neon-cyan",
  food: "bg-neon-green",
  pastry: "bg-neon-yellow",
};

const maxPop = Math.max(...itemPopularity.map((i) => i.value));

export default function AdminAnalytics() {
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number } | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Analytics</h1>
        <p className="text-muted-foreground mt-1">This week's performance overview.</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-serif text-lg mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--foreground)" }} />
              <Bar dataKey="revenue" fill="var(--vibe-purple)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-serif text-lg mb-4">Order Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--foreground)" }} />
              <Line type="monotone" dataKey="orders" stroke="var(--neon-pink)" strokeWidth={2} dot={{ fill: "var(--neon-pink)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Hours Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-serif text-lg mb-4">Peak Hours Heatmap</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid gap-1" style={{ gridTemplateColumns: `60px repeat(${hours.length}, 1fr)` }}>
              <div />
              {hours.map((h) => (
                <div key={h} className="text-center text-xs text-muted-foreground font-mono">{h.replace(":00", "")}</div>
              ))}
            </div>
            {/* Grid */}
            {days.map((day, di) => (
              <div key={day} className="grid gap-1 mt-1" style={{ gridTemplateColumns: `60px repeat(${hours.length}, 1fr)` }}>
                <div className="text-xs text-muted-foreground font-medium flex items-center">{day}</div>
                {heatmapData[di].map((val, hi) => (
                  <motion.div
                    key={hi}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (di * hours.length + hi) * 0.01 }}
                    onMouseEnter={() => setHoveredCell({ day: di, hour: hi })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`relative h-8 rounded-md ${heatColor(val)} cursor-default transition-all hover:ring-2 hover:ring-foreground/20`}
                    style={{ opacity: heatOpacity(val) }}
                  >
                    {hoveredCell?.day === di && hoveredCell?.hour === hi && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-2 py-0.5 text-xs font-mono whitespace-nowrap z-10 shadow-lg">
                        {val} orders
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 justify-end">
              <span className="text-xs text-muted-foreground">Low</span>
              <div className="flex gap-0.5">
                {[0.2, 0.4, 0.6, 0.8].map((o) => (
                  <div key={o} className="w-5 h-3 rounded-sm bg-vibe-purple" style={{ opacity: o }} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Item Popularity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-serif text-lg mb-4">Item Popularity</h3>
        <div className="flex flex-wrap gap-2">
          {itemPopularity.map((item, i) => {
            const sizeRatio = 0.5 + (item.value / maxPop) * 0.5;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`${catColors[item.cat]} rounded-xl flex flex-col items-center justify-center text-center cursor-default transition-all`}
                style={{
                  width: `${Math.max(80, sizeRatio * 140)}px`,
                  height: `${Math.max(60, sizeRatio * 100)}px`,
                  opacity: 0.3 + (item.value / maxPop) * 0.7,
                }}
              >
                <span className="text-xs font-bold text-foreground leading-tight">{item.name}</span>
                <span className="text-[10px] font-mono text-foreground/70">{item.value}</span>
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4">
          {Object.entries(catColors).map(([cat, cls]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${cls}`} />
              <span className="text-xs text-muted-foreground capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top items */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-serif text-lg mb-4">Top Selling Items</h3>
        <div className="space-y-3">
          {topItems.map((item, i) => (
            <div key={item.name} className="flex items-center gap-4">
              <span className="text-gold font-bold w-6 text-right">{i + 1}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <div className="mt-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${(item.sold / topItems[0].sold) * 100}%` }} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{item.sold} sold</p>
                <p className="text-xs text-muted-foreground">${item.revenue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
