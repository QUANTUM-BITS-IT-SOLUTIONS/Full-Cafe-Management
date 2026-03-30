import { Coffee, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CafeFooter() {
  return (
    <footer className="border-t border-border relative noise-overlay">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vibe-purple to-neon-pink flex items-center justify-center">
                <Coffee className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-gold-gradient uppercase tracking-wide">Aureum</span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Redefining cafe culture since 2019. Bold coffee, bold vibes, zero gatekeeping. ☕✨
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-vibe-purple/50 transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </motion.a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-mono font-semibold text-foreground mb-4 tracking-widest uppercase">Hours</h4>
            <p className="text-sm text-muted-foreground">Mon – Fri: 7:00 AM – 8:00 PM</p>
            <p className="text-sm text-muted-foreground mt-1">Sat – Sun: 8:00 AM – 9:00 PM</p>
          </div>
          <div>
            <h4 className="text-xs font-mono font-semibold text-foreground mb-4 tracking-widest uppercase">Links</h4>
            <div className="space-y-2">
              <Link to="/menu" className="block text-sm text-muted-foreground hover:text-vibe-purple transition-colors">Menu</Link>
              <Link to="/order" className="block text-sm text-muted-foreground hover:text-vibe-purple transition-colors">Order Online</Link>
              <Link to="/admin" className="block text-sm text-muted-foreground hover:text-vibe-purple transition-colors">Admin</Link>
            </div>
          </div>
        </div>
        <div className="warm-divider mt-12 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">© 2026 Aureum Coffee. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Made with 💜 and ☕</p>
        </div>
      </div>
    </footer>
  );
}
