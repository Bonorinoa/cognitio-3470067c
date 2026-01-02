import { useEffect, useState } from "react";

const HeroBackground = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if matchMedia is available (for test environments)
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    try {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery) {
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
          setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
    } catch (e) {
      // Silently fail in case matchMedia throws an error in test environment
      console.warn('matchMedia not available:', e);
    }
  }, []);

  const animationClass = prefersReducedMotion ? "" : "animate-blob";
  const floatAnimation = prefersReducedMotion ? "" : "animate-float-slow";
  const floatSlowerAnimation = prefersReducedMotion ? "" : "animate-float-slower";
  const pulseAnimation = prefersReducedMotion ? "" : "animate-pulse-glow";

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

      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Geometric pattern - flowing dots representing knowledge flow */}
      <div className="absolute inset-0">
        {/* Top-left cluster - symbolizing knowledge sources */}
        <div className={`absolute top-20 left-[10%] w-3 h-3 bg-primary/40 rounded-full ${pulseAnimation}`} style={{ animationDelay: "0s" }} />
        <div className={`absolute top-32 left-[15%] w-2 h-2 bg-primary/30 rounded-full ${floatAnimation}`} style={{ animationDelay: "0.5s" }} />
        <div className={`absolute top-28 left-[8%] w-2.5 h-2.5 bg-primary/35 rounded-full ${floatSlowerAnimation}`} style={{ animationDelay: "1s" }} />
        
        {/* Center cluster - main flow of knowledge */}
        <div className={`absolute top-1/3 left-1/4 w-2.5 h-2.5 bg-primary/35 rounded-full ${floatAnimation}`} style={{ animationDelay: "1.5s" }} />
        <div className={`absolute top-[40%] left-[30%] w-3 h-3 bg-primary/40 rounded-full ${pulseAnimation}`} style={{ animationDelay: "2s" }} />
        <div className={`absolute top-[35%] left-[22%] w-2 h-2 bg-primary/30 rounded-full ${floatSlowerAnimation}`} style={{ animationDelay: "2.5s" }} />
        
        {/* Right cluster - knowledge expansion */}
        <div className={`absolute top-1/4 right-[20%] w-2 h-2 bg-primary/30 rounded-full ${floatSlowerAnimation}`} style={{ animationDelay: "3s" }} />
        <div className={`absolute top-[30%] right-[15%] w-2.5 h-2.5 bg-primary/35 rounded-full ${floatAnimation}`} style={{ animationDelay: "3.5s" }} />
        <div className={`absolute top-[22%] right-[25%] w-3 h-3 bg-primary/40 rounded-full ${pulseAnimation}`} style={{ animationDelay: "4s" }} />
        
        {/* Bottom cluster - knowledge destination/application */}
        <div className={`absolute bottom-1/3 left-[40%] w-2 h-2 bg-primary/30 rounded-full ${floatAnimation}`} style={{ animationDelay: "4.5s" }} />
        <div className={`absolute bottom-[30%] right-[35%] w-2.5 h-2.5 bg-primary/35 rounded-full ${floatSlowerAnimation}`} style={{ animationDelay: "5s" }} />
        <div className={`absolute bottom-1/4 left-1/2 w-2 h-2 bg-primary/30 rounded-full ${pulseAnimation}`} style={{ animationDelay: "5.5s" }} />

        {/* Connecting lines - subtle paths of knowledge flow */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {/* Lines connecting the dots to represent knowledge networks */}
          <line x1="10%" y1="20%" x2="15%" y2="32%" stroke="hsl(14, 90%, 67%)" strokeWidth="1" strokeDasharray="4 4" className={pulseAnimation} />
          <line x1="15%" y1="32%" x2="25%" y2="35%" stroke="hsl(14, 90%, 67%)" strokeWidth="1" strokeDasharray="4 4" className={floatAnimation} />
          <line x1="25%" y1="35%" x2="30%" y2="40%" stroke="hsl(14, 90%, 67%)" strokeWidth="1" strokeDasharray="4 4" className={floatSlowerAnimation} />
          <line x1="75%" y1="25%" x2="78%" y2="30%" stroke="hsl(14, 90%, 67%)" strokeWidth="1" strokeDasharray="4 4" className={pulseAnimation} />
          <line x1="30%" y1="40%" x2="50%" y2="75%" stroke="hsl(14, 90%, 67%)" strokeWidth="1" strokeDasharray="4 4" className={floatAnimation} />
        </svg>
      </div>
    </div>
  );
};

export default HeroBackground;
