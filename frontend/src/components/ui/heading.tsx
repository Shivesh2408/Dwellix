import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva(
  "font-heading text-foreground font-bold tracking-tight",
  {
    variants: {
      level: {
        h1: "text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1]",
        h2: "text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.2]",
        h3: "text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.25]",
        h4: "text-xl sm:text-2xl md:text-3xl font-semibold leading-[1.3]",
        h5: "text-lg sm:text-xl md:text-2xl font-semibold leading-[1.35]",
        h6: "text-base sm:text-lg md:text-xl font-medium leading-[1.4]",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      level: "h2",
      align: "left",
    },
  }
);

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, align, as, ...props }, ref) => {
    const Component = as || level || "h2";
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ level, align, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
