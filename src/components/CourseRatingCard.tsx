import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseRating } from "@/hooks/useCourseRating";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CourseRatingCardProps {
  courseId: string;
  hasAccess: boolean;
}

export default function CourseRatingCard({ courseId, hasAccess }: CourseRatingCardProps) {
  const { t } = useTranslation();
  const { userRating, submitRating, deleteRating } = useCourseRating(courseId);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(userRating?.rating || 0);
  const [review, setReview] = useState(userRating?.review || "");
  const [isEditing, setIsEditing] = useState(!userRating);

  // Update local state when userRating changes
  useState(() => {
    if (userRating) {
      setSelectedRating(userRating.rating);
      setReview(userRating.review || "");
      setIsEditing(false);
    }
  });

  if (!hasAccess) return null;

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast({
        title: t("rating.selectRating"),
        variant: "destructive",
      });
      return;
    }

    try {
      await submitRating.mutateAsync({ rating: selectedRating, review });
      toast({ title: t("rating.submitted") });
      setIsEditing(false);
    } catch {
      toast({
        title: t("rating.errorSubmit"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRating.mutateAsync();
      setSelectedRating(0);
      setReview("");
      setIsEditing(true);
      toast({ title: t("rating.deleted") });
    } catch {
      toast({
        title: t("rating.errorDelete"),
        variant: "destructive",
      });
    }
  };

  const displayRating = hoveredStar ?? selectedRating;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t("rating.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  onClick={() => setSelectedRating(star)}
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      star <= displayRating
                        ? "text-accent-foreground fill-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
              {selectedRating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {selectedRating}/5
                </span>
              )}
            </div>

            <Textarea
              placeholder={t("rating.reviewPlaceholder")}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
            />

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={submitRating.isPending || selectedRating === 0}
              >
                {submitRating.isPending ? t("rating.submitting") : t("rating.submit")}
              </Button>
              {userRating && (
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  {t("rating.cancel")}
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    star <= selectedRating
                      ? "text-accent-foreground fill-accent-foreground"
                      : "text-muted-foreground"
                  )}
                />
              ))}
              <span className="ml-2 text-sm font-medium">{selectedRating}/5</span>
            </div>

            {review && (
              <p className="text-sm text-muted-foreground">{review}</p>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                {t("rating.edit")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={deleteRating.isPending}
              >
                {t("rating.delete")}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
