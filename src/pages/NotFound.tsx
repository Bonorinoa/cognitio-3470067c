import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Search } from "lucide-react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Página no encontrada"
        description="La página que buscás no existe o fue movida. Explorá nuestros cursos o volvé al inicio."
        path={location.pathname}
      />
      <main className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
        <div className="max-w-lg w-full text-center space-y-8">
          <div>
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-3">
              Error 404
            </p>
            <h1 className="text-5xl sm:text-6xl font-light text-foreground tracking-tight mb-4">
              Página no encontrada
            </h1>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              La dirección{" "}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                {location.pathname}
              </code>{" "}
              no existe o fue movida. Si llegaste acá desde un enlace, avisanos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" size="lg">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                Volver al inicio
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/courses">
                <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                Ver cursos
              </Link>
            </Button>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Buscás algo en particular?
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-sm">
              <Link
                to="/instructors"
                className="inline-flex items-center gap-1.5 text-primary hover:underline underline-offset-4"
              >
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                Instructores
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link
                to="/planes"
                className="inline-flex items-center gap-1.5 text-primary hover:underline underline-offset-4"
              >
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                Servicios
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link
                to="/faq"
                className="inline-flex items-center gap-1.5 text-primary hover:underline underline-offset-4"
              >
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                Preguntas frecuentes
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
