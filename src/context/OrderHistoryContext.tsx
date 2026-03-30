import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { MenuItem } from "@/data/menu";

export interface OrderHistoryItem {
  menuItem: MenuItem;
  quantity: number;
  size?: string;
  milk?: string;
  extras?: string[];
}

export interface CompletedOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderHistoryItem[];
  subtotal: number;
  tax: number;
  total: number;
  pickupTime: string;
  createdAt: string;
  paymentMethod: string;
}

interface OrderHistoryContextValue {
  orders: CompletedOrder[];
  addOrder: (order: CompletedOrder) => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextValue | null>(null);

const STORAGE_KEY = "aureum-order-history";

export function OrderHistoryProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<CompletedOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addOrder = useCallback((order: CompletedOrder) => {
    setOrders((prev) => {
      const next = [order, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <OrderHistoryContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderHistoryContext.Provider>
  );
}

export function useOrderHistory() {
  const ctx = useContext(OrderHistoryContext);
  if (!ctx) throw new Error("useOrderHistory must be used within OrderHistoryProvider");
  return ctx;
}
