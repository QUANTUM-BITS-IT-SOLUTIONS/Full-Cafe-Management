import { useState, useEffect } from "react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { FormField } from "@/components/ui/form-field";
import { Phone, KeyRound, User, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [nameError, setNameError] = useState("");

  // Resend OTP timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }
    setPhoneError("");
    setLoading(true);
    
    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const code = sendOtp(cleaned);
    setGeneratedOtp(code);
    setStep("otp");
    setResendTimer(30);
    setLoading(false);
    toast.success("OTP sent to your mobile!");
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const cleaned = phone.replace(/\D/g, "");
    const code = sendOtp(cleaned);
    setGeneratedOtp(code);
    setResendTimer(30);
    setLoading(false);
    toast.success("New OTP sent!");
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      setOtpError("Please enter the 4-digit OTP");
      return;
    }
    if (otp !== generatedOtp) {
      setOtpError("Invalid OTP. Please check and try again");
      return;
    }
    setOtpError("");
    setStep("name");
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      setNameError("Please enter your name");
      return;
    }
    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    setNameError("");
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const cleaned = phone.replace(/\D/g, "");
    const success = verifyOtp(cleaned, otp, name.trim());
    if (success) {
      toast.success(`Welcome, ${name.trim()}! 🎉`);
      navigate("/menu");
    } else {
      setLoading(false);
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
              <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                <FormField
                  label="Mobile Number"
                  icon={Phone}
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError("");
                  }}
                  error={phoneError}
                  helperText="We'll send a verification code to this number"
                  maxLength={15}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                />
                <LoadingButton
                  onClick={handleSendOtp}
                  loading={loading}
                  loadingText="Sending..."
                  disabled={phone.replace(/\D/g, "").length < 10}
                  className="w-full bg-gradient-to-r from-vibe-purple to-neon-pink text-white hover:opacity-90 font-bold py-6 rounded-full text-base"
                >
                  Send OTP <ArrowRight className="ml-2 h-4 w-4" />
                </LoadingButton>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                {/* Simulated OTP display */}
                <div className="bg-neon-green/10 border border-neon-green/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">📱 Simulated SMS</p>
                  <p className="text-sm">Your Aureum OTP is: <span className="font-mono font-bold text-neon-green text-lg">{generatedOtp}</span></p>
                </div>

                <FormField
                  label="Enter OTP"
                  icon={KeyRound}
                  type="text"
                  placeholder="4-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
                    setOtpError("");
                  }}
                  error={otpError}
                  maxLength={4}
                  className="[&_input]:text-2xl [&_input]:tracking-[0.5em] [&_input]:text-center"
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                />

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm text-vibe-purple hover:text-vibe-violet disabled:text-muted-foreground transition-colors inline-flex items-center gap-1"
                  >
                    <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("phone")} className="flex-1 rounded-full border-border h-12">
                    Back
                  </Button>
                  <LoadingButton
                    onClick={handleVerifyOtp}
                    loading={loading}
                    loadingText="Verifying..."
                    disabled={otp.length !== 4}
                    className="flex-1 bg-gradient-to-r from-vibe-purple to-neon-pink text-white hover:opacity-90 font-bold rounded-full h-12"
                  >
                    Verify <CheckCircle2 className="ml-2 h-4 w-4" />
                  </LoadingButton>
                </div>
              </motion.div>
            )}

            {step === "name" && (
              <motion.div key="name" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                <FormField
                  label="Your Name"
                  icon={User}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError("");
                  }}
                  error={nameError}
                  helperText="This will be used for your orders"
                  onKeyDown={(e) => e.key === "Enter" && handleComplete()}
                />
                <LoadingButton
                  onClick={handleComplete}
                  loading={loading}
                  loadingText="Creating account..."
                  disabled={!name.trim()}
                  className="w-full bg-gradient-to-r from-neon-green to-vibe-purple text-white hover:opacity-90 font-bold py-6 rounded-full text-base"
                >
                  Continue to Menu 🎉
                </LoadingButton>
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
