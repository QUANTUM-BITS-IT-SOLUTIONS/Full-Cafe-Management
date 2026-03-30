import { useState } from "react";
import { menuItems as initialItems, MenuItem, categories } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setEditing({ id: String(Date.now()), name: "", description: "", price: 0, category: "hot-drinks", image: "", available: true });
    setIsNew(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing({ ...item });
    setIsNew(false);
  };

  const save = () => {
    if (!editing || !editing.name) return;
    if (isNew) {
      setItems((prev) => [...prev, editing]);
      toast.success("Item added");
    } else {
      setItems((prev) => prev.map((i) => (i.id === editing.id ? editing : i)));
      toast.success("Item updated");
    }
    setEditing(null);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item deleted");
  };

  const toggleAvailability = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Menu Management</h1>
          <p className="text-muted-foreground mt-1">{items.length} items</p>
        </div>
        <Button onClick={openNew} className="bg-gold text-primary-foreground hover:bg-gold-dark">
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="glass-card rounded-xl p-6 w-full max-w-md space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl">{isNew ? "Add Item" : "Edit Item"}</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <Input placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="bg-secondary border-border" />
            <Textarea placeholder="Description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="bg-secondary border-border" />
            <Input type="number" placeholder="Price" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} className="bg-secondary border-border" />
            <select
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
            >
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Input placeholder="Image URL" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="bg-secondary border-border" />
            <Button onClick={save} className="w-full bg-gold text-primary-foreground hover:bg-gold-dark">
              {isNew ? "Add" : "Save"}
            </Button>
          </div>
        </div>
      )}

      {/* Items table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4 font-medium">Item</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/50 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-muted-foreground capitalize">{item.category.replace("-", " ")}</td>
                  <td className="p-4 text-gold font-semibold">${item.price.toFixed(2)}</td>
                  <td className="p-4">
                    <button onClick={() => toggleAvailability(item.id)} className={`text-xs ${item.available ? "text-green-400" : "text-red-400"}`}>
                      {item.available ? "Available" : "Sold Out"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleAvailability(item.id)} className="p-1.5 text-muted-foreground hover:text-foreground">
                        {item.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
