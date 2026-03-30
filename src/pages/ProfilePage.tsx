import { useState } from "react";
import { useLoyalty } from "@/context/LoyaltyContext";
import { useOrderHistory, CompletedOrder } from "@/context/OrderHistoryContext";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, Gift, Crown, Gem, Lock, Check, ArrowLeft, Download, Eye, X, Receipt, Clock, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import jsPDF from "jspdf";

const tiers = [
  { name: "Bronze", min: 0, max: 500, icon: Award, color: "text-neon-orange" },
  { name: "Silver", min: 500, max: 2000, icon: Star, color: "text-muted-foreground" },
  { name: "Gold", min: 2000, max: 5000, icon: Crown, color: "text-neon-yellow" },
  { name: "Platinum", min: 5000, max: Infinity, icon: Gem, color: "text-vibe-purple" },
];

const rewards = [
  { name: "Free Coffee", pointsCost: 500, emoji: "☕" },
  { name: "Free Pastry", pointsCost: 1000, emoji: "🥐" },
  { name: "Free Breakfast", pointsCost: 2500, emoji: "🍳" },
  { name: "Free Lunch", pointsCost: 4000, emoji: "🥗" },
  { name: "VIP Experience", pointsCost: 7500, emoji: "✨" },
];

function downloadBillPDF(order: CompletedOrder) {
  const doc = new jsPDF({ unit: "mm", format: [80, 200] });
  const w = 80;
  const margin = 6;
  const contentW = w - margin * 2;
  let y = 10;

  // Background
  doc.setFillColor(18, 18, 24);
  doc.rect(0, 0, w, 300, "F");

  // Header bar
  doc.setFillColor(139, 92, 246);
  doc.rect(0, 0, w, 22, "F");

  // Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("AUREUM", w / 2, 10, { align: "center" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 220, 255);
  doc.text("Premium Coffee Experience", w / 2, 15, { align: "center" });

  doc.setFontSize(6);
  doc.text("www.aureumcafe.com", w / 2, 19, { align: "center" });

  y = 28;

  // Invoice title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 220);
  doc.text("RECEIPT", w / 2, y, { align: "center" });
  y += 6;

  // Divider
  doc.setDrawColor(80, 80, 120);
  doc.setLineWidth(0.3);
  doc.line(margin, y, w - margin, y);
  y += 5;

  // Order details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 190);

  const details = [
    ["Invoice", order.id],
    ["Date", new Date(order.createdAt).toLocaleString()],
    ["Customer", order.customerName],
    ["Phone", order.customerPhone],
    ["Pickup", order.pickupTime],
    ["Payment", order.paymentMethod],
  ];

  details.forEach(([label, value]) => {
    doc.setTextColor(120, 120, 150);
    doc.text(label, margin, y);
    doc.setTextColor(220, 220, 240);
    doc.text(value, w - margin, y, { align: "right" });
    y += 4.5;
  });

  y += 2;
  doc.setDrawColor(80, 80, 120);
  doc.line(margin, y, w - margin, y);
  y += 5;

  // Items header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(139, 92, 246);
  doc.text("ITEMS", margin, y);
  doc.text("AMOUNT", w - margin, y, { align: "right" });
  y += 5;

  // Items
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  order.items.forEach((item) => {
    const itemTotal = item.menuItem.price * item.quantity;
    doc.setTextColor(220, 220, 240);
    doc.text(`${item.quantity}x ${item.menuItem.name}${item.size ? ` (${item.size})` : ""}`, margin, y);
    doc.text(`$${itemTotal.toFixed(2)}`, w - margin, y, { align: "right" });
    y += 4;

    if (item.milk) {
      doc.setTextColor(120, 120, 150);
      doc.setFontSize(6);
      doc.text(`  Milk: ${item.milk}`, margin + 2, y);
      y += 3.5;
      doc.setFontSize(7);
    }
    if (item.extras?.length) {
      doc.setTextColor(120, 120, 150);
      doc.setFontSize(6);
      doc.text(`  + ${item.extras.join(", ")}`, margin + 2, y);
      y += 3.5;
      doc.setFontSize(7);
    }
  });

  y += 3;
  doc.setDrawColor(80, 80, 120);
  doc.line(margin, y, w - margin, y);
  y += 5;

  // Totals
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 190);
  doc.text("Subtotal", margin, y);
  doc.text(`$${order.subtotal.toFixed(2)}`, w - margin, y, { align: "right" });
  y += 4.5;

  doc.text("Tax (8%)", margin, y);
  doc.text(`$${order.tax.toFixed(2)}`, w - margin, y, { align: "right" });
  y += 5;

  // Total highlight
  doc.setFillColor(139, 92, 246);
  doc.roundedRect(margin, y - 3, contentW, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL", margin + 4, y + 3);
  doc.text(`$${order.total.toFixed(2)}`, w - margin - 4, y + 3, { align: "right" });
  y += 14;

  // Payment status
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(w / 2 - 14, y - 3, 28, 7, 2, 2, "F");
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("PAID", w / 2, y + 1, { align: "center" });
  y += 12;

  // Footer
  doc.setDrawColor(80, 80, 120);
  doc.line(margin, y, w - margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(120, 120, 150);
  doc.text("Thank you for choosing Aureum!", w / 2, y, { align: "center" });
  y += 3.5;
  doc.text("We hope to see you again soon.", w / 2, y, { align: "center" });

  // Trim the page height
  const pageHeight = y + 10;
  doc.internal.pageSize.height = pageHeight;

  doc.save(`${order.id}-receipt.pdf`);
  toast.success(`Receipt ${order.id} downloaded as PDF`);
}

export default function ProfilePage() {
  const { points, totalEarned } = useLoyalty();
  const { orders } = useOrderHistory();
  const [viewOrder, setViewOrder] = useState<CompletedOrder | null>(null);

  const currentTier = tiers.reduce((t, tier) => (totalEarned >= tier.min ? tier : t), tiers[0]);
  const nextTier = tiers.find((t) => t.min > totalEarned);
  const tierProgress = nextTier
    ? ((totalEarned - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const TierIcon = currentTier.icon;

  const handleRedeem = (r: typeof rewards[0]) => {
    if (points >= r.pointsCost) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#c084fc", "#f472b6", "#22d3ee", "#facc15"] });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob absolute top-20 right-[20%] w-72 h-72 bg-vibe-violet/8" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-3xl">My <span className="text-gold-gradient">Profile</span></h1>
        </div>

        {/* Points & Tier Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 text-center space-y-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-vibe-purple/5 via-transparent to-neon-pink/5" />
          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-vibe-purple to-neon-pink flex items-center justify-center mx-auto mb-4"
            >
              <TierIcon className="h-8 w-8 text-white" />
            </motion.div>
            <p className={`text-sm font-bold uppercase tracking-wider ${currentTier.color}`}>{currentTier.name} Member</p>
            <motion.p
              key={points}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-serif font-bold text-gold-gradient my-2"
            >
              {points.toLocaleString()}
            </motion.p>
            <p className="text-muted-foreground text-sm">Available Points</p>
            <p className="text-xs text-muted-foreground mt-1">Lifetime earned: {totalEarned.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Tier Progress */}
        {nextTier && (
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className={`font-bold ${currentTier.color}`}>{currentTier.name}</span>
              <span className={`font-bold ${nextTier.icon === Star ? "text-muted-foreground" : nextTier.icon === Crown ? "text-neon-yellow" : "text-vibe-purple"}`}>{nextTier.name}</span>
            </div>
            <Progress value={tierProgress} className="h-3 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-vibe-purple [&>div]:to-neon-pink" />
            <p className="text-xs text-muted-foreground text-center">
              {(nextTier.min - totalEarned).toLocaleString()} more points to {nextTier.name}
            </p>
          </div>
        )}

        {/* Order History */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="h-5 w-5 text-vibe-purple" />
            <h2 className="font-serif text-xl">Order History</h2>
            <span className="ml-auto text-xs text-muted-foreground font-mono">{orders.length} orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center space-y-3">
              <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No orders yet. Start ordering from the menu!</p>
              <Button asChild variant="outline" className="rounded-full border-vibe-purple/30 text-vibe-purple">
                <Link to="/menu">Browse Menu ☕</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-accent-foreground font-bold">{order.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20 font-medium">Paid</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {order.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(", ")}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> Pickup: {order.pickupTime}
                    </div>
                    <span className="font-mono font-bold text-sm text-accent-foreground">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full text-xs h-8 border-border"
                      onClick={() => setViewOrder(order)}
                    >
                      <Eye className="h-3 w-3 mr-1" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full text-xs h-8 border-border"
                      onClick={() => downloadBillPDF(order)}
                    >
                      <Download className="h-3 w-3 mr-1" /> Download Bill
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Rewards */}
        <div>
          <h2 className="font-serif text-xl mb-4">Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rewards.map((r) => {
              const unlocked = points >= r.pointsCost;
              return (
                <motion.div
                  key={r.name}
                  whileHover={unlocked ? { scale: 1.02 } : undefined}
                  onClick={() => handleRedeem(r)}
                  className={`glass-card rounded-xl p-4 flex items-center gap-4 transition-all ${
                    unlocked
                      ? "cursor-pointer border border-neon-green/30"
                      : "opacity-50 grayscale"
                  }`}
                >
                  <span className="text-3xl">{r.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{r.pointsCost.toLocaleString()} pts</p>
                  </div>
                  {unlocked ? (
                    <div className="w-8 h-8 rounded-full bg-neon-green/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-neon-green" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-serif text-lg mb-3">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-vibe-purple">{orders.length || Math.floor(totalEarned / 10)}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neon-pink">
                ${orders.length > 0 ? orders.reduce((s, o) => s + o.total, 0).toFixed(0) : (totalEarned / 10).toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
            <div>
              <Gift className="h-6 w-6 text-neon-yellow mx-auto" />
              <p className="text-xs text-muted-foreground mt-1">{rewards.filter((r) => points >= r.pointsCost).length} Unlocked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {viewOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
                <div>
                  <h3 className="font-serif text-xl font-bold">{viewOrder.id}</h3>
                  <p className="text-xs text-muted-foreground">{new Date(viewOrder.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setViewOrder(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{viewOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{viewOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pickup Time</span>
                  <span className="font-medium">{viewOrder.pickupTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-medium text-neon-green">{viewOrder.paymentMethod} ✓</span>
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</p>
                  {viewOrder.items.map((item, i) => (
                    <div key={i} className="flex items-start justify-between text-sm gap-2">
                      <div className="flex-1">
                        <span>{item.quantity}× {item.menuItem.name}</span>
                        {item.size && <span className="text-muted-foreground text-xs ml-1">({item.size})</span>}
                        {item.milk && <p className="text-xs text-muted-foreground">Milk: {item.milk}</p>}
                        {item.extras?.length ? <p className="text-xs text-muted-foreground">+ {item.extras.join(", ")}</p> : null}
                      </div>
                      <span className="font-mono shrink-0">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono">${viewOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-mono">${viewOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-accent-foreground font-mono">${viewOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-border flex gap-2 sticky bottom-0 bg-card">
                <Button variant="outline" size="sm" onClick={() => setViewOrder(null)} className="flex-1 rounded-full">
                  Close
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-accent text-accent-foreground rounded-full"
                  onClick={() => downloadBillPDF(viewOrder)}
                >
                  <Download className="h-3 w-3 mr-1" /> Download Bill
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
