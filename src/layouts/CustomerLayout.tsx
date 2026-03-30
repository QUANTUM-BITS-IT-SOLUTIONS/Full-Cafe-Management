import { Outlet } from "react-router-dom";
import Navbar from "@/components/cafe/Navbar";
import CafeFooter from "@/components/cafe/Footer";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <CafeFooter />
    </div>
  );
}
