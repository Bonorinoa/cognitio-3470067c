import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BundleCard from "@/components/ai-studio/BundleCard";
import NotifyMeModal from "@/components/ai-studio/NotifyMeModal";
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
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState({ key: "", name: "" });

  const handleNotifyClick = (featureKey: string, featureName: string) => {
    setSelectedFeature({ key: featureKey, name: featureName });
    setNotifyModalOpen(true);
  };

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
            ctaText={t("aiStudio.notifyMe", "Notify Me")}
            ctaAction={() =>
              handleNotifyClick(
                "academic_bundle",
                t("aiStudio.academicBundle", "Academic Bundle")
              )
            }
            comingSoon
          />
        </div>
      </section>

      {/* Knowledge Base Section */}
      <section className="space-y-6">
        <Card className="rounded-xl border-2">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">
                  {t("aiStudio.poweredByKnowledge", "Powered by Your Knowledge")}
                </h3>
                <p className="text-muted-foreground">
                  {t(
                    "aiStudio.knowledgeDesc",
                    "Upload your documents, papers, and writing samples. Our AI learns your voice and expertise to create content that sounds authentically YOU."
                  )}
                </p>
                <Link to="/ai-studio/knowledge">
                  <Button className="gap-2">
                    {t("aiStudio.setupKnowledge", "Set Up Knowledge Base")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <div className="p-8 bg-primary/5 rounded-2xl">
                  <Upload className="h-24 w-24 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How It Works Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            {t("aiStudio.howItWorks", "How It Works")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <Card className="rounded-xl text-center">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t("aiStudio.step1Title", "Upload")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("aiStudio.step1Desc", "Your docs & writing samples")}
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
                  {t("aiStudio.step2Title", "Configure")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("aiStudio.step2Desc", "Your style preferences")}
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
                  {t("aiStudio.step3Title", "Generate")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("aiStudio.step3Desc", "Professional content instantly")}
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
              {t("aiStudio.freeTier", "Free Tier: 10 generations/day")}
            </h3>
            <p className="text-muted-foreground">
              {t("aiStudio.upgradeTeaser", "Upgrade to Pro for unlimited access - Coming Soon")}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Notify Me Modal */}
      <NotifyMeModal
        open={notifyModalOpen}
        onOpenChange={setNotifyModalOpen}
        featureKey={selectedFeature.key}
        featureName={selectedFeature.name}
      />
    </div>
  );
}
