import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Package, Truck, ClipboardList, BarChart3, ArrowLeft, Coffee, BookOpen, FileText, LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const navItems = [
  { to: "/inventory", label: "Stock Levels", icon: Package },
  { to: "/inventory/suppliers", label: "Suppliers", icon: Truck },
  { to: "/inventory/recipes", label: "Recipes", icon: BookOpen },
  { to: "/inventory/purchase-orders", label: "Purchase Orders", icon: FileText },
  { to: "/inventory/activity", label: "Activity Log", icon: ClipboardList },
  { to: "/inventory/reports", label: "Reports", icon: BarChart3 },
];

export default function InventoryLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout("inventory");
    toast.success("Logged out of inventory");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card fixed inset-y-0 left-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gold" />
            <span className="font-serif text-lg font-bold text-gold">Inventory</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Stock Management</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Coffee className="h-4 w-4" />
            Back to Café
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:text-destructive/80 transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-card flex items-center px-4 gap-3 overflow-x-auto">
        <Package className="h-5 w-5 text-gold shrink-0" />
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`text-xs whitespace-nowrap px-2 py-1 rounded ${
              isActive(item.to)
                ? "text-accent-foreground bg-accent"
                : "text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
