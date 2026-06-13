import { useTranslation } from "react-i18next";
import { useInstructorAnalytics, exportAnalyticsCSV } from "@/hooks/useInstructorAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { ErrorState } from "@/components/ErrorState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  BookOpen,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const InstructorAnalytics = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useInstructorAnalytics();

  const handleExport = () => {
    if (data) {
      exportAnalyticsCSV(data);
    }
  };

  if (error) {
    return (
      <ErrorState
        title="No pudimos cargar las analíticas"
        description="Hubo un problema al traer tus métricas. Probá de nuevo."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analíticas</h1>
          <p className="text-sm text-muted-foreground">
            Monitoreá el rendimiento de tus cursos en tiempo real
          </p>
        </div>
        <Button onClick={handleExport} disabled={!data || isLoading} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {isLoading ? (
        <AnalyticsSkeleton />
      ) : data ? (
        <>
          {/* Summary Cards - More compact */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-6">
            <SummaryCard
              title={t("help.topics.analytics.totalRevenueTitle", "Ingresos Totales")}
              value={`$${data.summary.totalRevenue.toLocaleString()}`}
              subtitle={`$${data.summary.revenueThisMonth.toLocaleString()} ${t("instructorAnalytics.thisMonth", "este mes")}`}
              icon={<DollarSign className="h-4 w-4" />}
              trend={data.summary.revenueGrowth}
              helpText={t("help.topics.analytics.totalRevenueDesc")}
            />
            <SummaryCard
              title={t("help.topics.analytics.totalStudentsTitle", "Total Estudiantes")}
              value={data.summary.totalStudents.toLocaleString()}
              subtitle={`${data.summary.studentsThisMonth} ${t("instructorAnalytics.newThisMonth", "nuevos este mes")}`}
              icon={<Users className="h-4 w-4" />}
              trend={data.summary.studentGrowth}
              helpText={t("help.topics.analytics.totalStudentsDesc")}
            />
            <SummaryCard
              title={t("help.topics.analytics.publishedCoursesTitle", "Cursos Publicados")}
              value={data.summary.publishedCourses.toString()}
              subtitle={`${t("instructorAnalytics.of", "de")} ${data.summary.totalCourses} total`}
              icon={<BookOpen className="h-4 w-4" />}
              helpText={t("help.topics.analytics.publishedCoursesDesc")}
            />
            <SummaryCard
              title={t("help.topics.analytics.completionRateTitle", "Tasa de Finalización")}
              value={`${data.summary.avgCompletionRate}%`}
              subtitle={t("instructorAnalytics.avgCourses", "promedio de cursos")}
              icon={<CheckCircle2 className="h-4 w-4" />}
              helpText={t("help.topics.analytics.completionRateDesc")}
            />
          </div>

          {/* Charts Section - Reduced heights */}
          <div className="grid gap-4 lg:grid-cols-2 mb-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Ingresos - Últimos 30 Días
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.revenueTimeSeries}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        className="text-muted-foreground"
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        className="text-muted-foreground"
                        tickFormatter={(value) => `$${value}`}
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, "Ingresos"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Enrollments Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Inscripciones - Últimos 30 Días
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.revenueTimeSeries}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        className="text-muted-foreground"
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        className="text-muted-foreground"
                        tickLine={false}
                        allowDecimals={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        formatter={(value: number) => [value, "Inscripciones"]}
                      />
                      <Bar
                        dataKey="enrollments"
                        fill="hsl(var(--primary))"
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Performance & Recent Purchases - Side by side */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Rendimiento por Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {data.courseAnalytics.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6 text-sm">
                    No tienes cursos aún
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Curso</TableHead>
                        <TableHead className="text-center text-xs">Est.</TableHead>
                        <TableHead className="text-right text-xs">Ingresos</TableHead>
                        <TableHead className="w-[120px] text-xs">Finalización</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.courseAnalytics.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium py-2">
                            <div className="truncate max-w-[200px]" title={course.title}>
                              {course.title}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {course.totalChapters} cap.
                            </p>
                          </TableCell>
                          <TableCell className="text-center py-2">
                            <Badge variant="secondary" className="text-xs">
                              {course.students}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium py-2 text-sm">
                            ${course.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="flex items-center gap-1">
                              <Progress value={course.completionRate} className="flex-1 h-1.5" />
                              <span className="text-xs text-muted-foreground w-8 text-right">
                                {course.completionRate}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Recent Purchases - Compact */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Compras Recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {data.recentPurchases.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6 text-sm">
                    No hay compras aún
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.recentPurchases.slice(0, 5).map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {purchase.studentName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {purchase.course}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <span className="font-medium text-primary text-sm">
                            ${purchase.amount.toFixed(0)}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {purchase.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </>
  );
};

// Summary Card Component
interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
  helpText?: string;
}

const SummaryCard = ({ title, value, subtitle, icon, trend, helpText }: SummaryCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
      <div className="flex items-center gap-1">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {helpText && <HelpTooltip content={helpText} />}
      </div>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent className="pb-4 px-4">
      <div className="text-xl font-bold">{value}</div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        {trend !== undefined && (
          <Badge
            variant="secondary"
            className={`text-xs px-1 py-0 ${
              trend >= 0
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : "bg-red-500/10 text-red-600 border-red-500/20"
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
            )}
            {Math.abs(trend)}%
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

// Loading Skeleton - Updated for compact layout
const AnalyticsSkeleton = () => (
  <>
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-1 pt-4 px-4">
            <Skeleton className="h-3 w-20" />
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <Skeleton className="h-6 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-4 lg:grid-cols-2 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  </>
);

export default InstructorAnalytics;
