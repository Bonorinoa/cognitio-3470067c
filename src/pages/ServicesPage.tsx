import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Check,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { SEO } from "@/components/SEO";

const PlanesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Planes y precios"
        description="Planes de Cognitio: plataforma core gratis para instructores invitados, AI Studio como add-on opcional y soluciones a medida para instituciones."
        path="/planes"
      />
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pt-20 pb-16">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-primary/20 blur-3xl opacity-40" />
          </div>
          <div className="container mx-auto px-4">
            <header className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/80 backdrop-blur px-4 py-1.5 mb-6 text-sm text-primary font-medium">
                <Building2 className="h-3.5 w-3.5" />
                Planes y precios
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                Gratis para enseñar.
                <br />
                <span className="text-primary">A medida cuando hace falta.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                La plataforma core es gratis para instructores invitados y sus estudiantes.
                AI Studio y los proyectos institucionales son los que la sostienen.
              </p>
            </header>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-20">
          {/* Pricing tiers */}
          <section className="max-w-6xl mx-auto -mt-4 mb-16">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Core (free) */}
              <article className="rounded-3xl border border-border bg-card p-8 flex flex-col">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Plataforma core</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Para instructores invitados y sus estudiantes.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">Gratis</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    "Cursos públicos y privados",
                    "Tutor IA por capítulo",
                    "Transcripciones automáticas",
                    "Discusiones con contexto",
                    "Sin comisiones en cursos privados",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/instructors">
                  <Button variant="outline" className="w-full group">
                    Ver la plataforma
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </article>

              {/* AI Studio add-on */}
              <article className="rounded-3xl border-2 border-primary bg-card p-8 flex flex-col relative shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Add-on opcional
                </div>
                <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">AI Studio</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Publicación con la voz del instructor.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">$19</span>
                  <span className="text-muted-foreground"> /mes</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    "Generación de blogs (disponible)",
                    "Perfil de estilo personalizado",
                    "LinkedIn, X, Newsletter (pronto)",
                    "Bundle académico (pronto)",
                    "Cancelás cuando quieras",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/ai-studio">
                  <Button className="w-full group">
                    Conocer AI Studio
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </article>

              {/* Instituciones */}
              <article className="rounded-3xl border border-border bg-card p-8 flex flex-col">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Instituciones</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Programas, universidades, empresas.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">A medida</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    "Despliegue white-label",
                    "Integración Canvas / Moodle",
                    "Flujos de IA personalizados",
                    "Capacitación a docentes",
                    "Soporte dedicado",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/instituciones">
                  <Button variant="outline" className="w-full group">
                    Hablemos
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </article>
            </div>
          </section>

          {/* Consultorías pointer — instructor-offered, not a Cognitio plan */}
          <section className="max-w-5xl mx-auto">
            <div className="rounded-3xl border border-border bg-secondary/30 p-8 md:p-10 grid md:grid-cols-[1fr_auto] items-center gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  ¿Buscás algo más personal?
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Consultorías 1:1 con instructores
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Asesorías y mentorías ofrecidas directamente por los instructores de Cognitio.
                  No forman parte de los planes — las contratás aparte con quien sabe del tema.
                </p>
              </div>
              <Link to="/consultorias">
                <Button variant="outline" className="group whitespace-nowrap">
                  Ver consultorías
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlanesPage;
