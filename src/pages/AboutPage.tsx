import Navbar from "@/components/Navbar";
import InstructorCardDeck from "@/components/InstructorCardDeck";
import { Users } from "lucide-react";

const founders = [
  {
    name: "Gabriel Bonorino",
    role: "Co-Fundador & Instructor Principal",
    bio: [
      "Con más de 30 años de experiencia en finanzas y educación, Gabriel ha dedicado su carrera a democratizar el acceso al conocimiento financiero.",
      "Su pasión por enseñar lo llevó a crear Cognitio, una plataforma donde el aprendizaje se encuentra con la excelencia.",
    ],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
  },
  {
    name: "Agustín Bonorino",
    role: "Co-Fundador & Director de Tecnología",
    bio: [
      "Agustín combina su formación en ingeniería con una visión innovadora para crear experiencias de aprendizaje excepcionales.",
      "Lidera el desarrollo tecnológico de Cognitio, asegurando que cada estudiante tenga las mejores herramientas para su éxito.",
    ],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Las Personas Detrás de Nuestros Cursos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conoce a los expertos que hacen posible tu aprendizaje. Cada curso está diseñado 
            con pasión y experiencia para ayudarte a alcanzar tus metas.
          </p>
        </div>

        {/* Founders Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
            Fundadores
          </h2>
          <div className="space-y-12">
            {founders.map((founder, index) => (
              <InstructorCardDeck
                key={founder.name}
                {...founder}
                isReversed={index % 2 === 1}
              />
            ))}
          </div>
        </section>

        {/* Future Instructors Section */}
        <section className="text-center py-12 border-t border-border">
          <div className="max-w-2xl mx-auto">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Instructores Invitados
            </h2>
            <p className="text-muted-foreground mb-4">
              Próximamente añadiremos más instructores expertos a nuestra plataforma. 
              Cada instructor es cuidadosamente seleccionado para garantizar la más alta 
              calidad en la enseñanza.
            </p>
            <p className="text-sm text-muted-foreground">
              ¿Eres un experto en tu campo y te gustaría enseñar en Cognitio? 
              Contáctanos para explorar oportunidades de colaboración.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Cognitio. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
