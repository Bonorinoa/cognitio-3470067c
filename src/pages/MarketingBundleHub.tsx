import { useTranslation } from "react-i18next";
import { Megaphone, FileEdit, Linkedin, Twitter, Mail } from "lucide-react";
import FeatureCard from "@/components/ai-studio/FeatureCard";

export default function MarketingBundleHub() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Megaphone className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {t("aiStudio.marketingBundle", "Marketing Bundle")}
            </h1>
            <p className="text-muted-foreground">
              {t(
                "aiStudio.marketingDesc",
                "Create compelling content for your brand & audience"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blog Posts - Available */}
        <FeatureCard
          icon={FileEdit}
          title={t("aiStudio.blogGenerator", "Blog Posts")}
          description={t(
            "aiStudio.blogGeneratorDesc",
            "Generate SEO-optimized blog articles from your knowledge base"
          )}
          status="available"
          ctaText={t("aiStudio.startGenerating", "Start →")}
          ctaLink="/ai-studio/marketing/blog"
        />

        {/* LinkedIn Posts - Coming Soon */}
        <FeatureCard
          icon={Linkedin}
          title={t("aiStudio.linkedinGenerator", "LinkedIn Posts")}
          description={t(
            "aiStudio.linkedinGeneratorDesc",
            "Create professional LinkedIn posts that engage your network"
          )}
          status="coming-soon"
          ctaText={t("aiStudio.comingSoon", "Coming Soon")}
        />

        {/* X/Twitter Posts - Coming Soon */}
        <FeatureCard
          icon={Twitter}
          title={t("aiStudio.twitterGenerator", "X/Twitter Posts")}
          description={t(
            "aiStudio.twitterGeneratorDesc",
            "Generate engaging tweets and threads for your audience"
          )}
          status="coming-soon"
          ctaText={t("aiStudio.comingSoon", "Coming Soon")}
        />

        {/* Newsletter - Coming Soon */}
        <FeatureCard
          icon={Mail}
          title={t("aiStudio.newsletterGenerator", "Newsletter")}
          description={t(
            "aiStudio.newsletterGeneratorDesc",
            "Create compelling newsletters for your subscribers"
          )}
          status="coming-soon"
          ctaText={t("aiStudio.comingSoon", "Coming Soon")}
        />
      </div>
    </div>
  );
}
