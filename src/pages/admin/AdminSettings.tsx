import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettings() {
  const [cafeName, setCafeName] = useState("Aureum Coffee");
  const [address, setAddress] = useState("42 Golden Lane, New York, NY 10013");
  const [hours, setHours] = useState("7:00 AM – 9:00 PM");

  const save = () => toast.success("Settings saved");

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your cafe profile.</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-serif text-lg">Cafe Profile</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Cafe Name</label>
            <Input value={cafeName} onChange={(e) => setCafeName(e.target.value)} className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Operating Hours</label>
            <Input value={hours} onChange={(e) => setHours(e.target.value)} className="bg-secondary border-border" />
          </div>
        </div>
        <Button onClick={save} className="bg-gold text-primary-foreground hover:bg-gold-dark">Save Changes</Button>
      </div>
    </div>
  );
}
