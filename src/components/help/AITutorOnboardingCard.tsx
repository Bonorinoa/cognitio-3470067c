import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  AtSign,
  Clock,
  MessageSquare,
  Eye,
  X
} from "lucide-react";
import { isHelpDismissed, dismissHelp } from "@/lib/helpStorage";

/**
 * Onboarding card for students explaining how to use CognitioAI tutor.
 * Shows when AI tutor is enabled and user hasn't dismissed the card.
 */
export const AITutorOnboardingCard = () => {
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(true); // Start dismissed to avoid flash

  useEffect(() => {
    setIsDismissed(isHelpDismissed("aiTutorIntro"));
  }, []);

  const handleDismiss = () => {
    dismissHelp("aiTutorIntro");
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-semibold text-sm">{t("help.aiTutor.title")}</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground -mt-1 -mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          {t("help.aiTutor.intro")}
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <AtSign className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium">{t("help.aiTutor.howToUse")}</p>
              <p className="text-xs text-muted-foreground">{t("help.aiTutor.howToUseDesc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium">{t("help.aiTutor.capabilities")}</p>
              <p className="text-xs text-muted-foreground">{t("help.aiTutor.capabilitiesDesc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium">{t("help.aiTutor.limits")}</p>
              <p className="text-xs text-muted-foreground">{t("help.aiTutor.limitsDesc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Eye className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium">Qué ve el tutor</p>
              <p className="text-xs text-muted-foreground">
                El título del curso, tu capítulo actual, la transcripción del video alrededor del momento en el que estás, y tus últimos mensajes en este hilo. Nada más.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs h-7 text-muted-foreground"
          >
            {t("help.aiTutor.dismiss")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITutorOnboardingCard;
