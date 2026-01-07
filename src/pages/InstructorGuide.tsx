import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BookOpen, 
  User, 
  Video, 
  BarChart3, 
  FolderOpen,
  Eye,
  DollarSign,
  Sparkles,
  Users,
  Mail
} from "lucide-react";

const InstructorGuide = () => {
  const { t } = useTranslation();

  const sections = [
    {
      id: "getting-started",
      icon: BookOpen,
      title: t("guide.sections.gettingStarted.title"),
      description: t("guide.sections.gettingStarted.description"),
      content: [
        { step: t("help.gettingStarted.step1Title"), desc: t("help.gettingStarted.step1Desc") },
        { step: t("help.gettingStarted.step2Title"), desc: t("help.gettingStarted.step2Desc") },
        { step: t("help.gettingStarted.step3Title"), desc: t("help.gettingStarted.step3Desc") },
        { step: t("help.gettingStarted.step4Title"), desc: t("help.gettingStarted.step4Desc") },
      ],
    },
    {
      id: "profile",
      icon: User,
      title: t("guide.sections.profile.title"),
      description: t("guide.sections.profile.description"),
      tips: [
        t("help.topics.profileTips.tip1"),
        t("help.topics.profileTips.tip2"),
        t("help.topics.profileTips.tip3"),
        t("help.topics.profileTips.tip4"),
      ],
    },
    {
      id: "visibility",
      icon: Eye,
      title: t("help.courseCreation.visibilityTitle"),
      description: t("help.courseCreation.visibilityIntro"),
      items: [
        { label: t("createCourse.public"), desc: t("help.courseCreation.visibilityPublic") },
        { label: t("createCourse.private"), desc: t("help.courseCreation.visibilityPrivate") },
      ],
    },
    {
      id: "pricing",
      icon: DollarSign,
      title: t("help.courseCreation.priceTitle"),
      description: t("help.courseCreation.priceDesc"),
    },
    {
      id: "chapters",
      icon: Video,
      title: t("help.topics.chapters.title"),
      description: t("help.topics.chapters.intro"),
      tips: [
        t("help.topics.chapters.tip1"),
        t("help.topics.chapters.tip2"),
        t("help.topics.chapters.tip3"),
      ],
    },
    {
      id: "resources",
      icon: FolderOpen,
      title: t("guide.sections.resources.title"),
      description: t("guide.sections.resources.description"),
      items: [
        { label: "PDF", desc: t("guide.sections.resources.pdf") },
        { label: "Link", desc: t("guide.sections.resources.link") },
        { label: "Notebook", desc: t("guide.sections.resources.notebook") },
        { label: "Video", desc: t("guide.sections.resources.video") },
      ],
    },
    {
      id: "membership",
      icon: Users,
      title: t("help.membership.helpTitle"),
      description: t("help.membership.helpDesc"),
    },
    {
      id: "video-upload",
      icon: Video,
      title: t("help.videoUpload.title"),
      description: t("guide.sections.videoUpload.description"),
      items: [
        { label: t("help.videoUpload.formatsLabel"), desc: t("help.videoUpload.formats") },
        { label: t("help.videoUpload.processingLabel"), desc: t("help.videoUpload.processing") },
        { label: t("help.videoUpload.qualityLabel"), desc: t("help.videoUpload.quality") },
      ],
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: t("help.topics.metrics.title"),
      description: t("help.topics.metrics.intro"),
      items: [
        { label: t("instructorDashboard.totalStudents"), desc: t("help.topics.metrics.students") },
        { label: t("instructorDashboard.totalRevenue"), desc: t("help.topics.metrics.revenue") },
        { label: t("analytics.completionRate"), desc: t("help.topics.metrics.completion") },
      ],
    },
    {
      id: "ai-studio",
      icon: Sparkles,
      title: t("guide.sections.aiStudio.title"),
      description: t("guide.sections.aiStudio.description"),
      tips: [
        t("help.aiStudio.tokenBudgetDesc"),
        t("help.aiStudio.documentTypesDesc"),
        t("help.aiStudio.refineDesc"),
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("guide.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("guide.subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.id} className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2">{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {section.content && (
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  {section.content.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.step}:</strong> {item.desc}
                    </li>
                  ))}
                </ol>
              )}
              {section.tips && (
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {section.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              )}
              {section.items && (
                <ul className="space-y-2 text-sm">
                  {section.items.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong>{" "}
                      <span className="text-muted-foreground">{item.desc}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t("guide.contact.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("guide.contact.description")}</p>
              <p className="text-sm text-primary mt-1">agbonorino21@gmail.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorGuide;
