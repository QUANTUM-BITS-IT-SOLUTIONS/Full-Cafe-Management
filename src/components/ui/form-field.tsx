import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, icon: Icon, error, helperText, className, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        <label className="text-xs font-medium text-muted-foreground block">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            ref={ref}
            className={cn(
              Icon && "pl-10",
              error && "border-destructive focus-visible:ring-destructive",
              "bg-secondary border-border rounded-xl h-12"
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";
