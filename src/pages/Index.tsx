import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import heroImage from "@/assets/hero-bg.jpg";
import { ArrowRight, GraduationCap, Users, Lightbulb, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: featuredCourses, isLoading } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          description,
          image_url,
          price,
          category,
          chapters (id)
        `)
        .eq("is_featured", true)
        .eq("is_published", true)
        .limit(3);

      if (error) throw error;

      return (data || []).map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || "",
        image: course.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
        price: course.price,
        chaptersCount: course.chapters?.length || 0,
        category: course.category || "General",
      }));
    },
  });

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
            <Link to="/about">
              <Button size="lg" variant="outline" className="min-w-[180px]">
                Conocer al Equipo
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

      {/* Featured Courses */}
      {featuredCourses && featuredCourses.length > 0 && (
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Cursos Destacados</h2>
                <p className="text-muted-foreground">Comienza tu aprendizaje con nuestros cursos más populares</p>
              </div>
              <Link to="/courses">
                <Button variant="ghost" className="mt-4 sm:mt-0">
                  Ver Todos los Cursos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;