import { Link } from "react-router-dom";
import { 
  ArrowRight, Sparkles, Zap, Star, Coffee, MapPin, Clock, Award, 
  Flame, Gift, Users, Utensils, CreditCard, ChefHat, Bike, 
  Smartphone, QrCode, Receipt, TrendingUp, Quote, Instagram,
  ArrowUpRight, Heart, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { menuItems } from "@/data/menu";
import { useRef } from "react";
import genzHero from "@/assets/genz-hero.jpg";
import cafeAmbiance from "@/assets/cafe-ambiance.jpg";
import genzFlatlay from "@/assets/genz-flatlay.jpg";

// Best sellers data
const bestSellers = [
  { id: 1, name: "Golden Latte", price: 5.50, rating: 4.9, sold: "2.3k", image: menuItems[0]?.image || genzFlatlay, badge: "Top Pick" },
  { id: 2, name: "Berry Bliss Bowl", price: 8.90, rating: 4.8, sold: "1.8k", image: menuItems[1]?.image || genzFlatlay, badge: "Healthy" },
  { id: 3, name: "Caramel Cold Brew", price: 6.50, rating: 4.9, sold: "3.1k", image: menuItems[2]?.image || genzFlatlay, badge: "Refreshing" },
  { id: 4, name: "Matcha Supreme", price: 6.90, rating: 4.7, sold: "1.5k", image: menuItems[3]?.image || genzFlatlay, badge: "Trending" },
];

// Offers data
const offers = [
  { id: 1, title: "Morning Boost", subtitle: "Coffee + Pastry", price: 7.50, originalPrice: 10.00, discount: "25% OFF", icon: Coffee, color: "from-orange-500 to-red-500" },
  { id: 2, title: "Study Buddy", subtitle: "2 Drinks + Snack", price: 12.00, originalPrice: 16.50, discount: "Save $4.50", icon: Zap, color: "from-vibe-purple to-neon-pink" },
  { id: 3, title: "Group Treat", subtitle: "4 Drinks Bundle", price: 20.00, originalPrice: 28.00, discount: "Best Value", icon: Users, color: "from-neon-cyan to-blue-500" },
];

// How it works steps
const howItWorks = [
  { step: 1, title: "Order", description: "Browse menu & customize your perfect drink", icon: Smartphone, color: "vibe-purple" },
  { step: 2, title: "Payment", description: "Secure checkout with multiple options", icon: CreditCard, color: "neon-pink" },
  { step: 3, title: "Kitchen", description: "Fresh preparation by expert baristas", icon: ChefHat, color: "neon-cyan" },
  { step: 4, title: "Pickup", description: "Ready when you are - skip the line!", icon: Bike, color: "neon-green" },
];

// Smart Billing features
const billingFeatures = [
  { icon: Zap, title: "Lightning Fast", desc: "Process orders in under 30 seconds" },
  { icon: Receipt, title: "Auto Receipts", desc: "Digital & print receipts instantly" },
  { icon: QrCode, title: "QR Ordering", desc: "Customers scan, order, pay - no contact" },
  { icon: TrendingUp, title: "Live Inventory", desc: "Stock updates automatically" },
];

// Testimonials
const testimonials = [
  { name: "Sarah M.", role: "Regular Customer", text: "Best coffee in the city! The app makes ordering so convenient.", rating: 5 },
  { name: "Jake K.", role: "Student", text: "Study buddy combo is a lifesaver. Great prices for students!", rating: 5 },
  { name: "Emma L.", role: "Food Blogger", text: "Instagram-worthy aesthetics and incredible taste. 10/10!", rating: 5 },
];

export default function LandingPage() {
  const featured = menuItems.slice(0, 4);
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() || false;
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], prefersReducedMotion ? [1, 1] : [1, 0]);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Vibrant gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5" />
          <div className="blob absolute top-20 left-[10%] w-72 h-72 bg-primary/10" style={{ animationDelay: "0s" }} />
          <div className="blob absolute top-40 right-[15%] w-96 h-96 bg-secondary/8" style={{ animationDelay: "2s" }} />
          <div className="blob absolute bottom-20 left-[30%] w-80 h-80 bg-accent/6" style={{ animationDelay: "4s" }} />
        </div>

        {/* Hero image with luxury overlay */}
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <img src={genzHero} alt="Aureum Cafe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto px-4 space-y-8">
          {/* Coffee Emblem - Central Hero Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-8"
          >
            <div className="coffee-emblem w-24 h-24 md:w-32 md:h-32 shadow-2xl">
              <Coffee className="h-12 w-12 md:h-16 md:w-16 text-coffee" />
            </div>
          </motion.div>

          {/* Elegant Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-primary text-sm font-cafe-accent backdrop-blur-sm gold-glow">
              <Sparkles className="h-4 w-4" />
              Modern Coffee Experience
              <Sparkles className="h-4 w-4" />
            </span>
          </motion.div>

          {/* Modern Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1"
          >
            <h1 className="font-hero-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gold-gradient leading-none drop-shadow-2xl">
              AUREUM
            </h1>
            <h2 className="font-hero-subtitle text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-gradient leading-none tracking-wider">
              CAFE
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-cafe-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Where <span className="text-gold-gradient font-cafe-accent">artisanal coffee</span> meets <span className="text-amber-gradient font-cafe-accent">vibrant energy</span>. Experience the perfect blend of exceptional flavors and contemporary atmosphere.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
          >
            <Link
              to="/menu"
              className="group relative px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-hero-subtitle text-xl hover:opacity-90 transition-all duration-300 shadow-2xl gold-border gold-glow hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Menu
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              to="/order"
              className="group relative px-10 py-5 bg-gradient-to-r from-accent to-vibrant text-white rounded-full font-hero-subtitle text-xl hover:opacity-90 transition-all duration-300 shadow-2xl vibrant-border vibrant-glow hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Order Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-vibrant-light to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>

          {/* Premium Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap gap-4 justify-center pt-8"
          >
            {[
              { icon: Coffee, label: "Artisanal Coffee" },
              { icon: Award, label: "Award Winning" },
              { icon: Heart, label: "Made with Love" },
              { icon: Star, label: "Premium Quality" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.3 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-cafe-accent backdrop-blur-sm gold-glow flex items-center gap-2"
              >
                <feature.icon className="h-4 w-4" />
                {feature.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Elegant Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-xs text-primary font-hero-subtitle uppercase tracking-widest">Discover More</span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1 h-10 bg-gradient-to-b from-primary to-secondary/50 rounded-full gold-glow"
          />
        </motion.div>
      </section>

      {/* Stats strip with counter animation */}
      <section className="relative border-y border-border noise-overlay">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { num: "500+", label: "5-Star Reviews", emoji: "⭐" },
            { num: "50K", label: "Cups Served", emoji: "☕" },
            { num: "15", label: "Origins", emoji: "🌍" },
            { num: "7-9", label: "Open Daily", emoji: "🕐" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 md:p-8 text-center group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="text-xl md:text-2xl mb-2"
              >
                <div className="text-3xl md:text-4xl mb-2">{stat.emoji}</div>
                <div className="text-2xl md:text-3xl font-cafe-heading text-gold-gradient">{stat.num}</div>
                <div className="text-sm font-cafe-body text-muted-foreground">{stat.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ⭐ BEST SELLERS SECTION */}
      <section className="section-padding relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="blob absolute top-20 left-[5%] w-80 h-80 bg-neon-pink/10" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono uppercase tracking-wider">
                <Flame className="h-3 w-3" /> Customer Favorites
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl">
                BEST <span className="text-gold-gradient">SELLERS</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">Our most loved drinks that keep customers coming back for more</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="gradient-card rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="product-badge">{item.badge}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{item.rating}</span>
                      <span className="text-white/70 text-xs">({item.sold} sold)</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-vibe-purple">${item.price.toFixed(2)}</span>
                    <Button size="sm" className="rounded-full bg-vibe-purple/10 text-vibe-purple hover:bg-vibe-purple hover:text-white border border-vibe-purple/20">
                      <Coffee className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎉 OFFERS & COMBOS SECTION */}
      <section className="section-padding-sm relative noise-overlay">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-mono uppercase tracking-wider">
                <Gift className="h-3 w-3" /> Special Deals
              </span>
              <h2 className="text-3xl md:text-5xl">
                OFFERS & <span className="text-gold-gradient">COMBOS</span>
              </h2>
              <p className="text-muted-foreground">Save more with our curated bundles</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {offers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="relative overflow-hidden rounded-2xl glass-card p-6"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${offer.color} opacity-20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${offer.color} flex items-center justify-center`}>
                      <offer.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs font-bold">
                      {offer.discount}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{offer.subtitle}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-gold-gradient">${offer.price}</span>
                    <span className="text-muted-foreground line-through text-sm">${offer.originalPrice}</span>
                  </div>
                  <Button className="w-full rounded-xl bg-gradient-to-r from-vibe-purple to-neon-pink text-white font-semibold">
                    Grab Deal <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📍 ABOUT THE CAFÉ SECTION */}
      <section className="section-padding relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="blob absolute top-20 right-[10%] w-64 h-64 bg-neon-pink/10" style={{ animationDelay: "1s" }} />
          <div className="blob absolute bottom-20 left-[5%] w-72 h-72 bg-neon-cyan/8" style={{ animationDelay: "3s" }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono uppercase tracking-wider">
                <MapPin className="h-3 w-3" /> About Aureum
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl leading-tight">
                Where Coffee <br />
                <span className="text-gold-gradient">Meets Art</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nestled in the heart of the city, Aureum Café is more than just a coffee shop. We're a community hub where every cup tells a story, every latte is a canvas, and every visit feels like coming home.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { icon: Clock, label: "Open 7am - 9pm", desc: "Daily" },
                  { icon: MapPin, label: "Downtown", desc: "5 min walk" },
                  { icon: Award, label: "Award Winning", desc: "Since 2020" },
                  { icon: Heart, label: "Community", desc: "First" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-xl p-4 flex items-center gap-3"
                  >
                    <div className="feature-icon shrink-0">
                      <item.icon className="h-5 w-5 text-vibe-purple" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 3 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden gold-glow">
                <img src={genzFlatlay} alt="Aureum Cafe interior" className="w-full h-auto" />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-4 -right-4 bg-neon-yellow text-background font-bold text-sm px-4 py-2 rounded-full shadow-lg -rotate-12"
              >
                VISIT US ☕
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-neon-pink text-white font-bold text-xs px-3 py-2 rounded-full shadow-lg rotate-6"
              >
                📍 123 Vibe Street
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS SECTION */}
      <section className="section-padding-sm relative noise-overlay">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vibe-purple/10 border border-vibe-purple/30 text-vibe-purple text-xs font-mono uppercase tracking-wider">
                <Quote className="h-3 w-3" /> Customer Love
              </span>
              <h2 className="text-3xl md:text-5xl">
                WHAT THEY <span className="text-gold-gradient">SAY</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 relative"
              >
                <Quote className="absolute top-4 right-4 h-8 w-8 text-vibe-purple/20" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-neon-yellow fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vibe-purple to-neon-pink flex items-center justify-center text-white font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📸 GALLERY SECTION */}
      <section className="section-padding-sm relative">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono uppercase tracking-wider">
                <Instagram className="h-3 w-3" /> @aureumcafe
              </span>
              <h2 className="text-3xl md:text-5xl">
                GALLERY <span className="text-gold-gradient">WALL</span>
              </h2>
              <p className="text-muted-foreground">Follow our journey, one cup at a time</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {menuItems.slice(0, 8).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className={`relative overflow-hidden rounded-xl group cursor-pointer ${i === 0 || i === 5 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${i === 0 || i === 5 ? 'h-full min-h-[200px] md:min-h-[300px]' : 'aspect-square'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white font-semibold text-sm md:text-base">{item.name}</p>
                  <p className="text-white/80 text-xs md:text-sm">${item.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured menu — bento grid style */}
      <section className="py-28 px-4 relative noise-overlay">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono uppercase tracking-wider">
                <Coffee className="h-3 w-3" /> Fan Favorites
              </span>
              <h2 className="font-serif text-4xl md:text-6xl">
                THE <span className="text-gold-gradient">MENU</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">The drinks that keep going viral. You've seen them on TikTok, now try them IRL.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden relative">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-mono bg-vibe-purple/90 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                      ${item.price.toFixed(2)}
                    </span>
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                      className="text-xs bg-neon-green/90 text-background px-2.5 py-1 rounded-full font-bold"
                    >
                      🔥 HOT
                    </motion.span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" className="border-vibe-purple/30 text-cream hover:bg-vibe-purple/10 rounded-full px-8 font-bold group">
              <Link to="/menu">
                See Full Menu <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 🎯 HOW IT WORKS SECTION */}
      <section className="section-padding relative noise-overlay">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono uppercase tracking-wider">
                <Zap className="h-3 w-3" /> Simple Process
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl">
                HOW IT <span className="text-gold-gradient">WORKS</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">Order your favorites in 4 simple steps</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-${step.color}/20 flex items-center justify-center mb-4`}>
                    <step.icon className={`h-7 w-7 text-${step.color}`} />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-vibe-purple to-neon-pink text-white text-xs flex items-center justify-center font-bold">
                      {step.step}
                    </span>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-vibe-purple/50 to-neon-pink/50" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💰 SMART BILLING SECTION */}
      <section className="section-padding relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="blob absolute top-20 left-[10%] w-72 h-72 bg-neon-green/10" />
          <div className="blob absolute bottom-20 right-[5%] w-64 h-64 bg-vibe-purple/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-neon-green to-vibe-purple opacity-20 blur-3xl rounded-full" />
                <div className="relative z-10 space-y-4">
                  {/* Mock POS UI */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vibe-purple to-neon-pink flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-lg">Aureum POS</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">Order #2847</span>
                  </div>
                  
                  {[
                    { name: "Golden Latte", qty: 2, price: 11.00 },
                    { name: "Avocado Toast", qty: 1, price: 8.50 },
                    { name: "Iced Matcha", qty: 1, price: 6.50 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-secondary text-xs flex items-center justify-center">{item.qty}x</span>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-mono">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>$26.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax (8%)</span>
                      <span>$2.08</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-gold-gradient">$28.08</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 rounded-xl bg-gradient-to-r from-vibe-purple to-neon-pink text-white font-semibold">
                      <QrCode className="h-4 w-4 mr-2" /> Pay Now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 space-y-6"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-mono uppercase tracking-wider">
                <TrendingUp className="h-3 w-3" /> For Business
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl leading-tight">
                Smart Billing for <br />
                <span className="text-gold-gradient">Walk-in Customers</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Streamline your cafe operations with our integrated POS system. Fast, accurate, and designed for modern cafes.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {billingFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-5 w-5 text-neon-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Button className="rounded-full bg-gradient-to-r from-neon-green to-vibe-purple text-white font-semibold px-8 py-6">
                Learn More <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vibe-violet/15" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-12 md:p-16 text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient opacity-50" />
            <div className="relative z-10 space-y-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-vibe-purple via-neon-pink to-neon-orange flex items-center justify-center"
              >
                <Coffee className="h-7 w-7 text-white" />
              </motion.div>
              <h2 className="font-serif text-4xl md:text-5xl">
                READY TO <span className="text-gold-gradient">SIP</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Your next favorite drink is one tap away. Order ahead, skip the line, live your best life.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-vibe-purple via-neon-pink to-neon-orange text-white hover:opacity-90 font-bold px-12 py-7 text-lg rounded-full">
                <Link to="/order">
                  Let's Go <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
