import { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem } from "@/data/menu";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  size?: string;
  milk?: string;
  extras?: string[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity } : item)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => {
    let itemPrice = item.menuItem.price;
    const sizeAdd = item.menuItem.customizations?.sizes?.find((s) => s.name === item.size)?.priceAdd || 0;
    const extrasAdd = (item.extras || []).reduce((acc, extra) => {
      const e = item.menuItem.customizations?.extras?.find((x) => x.name === extra);
      return acc + (e?.price || 0);
    }, 0);
    return sum + (itemPrice + sizeAdd + extrasAdd) * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
