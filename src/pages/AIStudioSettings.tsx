import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAISubscription } from "@/hooks/useAISubscription";
import StyleProfileForm from "@/components/ai-studio/StyleProfileForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function AIStudioSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isActivating, setIsActivating] = useState(false);
  const pollCount = useRef(0);
  const maxPolls = 6; // ~20 seconds total with backoff
  
  const {
    subscription,
    hasActiveSubscription,
    subscribedBundle,
    isTrialing,
    willCancel,
    isLoading: isLoadingSubscription,
    openPortal,
    isOpeningPortal,
    refetch,
    invalidateSubscription,
  } = useAISubscription();

  // Handle subscription=success query param with polling
  useEffect(() => {
    const isSuccess = searchParams.get("subscription") === "success";
    if (!isSuccess || !user) return;

    // Clear param immediately to avoid re-triggering on refresh
    setSearchParams({}, { replace: true });

    // If already has subscription, just show success
    if (hasActiveSubscription) {
      toast.success(t("aiStudio.subscriptionActivated", "Subscription activated!"));
      return;
    }

    // Start polling for subscription activation
    setIsActivating(true);
    pollCount.current = 0;
    toast.info(t("aiStudio.activatingSubscription", "Payment received — activating subscription…"));

    const poll = async () => {
      if (pollCount.current >= maxPolls) {
        setIsActivating(false);
        toast.error(t("aiStudio.activationTimeout", "Subscription activation is taking longer than expected. Please refresh the page."));
        return;
      }

      invalidateSubscription();
      const result = await refetch();
      
      if (result.data && ["active", "trialing"].includes(result.data.status)) {
        setIsActivating(false);
        toast.success(t("aiStudio.subscriptionActivated", "Subscription activated!"));
        return;
      }

      // Exponential backoff: 2s, 3s, 4s, 5s, 6s, 7s
      pollCount.current++;
      const delay = 2000 + (pollCount.current * 1000);
      setTimeout(poll, delay);
    };

    // Start first poll after a short delay
    setTimeout(poll, 1500);
  }, [searchParams, user, hasActiveSubscription, invalidateSubscription, refetch, setSearchParams, t]);

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
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Editorial Header */}
      <div className="space-y-3 pb-6 border-b border-border">
        <div className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
          {t("aiStudio.stepKicker2", "Estilo")}
        </div>
        <h1 className="text-3xl md:text-4xl font-light text-foreground">
          {t("aiStudio.settingsTitleLead", "Su voz, ")}
          <span className="italic font-serif">{t("aiStudio.settingsTitleAccent", "calibrada.")}</span>
        </h1>
        <p className="text-muted-foreground font-light max-w-xl">
          {t(
            "aiStudio.globalSettingsDesc",
            "Configure su tono editorial y gestione su suscripción a AI Studio."
          )}
        </p>
      </div>

      {/* Billing & Subscription — hairline editorial */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
            {t("aiStudio.billingEyebrow", "Facturación")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="border border-border rounded-sm p-6 md:p-8 bg-card/30">
          {isLoadingSubscription || isActivating ? (
            <div className="flex items-center gap-2 text-muted-foreground font-light">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isActivating 
                ? t("aiStudio.activatingSubscription", "Activando suscripción…") 
                : t("common.loading", "Cargando…")}
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl font-light text-foreground">
                    {getBundleDisplayName(subscribedBundle)}
                  </span>
                  {hasActiveSubscription && (
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-semibold text-primary">
                      <CheckCircle className="h-3 w-3" />
                      {t("aiStudio.activeStatus", "Activo")}
                    </span>
                  )}
                  {isTrialing && (
                    <Badge variant="outline" className="rounded-sm text-[10px] uppercase tracking-wider">
                      {t("aiStudio.trial", "Prueba")}
                    </Badge>
                  )}
                </div>
                {hasActiveSubscription && subscription?.current_period_end && (
                  <p className="text-sm text-muted-foreground font-light">
                    {willCancel ? (
                      <span className="flex items-center gap-1.5 text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {t("aiStudio.cancelsOn", "Se cancela el")} {format(new Date(subscription.current_period_end), "d MMM yyyy")}
                      </span>
                    ) : (
                      <>
                        {t("aiStudio.renewsOn", "Se renueva el")} {format(new Date(subscription.current_period_end), "d MMM yyyy")}
                      </>
                    )}
                  </p>
                )}
              </div>
              {hasActiveSubscription ? (
                <Button
                  variant="outline"
                  className="rounded-sm"
                  onClick={() => openPortal()}
                  disabled={isOpeningPortal}
                >
                  {isOpeningPortal && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {t("aiStudio.manageSubscription", "Gestionar suscripción")}
                </Button>
              ) : (
                <Link to="/ai-studio#pricing">
                  <Button className="rounded-sm">
                    {t("aiStudio.upgradePlan", "Ver planes")}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Style Profile */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
            {t("aiStudio.styleEyebrow", "Voz Editorial")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <StyleProfileForm embedded={false} />
      </section>
    </div>
  );
}
