import { Ingredient } from "@/data/ingredients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  ingredient: Ingredient;
  onClose: () => void;
  onRestock: (ingredientId: string, qty: number) => void;
}

export default function RestockModal({ ingredient, onClose, onRestock }: Props) {
  const [qty, setQty] = useState("");

  const handleSubmit = () => {
    const num = parseFloat(qty);
    if (!num || num <= 0) return;
    onRestock(ingredient.id, num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="glass-card rounded-xl p-6 w-full max-w-sm space-y-4 border border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl">Restock {ingredient.name}</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <p className="text-sm text-muted-foreground">
          Current: <span className="text-foreground font-medium">{ingredient.currentStock.toLocaleString()} {ingredient.unit}</span>
        </p>
        <Input
          type="number"
          placeholder={`Quantity (${ingredient.unit})`}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="bg-secondary border-border"
          min="1"
          step="any"
        />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-gold text-primary-foreground hover:bg-gold-dark" onClick={handleSubmit}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}
