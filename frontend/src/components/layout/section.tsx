import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva(
  "w-full relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        dark: "bg-dark text-white dark:bg-background dark:text-foreground border-y border-border/10",
      },
      spacing: {
        default: "section-spacing",
        sm: "py-10 md:py-14",
        lg: "py-24 md:py-36",
        none: "py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "default",
    },
  }
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, spacing, as: Component = "section", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(sectionVariants({ variant, spacing, className }))}
        {...props}
      />
    );
  }
);
Section.displayName = "Section";

export { Section, sectionVariants };
