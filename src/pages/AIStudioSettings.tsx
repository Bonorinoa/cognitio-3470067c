import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import StyleProfileForm from "@/components/ai-studio/StyleProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, Lock } from "lucide-react";

export default function AIStudioSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-muted rounded-full">
                <Lock className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">
              {t("aiStudio.loginToConfigureStyle", "Inicia sesión para configurar tu estilo")}
            </h2>
            <p className="text-muted-foreground">
              {t("aiStudio.loginToConfigureStyleDesc", "Necesitas una cuenta para guardar tus preferencias de escritura.")}
            </p>
            <Link to="/auth">
              <Button className="mt-2">
                {t("nav.login", "Iniciar Sesión")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {t("aiStudio.globalSettings", "Global Settings")}
            </h1>
            <p className="text-muted-foreground">
              {t(
                "aiStudio.globalSettingsDesc",
                "Configure your default style preferences for AI-generated content"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Style Profile Form */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {t("aiStudio.styleSettings", "Style Settings")}
        </h2>
        <StyleProfileForm embedded={false} />
      </div>
    </div>
  );
}
