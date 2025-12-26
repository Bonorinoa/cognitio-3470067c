import { Card } from "@/components/ui/card";

interface InstructorCardDeckProps {
  name: string;
  role: string;
  bio: string[];
  image: string;
  isReversed?: boolean;
}

const InstructorCardDeck = ({
  name,
  role,
  bio,
  image,
  isReversed = false,
}: InstructorCardDeckProps) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Stacked cards effect */}
      <div className={`relative ${isReversed ? "flex-row-reverse" : ""}`}>
        {/* Background card (offset) */}
        <Card className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-2 translate-x-2 translate-y-2" />
        
        {/* Main card */}
        <Card className="relative bg-primary/90 rounded-3xl overflow-hidden">
          <div className={`flex flex-col md:flex-row ${isReversed ? "md:flex-row-reverse" : ""} items-stretch`}>
            {/* Text content */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                {name}
              </h3>
              <p className="text-primary-foreground/80 font-medium mb-6">
                {role}
              </p>
              <div className="space-y-4">
                {bio.map((paragraph, index) => (
                  <p key={index} className="text-primary-foreground/90 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Photo */}
            <div className="w-full md:w-2/5 aspect-square md:aspect-auto">
              <img
                src={image}
                alt={`Foto de ${name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InstructorCardDeck;
