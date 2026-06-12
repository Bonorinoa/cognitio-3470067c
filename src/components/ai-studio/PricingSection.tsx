import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Megaphone, GraduationCap, Sparkles, Loader2 } from "lucide-react";
import { useAISubscription, AIBundle } from "@/hooks/useAISubscription";
import { useAuth } from "@/contexts/AuthContext";

interface PricingTier {
  bundle: AIBundle | "free";
  name: string;
  price: number | null;
  description: string;
  features: string[];
  icon: React.ReactNode;
  highlighted?: boolean;
}

export default function PricingSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    subscribedBundle,
    hasActiveSubscription,
    isSubscribedTo,
    createCheckout,
    isCreatingCheckout,
    openPortal,
    isOpeningPortal,
  } = useAISubscription();

  const tiers: PricingTier[] = [
    {
      bundle: "free",
      name: t("aiStudio.freeTierName", "Free"),
      price: null,
      description: t("aiStudio.freeTierDesc", "Get started with AI content generation"),
      features: [
        t("aiStudio.freeFeature1", "10 generations/day"),
        t("aiStudio.freeFeature2", "Blog post generation"),
        t("aiStudio.freeFeature3", "Basic style settings"),
      ],
      icon: <Sparkles className="h-6 w-6" />,
    },
    {
      bundle: "marketing",
      name: t("aiStudio.marketingBundle", "Marketing"),
      price: 19,
      description: t("aiStudio.marketingPricingDesc", "All marketing content tools"),
      features: [
        t("aiStudio.marketingFeature1", "200 generations/day"),
        t("aiStudio.marketingFeature2", "Blog posts, social media"),
        t("aiStudio.marketingFeature3", "Newsletter generation"),
        t("aiStudio.marketingFeature4", "Priority support"),
      ],
      icon: <Megaphone className="h-6 w-6" />,
    },
    {
      bundle: "academic",
      name: t("aiStudio.academicBundle", "Academic"),
      price: 19,
      description: t("aiStudio.academicPricingDesc", "Research & academic writing tools"),
      features: [
        t("aiStudio.academicFeature1", "200 generations/day"),
        t("aiStudio.academicFeature2", "Literature review"),
        t("aiStudio.academicFeature3", "Paper formatting"),
        t("aiStudio.academicFeature4", "Citation generator"),
      ],
      icon: <GraduationCap className="h-6 w-6" />,
    },
    {
      bundle: "pro",
      name: t("aiStudio.proBundleName", "Pro"),
      price: 29,
      description: t("aiStudio.proPricingDesc", "Everything in Marketing + Academic"),
      features: [
        t("aiStudio.proFeature1", "500 generations/day"),
        t("aiStudio.proFeature2", "All Marketing tools"),
        t("aiStudio.proFeature3", "All Academic tools"),
        t("aiStudio.proFeature4", "Priority support"),
      ],
      icon: <Crown className="h-6 w-6" />,
      highlighted: true,
    },
  ];

  const handleSubscribe = (bundle: AIBundle) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    createCheckout(bundle);
  };

  const handleManage = () => {
    openPortal();
  };

  const getButtonContent = (tier: PricingTier) => {
    if (tier.bundle === "free") {
      if (!hasActiveSubscription) {
        return {
          text: t("aiStudio.currentPlan", "Current Plan"),
          disabled: true,
          variant: "outline" as const,
        };
      }
      return {
        text: t("aiStudio.includedFree", "Included"),
        disabled: true,
        variant: "outline" as const,
      };
    }

    if (isSubscribedTo(tier.bundle as AIBundle)) {
      return {
        text: t("aiStudio.yourPlan", "Your Plan"),
        disabled: false,
        variant: "default" as const,
        action: handleManage,
      };
    }

    if (hasActiveSubscription) {
      // User has a subscription but not this one - they can switch
      return {
        text: t("aiStudio.switchPlan", "Switch Plan"),
        disabled: false,
        variant: "outline" as const,
        action: handleManage,
      };
    }

    return {
      text: t("aiStudio.subscribe", "Subscribe"),
      disabled: false,
      variant: "default" as const,
      action: () => handleSubscribe(tier.bundle as AIBundle),
    };
  };

  return (
    <section id="pricing" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">
          {t("aiStudio.pricingTitle", "Simple, Transparent Pricing")}
        </h2>
        <p className="text-muted-foreground">
          {t("aiStudio.pricingSubtitle", "Choose the plan that fits your needs")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => {
          const buttonConfig = getButtonContent(tier);
          const isCurrentPlan = tier.bundle === "free" 
            ? !hasActiveSubscription 
            : isSubscribedTo(tier.bundle as AIBundle);

          return (
            <Card
              key={tier.bundle}
              className={`rounded-xl border-2 flex flex-col transition-all duration-300 ${
                tier.highlighted
                  ? "border-primary shadow-lg scale-[1.02]"
                  : isCurrentPlan
                  ? "border-primary/50"
                  : "border-border"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${tier.highlighted ? "bg-primary/20" : "bg-primary/10"}`}>
                    <span className={tier.highlighted ? "text-primary" : "text-primary"}>
                      {tier.icon}
                    </span>
                  </div>
                  {tier.highlighted && (
                    <Badge className="bg-primary text-primary-foreground">
                      {t("aiStudio.bestValue", "Best Value")}
                    </Badge>
                  )}
                  {isCurrentPlan && !tier.highlighted && (
                    <Badge variant="secondary">
                      {t("aiStudio.currentPlanBadge", "Current")}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{tier.name}</CardTitle>
                <div className="mt-2">
                  {tier.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${tier.price}</span>
                      <span className="text-muted-foreground">{t("aiStudio.perMonth", "/mo")}</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold">{t("aiStudio.freePrice", "Free")}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={buttonConfig.variant}
                  disabled={buttonConfig.disabled || isCreatingCheckout || isOpeningPortal}
                  onClick={buttonConfig.action}
                >
                  {(isCreatingCheckout || isOpeningPortal) && buttonConfig.action ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {buttonConfig.text}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Instructor perk note */}
      <p className="text-center text-sm text-muted-foreground">
        {t("aiStudio.instructorPerk", "¿Eres instructor de Cognitio? Disfruta de 50 generaciones diarias.")}
      </p>
    </section>
  );
}
