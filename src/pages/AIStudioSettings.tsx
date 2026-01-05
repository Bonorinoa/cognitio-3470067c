import { useTranslation } from "react-i18next";
import StyleProfileForm from "@/components/ai-studio/StyleProfileForm";
import { Settings2 } from "lucide-react";

export default function AIStudioSettings() {
  const { t } = useTranslation();

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
