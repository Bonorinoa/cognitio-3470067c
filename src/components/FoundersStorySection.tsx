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

  // Main scroll progress for the entire container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
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

  // Desktop: True sticky stacking effect
  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${cards.length * 100}vh` }}
    >
      {cards.map((card, index) => (
        <StickyCard
          key={index}
          card={card}
          index={index}
          totalCards={cards.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
};

interface StickyCardProps {
  card: FounderCard;
  index: number;
  totalCards: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

const StickyCard = ({ card, index, totalCards, scrollYProgress }: StickyCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Individual card scroll progress for image zoom
  const { scrollYProgress: cardScrollProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  // Card scale: shrinks as you scroll past it
  // Earlier cards scale down more, later cards stay closer to 1
  const targetScale = 1 - (totalCards - index) * 0.05;
  const scale = useTransform(
    scrollYProgress,
    [index / totalCards, 1],
    [1, targetScale]
  );

  // Image zoom: starts zoomed in, zooms out as card enters viewport
  const imageScale = useTransform(cardScrollProgress, [0, 1], [1.4, 1]);

  return (
    <div
      ref={cardRef}
      className="sticky top-0 h-screen flex items-center justify-center"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, transformOrigin: "top" }}
        className="bg-primary/85 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full mx-4"
      >
        <div className="flex flex-row h-[380px]">
          {/* Left side - Bio (60%) */}
          <div className="w-3/5 p-8 flex flex-col justify-between overflow-y-auto">
            <p className="text-primary-foreground/90 leading-relaxed text-base">
              {card.bio}
            </p>
            <h3 className="text-sm font-bold text-primary-foreground mt-4">
              {card.name}
            </h3>
          </div>

          {/* Right side - Photo (40%) with zoom effect */}
          <div className="w-2/5 p-5 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full max-h-[320px] rounded-xl overflow-hidden">
              <motion.img
                src={card.image}
                alt={`Foto de ${card.name}`}
                className="w-full h-full object-cover"
                style={{ scale: imageScale }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FoundersStorySection;
