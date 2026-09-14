import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { SEO } from "@/components/SEO";
import {
  ArrowRight,
  BookOpen,
  Video,
  MessageCircleQuestion,
  FileText,
  Users,
  Sparkles,
  Check,
  LockKeyhole,
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
    desc: "Estructurá tu curso en capítulos. Subí videos, PDFs y materiales. Elegí visibilidad pública, privada o por enlace.",
    available: true,
  },
  {
    icon: Video,
    title: "Reproductor de video con Mux",
    desc: "Streaming adaptativo, sin anuncios, sin distracciones. Calidad automática según conexión.",
    available: true,
  },
  {
    icon: FileText,
    title: "Transcripciones automáticas",
    desc: "Cada video se transcribe con marcas de tiempo, listo para búsqueda, citas y referencias.",
    available: true,
  },
  {
    icon: MessageCircleQuestion,
    title: "Tutor IA por capítulo",
    desc: "Los estudiantes preguntan y reciben respuestas ancladas al contenido del capítulo, citando el minuto exacto del video.",
    available: true,
  },
  {
    icon: Users,
    title: "Discusiones con contexto",
    desc: "Foros por curso y por capítulo, enlazados al momento exacto del video. Con menciones y votos.",
    available: true,
  },
  {
    icon: Sparkles,
    title: "Guías de estudio generadas",
    desc: "Resúmenes, flashcards y preguntas de práctica a partir de cada capítulo.",
    available: false,
  },
];

const InstructorsPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Para instructores"
        description="Cognitio es invitación-solo. Si das clases, investigás o consultás, conocé cómo publicar cursos, ofrecer servicios y multiplicar tu alcance."
        path="/instructors"
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
                <Sparkles className="h-3.5 w-3.5" />
                Para instructores · Acceso por invitación
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                La plataforma de quien
                <br />
                <span className="text-primary">enseña en serio.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
                Un LMS ligero con IA bien pensada — complementario a Canvas o Moodle.
                Gratis para vos y para tus estudiantes. Sin algoritmos, sin publicidad, sin venta de datos.
              </p>
            </header>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-20">
          {/* Core block */}
          <section className="max-w-6xl mx-auto mb-24 -mt-4">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
              <div className="lg:sticky lg:top-24">
                <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary mb-3">
                  <span className="h-1 w-6 bg-primary rounded-full" />
                  El núcleo
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Gratis. Y de verdad.</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Si sos instructor invitado a Cognitio, tenés acceso completo al núcleo — para vos y
                  para todos tus estudiantes. Sin límite de cursos, sin sorpresas en la facturación.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  El acceso es por invitación. Mantenemos la red curada para que la calidad del
                  catálogo no dependa de algoritmos de descubrimiento.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Cursos públicos y privados (cohorte cerrada para tus clases de universidad). Los cobros online llegan más adelante; hoy la inscripción es manual",
                    "Perfil público de instructor en el catálogo",
                    "Sin comisiones sobre cursos privados",
                    "Sin publicidad, sin venta de datos",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/courses">
                  <Button variant="outline" className="group">
                    Ver cursos publicados
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {coreFeatures.map((f) => (
                  <div
                    key={f.title}
                    className={`group flex gap-4 rounded-2xl p-5 border transition-all ${
                      f.available
                        ? "border-border bg-card hover:border-primary/40 hover:shadow-md"
                        : "border-dashed border-border/60 bg-muted/30"
                    }`}
                  >
                    <div
                      className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${
                        f.available ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <f.icon
                        className={`h-5 w-5 ${
                          f.available ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2 flex-wrap">
                        {f.title}
                        {!f.available && (
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                            Pronto
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Directory CTA — gated */}
          <section className="max-w-4xl mx-auto mb-24">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-12">
              <div className="grid md:grid-cols-[auto_1fr_auto] items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <LockKeyhole className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    Directorio de instructores
                  </h2>
                  <p className="text-muted-foreground">
                    El listado completo de instructores está disponible para usuarios autenticados —
                    para mantener la web pública enfocada en la propuesta, no en una vidriera.
                  </p>
                </div>
                <Link to={user ? "/instructors/directory" : "/auth"}>
                  <Button className="group whitespace-nowrap">
                    {user ? "Ver directorio" : "Iniciá sesión"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Story teaser */}
          <section className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-10 md:p-12 text-center">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Construido por instructores, para instructores.
                </h2>
                <p className="text-muted-foreground mb-7 max-w-2xl mx-auto leading-relaxed">
                  Padre e hijo. Geociencias y econometría / IA. Una historia de aula que terminó en
                  una plataforma.
                </p>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="group">
                    Leer nuestra historia
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InstructorsPage;
