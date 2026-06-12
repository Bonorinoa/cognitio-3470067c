import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  BookOpen,
  Video,
  MessageCircleQuestion,
  FileText,
  Users,
  Sparkles,
  Check,
  Building2,
} from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  available: boolean;
}

const coreFeatures: Feature[] = [
  {
    icon: BookOpen,
    title: "Cursos con capítulos y recursos",
    desc: "Estructura tu curso en capítulos, sube videos, PDFs y recursos descargables. Visibilidad pública, privada o por enlace.",
    available: true,
  },
  {
    icon: Video,
    title: "Reproductor de video con Mux",
    desc: "Streaming adaptativo, calidad automática, sin anuncios, sin distracciones.",
    available: true,
  },
  {
    icon: FileText,
    title: "Transcripciones automáticas",
    desc: "Cada video se transcribe con marcas de tiempo, listo para búsqueda y referencias.",
    available: true,
  },
  {
    icon: MessageCircleQuestion,
    title: "Tutor IA por capítulo",
    desc: "Tus estudiantes hacen preguntas y reciben respuestas ancladas al contenido del capítulo, con citas al minuto del video.",
    available: true,
  },
  {
    icon: Users,
    title: "Discusiones por curso y capítulo",
    desc: "Foros enlazados al momento exacto del video, con menciones y votos.",
    available: true,
  },
  {
    icon: Sparkles,
    title: "Guías de estudio generadas",
    desc: "Resúmenes, flashcards y preguntas de práctica a partir del capítulo. (Próximamente)",
    available: false,
  },
];

const PlatformPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <header className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-6 text-sm text-primary">
              Plataforma core · Gratis para instructores invitados
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Un LMS ligero, con IA bien pensada.
            </h1>
            <p className="text-lg text-muted-foreground">
              Lo opuesto a un LMS institucional pesado. Lo opuesto a un marketplace masivo.
              Una plataforma enfocada en enseñar, complementaria a Canvas o Moodle.
            </p>
          </header>

          {/* Free core block */}
          <section className="max-w-5xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">El núcleo, gratis.</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Si sos instructor invitado a Cognitio, tenés acceso completo al núcleo de la plataforma
                  — para vos y para todos tus estudiantes. Sin límite de cursos, sin sorpresas en la facturación.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  El acceso es por invitación. Mantenemos la red curada para que la calidad del catálogo
                  no dependa de algoritmos de descubrimiento.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Cursos públicos (con cobros vía Stripe) y privados (cohorte cerrada)",
                    "Perfil público de instructor + listado en el catálogo",
                    "Sin comisiones sobre cursos privados",
                    "Sin publicidad, sin venta de datos",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/courses">
                  <Button variant="outline">
                    Ver cursos actuales
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {coreFeatures.map((f) => (
                  <div
                    key={f.title}
                    className={`rounded-2xl p-5 border ${
                      f.available
                        ? "border-border bg-card"
                        : "border-dashed border-border bg-muted/40"
                    }`}
                  >
                    <f.icon className="h-6 w-6 text-primary mb-3" />
                    <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                      {f.title}
                      {!f.available && (
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          Pronto
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Add-ons */}
          <section className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">Add-ons opcionales</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ¿Querés publicar más allá de tus cursos? ¿Ofrecer consultoría? Los add-ons amplían
                la plataforma cuando los necesitás.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                to="/ai-studio"
                className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <Sparkles className="h-7 w-7 text-primary" />
                  <span className="text-xs font-medium text-primary">desde $19/mes</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Studio · Marketing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Blog (disponible), LinkedIn, X, Newsletter (próximamente). Generación con la voz
                  del instructor a partir de su base de conocimiento.
                </p>
                <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ver detalle <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>

              <div className="bg-muted/40 rounded-2xl p-6 border border-dashed border-border">
                <div className="flex items-center justify-between mb-3">
                  <BookOpen className="h-7 w-7 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">próximamente</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Studio · Académico</h3>
                <p className="text-sm text-muted-foreground">
                  Revisión de literatura, formateo de papers, edición. Diseñado para investigadores
                  que enseñan.
                </p>
              </div>

              <Link
                to="/services"
                className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <Users className="h-7 w-7 text-primary" />
                  <span className="text-xs font-medium text-primary">listado público</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Consultorías marketplace</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Publicá servicios de consultoría 1:1 en el catálogo de Cognitio. Reservado para
                  instructores enrolados.
                </p>
                <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ver consultorías <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>

          {/* Institutional bridge */}
          <section className="max-w-4xl mx-auto">
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-10 text-center">
              <Building2 className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-3">
                ¿Necesitás algo más a la medida?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Despliegues white-label, integraciones con Canvas/Moodle, flujos de IA personalizados
                para tu programa o institución.
              </p>
              <Link to="/instituciones">
                <Button size="lg">
                  Hablemos de tu proyecto
                  <ArrowRight className="ml-2 h-4 w-4" />
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

export default PlatformPage;
