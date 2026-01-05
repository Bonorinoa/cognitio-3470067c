import { useTranslation } from "react-i18next";
import { GraduationCap, BookOpen, FileText, Pencil, Quote } from "lucide-react";
import FeatureCard from "@/components/ai-studio/FeatureCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AcademicBundleHub() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with Coming Soon Overlay */}
      <Card className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="pt-6">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="text-sm">
                {t("aiStudio.comingSoon", "Coming Soon")}
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-muted-foreground">
                {t("aiStudio.academicBundle", "Academic Bundle")}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t(
                  "aiStudio.academicDesc",
                  "Accelerate your research and academic writing"
                )}
              </p>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {t(
                "aiStudio.academicComingSoonDesc",
                "We're building powerful tools for researchers and academics."
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards Grid - All Coming Soon */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-70">
        {/* Literature Review */}
        <FeatureCard
          icon={BookOpen}
          title={t("aiStudio.literatureReview", "Literature Review")}
          description={t(
            "aiStudio.literatureReviewDesc",
            "Generate comprehensive literature reviews from research papers"
          )}
          status="coming-soon"
          ctaText={t("aiStudio.comingSoon", "Coming Soon")}
        />

        {/* Paper Formatter */}
        <FeatureCard
          icon={FileText}
          title={t("aiStudio.paperFormatter", "Paper Formatter")}
          description={t(
            "aiStudio.paperFormatterDesc",
            "Format papers to match academic style guides (APA, MLA, Chicago)"
          )}
          status="coming-soon"
          ctaText={t("aiStudio.comingSoon", "Coming Soon")}
        />

        {/* Paper Editor */}
        <FeatureCard
          icon={Pencil}
          title={t("aiStudio.paperEditor", "Paper Editor")}
          description={t(
            "aiStudio.paperEditorDesc",
            "Get AI-powered suggestions to improve clarity and academic writing"
          )}
          status="coming-soon"
          ctaText={t("aiStudio.comingSoon", "Coming Soon")}
        />

        {/* Citation Generator */}
        <FeatureCard
          icon={Quote}
          title={t("aiStudio.citationGenerator", "Citation Generator")}
          description={t(
            "aiStudio.citationGeneratorDesc",
            "Automatically generate citations and bibliographies"
          )}
          status="coming-soon"
          ctaText={t("aiStudio.comingSoon", "Coming Soon")}
        />
      </div>
    </div>
  );
}
