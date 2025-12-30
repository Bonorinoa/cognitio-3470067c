import { useInstructorAnalytics, exportAnalyticsCSV } from "@/hooks/useInstructorAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  const { data, isLoading, error } = useInstructorAnalytics();

  const handleExport = () => {
    if (data) {
      exportAnalyticsCSV(data);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error al cargar analytics</p>
      </div>
    );
  }

  return (
    <>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              Monitorea el rendimiento de tus cursos en tiempo real
            </p>
          </div>
          <Button onClick={handleExport} disabled={!data || isLoading} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        {isLoading ? (
          <AnalyticsSkeleton />
        ) : data ? (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <SummaryCard
                title="Ingresos Totales"
                value={`$${data.summary.totalRevenue.toLocaleString()}`}
                subtitle={`$${data.summary.revenueThisMonth.toLocaleString()} este mes`}
                icon={<DollarSign className="h-4 w-4" />}
                trend={data.summary.revenueGrowth}
              />
              <SummaryCard
                title="Total Estudiantes"
                value={data.summary.totalStudents.toLocaleString()}
                subtitle={`${data.summary.studentsThisMonth} nuevos este mes`}
                icon={<Users className="h-4 w-4" />}
                trend={data.summary.studentGrowth}
              />
              <SummaryCard
                title="Cursos Publicados"
                value={data.summary.publishedCourses.toString()}
                subtitle={`de ${data.summary.totalCourses} total`}
                icon={<BookOpen className="h-4 w-4" />}
              />
              <SummaryCard
                title="Tasa de Finalización"
                value={`${data.summary.avgCompletionRate}%`}
                subtitle="promedio de todos los cursos"
                icon={<CheckCircle2 className="h-4 w-4" />}
              />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Ingresos - Últimos 30 Días
                  </CardTitle>
                  <CardDescription>
                    Tendencia de ingresos diarios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.revenueTimeSeries}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          className="text-muted-foreground"
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          className="text-muted-foreground"
                          tickFormatter={(value) => `$${value}`}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
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
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Enrollments Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Inscripciones - Últimos 30 Días
                  </CardTitle>
                  <CardDescription>
                    Nuevas inscripciones diarias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.revenueTimeSeries}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          className="text-muted-foreground"
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          className="text-muted-foreground"
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "hsl(var(--foreground))" }}
                          formatter={(value: number) => [value, "Inscripciones"]}
                        />
                        <Bar
                          dataKey="enrollments"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Performance Table */}
            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Rendimiento por Curso
                  </CardTitle>
                  <CardDescription>
                    Métricas detalladas de cada curso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.courseAnalytics.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No tienes cursos aún
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Curso</TableHead>
                          <TableHead className="text-center">Estudiantes</TableHead>
                          <TableHead className="text-right">Ingresos</TableHead>
                          <TableHead className="w-[150px]">Finalización</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.courseAnalytics.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">
                              <div>
                                {course.title}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {course.totalChapters} capítulos
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">
                                {course.students}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${course.revenue.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={course.completionRate} className="flex-1" />
                                <span className="text-sm text-muted-foreground w-10 text-right">
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

              {/* Recent Purchases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Compras Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recentPurchases.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No hay compras aún
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {data.recentPurchases.slice(0, 5).map((purchase) => (
                        <div
                          key={purchase.id}
                          className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">
                              {purchase.studentName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {purchase.course}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {purchase.date}
                            </p>
                          </div>
                          <span className="font-medium text-primary ml-4">
                            ${purchase.amount.toFixed(2)}
                          </span>
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
}

const SummaryCard = ({ title, value, subtitle, icon, trend }: SummaryCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        {trend !== undefined && (
          <Badge
            variant="secondary"
            className={
              trend >= 0
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : "bg-red-500/10 text-red-600 border-red-500/20"
            }
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

// Loading Skeleton
const AnalyticsSkeleton = () => (
  <>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-2 mb-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  </>
);

export default InstructorAnalytics;
