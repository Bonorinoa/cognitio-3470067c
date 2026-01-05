import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: "available" | "coming-soon";
  ctaText: string;
  ctaAction?: () => void;
  ctaLink?: string;
  className?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  status,
  ctaText,
  ctaAction,
  ctaLink,
  className = "",
}: FeatureCardProps) {
  const isComingSoon = status === "coming-soon";

  const cardContent = (
    <Card
      className={`rounded-xl border-2 transition-all duration-300 h-full ${
        isComingSoon
          ? "opacity-60 hover:opacity-70"
          : "hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
      } ${className}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className={`p-3 rounded-lg ${isComingSoon ? "bg-muted" : "bg-primary/10"}`}>
            <Icon className={`h-6 w-6 ${isComingSoon ? "text-muted-foreground" : "text-primary"}`} />
          </div>
          {isComingSoon && (
            <Badge variant="secondary" className="text-xs">
              Coming Soon
            </Badge>
          )}
        </div>
        <CardTitle className={isComingSoon ? "text-muted-foreground" : ""}>{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          className="w-full"
          variant={isComingSoon ? "outline" : "default"}
          onClick={(e) => {
            if (ctaAction) {
              e.preventDefault();
              ctaAction();
            }
          }}
        >
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );

  if (ctaLink && !isComingSoon) {
    return <Link to={ctaLink}>{cardContent}</Link>;
  }

  return cardContent;
}
