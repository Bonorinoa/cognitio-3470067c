import { motion } from "framer-motion";

interface StickyInstructorCardProps {
  name: string;
  bio: string;
  image: string;
  index: number;
}

const StickyInstructorCard = ({
  name,
  bio,
  image,
  index,
}: StickyInstructorCardProps) => {
  // Incremental top offsets and z-indexes for sticky stacking effect
  const topOffsets = [
    'top-16', 'top-20', 'top-24', 'top-28', 
    'top-32', 'top-36', 'top-40', 'top-44'
  ];
  const zIndexes = [
    'z-10', 'z-20', 'z-30', 'z-40', 
    'z-50', 'z-[60]', 'z-[70]', 'z-[80]'
  ];

  const topClass = topOffsets[index] || 'top-44';
  const zClass = zIndexes[index] || 'z-[80]';

  return (
    <div
      className={`sticky ${topClass} ${zClass} min-h-[60vh] w-full max-w-3xl mx-auto mb-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.1 
        }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-primary rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row min-h-[50vh]">
          {/* Left side - Bio (60%) */}
          <div className="flex-1 md:w-3/5 p-8 md:p-12 flex flex-col justify-between">
            <p className="text-primary-foreground/90 leading-relaxed text-lg">
              {bio}
            </p>
            <h3 className="text-sm font-bold text-primary-foreground mt-8">
              {name}
            </h3>
          </div>

          {/* Right side - Photo (40%) */}
          <div className="md:w-2/5 p-6 flex items-center justify-center">
            <div className="w-full h-64 md:h-full max-h-80 rounded-xl overflow-hidden">
              <img
                src={image}
                alt={`Foto de ${name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StickyInstructorCard;
