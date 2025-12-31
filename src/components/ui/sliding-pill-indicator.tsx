import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlidingPillIndicatorProps {
  /**
   * Unique layout ID to prevent animation conflicts between different navigation areas
   * Examples: "navbar-active-indicator", "sidebar-active-indicator", "dashboard-tabs-indicator"
   */
  layoutId: string;
  /**
   * Border radius style - use "rounded-full" for horizontal layouts, "rounded-lg" for vertical
   */
  borderRadius?: "rounded-full" | "rounded-lg";
  /**
   * Additional custom classes
   */
  className?: string;
}

/**
 * A reusable sliding pill indicator component with glassmorphism styling.
 * Uses Framer Motion's shared layout animation for smooth transitions.
 * Automatically respects user's prefers-reduced-motion setting.
 */
export const SlidingPillIndicator = ({
  layoutId,
  borderRadius = "rounded-full",
  className,
}: SlidingPillIndicatorProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mediaQuery) {
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  return (
    <motion.div
      layoutId={layoutId}
      className={cn(
        "absolute inset-0 bg-primary/15 backdrop-blur-md border border-primary/20 shadow-lg -z-10",
        borderRadius,
        className
      )}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 380, damping: 30 }
      }
    />
  );
};
