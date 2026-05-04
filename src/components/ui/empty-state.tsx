import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center px-4 py-12", className)}>
      {Icon && (
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary mb-6">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
      <h3 className="font-serif text-xl md:text-2xl mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-gradient-to-r from-vibe-purple to-neon-pink text-white hover:opacity-90"
          >
            {action.label}
            {action.icon && <action.icon className="ml-2 h-4 w-4" />}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
