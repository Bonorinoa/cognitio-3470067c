import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Sparkles, Check, Info, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStyleProfile } from "@/hooks/useStyleProfile";
import type { 
  StyleProfileFormData, 
  WritingTone, 
  LanguagePreference,
  UserStyleProfile
} from "@/types/aiStudio";
import {
  WRITING_TONE_OPTIONS,
  LANGUAGE_PREFERENCE_OPTIONS,
} from "@/types/aiStudio";

const DEFAULT_FORM_DATA: StyleProfileFormData = {
  tone: "conversational",
  target_audience: "",
  preferred_length: "moderate",
  language_preference: "en",
  include_citations: false,
  use_examples: true,
  include_call_to_action: false,
  custom_instructions: "",
};

function profileToFormData(profile: UserStyleProfile): StyleProfileFormData {
  return {
    tone: profile.tone,
    target_audience: profile.target_audience || "",
    preferred_length: profile.preferred_length,
    language_preference: profile.language_preference,
    include_citations: profile.include_citations,
    use_examples: profile.use_examples,
    include_call_to_action: profile.include_call_to_action,
    custom_instructions: profile.custom_instructions || "",
  };
}

interface StyleProfileFormProps {
  embedded?: boolean;
}

export default function StyleProfileForm({ embedded = false }: StyleProfileFormProps) {
  const { t } = useTranslation();
  const { styleProfile, isLoading, saveStyleProfile, isSaving, hasCompletedSetup } = useStyleProfile();
  const [formData, setFormData] = useState<StyleProfileFormData>(DEFAULT_FORM_DATA);
  const [hasChanges, setHasChanges] = useState(false);

  // Load existing profile data
  useEffect(() => {
    if (styleProfile) {
      setFormData(profileToFormData(styleProfile));
    }
  }, [styleProfile]);

  const handleChange = <K extends keyof StyleProfileFormData>(
    field: K,
    value: StyleProfileFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await saveStyleProfile(formData);
      setHasChanges(false);
      toast({
        title: t("styleProfile.saved"),
        description: t("styleProfile.savedDesc"),
      });
    } catch (error) {
      console.error("Failed to save style profile:", error);
      toast({
        title: t("styleProfile.errorSave"),
        description: t("styleProfile.errorSaveDesc"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const content = (
    <div className="space-y-6">
        {/* Info Alert */}
        <Alert className="border-primary/30 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <p className="mb-2">{t("styleProfile.helpDescription")}</p>
            <p className="flex items-center gap-1 text-muted-foreground">
              <Mail className="h-3 w-3" />
              {t("styleProfile.helpCustomization")}
            </p>
          </AlertDescription>
        </Alert>

        {/* Writing Tone */}
        <div className="space-y-3">
          <Label className="text-base font-medium">{t("styleProfile.tone")}</Label>
          <p className="text-sm text-muted-foreground">{t("styleProfile.toneDesc")}</p>
          <RadioGroup
            value={formData.tone}
            onValueChange={(value) => handleChange("tone", value as WritingTone)}
            className="grid grid-cols-2 gap-3"
          >
            {WRITING_TONE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`tone-${option.value}`} />
                <Label htmlFor={`tone-${option.value}`} className="cursor-pointer">
                  {t(`styleProfile.tones.${option.value}`)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <Label htmlFor="target_audience" className="text-base font-medium">
            {t("styleProfile.audience")}
          </Label>
          <p className="text-sm text-muted-foreground">{t("styleProfile.audienceDesc")}</p>
          <Input
            id="target_audience"
            value={formData.target_audience}
            onChange={(e) => handleChange("target_audience", e.target.value)}
            placeholder={t("styleProfile.audiencePlaceholder")}
            maxLength={200}
          />
        </div>

        {/* Language Preference */}
        <div className="space-y-3">
          <Label className="text-base font-medium">{t("styleProfile.language")}</Label>
          <p className="text-sm text-muted-foreground">{t("styleProfile.languageDesc")}</p>
          <RadioGroup
            value={formData.language_preference}
            onValueChange={(value) => handleChange("language_preference", value as LanguagePreference)}
            className="grid grid-cols-3 gap-3"
          >
            {LANGUAGE_PREFERENCE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`lang-${option.value}`} />
                <Label htmlFor={`lang-${option.value}`} className="cursor-pointer">
                  {t(`styleProfile.languages.${option.value}`)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Custom Instructions */}
        <div className="space-y-2">
          <Label htmlFor="custom_instructions" className="text-base font-medium">
            {t("styleProfile.customInstructions")}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t("styleProfile.customInstructionsDesc")}
          </p>
          <Textarea
            id="custom_instructions"
            value={formData.custom_instructions}
            onChange={(e) => handleChange("custom_instructions", e.target.value)}
            placeholder={t("styleProfile.customInstructionsPlaceholder")}
            rows={4}
            className="resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground text-right">
            {formData.custom_instructions.length}/1000
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("styleProfile.saving")}
              </>
            ) : (
              t("styleProfile.savePreferences")
            )}
          </Button>
      </div>
    </div>
  );

  // If embedded, just return the content without card wrapper
  if (embedded) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>{t("styleProfile.title")}</CardTitle>
        </div>
        <CardDescription>
          {t("styleProfile.subtitle")}
        </CardDescription>
        {hasCompletedSetup && (
          <div className="flex items-center gap-1 text-sm text-primary">
            <Check className="h-4 w-4" />
            {t("styleProfile.setupComplete")}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
