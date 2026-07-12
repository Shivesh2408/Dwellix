import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover shadow-sm hover:translate-y-[-2px] border border-transparent",
        secondary: "bg-secondary text-foreground border border-border hover:bg-secondary/70 shadow-sm",
        outline: "bg-transparent text-foreground border border-border hover:bg-secondary",
        ghost: "hover:bg-secondary hover:text-foreground text-muted-foreground",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:translate-y-[-2px] border border-transparent",
      },
      size: {
        sm: "h-9 px-4 text-xs rounded-[12px]",
        default: "h-11 px-5 py-2.5 rounded-[14px]",
        lg: "h-12 px-8 text-base rounded-[16px]",
        icon: "h-11 w-11 rounded-[14px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            {asChild ? children : <span>Loading...</span>}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
