import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoundersStorySection from "@/components/FoundersStorySection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

import gusLooking from "@/assets/founders/gus-looking.jpg";
import bonoConference from "@/assets/founders/bono-conference.jpg";
import fatherAndSon3 from "@/assets/founders/father-and-son-3.jpg";

const founderCards = [
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Ph.D. en Ciencias de la Tierra (Canadá). Cinco décadas enseñando geología, evaluación de riesgos naturales y análisis geoespacial. Después de toda una vida frente al aula, sigue convencido de que la mejor herramienta pedagógica es la que libera tiempo para el diálogo con el estudiante.",
    image: gusLooking,
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "M.Sc. en Economía Cuantitativa (Claremont, CA). Lidera el laboratorio EconLLM en la intersección de procesamiento de lenguaje natural y economía del comportamiento. Profesor adjunto en Pomona College. Cree que la IA, bien diseñada, puede devolverle al instructor lo que la administración le quita: tiempo para enseñar.",
    image: bonoConference,
  },
  {
    name: "Padre e Hijo",
    bio: "Cognitio nació en una sobremesa larga. Dos generaciones, dos disciplinas — geociencias e IA — la misma frustración con plataformas que tratan a los instructores como proveedores de contenido en vez de como autores. Construimos lo que nos hubiese gustado tener: una plataforma curada, ligera, con IA pensada para enseñar, no para automatizar el aula.",
    image: fatherAndSon3,
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
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
                <Link to="/services">
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
