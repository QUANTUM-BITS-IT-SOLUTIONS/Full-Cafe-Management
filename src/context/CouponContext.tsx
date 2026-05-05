import { createContext, useContext, useState, ReactNode } from "react";

interface Coupon {
  code: string;
  discount: number; // percentage
  minAmount: number;
  maxDiscount?: number;
  description: string;
  validUntil?: string;
  uses?: number;
}

interface CouponState {
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string, orderAmount: number) => boolean;
  removeCoupon: () => void;
  validateCoupon: (code: string) => Coupon | null;
}

const CouponContext = createContext<CouponState | undefined>(undefined);

// Available coupons
const availableCoupons: Coupon[] = [
  {
    code: "FIRST10",
    discount: 10,
    minAmount: 5,
    maxDiscount: 5,
    description: "10% off your first order",
  },
  {
    code: "WEEKEND20",
    discount: 20,
    minAmount: 10,
    maxDiscount: 8,
    description: "20% off weekend orders",
  },
  {
    code: "STUDENT15",
    discount: 15,
    minAmount: 8,
    description: "Student discount - 15% off",
  },
  {
    code: "COFFEE25",
    discount: 25,
    minAmount: 15,
    maxDiscount: 10,
    description: "25% off coffee lovers",
  },
  {
    code: "FREESHIP",
    discount: 0,
    minAmount: 0,
    description: "Free delivery on orders over $20",
  },
];

export function CouponProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const validateCoupon = (code: string): Coupon | null => {
    const coupon = availableCoupons.find(c => 
      c.code.toLowerCase() === code.toLowerCase().trim()
    );
    
    if (!coupon) return null;
    
    // Check if coupon is expired
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return null;
    }
    
    return coupon;
  };

  const applyCoupon = (code: string, orderAmount: number): boolean => {
    const coupon = validateCoupon(code);
    
    if (!coupon) {
      return false;
    }
    
    // Check minimum order amount
    if (orderAmount < coupon.minAmount) {
      return false;
    }
    
    setAppliedCoupon(coupon);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CouponContext.Provider value={{
      coupons: availableCoupons,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      validateCoupon,
    }}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
}
