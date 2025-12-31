import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoundersStorySection from "@/components/FoundersStorySection";
import HeroBackground from "@/components/HeroBackground";
import heroImage from "@/assets/hero-bg.jpg";
import { ArrowRight, GraduationCap, Users, Lightbulb, Target } from "lucide-react";

// Founder images
import gusLooking from "@/assets/founders/gus-looking.jpg";
import gusReading from "@/assets/founders/gus-reading.jpg";
import gusHorse from "@/assets/founders/gus-horse.jpg";
import fatherAndSon from "@/assets/founders/father-and-son.jpg";
import bonoConference from "@/assets/founders/bono-conference.jpg";
import bonoClassroom from "@/assets/founders/bono-classroom.jpg";
import bonoPeople from "@/assets/founders/bono-people.jpg";
import fatherAndSon3 from "@/assets/founders/father-and-son-3.jpg";

const founderCards = [
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Mi formación profesional es en las Ciencias de la Tierra y Ambientales (M.Sc. y Ph.D., Canadá). De este amplio campo me enfoqué en la evaluación y mitigación de los riesgos derivados de fenómenos naturales (inundaciones, terremotos, deslizamientos).",
    image: gusLooking,
  },
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Debido al impacto significativo de estos eventos en personas y bienes materiales, es esencial evaluar su potencial de daño y probabilidad de ocurrencia de manera cuantitativa y rigurosa para que los resultados sean útiles en la formulación de políticas públicas confiables. Para cumplir con estos requisitos, he incorporado técnicas de análisis geoespacial, modelado físico/probabilístico y simulación computacional.",
    image: gusReading,
  },
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Como deporte practiqué rugby, con algunos triunfos de campeonatos en Argentina y Chile. Actualmente, la lectura es mi transporte favorito para explorar escenarios de ciencia ficción y aventuras.",
    image: gusHorse,
  },
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Cognitio es el lugar donde confluyen mi experiencia, conocimientos y pasión, ofrecidos a ustedes a través de los Cursos. Cada Curso los desafiará a incorporar nuevas habilidades para extender y fortalecer sus aspiraciones en un mercado laboral cada día más competitivo.",
    image: fatherAndSon,
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "Mi educación superior se concentra en Econometría y Ciencias de Datos Aplicados. Logré el M.Sc en Economía Cuantitativa de Claremont Graduate University, California, donde lidero el laboratorio de investigación EconLLM, enfocado en el diseño y desarrollo de sistemas inteligentes para la economía experimental.",
    image: bonoConference,
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "Desde 2020, mi investigación y experiencia laboral se enfocan en la intersección entre Procesamiento de Lenguaje Natural (NLP) y economía del comportamiento, aplicando enfoques interdisciplinarios a problemas microeconómicos mediante la computación. Actualmente, soy profesor adjunto de estadística y macroeconomía en Pomona College, CA.",
    image: bonoClassroom,
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "Argentina, con sus marcadas asimetrías sociales y desafíos desde la Economía, me impulsa a concentrar esfuerzos para descifrar estas complejidades a través de estrategias computacionales, simulaciones, y la lente de la teoría de la información.",
    image: bonoPeople,
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "Cognitio es el lugar donde mis experiencias convergen con las de mi padre, donde combinamos métodos clásicos y modernos. El poder enseñar junto a mi padre es un privilegio y juntos les ofrecemos educación relevante, de alta calidad, y a un costo razonable, en idioma español para impulsarlos hacia un mercado laboral global.",
    image: fatherAndSon3,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Fondo de aprendizaje"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <HeroBackground />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Bienvenido a{" "}
            <span className="text-primary">Cognitio</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Aprende de expertos con cursos diseñados para transformar tu carrera 
            y expandir tus conocimientos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" className="min-w-[180px]">
                Explorar Cursos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="min-w-[180px]">
                Ver Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Lightbulb className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-6">Nuestra Visión</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Creemos que el conocimiento de calidad debe ser accesible para todos. 
              En Cognitio, cada curso está cuidadosamente diseñado por expertos 
              comprometidos con tu éxito. No somos una plataforma masiva — somos 
              una comunidad de aprendizaje donde cada estudiante importa.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Lo Que Ofrecemos
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Students */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <GraduationCap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Para Estudiantes
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  Cursos diseñados por expertos en su campo
                </li>
                <li className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  Aprende a tu propio ritmo, desde cualquier lugar
                </li>
                <li className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  Contenido actualizado y relevante
                </li>
                <li className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  Seguimiento de tu progreso
                </li>
              </ul>
            </div>

            {/* For Instructors */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Para Instructores
              </h3>
              <p className="text-muted-foreground mb-4">
                Cognitio trabaja con instructores cuidadosamente seleccionados. 
                No somos una plataforma abierta — cada instructor es invitado 
                para garantizar la más alta calidad.
              </p>
              <p className="text-sm text-muted-foreground">
                ¿Eres un experto interesado en enseñar? Contáctanos para explorar 
                oportunidades de colaboración.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Story Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Conoce a Nuestros Fundadores
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Padre e hijo unidos por la pasión de enseñar
            </p>
          </div>
          <FoundersStorySection cards={founderCards} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ¿Listo para Aprender?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Explora nuestro catálogo de cursos y servicios de consultoría
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/courses">
              <Button size="lg">
                Ver Cursos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/instructors">
              <Button size="lg" variant="outline">
                Conocer Instructores
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;