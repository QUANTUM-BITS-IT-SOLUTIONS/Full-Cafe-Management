import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Props {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentModal({ amount, onSuccess, onCancel }: Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const tax = amount * 0.08;
  const total = amount + tax;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const isValid = cardNumber.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvv.length >= 3 && cardName.trim().length > 0;

  const handlePay = async () => {
    if (!isValid) return;
    setProcessing(true);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));

    setProcessing(false);
    setSuccess(true);
    toast.success("Payment successful! 💳");

    setTimeout(() => {
      onSuccess();
    }, 1500);
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

              {/* Amount breakdown */}
              <div className="px-5 pt-4 pb-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                  <span>Total</span>
                  <span className="text-accent-foreground font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Card form */}
              <div className="p-5 space-y-4">
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
