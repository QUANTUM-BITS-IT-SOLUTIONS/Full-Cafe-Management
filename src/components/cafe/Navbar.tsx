import { Link, useLocation } from "react-router-dom";
import { Coffee, ShoppingBag, LogOut, LogIn, Award, Moon, Sun, ChevronDown, Menu, X, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useLoyalty } from "@/context/LoyaltyContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Navbar() {
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { points } = useLoyalty();
  const { customer, isLoggedIn, logout: customerLogout } = useCustomerAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/order", label: "Order" },
    { to: "/profile", label: "Profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border/50" : "border-b border-transparent"
      }`}
      style={{
        background: scrolled
          ? theme === "dark" ? "rgba(10, 10, 15, 0.9)" : "rgba(250, 247, 255, 0.92)"
          : theme === "dark" ? "rgba(10, 10, 15, 0.3)" : "rgba(250, 247, 255, 0.5)",
        backdropFilter: "blur(24px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-4">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-vibe-purple to-neon-pink flex items-center justify-center"
            >
              <div className="coffee-emblem w-6 h-6">
                <Coffee className="h-3 w-3 text-coffee" />
              </div>
            </motion.div>
            <span className="font-serif text-xl font-bold text-gold-gradient uppercase tracking-wide">Aureum</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to) ? "bg-gradient-to-r from-gold/20 to-amber/20 text-gold border border-gold/30" : "text-muted-foreground hover:text-gold hover:bg-gradient-to-r hover:from-gold/10 hover:to-amber/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Loyalty points */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow text-xs font-mono"
            >
              <Award className="h-3.5 w-3.5" />
              <span className="font-bold">{points}</span>
              <span className="hidden lg:inline">pts</span>
            </motion.div>

            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.85, rotate: 180 }}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-vibe-purple/50 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="h-4 w-4 text-neon-yellow" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="h-4 w-4 text-vibe-purple" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cart */}
            <Link to="/order" className="relative group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center group-hover:border-vibe-purple/50 transition-colors"
              >
                <ShoppingBag className="h-4 w-4 text-muted-foreground group-hover:text-vibe-purple transition-colors" />
              </motion.div>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-amber to-gold rounded-full flex items-center justify-center text-xs font-bold text-coffee gold-glow"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
            {/* Auth button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="coffee-emblem w-8 h-8">
                  <Coffee className="h-4 w-4 text-coffee" />
                </div>
                <span className="font-cafe-heading text-lg text-gold-gradient">Aureum Cafe</span>
                <p className="text-xs text-muted-foreground mt-1 font-cafe-accent">Premium Coffee</p>
                <span className="text-xs text-muted-foreground font-mono">{customer?.name}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { customerLogout(); toast.success("Logged out"); }}
                  className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-destructive/50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive("/login") ? "bg-gradient-to-r from-gold to-amber text-coffee shadow-lg gold-border" : "text-muted-foreground hover:text-gold hover:bg-gradient-to-r hover:from-gold/10 hover:to-amber/10"
                }`}
              >
                <LogIn className="h-3.5 w-3.5" /> Sign In
              </Link>
            )}
            <Link to="/inventory" className="flex items-center gap-2 px-3 py-2 text-sm text-gold hover:text-amber transition-colors">
              <Package className="h-4 w-4" />
              Inventory
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Loyalty badge mobile */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow text-xs font-mono">
              <Award className="h-3 w-3" />
              <span className="font-bold">{points}</span>
            </div>
            {/* Mobile Cart */}
            <Link to="/order" className="relative">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full bg-vibe-purple/10 border border-vibe-purple/30 flex items-center justify-center"
              >
                <ShoppingBag className="h-4 w-4 text-vibe-purple" />
              </motion.div>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-neon-pink text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </Link>
            <motion.button
              whileTap={{ scale: 0.85, rotate: 180 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-neon-yellow" /> : <Moon className="h-4 w-4 text-vibe-purple" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-foreground w-9 h-9 flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-xs whitespace-nowrap px-2 py-1 rounded font-cafe-accent ${isActive(link.to) ? "text-gold bg-gradient-to-r from-gold/20 to-amber/20" : "text-muted-foreground hover:text-gold"}`}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <button onClick={() => { customerLogout(); setMobileOpen(false); toast.success("Logged out"); }} className="block text-sm text-destructive font-medium">
                  Logout ({customer?.name})
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-vibe-purple font-bold">
                  Sign In 📱
                </Link>
              )}
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground font-mono">
                admin →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
