import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { SlidingPillIndicator } from "@/components/ui/sliding-pill-indicator";
import { cn } from "@/lib/utils";

interface AnimatedTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** Shared layoutId so the pill animates between triggers in the same group. */
  layoutId?: string;
}

/**
 * Radix Tabs trigger with a Framer Motion sliding pill background.
 *
 * Place all triggers that should share a single pill inside the same
 * `<LayoutGroup>` and give them the same `layoutId`.
 */
export const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  AnimatedTabsTriggerProps
>(({ className, children, layoutId = "animated-tabs-indicator", ...props }, ref) => {
  const internalRef = React.useRef<HTMLButtonElement | null>(null);
  const [isActive, setIsActive] = React.useState(false);

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  React.useEffect(() => {
    const trigger = internalRef.current;
    if (!trigger) return;
    setIsActive(trigger.getAttribute("data-state") === "active");
    const observer = new MutationObserver(() => {
      setIsActive(trigger.getAttribute("data-state") === "active");
    });
    observer.observe(trigger, { attributes: true, attributeFilter: ["data-state"] });
    return () => observer.disconnect();
  }, []);

  return (
    <TabsPrimitive.Trigger
      ref={mergedRef}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground data-[state=active]:text-foreground",
        className
      )}
      {...props}
    >
      {isActive && <SlidingPillIndicator layoutId={layoutId} borderRadius="rounded-full" />}
      <span className="relative z-10">{children}</span>
    </TabsPrimitive.Trigger>
  );
});
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger";
