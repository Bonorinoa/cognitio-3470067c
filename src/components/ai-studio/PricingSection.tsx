import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Clock } from "lucide-react";
import { useAISubscription, AIBundle } from "@/hooks/useAISubscription";
import { useAuth } from "@/contexts/AuthContext";

interface PricingTier {
  bundle: AIBundle | "free";
  name: string;
  price: number | null;
  tagline: string;
  features: string[];
  comingSoon?: boolean;
  highlighted?: boolean;
}

export default function PricingSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
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
      tagline: t("aiStudio.freeTierDesc", "Comience a generar contenido con IA"),
      features: [
        t("aiStudio.freeFeature1", "10 generaciones/día"),
        t("aiStudio.freeFeature2", "Blog post generation"),
      ],
    },
    {
      bundle: "academic",
      name: t("aiStudio.academicBundle", "Académico"),
      price: 19,
      tagline: t("aiStudio.academicPricingDesc", "Herramientas de escritura académica"),
      features: [
        t("aiStudio.academicFeature1", "200 generaciones/día"),
        t("aiStudio.academicFeature2", "Literature review, citas, papers"),
      ],
      comingSoon: true,
    },
    {
      bundle: "academic",
      name: t("aiStudio.academicBundle", "Académico"),
      price: 19,
      tagline: t("aiStudio.academicPricingDesc", "Herramientas de escritura académica"),
      features: [
        t("aiStudio.academicFeature1", "200 generaciones/día"),
        t("aiStudio.academicFeature2", "Literature review, citas, papers"),
      ],
      comingSoon: true,
    },
    {
      bundle: "pro",
      name: t("aiStudio.proBundleName", "Pro"),
      price: 29,
      tagline: t("aiStudio.proPricingDesc", "Divulgación + Académico"),
      features: [
        t("aiStudio.proFeature1", "500 generaciones/día"),
        t("aiStudio.proFeature3", "Todas las herramientas"),
      ],
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

  const renderAction = (tier: PricingTier) => {
    if (tier.comingSoon) {
      return (
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold">
          {t("aiStudio.comingSoon", "Próximamente")}
        </span>
      );
    }
    if (tier.bundle === "free") {
      return (
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          {hasActiveSubscription
            ? t("aiStudio.includedFree", "Incluido")
            : t("aiStudio.currentPlan", "Plan Actual")}
        </span>
      );
    }
    if (isSubscribedTo(tier.bundle as AIBundle)) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="rounded-sm h-8 text-xs"
          onClick={() => openPortal()}
          disabled={isOpeningPortal}
        >
          {isOpeningPortal && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
          {t("aiStudio.yourPlan", "Su Plan")}
        </Button>
      );
    }
    if (hasActiveSubscription) {
      return (
        <Button
          size="sm"
          variant="ghost"
          className="rounded-sm h-8 text-xs px-2"
          onClick={() => openPortal()}
          disabled={isOpeningPortal}
        >
          {t("aiStudio.switchPlan", "Cambiar")}
        </Button>
      );
    }
    return (
      <Button
        size="sm"
        className="rounded-sm h-8 text-xs"
        onClick={() => handleSubscribe(tier.bundle as AIBundle)}
        disabled={isCreatingCheckout}
      >
        {isCreatingCheckout && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
        {t("aiStudio.subscribe", "Suscribirse")}
      </Button>
    );
  };

  return (
    <section id="pricing" className="py-16 border-t border-border">
      <div className="text-center mb-12 px-2">
        <div className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3">
          {t("aiStudio.pricingEyebrow", "Planes")}
        </div>
        <h2 className="text-3xl md:text-4xl font-light text-foreground">
          {t("aiStudio.pricingTitleEditorial", "Acceso ")}
          <span className="italic font-serif">
            {t("aiStudio.pricingTitleEditorialAccent", "sin fricciones.")}
          </span>
        </h2>
        <div className="h-px w-16 bg-primary/40 mx-auto mt-6" />
      </div>

      <div className="divide-y divide-border border-y border-border">
        {tiers.map((tier) => (
          <div
            key={tier.bundle}
            className={`grid grid-cols-12 gap-4 items-center py-6 px-2 transition-colors ${
              tier.highlighted ? "bg-primary/[0.03]" : ""
            } ${tier.comingSoon ? "opacity-60" : ""}`}
          >
            {/* Name + tagline */}
            <div className="col-span-12 md:col-span-4 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-light text-foreground">{tier.name}</h3>
                {tier.highlighted && (
                  <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 bg-primary/10 text-primary font-semibold rounded-sm">
                    {t("aiStudio.bestValue", "Recomendado")}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-light">{tier.tagline}</p>
            </div>

            {/* Price */}
            <div className="col-span-6 md:col-span-2">
              {tier.price !== null ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-light text-foreground">${tier.price}</span>
                  <span className="text-xs text-muted-foreground">
                    {t("aiStudio.perMonth", "/mes")}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-light text-foreground">
                  {t("aiStudio.freePrice", "Gratis")}
                </span>
              )}
            </div>

            {/* Features */}
            <ul className="col-span-12 md:col-span-4 space-y-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80 font-light">
                  {tier.comingSoon ? (
                    <Clock className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                  ) : (
                    <Check className="h-3 w-3 text-primary shrink-0 mt-1.5" />
                  )}
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action */}
            <div className="col-span-6 md:col-span-2 flex md:justify-end">
              {renderAction(tier)}
            </div>
          </div>
        ))}
      </div>

      {/* Instructor perk */}
      <p className="text-center text-sm text-muted-foreground font-light mt-8 italic">
        {t("aiStudio.instructorPerk", "¿Es instructor de Cognitio? Reciba 50 generaciones diarias sin costo adicional.")}
      </p>
    </section>
  );
}
