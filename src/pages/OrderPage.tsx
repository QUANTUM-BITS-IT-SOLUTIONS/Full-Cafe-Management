import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useInventory } from "@/context/InventoryContext";
import { useLoyalty } from "@/context/LoyaltyContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useOrderHistory } from "@/context/OrderHistoryContext";
import { useCoupon } from "@/context/CouponContext";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { BackButton } from "@/components/ui/back-button";
import TimeScroller from "@/components/ui/time-scroller";
import { Minus, Plus, Trash2, ShoppingBag, Zap, PartyPopper, Award, AlertTriangle, LogIn, CreditCard, Coffee } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import PaymentModal from "@/components/PaymentModal";

function fireConfetti(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) return;
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
  const prefersReducedMotion = useReducedMotion() || false;
  const [pickupTime, setPickupTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  
  const { appliedCoupon } = useCoupon();

  const name = customer?.name || "";
  const tax = total * 0.08;
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon && appliedCoupon.discount > 0) {
    discount = Math.min((total * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount || Infinity);
  }
  
  const discountedTotal = total - discount;
  const finalTotal = discountedTotal + tax;

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
    setLoading(false);
    clearCart();
    fireConfetti(prefersReducedMotion);
  };

  const handleClearCart = () => {
    setShowClearCartConfirm(true);
  };

  const confirmClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
    setShowClearCartConfirm(false);
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
          <motion.div animate={prefersReducedMotion ? {} : { rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}>
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
        <BackButton to="/menu" className="mb-4" />
        <PageHeader
          badge={{ text: `Your Cart · ${itemCount} items`, icon: ShoppingBag }}
          title="CHECK"
          highlight="OUT"
          description={`Logged in as ${name} · ${customer?.phone}`}
        />

        {items.length === 0 ? (
          <EmptyState
            icon={Coffee}
            title="Your cart is empty"
            description="Looks like you haven't added any items yet. Browse our menu to find something delicious!"
            action={{
              label: "Browse Menu",
              onClick: () => navigate("/menu"),
            }}
          />
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
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.01 }}
                    className="glass-card rounded-2xl p-3 md:p-4"
                  >
                    {/* Mobile: Stack layout | Desktop: Row layout */}
                    <div className="flex gap-3 md:items-center">
                      <img src={item.menuItem.image} alt={item.menuItem.name} className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate">{item.menuItem.name}</h3>
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          {item.size && <p>{item.size}</p>}
                          {item.milk && <p>{item.milk}</p>}
                          {item.extras && item.extras.length > 0 && <p className="truncate">+ {item.extras.join(", ")}</p>}
                        </div>
                      </div>
                      {/* Desktop only: Price and delete */}
                      <div className="hidden md:flex items-center gap-3">
                        <p className="text-vibe-purple font-bold text-sm font-mono w-14 text-right">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => removeItem(index)}
                          className="text-muted-foreground hover:text-destructive p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Mobile: Bottom row with qty controls, price, delete */}
                    <div className="flex items-center justify-between mt-3 md:mt-0 md:hidden">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground bg-secondary rounded-lg active:bg-secondary/80"
                        >
                          <Minus className="h-4 w-4" />
                        </motion.button>
                        <span className="text-sm w-8 text-center font-mono font-bold">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground bg-secondary rounded-lg active:bg-secondary/80"
                        >
                          <Plus className="h-4 w-4" />
                        </motion.button>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-vibe-purple font-bold text-base font-mono">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => removeItem(index)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Desktop: Qty controls inline */}
                    <div className="hidden md:flex items-center justify-end gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(index, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground bg-secondary rounded-lg"><Minus className="h-3 w-3" /></motion.button>
                        <span className="text-sm w-6 text-center font-mono font-bold">{item.quantity}</span>
                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(index, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground bg-secondary rounded-lg"><Plus className="h-3 w-3" /></motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Subtotal ({itemCount} items)</span>
                <span className="text-xl font-serif font-bold">${total.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm text-neon-green">
                  <span className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    Discount ({appliedCoupon.discount}%)
                  </span>
                  <span className="font-mono font-bold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-mono text-muted-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-border pt-2">
                <span className="font-semibold">Grand Total</span>
                <span className="text-lg font-serif font-bold text-gold-gradient">${finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-neon-yellow" /> Points you'll earn
                </span>
                <span className="text-neon-yellow font-mono font-bold">+{Math.floor(discountedTotal * 10)} pts</span>
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
              <TimeScroller
                value={pickupTime}
                onChange={setPickupTime}
                disabled={loading}
              />
              <LoadingButton
                onClick={handleProceedToPayment}
                loading={loading}
                loadingText="Processing..."
                disabled={!pickupTime || unavailableItems.length > 0}
                className="w-full bg-gradient-to-r from-vibe-purple via-neon-pink to-neon-orange text-white hover:opacity-90 font-bold py-6 rounded-full text-base"
              >
                <CreditCard className="mr-2 h-4 w-4" /> Pay ${finalTotal.toFixed(2)}
              </LoadingButton>

              {/* Clear Cart Button */}
              <Button
                variant="ghost"
                onClick={handleClearCart}
                className="w-full text-muted-foreground hover:text-destructive"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          amount={total}
          couponCode={couponCode}
          onCouponApply={(code) => setCouponCode(code)}
          onCouponRemove={() => setCouponCode("")}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {/* Clear Cart Confirmation */}
      <ConfirmDialog
        open={showClearCartConfirm}
        onOpenChange={setShowClearCartConfirm}
        title="Clear Cart?"
        description="This will remove all items from your cart. This action cannot be undone."
        confirmLabel="Clear Cart"
        onConfirm={confirmClearCart}
        variant="destructive"
      />
    </div>
  );
}
