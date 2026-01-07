import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  UserCircle, 
  BookOpen, 
  Video, 
  Globe,
  CheckCircle2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isHelpDismissed, dismissHelp } from "@/lib/helpStorage";

interface InstructorGettingStartedCardProps {
  hasProfile?: boolean;
  hasCourses?: boolean;
  hasVideos?: boolean;
  hasPublished?: boolean;
}

/**
 * Getting Started card for new instructors.
 * Shows a checklist of onboarding steps with progress indicators.
 */
export const InstructorGettingStartedCard = ({
  hasProfile = false,
  hasCourses = false,
  hasVideos = false,
  hasPublished = false,
}: InstructorGettingStartedCardProps) => {
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(true); // Start as dismissed to avoid flash

  useEffect(() => {
    // Check localStorage on mount
    setIsDismissed(isHelpDismissed("instructorGettingStarted"));
  }, []);

  const handleDismiss = () => {
    dismissHelp("instructorGettingStarted");
    setIsDismissed(true);
  };

  // Don't show if dismissed
  if (isDismissed) return null;

  const steps = [
    {
      id: "profile",
      icon: UserCircle,
      title: t("help.gettingStarted.step1Title"),
      description: t("help.gettingStarted.step1Desc"),
      completed: hasProfile,
      href: "/instructor/settings",
    },
    {
      id: "course",
      icon: BookOpen,
      title: t("help.gettingStarted.step2Title"),
      description: t("help.gettingStarted.step2Desc"),
      completed: hasCourses,
      href: "/instructor/create",
    },
    {
      id: "video",
      icon: Video,
      title: t("help.gettingStarted.step3Title"),
      description: t("help.gettingStarted.step3Desc"),
      completed: hasVideos,
      href: hasCourses ? "/instructor/courses" : "/instructor/create",
    },
    {
      id: "publish",
      icon: Globe,
      title: t("help.gettingStarted.step4Title"),
      description: t("help.gettingStarted.step4Desc"),
      completed: hasPublished,
      href: hasCourses ? "/instructor/courses" : "/instructor/create",
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {t("help.gettingStarted.title")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {completedCount} / {steps.length} {t("help.gettingStarted.stepsCompleted")}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground -mt-1 -mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {steps.map((step, index) => (
            <Link
              key={step.id}
              to={step.href}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                step.completed
                  ? "border-primary/20 bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  step.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-medium text-sm",
                    step.completed ? "text-primary" : "text-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {step.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs text-muted-foreground"
          >
            {t("help.gettingStarted.dismiss")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorGettingStartedCard;
