import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FileEdit, Linkedin, Twitter, Mail, ArrowRight, Clock, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDrafts } from "@/hooks/useDrafts";
import WaitlistForm from "@/components/ai-studio/WaitlistForm";

interface ComingSoonItem {
  key: string;
  icon: typeof Linkedin;
  title: string;
  desc: string;
}

export default function MarketingBundleHub() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { drafts: recentDrafts } = useDrafts({ contentType: "blog", limit: 2 });

  const comingSoon: ComingSoonItem[] = [
    {
      key: "linkedin",
      icon: Linkedin,
      title: t("aiStudio.linkedinGenerator", "LinkedIn Posts"),
      desc: t("aiStudio.linkedinGeneratorDesc", "Publicaciones profesionales que conectan con su red."),
    },
    {
      key: "twitter",
      icon: Twitter,
      title: t("aiStudio.twitterGenerator", "X / Twitter"),
      desc: t("aiStudio.twitterGeneratorDesc", "Tweets e hilos para amplificar sus ideas."),
    },
    {
      key: "newsletter",
      icon: Mail,
      title: t("aiStudio.newsletterGenerator", "Newsletter"),
      desc: t("aiStudio.newsletterGeneratorDesc", "Boletines editoriales para suscriptores fieles."),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Editorial header */}
      <div className="space-y-3 pb-6 border-b border-border">
        <div className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
          {t("aiStudio.marketingBundleEyebrow", "Divulgación")}
        </div>
        <h1 className="text-3xl md:text-4xl font-light text-foreground">
          {t("aiStudio.marketingTitleLead", "Su voz, ")}
          <span className="italic font-serif">{t("aiStudio.marketingTitleAccent", "multiplicada.")}</span>
        </h1>
        <p className="text-muted-foreground font-light max-w-xl">
          {t(
            "aiStudio.marketingHubDesc",
            "Herramientas para llevar su conocimiento académico a audiencias más amplias, sin perder rigor ni voz."
          )}
        </p>
      </div>

      {/* Continue working — only if logged in and has drafts */}
      {user && recentDrafts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
              {t("aiStudio.continueWorking", "Continuar trabajando")}
            </span>
            <Link
              to="/ai-studio/drafts"
              className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors font-semibold"
            >
              {t("aiStudio.viewAllDrafts", "Ver todos →")}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {recentDrafts.map((draft) => (
              <Link
                key={draft.id}
                to={`/ai-studio/marketing/blog?load=${draft.id}`}
                className="group border border-border rounded-sm p-4 hover:border-primary/40 transition-colors flex items-start gap-3"
              >
                <FileText className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:text-primary" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="text-sm font-light text-foreground truncate group-hover:text-primary transition-colors">
                    {draft.topic}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 font-light">
                    {draft.generated_content.slice(0, 80)}…
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Live tool — Blog */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
            {t("aiStudio.liveTools", "Herramientas disponibles")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <Link
          to="/ai-studio/marketing/blog"
          className="group block border border-border rounded-sm p-8 md:p-10 hover:border-primary/40 hover:bg-card/50 transition-all"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-3 min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <FileEdit className="h-5 w-5 text-primary" strokeWidth={1.5} />
                <h3 className="text-2xl font-light text-foreground">
                  {t("aiStudio.blogGenerator", "Blog Posts")}
                </h3>
              </div>
              <p className="text-muted-foreground font-light max-w-lg">
                {t(
                  "aiStudio.blogGeneratorDesc",
                  "Artículos editoriales generados desde su base de conocimiento, con su voz."
                )}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
          </div>
        </Link>
      </section>

      {/* Coming soon — with waitlist */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">
            {t("aiStudio.upcoming", "Próximamente")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="divide-y divide-border border-y border-border">
          {comingSoon.map((item) => (
            <div
              key={item.key}
              className="py-6 px-2 grid grid-cols-12 gap-4 items-center"
            >
              <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <h4 className="text-lg font-light text-foreground">{item.title}</h4>
                <Clock className="h-3 w-3 text-muted-foreground/60" />
              </div>
              <p className="col-span-12 md:col-span-3 text-sm text-muted-foreground font-light">
                {item.desc}
              </p>
              <div className="col-span-12 md:col-span-4">
                <WaitlistForm bundle={`marketing-${item.key}`} variant="compact" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
