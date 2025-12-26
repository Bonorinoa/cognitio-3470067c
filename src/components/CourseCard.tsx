import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, PlayCircle } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  chaptersCount: number;
  progress?: number;
  category?: string;
  totalDurationSeconds?: number;
}

const CourseCard = ({
  id,
  title,
  description,
  image,
  price,
  chaptersCount,
  progress,
  category = "Development",
  totalDurationSeconds = 0,
}: CourseCardProps) => {
  const formatTotalDuration = (seconds: number) => {
    if (seconds === 0) return null;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const durationDisplay = formatTotalDuration(totalDurationSeconds);
  return (
    <Link to={`/course/${id}`}>
      <Card className="group overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
            {category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {chaptersCount} chapters
            </span>
            {durationDisplay && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {durationDisplay}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t border-border p-4">
          <div className="flex w-full items-center justify-between">
            {progress !== undefined ? (
              <span className="text-sm text-accent">{progress}% complete</span>
            ) : (
              <span className="text-lg font-bold text-foreground">
                ${price.toFixed(2)}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-primary">
              <PlayCircle className="h-4 w-4" />
              {progress !== undefined ? "Continuar" : "Inscribirse"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
