import { useState } from "react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, KeyRound, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Step = "phone" | "otp" | "name";

export default function CustomerLoginPage() {
  const { sendOtp, verifyOtp } = useCustomerAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [name, setName] = useState("");

  const handleSendOtp = () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    const code = sendOtp(cleaned);
    setGeneratedOtp(code);
    setStep("otp");
    toast.success("OTP sent to your mobile!");
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }
    setStep("name");
  };

  const handleComplete = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    const cleaned = phone.replace(/\D/g, "");
    const success = verifyOtp(cleaned, otp, name.trim());
    if (success) {
      toast.success(`Welcome, ${name.trim()}! 🎉`);
      navigate("/menu");
    } else {
      toast.error("Verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob absolute top-20 left-[20%] w-80 h-80 bg-vibe-purple/8" />
        <div className="blob absolute bottom-20 right-[15%] w-64 h-64 bg-neon-pink/6" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-vibe-purple to-neon-pink mb-4"
          >
            <Phone className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="font-serif text-3xl md:text-4xl">
            SIGN <span className="text-gold-gradient">IN</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            {step === "phone" && "Enter your mobile number to continue"}
            {step === "otp" && "Verify the OTP sent to your phone"}
            {step === "name" && "Almost there! Tell us your name"}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-5">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {(["phone", "otp", "name"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  s === step
                    ? "bg-vibe-purple scale-125"
                    : (["phone", "otp", "name"] as Step[]).indexOf(step) > i
                    ? "bg-neon-green"
                    : "bg-secondary"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 bg-secondary border-border rounded-xl h-12 text-lg font-mono tracking-wider"
                      maxLength={15}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSendOtp}
                  disabled={phone.replace(/\D/g, "").length < 10}
                  className="w-full bg-gradient-to-r from-vibe-purple to-neon-pink text-white hover:opacity-90 font-bold py-6 rounded-full text-base"
                >
                  Send OTP <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                {/* Simulated OTP display */}
                <div className="bg-neon-green/10 border border-neon-green/30 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">📱 Simulated SMS</p>
                  <p className="text-sm">Your Aureum OTP is: <span className="font-mono font-bold text-neon-green text-lg">{generatedOtp}</span></p>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Enter OTP</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="4-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="pl-10 bg-secondary border-border rounded-xl h-12 text-2xl font-mono tracking-[0.5em] text-center"
                      maxLength={4}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("phone")} className="flex-1 rounded-full border-border">
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 4}
                    className="flex-1 bg-gradient-to-r from-vibe-purple to-neon-pink text-white hover:opacity-90 font-bold rounded-full"
                  >
                    Verify <CheckCircle2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "name" && (
              <motion.div key="name" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-secondary border-border rounded-xl h-12"
                      onKeyDown={(e) => e.key === "Enter" && handleComplete()}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleComplete}
                  disabled={!name.trim()}
                  className="w-full bg-gradient-to-r from-neon-green to-vibe-purple text-white hover:opacity-90 font-bold py-6 rounded-full text-base"
                >
                  Continue to Menu 🎉
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By signing in, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
}
