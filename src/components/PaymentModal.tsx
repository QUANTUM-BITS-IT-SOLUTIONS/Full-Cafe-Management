import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Lock, CheckCircle2, Loader2, QrCode, Smartphone, Tag, X, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCoupon } from "@/context/CouponContext";

interface Props {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  couponCode?: string;
  onCouponApply?: (code: string) => void;
  onCouponRemove?: () => void;
}

export default function PaymentModal({ amount, onSuccess, onCancel, couponCode, onCouponApply, onCouponRemove }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'qr'>('card');
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  
  const { appliedCoupon, applyCoupon, removeCoupon } = useCoupon();

  const tax = amount * 0.08;
  const subtotal = amount;
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon && appliedCoupon.discount > 0) {
    discount = Math.min((subtotal * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount || Infinity);
  }
  
  const discountedSubtotal = subtotal - discount;
  const total = discountedSubtotal + tax;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const isValidCard = cardNumber.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvv.length >= 3 && cardName.trim().length > 0;
  const isValidUPI = upiId.includes('@') && upiId.length > 5;
  const isValid = paymentMethod === 'card' ? isValidCard : paymentMethod === 'upi' ? isValidUPI : true;

  const handlePay = async () => {
    if (!isValid) return;
    setProcessing(true);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));

    setProcessing(false);
    setSuccess(true);
    const method = paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'QR Code';
    toast.success(`Payment successful via ${method}! 💳`);

    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  const handleCouponApply = () => {
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    
    if (applyCoupon(couponInput, subtotal)) {
      toast.success(`Coupon applied! ${appliedCoupon?.discount}% off`);
      setShowCouponInput(false);
      onCouponApply?.(couponInput);
    } else {
      toast.error("Invalid or expired coupon code");
    }
  };

  const handleCouponRemove = () => {
    removeCoupon();
    setCouponInput("");
    onCouponRemove?.();
    toast.info("Coupon removed");
  };

  const copyUpiId = () => {
    const upi = "aureumcafe@ybl";
    navigator.clipboard.writeText(upi);
    toast.success("UPI ID copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 text-center space-y-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-green/20 mx-auto"
              >
                <CheckCircle2 className="h-10 w-10 text-neon-green" />
              </motion.div>
              <h3 className="font-serif text-2xl font-bold">Payment Successful!</h3>
              <p className="text-muted-foreground">Your order is being processed...</p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              {/* Header */}
              <div className="p-5 border-b border-border bg-gradient-to-r from-vibe-purple/10 to-neon-pink/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vibe-purple to-neon-pink flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">Secure Payment</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" /> 256-bit encrypted
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="px-5 pt-4 pb-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-vibe-purple bg-vibe-purple/10 text-vibe-purple' 
                        : 'border-border text-muted-foreground hover:border-vibe-purple/50'
                    }`}
                  >
                    <CreditCard className="h-4 w-4 mx-auto mb-1" />
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                      paymentMethod === 'upi' 
                        ? 'border-vibe-purple bg-vibe-purple/10 text-vibe-purple' 
                        : 'border-border text-muted-foreground hover:border-vibe-purple/50'
                    }`}
                  >
                    <Smartphone className="h-4 w-4 mx-auto mb-1" />
                    UPI
                  </button>
                  <button
                    onClick={() => setPaymentMethod('qr')}
                    className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                      paymentMethod === 'qr' 
                        ? 'border-vibe-purple bg-vibe-purple/10 text-vibe-purple' 
                        : 'border-border text-muted-foreground hover:border-vibe-purple/50'
                    }`}
                  >
                    <QrCode className="h-4 w-4 mx-auto mb-1" />
                    QR
                  </button>
                </div>
              </div>

              {/* Amount breakdown */}
              <div className="px-5 pt-2 pb-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-neon-green">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Discount ({appliedCoupon.discount}%)
                    </span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                  <span>Total</span>
                  <span className="text-accent-foreground font-mono">${total.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-neon-green">{appliedCoupon.description}</span>
                    <button
                      onClick={handleCouponRemove}
                      className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Coupon Section */}
              {!appliedCoupon && (
                <div className="px-5 pb-2">
                  {showCouponInput ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-secondary border-border rounded-xl h-10 font-mono text-sm"
                      />
                      <Button size="sm" onClick={handleCouponApply} className="rounded-xl">
                        Apply
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowCouponInput(false)} className="rounded-xl">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      className="w-full p-3 rounded-xl border border-dashed border-vibe-purple/30 bg-vibe-purple/5 text-vibe-purple text-sm font-medium hover:bg-vibe-purple/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Tag className="h-4 w-4" />
                      Have a coupon code?
                    </button>
                  )}
                </div>
              )}

              {/* Payment Forms */}
              <div className="p-5 space-y-4">
                {/* Card Payment */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Cardholder Name</label>
                  <Input
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="bg-secondary border-border rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="pl-10 bg-secondary border-border rounded-xl h-11 font-mono tracking-wider"
                      maxLength={19}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Expiry</label>
                    <Input
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className="bg-secondary border-border rounded-xl h-11 font-mono"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">CVV</label>
                    <Input
                      type="password"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="bg-secondary border-border rounded-xl h-11 font-mono"
                      maxLength={4}
                    />
                  </div>
                </div>

                    {/* Simulated test hint */}
                    <div className="bg-neon-yellow/10 border border-neon-yellow/20 rounded-xl p-2.5 text-center">
                      <p className="text-xs text-muted-foreground">
                        🧪 <span className="text-neon-yellow font-medium">Test mode</span> — Use any card details
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* UPI Payment */}
                {paymentMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">UPI ID</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="yourupi@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                          className="pl-10 bg-secondary border-border rounded-xl h-11 font-mono"
                        />
                      </div>
                    </div>
                    <div className="bg-vibe-purple/10 border border-vibe-purple/20 rounded-xl p-4 space-y-3">
                      <p className="text-sm font-medium text-vibe-purple">Quick UPI Options:</p>
                      <div className="space-y-2">
                        <button
                          onClick={() => setUpiId("aureumcafe@ybl")}
                          className="w-full text-left p-2 rounded-lg bg-background border border-border hover:border-vibe-purple/50 transition-colors"
                        >
                          <p className="text-sm font-mono">aureumcafe@ybl</p>
                          <p className="text-xs text-muted-foreground">PhonePe / Paytm</p>
                        </button>
                        <button
                          onClick={() => setUpiId("aureum@okic")}
                          className="w-full text-left p-2 rounded-lg bg-background border border-border hover:border-vibe-purple/50 transition-colors"
                        >
                          <p className="text-sm font-mono">aureum@okic</p>
                          <p className="text-xs text-muted-foreground">Google Pay</p>
                        </button>
                      </div>
                      <button
                        onClick={copyUpiId}
                        className="w-full p-2 rounded-lg bg-vibe-purple/20 text-vibe-purple text-sm font-medium hover:bg-vibe-purple/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Copy className="h-4 w-4" /> Copy UPI ID
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* QR Code Payment */}
                {paymentMethod === 'qr' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-48 h-48 bg-white rounded-2xl p-4">
                        <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Scan QR with any UPI app</p>
                        <p className="text-xs text-muted-foreground">PhonePe, Paytm, Google Pay, etc.</p>
                        <div className="bg-neon-green/10 border border-neon-green/20 rounded-xl p-3">
                          <p className="text-xs text-neon-green font-medium">Amount: ${total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 flex gap-2">
                <Button variant="outline" onClick={onCancel} className="flex-1 rounded-full border-border" disabled={processing}>
                  Cancel
                </Button>
                <Button
                  onClick={handlePay}
                  disabled={!isValid || processing}
                  className="flex-1 bg-gradient-to-r from-neon-green to-vibe-purple text-white hover:opacity-90 font-bold rounded-full"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
