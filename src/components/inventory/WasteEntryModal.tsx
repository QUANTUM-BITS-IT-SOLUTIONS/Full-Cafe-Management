import { useState } from "react";
import { Ingredient } from "@/data/ingredients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Props {
  ingredient: Ingredient;
  onClose: () => void;
  onRecord: (ingredientId: string, qty: number, note: string) => void;
}

export default function WasteEntryModal({ ingredient, onClose, onRecord }: Props) {
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    const num = parseFloat(qty);
    if (!num || num <= 0) return;
    onRecord(ingredient.id, num, note || "Waste recorded");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="glass-card rounded-xl p-6 w-full max-w-sm space-y-4 border border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl">Record Waste</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">{ingredient.name}</span> · Current: {ingredient.currentStock} {ingredient.unit}
        </p>
        <Input
          type="number"
          placeholder={`Quantity (${ingredient.unit})`}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="bg-secondary border-border"
          min="0.1"
          step="any"
        />
        <Input
          placeholder="Reason (e.g., Expired, Spilled)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-secondary border-border"
        />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleSubmit}>Record Waste</Button>
        </div>
      </div>
    </div>
  );
}
