import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:translate-y-[-2px] hover:scale-[1.02] border border-transparent",
        secondary: "bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-200 border border-[#ECECEC] dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]",
        outline: "bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-200 border border-[#ECECEC] dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]",
        ghost: "hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-slate-100 text-slate-500",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-[0_4px_12px_rgba(220,38,38,0.1)] hover:translate-y-[-2px] hover:scale-[1.02] border border-transparent",
      },
      size: {
        sm: "h-9 px-4 text-xs rounded-[14px]",
        default: "h-11 px-5 py-2.5 rounded-[18px]",
        lg: "h-12 px-8 text-base rounded-[20px]",
        icon: "h-11 w-11 rounded-[18px]",
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
