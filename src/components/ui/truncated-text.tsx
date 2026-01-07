import * as React from "react";
import { cn } from "@/lib/utils";

interface TruncatedTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  as?: "p" | "span" | "div";
}

/**
 * A block-level text component that reliably truncates with ellipsis.
 * Use this inside flex/grid containers where you need text to shrink.
 * 
 * Key: uses `min-w-0` + `block` + standard truncate classes to ensure
 * `overflow: hidden` applies correctly (which requires a block-level element).
 */
const TruncatedText = React.forwardRef<HTMLParagraphElement, TruncatedTextProps>(
  ({ className, children, as: Component = "p", title, ...props }, ref) => {
    // Auto-generate title for tooltip if children is a simple string
    const tooltipTitle = title ?? (typeof children === "string" ? children : undefined);
    
    return (
      <Component
        ref={ref}
        title={tooltipTitle}
        className={cn(
          "min-w-0 truncate block",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

TruncatedText.displayName = "TruncatedText";

export { TruncatedText };
