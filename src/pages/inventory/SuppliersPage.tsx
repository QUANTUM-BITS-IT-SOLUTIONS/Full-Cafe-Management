import SuppliersTab from "@/components/inventory/SuppliersTab";

export default function SuppliersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Suppliers</h1>
        <p className="text-muted-foreground mt-1">View supplier performance and stock distribution.</p>
      </div>
      <SuppliersTab />
    </div>
  );
}
