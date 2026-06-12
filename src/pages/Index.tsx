import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBackground from "@/components/HeroBackground";
import heroImage from "@/assets/hero-bg.jpg";
import {
  ArrowRight,
  GraduationCap,
  Sparkles,
  Building2,
  BookOpen,
  MessageCircleQuestion,
  FileText,
  Heart,
} from "lucide-react";

// Founder images (kept, condensed cards below)
import gusLooking from "@/assets/founders/gus-looking.jpg";
import bonoConference from "@/assets/founders/bono-conference.jpg";
import fatherAndSon3 from "@/assets/founders/father-and-son-3.jpg";

const founderCards = [
  {
    name: "Gustavo Gonzalez Bonorino",
    bio: "Ph.D. en Ciencias de la Tierra (Canadá). Especialista en evaluación y mitigación de riesgos naturales mediante análisis geoespacial y modelado probabilístico.",
    image: gusLooking,
  },
  {
    name: "Augusto Gonzalez Bonorino",
    bio: "M.Sc. en Economía Cuantitativa (Claremont, CA). Lidera el laboratorio EconLLM en la intersección de NLP y economía del comportamiento. Profesor adjunto en Pomona College.",
    image: bonoConference,
  },
  {
    name: "Padre e Hijo",
    bio: "Cognitio nació de la convicción de que la mejor tecnología educativa la diseñan quienes enseñan. Combinamos métodos clásicos con herramientas modernas para multiplicar el alcance de cada instructor.",
    image: fatherAndSon3,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Fondo de aprendizaje"
            className="h-full w-full object-cover opacity-30"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <HeroBackground />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-6 text-sm text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Ed-tech con IA, hecha para instructores
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            IA que <span className="text-primary">aumenta</span> al instructor.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Una plataforma ligera que complementa Canvas y Moodle, con IA pensada para enseñar mejor.
            Gratis para instructores y estudiantes — sostenida por las instituciones que apuestan por mejor educación.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/instructors">
              <Button size="lg" className="min-w-[200px]">
                Explorar la plataforma
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                <Building2 className="mr-2 h-5 w-5" />
                Servicios y precios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Lo que hacemos</h2>
            <p className="text-lg text-muted-foreground">
              Tres frentes, un mismo objetivo: que el instructor — y la educación — ganen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link
              to="/instructors"
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Plataforma LMS gratuita
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cursos, videos con transcripción automática, tutor IA por capítulo, discusiones.
                Sin costo para instructores invitados y sus estudiantes.
              </p>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Conocer la plataforma <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              to="/ai-studio"
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                AI Studio (add-ons)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Herramientas opcionales para publicar blogs, newsletters y contenido académico
                con la voz de cada instructor.
              </p>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Ver herramientas <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              to="/services"
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Servicios y soluciones a medida
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add-ons, consultorías 1:1 y proyectos institucionales — la mezcla que sostiene
                el acceso gratuito al núcleo.
              </p>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Ver servicios <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Heart className="h-10 w-10 text-primary mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-6">Por qué existimos</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                La IA puede hacer dos cosas con la educación: vaciarla, o hacerla más humana.
                Creemos que la diferencia está en quién tiene las herramientas. Cuando el instructor
                las maneja, gana tiempo para lo que importa: pensar, dialogar, acompañar.
              </p>
              <p>
                Cognitio es nuestro intento de poner esas herramientas en manos de quien enseña.
                La plataforma es gratuita para instructores y estudiantes; los proyectos a medida
                con instituciones y empresas son los que la sostienen. Es un modelo simple —
                quienes pueden pagar, financian el acceso de quienes no.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product in action — what's built */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Lo que ya funciona</h2>
            <p className="text-muted-foreground">
              Funciones de IA diseñadas para enseñar — no para automatizar el aula.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <MessageCircleQuestion className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Tutor IA por capítulo</h3>
              <p className="text-sm text-muted-foreground">
                Cada estudiante hace preguntas y recibe respuestas anclados al contenido del capítulo,
                con citas al minuto exacto del video.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Transcripciones automáticas</h3>
              <p className="text-sm text-muted-foreground">
                Los videos se transcriben con marcas de tiempo, indexados para búsqueda y referenciados
                por el tutor IA y las discusiones.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <GraduationCap className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Discusiones con contexto</h3>
              <p className="text-sm text-muted-foreground">
                Foros por curso y por capítulo, con enlace directo al momento del video que se discute.
                Sin distracciones de un foro genérico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders — demoted to clean grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Quiénes somos</h2>
            <p className="text-muted-foreground">
              Padre e hijo. Geociencias y econometría / IA. Una década enseñando — y rediseñando cómo se enseña.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {founderCards.map((c) => (
              <article
                key={c.name}
                className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={c.image}
                    alt={`Foto de ${c.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-2">{c.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-10 text-center">
            <Building2 className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Representás a una institución?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Construimos integraciones con Canvas y Moodle, despliegues privados, y flujos de IA a medida
              para universidades, programas y empresas. Cada proyecto financia el acceso gratuito de
              instructores independientes.
            </p>
            <Link to="/instituciones">
              <Button size="lg">
                Conversemos
                <ArrowRight className="ml-2 h-5 w-5" />
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
