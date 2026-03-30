import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Lock, KeyRound, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProtectedRouteProps {
  role: Exclude<UserRole, "customer">;
  children: React.ReactNode;
}

const roleConfig = {
  admin: {
    title: "Admin Access",
    subtitle: "Enter admin PIN to access the management dashboard.",
    icon: ShieldCheck,
    gradient: "from-vibe-purple to-neon-pink",
    hint: "Default PIN: 1234",
  },
  kitchen: {
    title: "Kitchen Access",
    subtitle: "Enter kitchen PIN to access the kitchen display.",
    icon: KeyRound,
    gradient: "from-neon-orange to-neon-yellow",
    hint: "Default PIN: 5678",
  },
  inventory: {
    title: "Inventory Access",
    subtitle: "Enter inventory PIN to access stock management.",
    icon: Lock,
    gradient: "from-neon-green to-neon-cyan",
    hint: "Default PIN: 4321",
  },
};

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { isAuthenticated, login } = useAuth();
  const [pin, setPin] = useState("");

  if (isAuthenticated(role)) {
    return <>{children}</>;
  }

  const config = roleConfig[role];
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(role, pin)) {
      toast.success(`${config.title} granted ✨`);
    } else {
      toast.error("Incorrect PIN");
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto`}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="font-serif text-3xl">{config.title}</h1>
          <p className="text-muted-foreground text-sm">{config.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <Input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="bg-secondary border-border rounded-xl h-14 text-center text-2xl tracking-[0.5em] font-mono"
              autoFocus
            />
            <Button
              type="submit"
              disabled={pin.length < 4}
              className={`w-full bg-gradient-to-r ${config.gradient} text-white hover:opacity-90 font-bold py-6 rounded-full`}
            >
              Unlock <Lock className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground font-mono">{config.hint}</p>
        </form>

        <div className="text-center">
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Café
          </a>
        </div>
      </motion.div>
    </div>
  );
}
