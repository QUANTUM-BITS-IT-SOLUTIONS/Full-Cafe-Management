import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CustomerProfile {
  phone: string;
  name: string;
  loggedInAt: string;
}

interface CustomerAuthContextValue {
  customer: CustomerProfile | null;
  isLoggedIn: boolean;
  sendOtp: (phone: string) => string; // returns the OTP for simulated display
  verifyOtp: (phone: string, otp: string, name: string) => boolean;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    const saved = localStorage.getItem("aureum-customer");
    return saved ? JSON.parse(saved) : null;
  });
  const [otpStore, setOtpStore] = useState<Map<string, string>>(new Map());

  const sendOtp = useCallback((phone: string) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpStore((prev) => {
      const next = new Map(prev);
      next.set(phone, otp);
      return next;
    });
    return otp;
  }, []);

  const verifyOtp = useCallback((phone: string, otp: string, name: string) => {
    const stored = otpStore.get(phone);
    if (stored && stored === otp) {
      const profile: CustomerProfile = {
        phone,
        name,
        loggedInAt: new Date().toISOString(),
      };
      setCustomer(profile);
      localStorage.setItem("aureum-customer", JSON.stringify(profile));
      setOtpStore((prev) => {
        const next = new Map(prev);
        next.delete(phone);
        return next;
      });
      return true;
    }
    return false;
  }, [otpStore]);

  const logout = useCallback(() => {
    setCustomer(null);
    localStorage.removeItem("aureum-customer");
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ customer, isLoggedIn: !!customer, sendOtp, verifyOtp, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}
