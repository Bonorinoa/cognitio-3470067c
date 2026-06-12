import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Building2,
  Check,
  Loader2,
  Sparkles,
  BookOpen,
  Layers,
  Users,
  GraduationCap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Tu nombre es obligatorio").max(120),
  email: z.string().trim().email("Email inválido").max(255),
  organization: z.string().trim().min(1, "Indicá tu institución o empresa").max(200),
  role: z.string().trim().max(120).optional(),
  inquiry_type: z.enum(["general", "lms", "ai_workflows", "custom_build", "training", "other"]),
  message: z
    .string()
    .trim()
    .min(10, "Contanos un poco más (al menos 10 caracteres)")
    .max(4000),
});

type InquiryForm = z.infer<typeof inquirySchema>;

const INQUIRY_TYPES: { value: InquiryForm["inquiry_type"]; label: string }[] = [
  { value: "general", label: "Consulta general" },
  { value: "lms", label: "Despliegue de LMS / white-label" },
  { value: "ai_workflows", label: "Flujos de IA a medida" },
  { value: "custom_build", label: "Desarrollo a medida" },
  { value: "training", label: "Capacitación a docentes" },
  { value: "other", label: "Otro" },
];

const offerings = [
  {
    icon: Layers,
    title: "Despliegue white-label",
    desc: "La plataforma de Cognitio, con tu marca, integrada al stack de tu institución.",
  },
  {
    icon: Sparkles,
    title: "Flujos de IA a medida",
    desc: "Asistentes de evaluación formativa, generación curricular, analítica de cohortes — diseñados con tu equipo pedagógico.",
  },
  {
    icon: BookOpen,
    title: "Integración con Canvas / Moodle",
    desc: "SSO, sincronización de cursos, exportación de progreso. Tu LMS institucional sigue siendo la fuente de verdad.",
  },
  {
    icon: Users,
    title: "Capacitación y soporte",
    desc: "Talleres para docentes sobre uso responsable de IA, diseño de cursos y evaluación.",
  },
];

const ServicesPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<InquiryForm>({
    name: "",
    email: "",
    organization: "",
    role: "",
    inquiry_type: "general",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inquirySchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Revisá el formulario");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("institution_inquiries").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        organization: parsed.data.organization,
        role: parsed.data.role || null,
        inquiry_type: parsed.data.inquiry_type,
        message: parsed.data.message,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Recibimos tu consulta. Te contestamos en 1–2 días hábiles.");
    } catch (err) {
      console.error("inquiry submit error", err);
      toast.error("No pudimos enviar tu consulta. Intentá de nuevo en un momento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
                Servicios y precios
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                Gratis para enseñar.
                <br />
                <span className="text-primary">A medida cuando hace falta.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                La plataforma core es gratis para instructores invitados y sus estudiantes.
                Los add-ons opcionales y los proyectos institucionales son los que la sostienen.
              </p>
            </header>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-20">
          {/* Pricing tiers */}
          <section className="max-w-6xl mx-auto -mt-4 mb-24">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Core (free) */}
              <article className="rounded-3xl border border-border bg-card p-8 flex flex-col">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Plataforma core</h3>
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
                <h3 className="text-lg font-semibold text-foreground mb-1">AI Studio</h3>
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

              {/* Custom */}
              <article className="rounded-3xl border border-border bg-card p-8 flex flex-col">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Instituciones</h3>
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
                <a href="#contacto">
                  <Button variant="outline" className="w-full group">
                    Hablemos
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </a>
              </article>
            </div>
          </section>

          {/* 1:1 consultancies — gated */}
          <section className="max-w-5xl mx-auto mb-24">
            <div className="rounded-3xl border border-border bg-secondary/30 p-10 grid md:grid-cols-[1fr_auto] items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  ¿Buscás consultoría 1:1 con un instructor?
                </h2>
                <p className="text-muted-foreground">
                  Los instructores de Cognitio ofrecen asesorías directas — diagnóstico, mentoría y
                  proyectos puntuales. El catálogo está disponible para usuarios autenticados.
                </p>
              </div>
              <Link to={user ? "/services/catalog" : "/auth"}>
                <Button className="group whitespace-nowrap">
                  {user ? "Ver consultorías" : "Iniciá sesión"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Custom / institutional */}
          <section id="contacto" className="max-w-6xl mx-auto scroll-mt-24">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary mb-3">
                <span className="h-1 w-6 bg-primary rounded-full" />
                Soluciones a medida
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Construimos contigo el ed-tech que tu programa necesita.
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Universidades, programas de posgrado, escuelas técnicas, equipos de aprendizaje
                corporativo. Cada proyecto a medida financia el acceso gratuito de instructores
                independientes a la plataforma core.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* What we do */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">Qué hacemos</h3>
                <div className="space-y-4">
                  {offerings.map((o) => (
                    <div key={o.title} className="flex gap-4 p-5 rounded-2xl border border-border bg-card">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <o.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{o.title}</h4>
                        <p className="text-sm text-muted-foreground">{o.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-secondary/40 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Cómo trabajamos</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Llamada inicial de descubrimiento (sin costo)",
                      "Propuesta y presupuesto en una semana",
                      "Sprints cortos con entregas funcionales",
                      "Código y datos siempre auditables por tu equipo",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact form */}
              <div>
                <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sticky top-24">
                  {submitted ? (
                    <div className="text-center py-10">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Check className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Gracias por escribir.</h3>
                      <p className="text-muted-foreground">
                        Te contestamos por email en 1–2 días hábiles.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="text-xl font-bold text-foreground mb-2">Contanos sobre tu proyecto</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Respondemos en 1–2 días hábiles. Todo queda confidencial.
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nombre *</Label>
                          <Input
                            id="name"
                            required
                            maxLength={120}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            maxLength={255}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="organization">Institución / Empresa *</Label>
                        <Input
                          id="organization"
                          required
                          maxLength={200}
                          value={form.organization}
                          onChange={(e) => setForm({ ...form, organization: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="role">Tu rol</Label>
                        <Input
                          id="role"
                          placeholder="Ej: Directora académica, CTO, Coordinador"
                          maxLength={120}
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="inquiry_type">¿Qué te interesa?</Label>
                        <Select
                          value={form.inquiry_type}
                          onValueChange={(v) => setForm({ ...form, inquiry_type: v as InquiryForm["inquiry_type"] })}
                        >
                          <SelectTrigger id="inquiry_type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {INQUIRY_TYPES.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Contanos un poco más *</Label>
                        <Textarea
                          id="message"
                          required
                          maxLength={4000}
                          rows={5}
                          placeholder="Tamaño del programa, objetivos, plazos aproximados…"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Enviar consulta
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
