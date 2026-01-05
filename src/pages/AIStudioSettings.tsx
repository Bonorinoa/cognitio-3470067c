import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAISubscription } from "@/hooks/useAISubscription";
import StyleProfileForm from "@/components/ai-studio/StyleProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2, Lock, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function AIStudioSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    subscription,
    hasActiveSubscription,
    subscribedBundle,
    isTrialing,
    willCancel,
    isLoading: isLoadingSubscription,
    openPortal,
    isOpeningPortal,
  } = useAISubscription();

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

  const getBundleDisplayName = (bundle: string | null) => {
    switch (bundle) {
      case "marketing":
        return t("aiStudio.marketingBundle", "Marketing");
      case "academic":
        return t("aiStudio.academicBundle", "Academic");
      case "pro":
        return t("aiStudio.proBundleName", "Pro");
      default:
        return t("aiStudio.freeTierName", "Free");
    }
  };

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

      {/* Billing & Subscription Section */}
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{t("aiStudio.billingTitle", "Billing & Subscription")}</CardTitle>
              <CardDescription>
                {t("aiStudio.billingDesc", "Manage your AI Studio subscription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingSubscription ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("common.loading", "Loading...")}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("aiStudio.currentPlanLabel", "Current Plan:")}</span>
                    <Badge variant={hasActiveSubscription ? "default" : "secondary"}>
                      {getBundleDisplayName(subscribedBundle)}
                    </Badge>
                    {isTrialing && (
                      <Badge variant="outline">{t("aiStudio.trial", "Trial")}</Badge>
                    )}
                  </div>
                  {hasActiveSubscription && subscription?.current_period_end && (
                    <p className="text-sm text-muted-foreground">
                      {willCancel ? (
                        <span className="flex items-center gap-1 text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          {t("aiStudio.cancelsOn", "Cancels on")} {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
                        </span>
                      ) : (
                        <>
                          {t("aiStudio.renewsOn", "Renews on")} {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
                        </>
                      )}
                    </p>
                  )}
                </div>
                {hasActiveSubscription ? (
                  <Button
                    variant="outline"
                    onClick={() => openPortal()}
                    disabled={isOpeningPortal}
                  >
                    {isOpeningPortal && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {t("aiStudio.manageSubscription", "Manage Subscription")}
                  </Button>
                ) : (
                  <Link to="/ai-studio#pricing">
                    <Button>
                      {t("aiStudio.upgradePlan", "Upgrade Plan")}
                    </Button>
                  </Link>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

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
