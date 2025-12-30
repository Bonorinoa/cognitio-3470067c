import { useEffect, useState } from "react";

const HeroBackground = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const animationClass = prefersReducedMotion ? "" : "animate-blob";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary blob - top left */}
      <div
        className={`absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl ${animationClass}`}
        style={{ animationDelay: "0s" }}
      />
      
      {/* Secondary blob - top right */}
      <div
        className={`absolute -top-20 -right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl ${animationClass}`}
        style={{ animationDelay: "2s" }}
      />
      
      {/* Tertiary blob - bottom center */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl ${animationClass}`}
        style={{ animationDelay: "4s" }}
      />
    </div>
  );
};

export default HeroBackground;
