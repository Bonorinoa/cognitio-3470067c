import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/EmptyState";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { useStyleProfile } from "@/hooks/useStyleProfile";
import { useGenerationUsage } from "@/hooks/useGenerationUsage";
import { useGenerationHistory, formatRelativeTime } from "@/hooks/useGenerationHistory";
import {
  FileEdit,
  Mail,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  History,
} from "lucide-react";

export default function AIStudioDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { documents } = useKnowledgeBase();
  const { hasCompletedSetup } = useStyleProfile();
  const { remaining, limit, totalCount } = useGenerationUsage();
  const { history } = useGenerationHistory();

  // Calculate usage percentage
  const usagePercentage = limit > 0 ? ((limit - remaining) / limit) * 100 : 0;

  // Get last 3 generations
  const recentGenerations = history.slice(0, 3);

  const handleLoadGeneration = (id: string) => {
    navigate(`/ai-studio/blog?load=${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🎨 {t("aiStudio.dashboardTitle", "AI Content Studio")}
        </h1>
        <p className="text-muted-foreground">
          {t("aiStudio.dashboardSubtitle", "Tu asistente de contenido inteligente")}
        </p>
      </div>

      {/* Quick Actions Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          {t("aiStudio.quickActions", "Acciones Rápidas")}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Blog Generator Card */}
          <Link to="/ai-studio/blog">
            <Card className="rounded-xl border-2 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileEdit className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{t("aiStudio.generateBlog", "Generar Blog")}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t("aiStudio.blogDesc", "Crea artículos desde tu base de conocimiento")}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Newsletter Card - Disabled */}
          <Card className="rounded-xl opacity-60 cursor-not-allowed h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-muted">
                  <Mail className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-muted-foreground">
                      {t("aiStudioNav.newsletter", "Newsletter")}
                    </CardTitle>
                    <Badge variant="secondary">
                      {t("common.soon", "Próximamente")}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("aiStudio.newsletterDesc", "Genera boletines para tu audiencia")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Generations Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {t("aiStudio.recentGenerations", "Generaciones Recientes")}
          </h2>
          {history.length > 0 && (
            <Link to="/ai-studio/blog" className="text-sm text-primary hover:underline">
              {t("aiStudio.viewAll", "Ver todo")} →
            </Link>
          )}
        </div>

        {recentGenerations.length === 0 ? (
          <EmptyState
            icon={History}
            title={t("aiStudio.noRecentGenerations", "Sin generaciones recientes")}
            description={t(
              "aiStudio.noRecentGenerationsDesc",
              "Tus generaciones guardadas aparecerán aquí"
            )}
            action={{
              label: t("aiStudio.start", "Comenzar"),
              onClick: () => navigate("/ai-studio/blog"),
            }}
          />
        ) : (
          <div className="space-y-3">
            {recentGenerations.map((item) => {
              // Truncate topic and content for preview
              const truncatedTopic = item.topic.length > 50 
                ? item.topic.slice(0, 50) + "..." 
                : item.topic;
              const contentPreview = item.generated_content.length > 150
                ? item.generated_content.slice(0, 150) + "..."
                : item.generated_content;

              return (
                <Card key={item.id} className="rounded-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{truncatedTopic}</h3>
                          <Badge variant="outline" className="shrink-0">
                            {item.content_type === "blog" ? "Blog" : "Newsletter"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {contentPreview}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(item.created_at)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoadGeneration(item.id)}
                        className="shrink-0"
                      >
                        {t("aiStudio.load", "Cargar")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Studio Health Stats Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          {t("aiStudio.yourStudio", "Tu Estudio")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Documents Count */}
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Database className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents?.length || 0}</div>
              <p className="text-sm text-muted-foreground">
                {t("aiStudio.documents", "Documentos")}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/ai-studio/knowledge" className="text-xs text-primary hover:underline">
                {t("aiStudio.manage", "Gestionar")} →
              </Link>
            </CardFooter>
          </Card>

          {/* Style Profile Status */}
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${hasCompletedSetup ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                  {hasCompletedSetup ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hasCompletedSetup
                  ? t("aiStudio.configured", "Configurado")
                  : t("aiStudio.pending", "Pendiente")}
              </div>
              <p className="text-sm text-muted-foreground">
                {t("styleProfile.title", "Estilo")}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/ai-studio/knowledge" className="text-xs text-primary hover:underline">
                {hasCompletedSetup
                  ? t("common.edit", "Editar")
                  : t("aiStudio.configure", "Configurar")} →
              </Link>
            </CardFooter>
          </Card>

          {/* Generations Usage */}
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {remaining}/{limit}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {t("aiStudio.genToday", "Gen. hoy")}
              </p>
              <Progress value={usagePercentage} className="h-1.5" />
            </CardContent>
          </Card>

          {/* Total Generations */}
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <FileEdit className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-sm text-muted-foreground">
                {t("aiStudio.totalGen", "Total gen.")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
