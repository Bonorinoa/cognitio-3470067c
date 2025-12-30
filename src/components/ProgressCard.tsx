import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BookOpen, Clock, Award } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: "trending" | "courses" | "time" | "award";
  progress?: number;
}

const iconMap = {
  trending: TrendingUp,
  courses: BookOpen,
  time: Clock,
  award: Award,
};

const ProgressCard = ({ title, value, subtitle, icon, progress }: ProgressCardProps) => {
  const Icon = iconMap[icon];

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-1" />
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
