import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BundleCard from "@/components/ai-studio/BundleCard";
import {
  Sparkles,
  Megaphone,
  GraduationCap,
  Upload,
  Settings,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function AIStudioLanding() {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-8 w-8" />
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("aiStudio.landingTitle", "AI Studio")}
          </h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          {t("aiStudio.landingSubtitle", "Your AI-Powered Content Creation Companion")}
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t(
            "aiStudio.landingDescription",
            "Create professional content in minutes, not hours. Powered by your knowledge base and personal style."
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/ai-studio/marketing">
            <Button size="lg" className="gap-2">
              {t("aiStudio.tryFree", "Try Free - 10 generations/day")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("bundles")}
          >
            {t("aiStudio.learnMore", "Learn More")}
          </Button>
        </div>
      </section>

      {/* Bundle Cards Section */}
      <section id="bundles" className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            {t("aiStudio.chooseBundleTitle", "Choose Your Bundle")}
          </h2>
          <p className="text-muted-foreground">
            {t("aiStudio.chooseBundleDesc", "Pick the tools that match your needs")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Marketing Bundle */}
          <BundleCard
            icon={Megaphone}
            title={t("aiStudio.marketingBundle", "Marketing Bundle")}
            description={t(
              "aiStudio.marketingDesc",
              "Create compelling content for your brand & audience"
            )}
            features={[
              {
                name: t("aiStudio.blogPosts", "Blog Posts"),
                available: true,
              },
              {
                name: t("aiStudio.linkedinPosts", "LinkedIn Posts"),
                available: false,
              },
              {
                name: t("aiStudio.twitterPosts", "X/Twitter Posts"),
                available: false,
              },
              {
                name: t("aiStudio.newsletters", "Newsletters"),
                available: false,
              },
            ]}
            ctaText={t("aiStudio.exploreMarketing", "Explore Marketing →")}
            ctaLink="/ai-studio/marketing"
          />

          {/* Academic Bundle */}
          <BundleCard
            icon={GraduationCap}
            title={t("aiStudio.academicBundle", "Academic Bundle")}
            description={t(
              "aiStudio.academicDesc",
              "Accelerate your research and academic writing"
            )}
            features={[
              {
                name: t("aiStudio.literatureReview", "Literature Review"),
                available: false,
              },
              {
                name: t("aiStudio.paperFormatter", "Paper Formatter"),
                available: false,
              },
              {
                name: t("aiStudio.paperEditor", "Paper Editor"),
                available: false,
              },
              {
                name: t("aiStudio.citationGenerator", "Citation Generator"),
                available: false,
              },
            ]}
            comingSoon
          />
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            {t("aiStudio.howItWorks", "Cómo Funciona")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("aiStudio.howItWorksDesc", "La IA aprende tu voz y estilo para crear contenido que suena auténticamente como tú.")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 - Enhanced with knowledge base info */}
          <Card className="rounded-xl text-center">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t("aiStudio.step1Title", "Sube")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("aiStudio.step1DescEnhanced", "Tus documentos, artículos y muestras de escritura para personalizar la IA")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="rounded-xl text-center">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t("aiStudio.step2Title", "Configura")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("aiStudio.step2DescEnhanced", "Tu tono, audiencia e idioma preferido")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="rounded-xl text-center">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t("aiStudio.step3Title", "Genera")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("aiStudio.step3DescEnhanced", "Artículos, posts y más contenido profesional al instante")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="space-y-4">
        <Card className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
          <CardContent className="pt-6 text-center space-y-4">
            <h3 className="text-xl font-bold">
              {t("aiStudio.freeTier", "Nivel Gratuito: 10 generaciones/día")}
            </h3>
            <p className="text-muted-foreground">
              {t("aiStudio.instructorPerk", "¿Eres instructor de Cognitio? Disfruta de 50 generaciones diarias.")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("aiStudio.upgradeTeaser", "Planes Pro con acceso ilimitado - Próximamente")}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
