import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Search } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const isSearch = type === "search";
    
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full flex items-center">
        {isSearch && (
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        )}
        <input
          type={inputType}
          className={cn(
            "flex h-11 w-full rounded-[14px] border border-border bg-card px-4 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all duration-300",
            isSearch && "pl-10",
            isPassword && "pr-10",
            error && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && !props.disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
