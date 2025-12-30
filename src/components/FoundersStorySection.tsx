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
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  if (isMobile) {
    // Mobile: Simple vertical scroll with fade-in
    return (
      <div className="space-y-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-primary rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="flex flex-col">
              <div className="h-48 overflow-hidden">
                <img
                  src={card.image}
                  alt={`Foto de ${card.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
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
      </div>
    );
  }

  // Desktop: Accordion-style reveal based on scroll position
  return (
    <div ref={containerRef} className="max-w-3xl mx-auto">
      <div className="space-y-4">
        {cards.map((card, index) => (
          <AccordionCard
            key={index}
            card={card}
            index={index}
            totalCards={cards.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
};

interface AccordionCardProps {
  card: FounderCard;
  index: number;
  totalCards: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

const AccordionCard = ({ card, index, totalCards, scrollYProgress }: AccordionCardProps) => {
  // Each card reveals at a specific scroll threshold
  const cardStart = index / totalCards;
  const cardPeak = (index + 0.5) / totalCards;
  const cardEnd = (index + 1) / totalCards;

  // Opacity: fade in as we approach, stay visible, fade out as we pass
  const opacity = useTransform(
    scrollYProgress,
    [
      Math.max(0, cardStart - 0.1),
      cardStart,
      cardPeak,
      cardEnd,
      Math.min(1, cardEnd + 0.1),
    ],
    [0, 1, 1, 1, 0.3]
  );

  // Scale: slightly smaller when not in focus
  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardPeak, cardEnd],
    [0.95, 1, 0.98]
  );

  // Y position: slide up into view, then slightly up as next card comes
  const y = useTransform(
    scrollYProgress,
    [Math.max(0, cardStart - 0.1), cardStart, cardEnd],
    [40, 0, -10]
  );

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="bg-primary rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="flex flex-row min-h-[260px]">
        {/* Left side - Bio (60%) */}
        <div className="w-3/5 p-8 md:p-10 flex flex-col justify-between">
          <p className="text-primary-foreground/90 leading-relaxed text-lg">
            {card.bio}
          </p>
          <h3 className="text-sm font-bold text-primary-foreground mt-6">
            {card.name}
          </h3>
        </div>

        {/* Right side - Photo (40%) */}
        <div className="w-2/5 p-6 flex items-center justify-center">
          <div className="w-full h-full max-h-56 rounded-xl overflow-hidden">
            <img
              src={card.image}
              alt={`Foto de ${card.name}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FoundersStorySection;
