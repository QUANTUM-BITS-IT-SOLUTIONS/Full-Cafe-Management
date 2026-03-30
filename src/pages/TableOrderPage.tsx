import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, Coffee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TableOrderPage() {
  const { tableNumber } = useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-vibe-purple to-neon-pink flex items-center justify-center mx-auto"
        >
          <QrCode className="h-10 w-10 text-white" />
        </motion.div>

        <div>
          <h1 className="font-serif text-4xl md:text-5xl">
            TABLE <span className="text-gold-gradient">{tableNumber}</span>
          </h1>
          <p className="text-muted-foreground mt-2">Welcome to Aureum! Browse our menu and order from your table.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-vibe-purple/10 flex items-center justify-center shrink-0">
              <Coffee className="h-5 w-5 text-vibe-purple" />
            </div>
            <div>
              <p className="font-semibold text-sm">Scan → Browse → Order</p>
              <p className="text-xs text-muted-foreground">Your order will be sent straight to the kitchen.</p>
            </div>
          </div>
        </div>

        <Button asChild className="bg-gradient-to-r from-vibe-purple via-neon-pink to-neon-orange text-white hover:opacity-90 font-bold py-6 rounded-full text-base px-10">
          <Link to="/menu">
            Browse Menu <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <p className="text-xs text-muted-foreground font-mono">
          Table #{tableNumber} • Dine-in ordering
        </p>
      </motion.div>
    </div>
  );
}
