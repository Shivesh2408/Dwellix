import * as React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

const Subheading = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-normal",
          className
        )}
        {...props}
      />
    );
  }
);
Subheading.displayName = "Subheading";

const Paragraph = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "text-sm sm:text-base text-muted-foreground leading-relaxed font-normal",
          className
        )}
        {...props}
      />
    );
  }
);
Paragraph.displayName = "Paragraph";

const Caption = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Component = "span", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "text-xs text-muted-foreground font-normal tracking-wide",
          className
        )}
        {...props}
      />
    );
  }
);
Caption.displayName = "Caption";

export { Subheading, Paragraph, Caption };
