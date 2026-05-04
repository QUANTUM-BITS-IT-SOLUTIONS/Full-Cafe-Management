import { useState, useEffect } from "react";
import { Search, Plus, Sparkles, Coffee, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonGrid } from "@/components/ui/skeleton-card";
import { PageHeader } from "@/components/ui/page-header";
import { menuItems, categories } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { useInventory } from "@/context/InventoryContext";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "sonner";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { checkAvailability } = useInventory();
  const prefersReducedMotion = useReducedMotion() || false;

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === "all" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const isAvailable = (item: typeof menuItems[0]) => {
    if (!item.available) return false;
    const { available } = checkAvailability(item.id, 1);
    return available;
  };

  const handleQuickAdd = (item: typeof menuItems[0]) => {
    if (!isAvailable(item)) {
      toast.error(`${item.name} is sold out`);
      return;
    }
    addItem({ menuItem: item, quantity: 1 });
    toast.success(`${item.name} added to cart ✨`);
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob absolute top-40 left-[5%] w-64 h-64 bg-vibe-violet/10" style={{ animationDelay: "0s" }} />
        <div className="blob absolute bottom-40 right-[10%] w-72 h-72 bg-neon-pink/8" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <PageHeader
          badge={{ text: "Explore", icon: Sparkles }}
          title="THE"
          highlight="MENU"
          description="From signature pour overs to viral matcha — something for every vibe."
        />

        {/* Search */}
        <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.2 }} className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search the menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-10 bg-card border-border rounded-full h-12"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </motion.div>

        {/* Categories */}
        <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.3 }} className="flex flex-wrap gap-2 justify-center mb-10">
          <button onClick={() => setActiveCategory("all")} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === "all" ? "bg-vibe-purple text-white shadow-lg shadow-vibe-purple/25" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"}`}>All</button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-vibe-purple text-white shadow-lg shadow-vibe-purple/25" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"}`}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const available = isAvailable(item);
              return (
                <motion.div key={item.id} layout initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }} transition={{ delay: prefersReducedMotion ? 0 : i * 0.03, duration: prefersReducedMotion ? 0 : 0.4 }} whileHover={prefersReducedMotion ? {} : { y: -6 }} className="glass-card rounded-2xl overflow-hidden group relative">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <motion.img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" whileHover={prefersReducedMotion ? {} : { scale: 1.1 }} transition={{ duration: prefersReducedMotion ? 0 : 0.5 }} />
                    {!available && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-sm font-bold text-neon-pink font-mono uppercase">Sold Out 😭</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-5 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      <span className="inline-block mt-3 text-sm font-mono font-bold text-vibe-purple">${item.price.toFixed(2)}</span>
                    </div>
                    {available && (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button size="icon" className="shrink-0 bg-vibe-purple/10 text-vibe-purple hover:bg-vibe-purple hover:text-white border border-vibe-purple/20 rounded-xl" onClick={() => handleQuickAdd(item)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Coffee}
            title="No items found"
            description={`We couldn't find any items matching "${search}". Try a different search term or browse all categories.`}
            action={{
              label: "Clear Search",
              onClick: () => {
                setSearch("");
                setActiveCategory("all");
              },
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
