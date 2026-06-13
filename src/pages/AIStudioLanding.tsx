import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PricingSection from "@/components/ai-studio/PricingSection";
import { useAISubscription } from "@/hooks/useAISubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FileEdit, GraduationCap, ArrowRight, Clock } from "lucide-react";
import WaitlistForm from "@/components/ai-studio/WaitlistForm";
import { SEO } from "@/components/SEO";

export default function AIStudioLanding() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { invalidateSubscription, hasActiveSubscription, isLoading: subscriptionLoading } = useAISubscription();
  const { user } = useAuth();

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      invalidateSubscription();
      toast.success(t("aiStudio.subscriptionActivated", "Subscription activated!"));
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, invalidateSubscription, t]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    {
      number: "01",
      kicker: t("aiStudio.stepKicker1", "Conocimiento"),
      title: t("aiStudio.stepTitle1", "Tu biblioteca digital"),
      desc: t(
        "aiStudio.stepDesc1",
        "Cargá tus artículos, tesis y notas de clase. La IA se entrena exclusivamente con tu material original."
      ),
    },
    {
      number: "02",
      kicker: t("aiStudio.stepKicker2", "Estilo"),
      title: t("aiStudio.stepTitle2", "Voz y rigor"),
      desc: t(
        "aiStudio.stepDesc2",
        "Definí el tono académico y el nivel de complejidad. Asegurate de que cada palabra suene auténticamente como vos."
      ),
    },
    {
      number: "03",
      kicker: t("aiStudio.stepKicker3", "Herramienta"),
      title: t("aiStudio.stepTitle3", "Producción fluida"),
      desc: t(
        "aiStudio.stepDesc3",
        "Generá artículos de blog, newsletters o revisiones bibliográficas en segundos, manteniendo la integridad científica."
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <SEO
        title="AI Studio para instructores"
        description="Convertí tu investigación y materiales de curso en publicaciones de blog, newsletters y guiones, asistido por IA. Exclusivo para instructores de Cognitio."
        path="/ai-studio"
      />
      {/* Hero */}

      <section className="text-center pt-12 pb-24 max-w-3xl mx-auto px-2">
        <div className="inline-flex items-center gap-3 mb-8">
          <span className="h-px w-8 bg-primary" />
          <span className="uppercase tracking-[0.2em] text-xs font-semibold text-primary">
            {t("aiStudio.heroEyebrow", "Exclusivo para Instructores")}
          </span>
          <span className="h-px w-8 bg-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1] text-foreground">
          {t("aiStudio.heroLine1", "Tu base de conocimiento,")}
          <br />
          <span className="italic font-serif">
            {t("aiStudio.heroLine2", "amplificada por IA.")}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-8 mb-10 font-light">
          {t(
            "aiStudio.heroDescription",
            "Una herramienta de creación pensada para académicos y especialistas. Preservá tu voz original mientras escalás tu producción de contenido."
          )}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {subscriptionLoading ? (
            <div className="h-12 w-48 bg-muted animate-pulse rounded-md" />
          ) : (
            <Link to={hasActiveSubscription ? "/ai-studio/marketing/blog" : user ? "/ai-studio/marketing/blog" : "/auth"}>
              <Button size="lg" className="gap-2 rounded-sm">
                {hasActiveSubscription
                  ? t("aiStudio.goToTools", "Ir a Herramientas")
                  : t("aiStudio.startCreating", "Empezar Creación")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <Button
            size="lg"
            variant="outline"
            className="rounded-sm"
            onClick={() => scrollToSection("process")}
          >
            {t("aiStudio.seeMethodology", "Ver Metodología")}
          </Button>
        </div>
      </section>

      {/* Process: Knowledge → Style → Tool */}
      <section id="process" className="py-20 border-y border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light mb-4 text-foreground">
            {t("aiStudio.processTitle", "El Proceso Editorial")}
          </h2>
          <div className="h-px w-24 bg-primary/40 mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-12 px-2">
          {steps.map((step) => (
            <div key={step.number} className="space-y-3">
              <div className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                {step.number}. {step.kicker}
              </div>
              <h3 className="text-2xl font-light text-foreground">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bundles */}
      <section id="bundles" className="py-24">
        <div className="grid md:grid-cols-2 gap-8 px-2">
          {/* Blog — live */}
          <Link
            to="/ai-studio/marketing/blog"
            className="group p-10 md:p-12 border border-border bg-card/50 hover:border-primary/40 hover:bg-card transition-all flex flex-col"
          >
            <div className="w-12 h-12 mb-8 flex items-center justify-center bg-primary/10 text-primary rounded-sm">
              <FileEdit className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-light mb-3 text-foreground">
              {t("aiStudio.blogToolTitle", "Generador de Blog")}
            </h3>
            <p className="text-muted-foreground mb-8 font-light">
              {t(
                "aiStudio.blogToolDesc",
                "Convertí tus materiales de investigación y notas en artículos de blog cuidadosamente redactados."
              )}
            </p>
            <ul className="space-y-3 text-sm text-foreground/80 mb-10 border-t border-border pt-6">
              {[
                t("aiStudio.blogFeatureKB", "Usa tu base de conocimiento"),
                t("aiStudio.blogFeatureStyle", "Respeta tu perfil de estilo"),
                t("aiStudio.blogFeatureRefine", "Refinado contextual línea por línea"),
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <span className="mt-auto text-sm font-bold tracking-[0.2em] uppercase text-primary group-hover:underline underline-offset-4">
              {t("aiStudio.openBlogCTA", "Abrir →")}
            </span>
          </Link>

          {/* Academic — coming soon */}
          <div className="p-10 md:p-12 border border-border bg-card/30 flex flex-col opacity-80">
            <div className="w-12 h-12 mb-8 flex items-center justify-center bg-muted text-muted-foreground rounded-sm">
              <GraduationCap className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div className="flex items-center justify-between mb-3 gap-3">
              <h3 className="text-3xl font-light text-foreground">
                {t("aiStudio.bundleAcademicTitle", "Académico")}
              </h3>
              <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 bg-muted text-muted-foreground font-semibold">
                {t("aiStudio.comingSoon", "Próximamente")}
              </span>
            </div>
            <p className="text-muted-foreground mb-8 font-light">
              {t(
                "aiStudio.bundleAcademicDesc",
                "Revisiones de literatura, formateo de papers y gestión de citas automatizada."
              )}
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground mb-10 border-t border-border pt-6">
              {[
                t("aiStudio.literatureReview", "Literature Review"),
                t("aiStudio.paperFormatter", "Paper Formatter"),
                t("aiStudio.paperEditor", "Paper Editor"),
                t("aiStudio.citationGenerator", "Citation Generator"),
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-2 border-t border-border">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">
                {t("aiStudio.waitlistCTA", "Lista de Espera")}
              </p>
              <WaitlistForm bundle="academic" variant="compact" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing (unchanged functionality) */}
      <PricingSection />
    </div>
  );
}
