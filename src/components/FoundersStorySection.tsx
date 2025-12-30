import { motion } from "framer-motion";
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

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeOut",
              delay: isMobile ? 0 : index * 0.05 
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-primary rounded-2xl shadow-xl overflow-hidden"
          >
            {isMobile ? (
              // Mobile: Stacked vertically
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
            ) : (
              // Desktop: Side by side
              <div className="flex flex-row min-h-[280px]">
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
                  <div className="w-full h-full max-h-64 rounded-xl overflow-hidden">
                    <img
                      src={card.image}
                      alt={`Foto de ${card.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FoundersStorySection;
