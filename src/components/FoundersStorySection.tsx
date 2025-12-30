import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface FounderCard {
  name: string;
  bio: string;
  image: string;
}

interface FoundersStorySectionProps {
  cards: FounderCard[];
}

const FoundersStorySection = ({ cards }: FoundersStorySectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate section height based on card count
  const sectionHeight = `${100 * cards.length}vh`;

  if (isMobile) {
    // Mobile: Simple vertical scroll without sticky behavior
    return (
      <section className="space-y-6 py-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-primary rounded-2xl shadow-xl overflow-hidden mx-auto max-w-lg"
          >
            <div className="flex flex-col">
              {/* Photo */}
              <div className="h-48 overflow-hidden">
                <img
                  src={card.image}
                  alt={`Foto de ${card.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bio */}
              <div className="p-6">
                <p className="text-primary-foreground/90 leading-relaxed text-base mb-4">
                  {card.bio}
                </p>
                <h3 className="text-sm font-bold text-primary-foreground">
                  {card.name}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    );
  }

  // Desktop: Scroll-controlled sticky stack animation
  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-20 h-[80vh] flex items-start justify-center pt-8">
        <div className="relative w-full max-w-3xl mx-auto">
          {cards.map((card, index) => (
            <ScrollCard
              key={index}
              card={card}
              index={index}
              totalCards={cards.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ScrollCardProps {
  card: FounderCard;
  index: number;
  totalCards: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

const ScrollCard = ({ card, index, totalCards, scrollYProgress }: ScrollCardProps) => {
  // Each card has its own scroll range
  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;
  const cardMid = cardStart + (cardEnd - cardStart) * 0.3;

  // Card slides up and fades in during its range
  const y = useTransform(
    scrollYProgress,
    [cardStart, cardMid],
    [100, 0]
  );

  const opacity = useTransform(
    scrollYProgress,
    [cardStart, cardMid],
    [0, 1]
  );

  // Previous cards scale down and get overlay when new card comes in
  const scale = useTransform(
    scrollYProgress,
    [cardEnd, cardEnd + 0.05],
    [1, 0.95]
  );

  const overlayOpacity = useTransform(
    scrollYProgress,
    [cardEnd, cardEnd + 0.05],
    [0, 0.1]
  );

  // Stack offset for visual layering
  const stackOffset = index * 4;

  return (
    <motion.div
      style={{
        y,
        opacity,
        scale,
        zIndex: index + 10,
        top: stackOffset,
      }}
      className="absolute left-0 right-0 mx-auto"
    >
      <div className="bg-primary rounded-2xl shadow-xl overflow-hidden relative">
        {/* Overlay for stacked cards */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-background pointer-events-none rounded-2xl z-10"
        />
        
        <div className="flex flex-col md:flex-row min-h-[50vh]">
          {/* Left side - Bio (60%) */}
          <div className="flex-1 md:w-3/5 p-8 md:p-12 flex flex-col justify-between">
            <p className="text-primary-foreground/90 leading-relaxed text-lg">
              {card.bio}
            </p>
            <h3 className="text-sm font-bold text-primary-foreground mt-8">
              {card.name}
            </h3>
          </div>

          {/* Right side - Photo (40%) */}
          <div className="md:w-2/5 p-6 flex items-center justify-center">
            <div className="w-full h-64 md:h-full max-h-80 rounded-xl overflow-hidden">
              <img
                src={card.image}
                alt={`Foto de ${card.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FoundersStorySection;
