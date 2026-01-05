import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ComingSoonFeatureProps {
  featureKey: string;
  title: string;
  bundle: "marketing" | "academic";
  description?: string;
}

export default function ComingSoonFeature({
  featureKey,
  title,
  bundle,
  description,
}: ComingSoonFeatureProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bundleName = bundle === "marketing" 
    ? t("aiStudio.marketingBundle", "Marketing")
    : t("aiStudio.academicBundle", "Academic");

  const bundlePath = `/ai-studio/${bundle}`;

  const defaultDescription = t(
    "aiStudio.featureComingSoonDesc",
    "This feature is currently under development. Sign up below to be notified when it launches."
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error(t("aiStudio.invalidEmail", "Please enter a valid email address"));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("feature_notify_requests").insert({
        email,
        feature_key: featureKey,
        user_id: user?.id || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast.info(t("aiStudio.alreadyNotified", "You're already on the list for this feature!"));
          setIsSuccess(true);
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast.success(t("aiStudio.notifySuccess", "We'll notify you when it's ready!"));
      }
    } catch (error) {
      console.error("Failed to submit notification request:", error);
      toast.error(t("aiStudio.notifyError", "Failed to submit request. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">
                {t("aiStudio.comingSoon", "Coming Soon")}
              </span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {description || defaultDescription}
            </p>
          </div>

          {/* Email Form */}
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="email">
                  {t("common.email", "Email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("aiStudio.emailPlaceholder", "Enter your email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || !!user?.email}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.submitting", "Submitting...")}
                  </>
                ) : (
                  t("aiStudio.notifyMe", "Notify Me")
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t(
                  "aiStudio.notifyPrivacy",
                  "We'll only email you about {{feature}} and won't share your email.",
                  { feature: title }
                )}
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6" />
                <p className="text-lg font-medium">
                  {t("aiStudio.notifySuccess", "We'll notify you when it's ready!")}
                </p>
              </div>
              <Link to={bundlePath}>
                <Button variant="outline">
                  {t("aiStudio.backTo", "Back to {{bundle}}", { bundle: bundleName })}
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
