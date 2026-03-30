import { createContext, useContext, useState, ReactNode } from "react";

interface LoyaltyContextValue {
  points: number;
  addPoints: (amount: number) => void;
  totalEarned: number;
}

const LoyaltyContext = createContext<LoyaltyContextValue | null>(null);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem("aureum-loyalty-points");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [totalEarned, setTotalEarned] = useState<number>(() => {
    const saved = localStorage.getItem("aureum-loyalty-total");
    return saved ? parseInt(saved, 10) : 0;
  });

  const addPoints = (amount: number) => {
    setPoints((prev) => {
      const next = prev + amount;
      localStorage.setItem("aureum-loyalty-points", String(next));
      return next;
    });
    setTotalEarned((prev) => {
      const next = prev + amount;
      localStorage.setItem("aureum-loyalty-total", String(next));
      return next;
    });
  };

  return (
    <LoyaltyContext.Provider value={{ points, addPoints, totalEarned }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) throw new Error("useLoyalty must be used within LoyaltyProvider");
  return ctx;
}
