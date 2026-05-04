import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  highlight?: string;
  description?: string;
  badge?: {
    text: string;
    icon?: LucideIcon;
  };
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  highlight,
  description,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("text-center mb-10", className)}>
      {badge && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vibe-purple/10 border border-vibe-purple/30 text-vibe-purple text-xs font-mono uppercase tracking-wider mb-4">
          {badge.icon && <badge.icon className="h-3 w-3" />}
          {badge.text}
        </span>
      )}
      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
        {title}
        {highlight && <span className="text-gold-gradient"> {highlight}</span>}
      </h1>
      {description && (
        <p className="text-muted-foreground max-w-md mx-auto text-base sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
