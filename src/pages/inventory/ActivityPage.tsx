import ActivityLogTab from "@/components/inventory/ActivityLogTab";

export default function ActivityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Activity Log</h1>
        <p className="text-muted-foreground mt-1">Track all ingredient stock movements.</p>
      </div>
      <ActivityLogTab />
    </div>
  );
}
