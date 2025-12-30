import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoundersStorySection from "@/components/FoundersStorySection";
import { Button } from "@/components/ui/button";

const instructorCards = [
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Mi formación profesional es en las Ciencias de la Tierra y Ambientales (M.Sc. y Ph.D., Canadá). De este amplio campo me enfoqué en la evaluación y mitigación de los riesgos derivados de fenómenos naturales (inundaciones, terremotos, deslizamientos).",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop",
  },
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Debido al impacto significativo de estos eventos en personas y bienes materiales, es esencial evaluar su potencial de daño y probabilidad de ocurrencia de manera cuantitativa y rigurosa para que los resultados sean útiles en la formulación de políticas públicas confiables. Para cumplir con estos requisitos, he incorporado técnicas de análisis geoespacial, modelado físico/probabilístico y simulación computacional a mi experiencia profesional.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
  },
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Como deporte practiqué rugby, con algunos triunfos de campeonatos en Argentina y Chile. Actualmente, la lectura es mi transporte favorito para explorar escenarios de ciencia ficción y aventuras.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop",
  },
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Cognitio es el lugar donde confluyen mi experiencia, conocimientos y pasión, ofrecidos a ustedes a través de los Cursos. Cada Curso los desafiará a incorporar nuevas habilidades para extender y fortalecer sus aspiraciones en un mercado laboral cada día más competitivo.",
    image: "https://images.unsplash.com/photo-1559718062-361155fad299?w=600&h=600&fit=crop",
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "Mi educación superior se concentra en Econometría y Ciencias de Datos Aplicados. Logré el M.Sc en Economía Cuantitativa de Claremont Graduate University, California, donde lidero el laboratorio de investigación EconLLM, enfocado en el diseño y desarrollo de sistemas inteligentes para la economía experimental.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop",
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "Desde 2020, mi investigación y experiencia laboral se enfocan en la intersección entre Procesamiento de Lenguaje Natural (NLP) y economía del comportamiento, aplicando enfoques interdisciplinarios a problemas microeconómicos mediante la computación. Actualmente, soy profesor adjunto de estadística y macroeconomía en Pomona College, CA.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop",
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "Argentina, con sus marcadas asimetrías sociales y desafíos desde la Economía, me impulsa a concentrar esfuerzos para descifrar estas complejidades a través de estrategias computacionales, simulaciones, y la lente de la teoría de la información.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop",
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "Cognitio es el lugar donde mis experiencias convergen con las de mi padre, donde combinamos métodos clásicos y modernos. El poder enseñar junto a mi padre es un privilegio y juntos les ofrecemos educación relevante, de alta calidad, y a un costo razonable, en idioma español para impulsarlos hacia un mercado laboral global y logren un incremento salarial significativo.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop",
  },
];

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Scroll-Controlled Sticky Stack Cards */}
        <FoundersStorySection cards={instructorCards} />

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center py-16 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('about.ctaTitle')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t('about.ctaDescription')}
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/instructors">
              {t('about.ctaButton')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
