import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("glass-card rounded-2xl overflow-hidden animate-pulse", className)}>
      <div className="aspect-[4/3] bg-secondary" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-secondary rounded w-3/4" />
        <div className="h-4 bg-secondary rounded w-full" />
        <div className="h-4 bg-secondary rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-secondary rounded w-16" />
          <div className="h-8 w-8 bg-secondary rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
