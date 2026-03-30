import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useInventory } from "@/context/InventoryContext";
import { useLoyalty } from "@/context/LoyaltyContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useOrderHistory } from "@/context/OrderHistoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, Zap, PartyPopper, Award, AlertTriangle, LogIn, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import PaymentModal from "@/components/PaymentModal";

function fireConfetti() {
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
  const end = Date.now() + 1500;
  const interval = setInterval(() => {
    if (Date.now() > end) return clearInterval(interval);
    confetti({ ...defaults, particleCount: 40, origin: { x: Math.random(), y: Math.random() * 0.4 }, colors: ["#c084fc", "#f472b6", "#22d3ee", "#fb923c", "#facc15", "#4ade80"] });
  }, 200);
}

export default function OrderPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const { deductByOrder, checkAvailability } = useInventory();
  const { addPoints } = useLoyalty();
  const { customer, isLoggedIn } = useCustomerAuth();
  const { addOrder } = useOrderHistory();
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const name = customer?.name || "";

  const unavailableItems = items
    .map((item) => {
      const { available, shortIngredients } = checkAvailability(item.menuItem.id, item.quantity);
      return !available ? { name: item.menuItem.name, shortIngredients } : null;
    })
    .filter(Boolean);

  const handleProceedToPayment = () => {
    if (!pickupTime) {
      toast.error("Please select a pickup time");
      return;
    }
    if (unavailableItems.length > 0) {
      toast.error("Some items don't have enough ingredients in stock");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    deductByOrder(orderId, items);

    const pts = Math.floor(total * 10);
    addPoints(pts);
    setEarnedPoints(pts);

    // Save order to history
    const tax = total * 0.08;
    addOrder({
      id: orderId,
      customerName: name,
      customerPhone: customer?.phone || "",
      items: items.map((i) => ({
        menuItem: i.menuItem,
        quantity: i.quantity,
        size: i.size,
        milk: i.milk,
        extras: i.extras,
      })),
      subtotal: total,
      tax,
      total: total + tax,
      pickupTime,
      createdAt: new Date().toISOString(),
      paymentMethod: "Card",
    });

    toast.success("Order placed — ingredients deducted ✨");
    setSubmitted(true);
    clearCart();
    fireConfetti();
  };

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-vibe-purple to-neon-pink mx-auto">
            <LogIn className="h-10 w-10 text-white" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl">LOGIN <span className="text-gold-gradient">REQUIRED</span></h2>
          <p className="text-muted-foreground">Please sign in with your mobile number to place an order.</p>
          <Button asChild className="bg-gradient-to-r from-vibe-purple to-neon-pink text-white hover:opacity-90 font-bold rounded-full px-8 py-6">
            <Link to="/login">Sign In with Mobile 📱</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
          <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}>
            <PartyPopper className="h-20 w-20 text-neon-pink mx-auto" />
          </motion.div>
          <h2 className="font-serif text-4xl md:text-5xl">ORDER <span className="text-gold-gradient">CONFIRMED</span>!</h2>
          <p className="text-muted-foreground text-lg">Your order will be ready at <span className="text-vibe-purple font-bold">{pickupTime}</span></p>
          <p className="text-muted-foreground">Thanks, {name}! 💜</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-medium">
            <CreditCard className="h-4 w-4" /> Payment received
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow font-bold">
            <Award className="h-5 w-5" />
            +{earnedPoints} loyalty points earned!
          </motion.div>
          <div className="flex gap-3 justify-center">
            <Button asChild className="bg-vibe-purple text-white hover:bg-vibe-violet mt-4 rounded-full px-8 font-bold">
              <Link to="/menu">Order More ☕</Link>
            </Button>
            <Button asChild variant="outline" className="mt-4 rounded-full px-8 font-bold border-border">
              <Link to="/profile">View Orders 📋</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob absolute top-40 right-[10%] w-64 h-64 bg-vibe-violet/8" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-orange/10 border border-neon-orange/30 text-neon-orange text-xs font-mono uppercase tracking-wider mb-4">
            <ShoppingBag className="h-3 w-3" /> Your Cart
          </span>
          <h1 className="font-serif text-4xl md:text-5xl">CHECK<span className="text-gold-gradient">OUT</span></h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Logged in as <span className="text-vibe-purple font-semibold">{name}</span> · {customer?.phone}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 space-y-4">
            <span className="text-5xl block">🛒</span>
            <p className="text-muted-foreground text-lg">Your cart is empty.</p>
            <Button asChild variant="outline" className="border-vibe-purple/30 text-vibe-purple hover:bg-vibe-purple/10 rounded-full">
              <Link to="/menu">Browse Menu ✨</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {unavailableItems.length > 0 && (
              <div className="glass-card rounded-2xl p-4 border border-destructive/30 bg-destructive/5">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold text-sm">Insufficient ingredients</span>
                </div>
                {unavailableItems.map((item, i) => (
                  <div key={i} className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">{item!.name}</span>: {item!.shortIngredients.map((s) => `${s.name} (need ${s.need}, have ${s.have} ${s.unit})`).join(", ")}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div key={index} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} whileHover={{ scale: 1.01 }} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                    <img src={item.menuItem.image} alt={item.menuItem.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-sm font-semibold">{item.menuItem.name}</h3>
                      {item.size && <p className="text-xs text-muted-foreground">{item.size}</p>}
                      {item.milk && <p className="text-xs text-muted-foreground">{item.milk}</p>}
                      {item.extras && item.extras.length > 0 && <p className="text-xs text-muted-foreground">+ {item.extras.join(", ")}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(index, item.quantity - 1)} className="p-1.5 text-muted-foreground hover:text-foreground bg-secondary rounded-lg"><Minus className="h-3 w-3" /></motion.button>
                      <span className="text-sm w-6 text-center font-mono font-bold">{item.quantity}</span>
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(index, item.quantity + 1)} className="p-1.5 text-muted-foreground hover:text-foreground bg-secondary rounded-lg"><Plus className="h-3 w-3" /></motion.button>
                    </div>
                    <p className="text-vibe-purple font-bold text-sm font-mono w-16 text-right">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeItem(index)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total ({itemCount} items)</span>
                <span className="text-2xl font-serif font-bold text-gold-gradient">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-mono text-muted-foreground">${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-border pt-2">
                <span className="font-semibold">Grand Total</span>
                <span className="text-lg font-serif font-bold text-gold-gradient">${(total * 1.08).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-neon-yellow" /> Points you'll earn
                </span>
                <span className="text-neon-yellow font-mono font-bold">+{Math.floor(total * 10)} pts</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-lg">Pickup Details</h3>
              <div className="bg-secondary/50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-vibe-purple/20 flex items-center justify-center text-vibe-purple font-bold text-sm">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{customer?.phone}</p>
                </div>
              </div>
              <Input type="text" placeholder="e.g. 10:30 AM" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="bg-secondary border-border rounded-xl h-12" />
              <Button
                onClick={handleProceedToPayment}
                disabled={!pickupTime || unavailableItems.length > 0}
                className="w-full bg-gradient-to-r from-vibe-purple via-neon-pink to-neon-orange text-white hover:opacity-90 font-bold py-6 rounded-full text-base"
              >
                <CreditCard className="mr-2 h-4 w-4" /> Pay & Place Order
              </Button>
            </div>
          </div>
        )}
      </div>

      {showPayment && (
        <PaymentModal
          amount={total}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
