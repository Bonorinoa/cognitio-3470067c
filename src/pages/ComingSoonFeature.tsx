import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft } from "lucide-react";

interface ComingSoonFeatureProps {
  featureKey: string;
  titleKey?: string;
  title?: string;
  bundle: "marketing" | "academic";
  description?: string;
}

export default function ComingSoonFeature({
  titleKey,
  title,
  bundle,
  description,
}: ComingSoonFeatureProps) {
  const { t } = useTranslation();

  const featureTitle = titleKey ? t(titleKey) : title || "";

  const getBundleName = (bundleType: "marketing" | "academic"): string => {
    const bundleTranslations = {
      marketing: t("aiStudio.marketingBundle", "Marketing"),
      academic: t("aiStudio.academicBundle", "Academic"),
    };
    return bundleTranslations[bundleType];
  };

  const bundleName = getBundleName(bundle);
  const bundlePath = `/ai-studio/${bundle}`;

  const defaultDescription = t(
    "aiStudio.featureComingSoonDesc",
    "This feature is currently under development."
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back Button */}
      <Link to={bundlePath}>
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("aiStudio.backTo", "Back to {{bundle}}", { bundle: bundleName })}
        </Button>
      </Link>

      {/* Main Card */}
      <Card className="rounded-xl border-2">
        <CardContent className="pt-12 pb-12 text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-6 bg-muted rounded-full">
              <Lock className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{featureTitle}</h1>
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">
                {t("aiStudio.comingSoon", "Coming Soon")}
              </span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {description || defaultDescription}
            </p>
          </div>

          {/* Back Button */}
          <Link to={bundlePath}>
            <Button variant="outline">
              {t("aiStudio.backTo", "Back to {{bundle}}", { bundle: bundleName })}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
