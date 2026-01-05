import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";

interface BundleFeature {
  name: string;
  available: boolean;
}

interface BundleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: BundleFeature[];
  ctaText?: string;
  ctaAction?: () => void;
  ctaLink?: string;
  comingSoon?: boolean;
  className?: string;
}

export default function BundleCard({
  icon: Icon,
  title,
  description,
  features,
  ctaText,
  ctaAction,
  ctaLink,
  comingSoon = false,
  className = "",
}: BundleCardProps) {
  const { t } = useTranslation();
  const cardContent = (
    <Card
      className={`rounded-xl border-2 transition-all duration-300 h-full flex flex-col ${
        comingSoon
          ? "opacity-60 cursor-default"
          : "hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      } ${className}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${comingSoon ? "bg-muted" : "bg-primary/10"}`}>
              <Icon className={`h-6 w-6 ${comingSoon ? "text-muted-foreground" : "text-primary"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>{title}</CardTitle>
                {comingSoon && (
                  <Badge variant="secondary" className="text-xs">
                    {t("aiStudio.comingSoon", "Próximamente")}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              {feature.available ? (
                <Check className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className={feature.available ? "" : "text-muted-foreground"}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      {ctaText && (
        <CardFooter>
          <Button
            className="w-full"
            variant={comingSoon ? "outline" : "default"}
            onClick={(e) => {
              if (ctaAction) {
                e.preventDefault();
                ctaAction();
              }
            }}
          >
            {ctaText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  if (ctaLink && !comingSoon) {
    return <Link to={ctaLink}>{cardContent}</Link>;
  }

  return cardContent;
}
