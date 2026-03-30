import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LoyaltyProvider } from "@/context/LoyaltyContext";
import { AuthProvider } from "@/context/AuthContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { OrderHistoryProvider } from "@/context/OrderHistoryContext";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomerLayout from "@/layouts/CustomerLayout";
import AdminLayout from "@/layouts/AdminLayout";
import InventoryLayout from "@/layouts/InventoryLayout";
import LandingPage from "@/pages/LandingPage";
import MenuPage from "@/pages/MenuPage";
import OrderPage from "@/pages/OrderPage";
import ProfilePage from "@/pages/ProfilePage";
import TableOrderPage from "@/pages/TableOrderPage";
import CustomerLoginPage from "@/pages/CustomerLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminMenu from "@/pages/admin/AdminMenu";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminSettings from "@/pages/admin/AdminSettings";
import KitchenDisplay from "@/pages/admin/KitchenDisplay";
import BillingPage from "@/pages/admin/BillingPage";
import QRCodes from "@/pages/admin/QRCodes";
import StockLevelsPage from "@/pages/inventory/StockLevelsPage";
import SuppliersPage from "@/pages/inventory/SuppliersPage";
import ActivityPage from "@/pages/inventory/ActivityPage";
import ReportsPage from "@/pages/inventory/ReportsPage";
import RecipesPage from "@/pages/inventory/RecipesPage";
import PurchaseOrdersPage from "@/pages/inventory/PurchaseOrdersPage";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LoyaltyProvider>
            <CartProvider>
              <CustomerAuthProvider>
              <OrderHistoryProvider>
              <InventoryProvider>
                <Routes>
                  {/* Customer — open access */}
                  <Route element={<CustomerLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/order" element={<OrderPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/login" element={<CustomerLoginPage />} />
                    <Route path="/table/:tableNumber" element={<TableOrderPage />} />
                  </Route>

                  {/* Admin — PIN protected */}
                  <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="menu" element={<AdminMenu />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="billing" element={<BillingPage />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="qr" element={<QRCodes />} />
                  </Route>

                  {/* Kitchen — PIN protected, full screen */}
                  <Route path="/admin/kitchen" element={<ProtectedRoute role="kitchen"><KitchenDisplay /></ProtectedRoute>} />

                  {/* Inventory — PIN protected */}
                  <Route path="/inventory" element={<ProtectedRoute role="inventory"><InventoryLayout /></ProtectedRoute>}>
                    <Route index element={<StockLevelsPage />} />
                    <Route path="suppliers" element={<SuppliersPage />} />
                    <Route path="recipes" element={<RecipesPage />} />
                    <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
                    <Route path="activity" element={<ActivityPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </InventoryProvider>
              </OrderHistoryProvider>
              </CustomerAuthProvider>
            </CartProvider>
          </LoyaltyProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
