import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoundersStorySection from "@/components/FoundersStorySection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { SEO } from "@/components/SEO";

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
    bio: "Debido al impacto significativo de estos eventos en personas y bienes materiales, es esencial evaluar su potencial de daño y probabilidad de ocurrencia de manera cuantitativa y rigurosa para que los resultados sean útiles en la formulación de políticas públicas confiables. Para cumplir con estos requisitos, he incorporado técnicas de análisis geoespacial, modelado físico/probabilístico y simulación computacional a mi experiencia profesional.",
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
    bio: "Cognitio es el lugar donde mis experiencias convergen con las de mi padre, donde combinamos métodos clásicos y modernos. El poder enseñar junto a mi padre es un privilegio y juntos les ofrecemos educación relevante, de alta calidad, y a un costo razonable, en idioma español para impulsarlos hacia un mercado laboral global y logren un incremento salarial significativo.",
    image: fatherAndSon3,
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Nuestra historia"
        description="Cognitio nació de la convicción de que la mejor tecnología educativa la diseñan quienes enseñan. Conocé a los fundadores."
        path="/about"
      />
      <Navbar />


      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pt-20 pb-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/80 backdrop-blur px-4 py-1.5 mb-6 text-sm text-primary font-medium">
                <Heart className="h-3.5 w-3.5" />
                Nuestra historia
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                Padre e hijo,
                <br />
                <span className="text-primary">una misma convicción.</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Cognitio no nació en un pitch deck. Nació de medio siglo de aulas, de tesis dirigidas
                a las dos de la mañana, y de la convicción de que la mejor tecnología educativa la
                diseñan quienes enseñan.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Sticky-stacking story */}
        <section className="container mx-auto px-4 py-12">
          <FoundersStorySection cards={founderCards} />
        </section>

        {/* Manifesto */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6">Por qué hacemos esto</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  La IA puede hacer dos cosas con la educación: vaciarla, o hacerla más humana.
                  Creemos que la diferencia está en quién tiene las herramientas. Cuando el instructor
                  las maneja, gana tiempo para lo que importa: pensar, dialogar, acompañar.
                </p>
                <p>
                  La plataforma es gratuita para instructores invitados y sus estudiantes. La sostienen
                  los proyectos a medida con instituciones y empresas. Es un modelo simple — quienes
                  pueden pagar financian el acceso de quienes no.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/instructors">
                  <Button size="lg" className="group">
                    Conocé la plataforma
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/planes">
                  <Button size="lg" variant="outline">
                    Ver servicios y precios
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
