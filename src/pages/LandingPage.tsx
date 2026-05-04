import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Star, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { menuItems } from "@/data/menu";
import { useRef } from "react";
import genzHero from "@/assets/genz-hero.jpg";
import genzFlatlay from "@/assets/genz-flatlay.jpg";

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
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="blob absolute top-20 left-[10%] w-72 h-72 bg-vibe-violet/20" style={{ animationDelay: "0s" }} />
          <div className="blob absolute top-40 right-[15%] w-96 h-96 bg-neon-pink/15" style={{ animationDelay: "2s" }} />
          <div className="blob absolute bottom-20 left-[30%] w-80 h-80 bg-neon-orange/10" style={{ animationDelay: "4s" }} />
        </div>

        {/* Hero image */}
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <img src={genzHero} alt="Aureum Cafe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
          <div className="absolute inset-0 mesh-gradient" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto px-4 space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vibe-purple/10 border border-vibe-purple/30 text-vibe-purple text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Now Serving Vibes & Coffee
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </motion.div>

          {/* Title with stagger */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-serif leading-none"
            >
              <span className="text-gold-gradient">AUREUM</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            Not your average coffee shop. <span className="text-neon-pink">Bold flavors</span>, <span className="text-neon-cyan">cool vibes</span>, <span className="text-neon-orange">zero gatekeeping</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
            <Button asChild size="lg" className="bg-vibe-purple text-white hover:bg-vibe-violet font-bold px-10 py-7 text-lg rounded-full relative group overflow-hidden">
              <Link to="/order">
                <span className="relative z-10 flex items-center gap-2">
                  Order Now <Zap className="h-5 w-5 group-hover:animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-vibe-purple via-neon-pink to-vibe-purple bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity" style={{ animation: "gradient-rotate 3s ease infinite" }} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-vibe-purple/30 text-cream hover:bg-vibe-purple/10 px-10 py-7 text-lg rounded-full backdrop-blur-sm">
              <Link to="/menu">Explore Menu ✨</Link>
            </Button>
          </motion.div>

          {/* Floating tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-wrap gap-3 justify-center pt-4"
          >
            {["☕ Specialty Coffee", "🍵 Matcha Bar", "🥐 Fresh Pastries", "📸 Instagrammable"].map((tag, i) => (
              <motion.span
                key={tag}
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
                className="px-3 py-1.5 rounded-full bg-secondary/80 border border-border text-xs text-muted-foreground backdrop-blur-sm"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-0.5 h-8 bg-gradient-to-b from-vibe-purple to-transparent rounded-full"
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
              className="p-8 text-center group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="text-2xl mb-2"
              >
                {stat.emoji}
              </motion.div>
              <p className="text-2xl md:text-3xl font-serif font-bold text-gold-gradient">{stat.num}</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story / About section */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="blob absolute top-20 right-[10%] w-64 h-64 bg-neon-pink/10" style={{ animationDelay: "1s" }} />
          <div className="blob absolute bottom-20 left-[5%] w-72 h-72 bg-neon-cyan/8" style={{ animationDelay: "3s" }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono uppercase tracking-wider">
              <Star className="h-3 w-3" /> Our Vibe
            </span>
            <h2 className="font-serif text-4xl md:text-6xl leading-none">
              Coffee That <br />
              <span className="text-gold-gradient">Hits Different</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We're rewriting the rules of cafe culture. Single-origin beans, zero pretentiousness, maximum flavor. Every cup is an experience, not just a caffeine fix.
            </p>
            <div className="flex gap-6 pt-4">
              {[
                { icon: "🔥", label: "In-House Roasted" },
                { icon: "🌱", label: "Ethically Sourced" },
                { icon: "✨", label: "Main Character Energy" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="glass-card rounded-xl p-4 text-center flex-1"
                >
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
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
              <img src={genzFlatlay} alt="Artisan coffee" className="w-full h-auto" />
            </div>
            {/* Floating sticker */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-6 -right-4 bg-neon-yellow text-background font-bold text-sm px-4 py-2 rounded-full shadow-lg -rotate-12"
            >
              SO GOOD 🤤
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-neon-pink text-white font-bold text-xs px-3 py-2 rounded-full shadow-lg rotate-6"
            >
              📸 AESTHETIC AF
            </motion.div>
          </motion.div>
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
