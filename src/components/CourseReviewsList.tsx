import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseRating } from "@/hooks/useCourseRating";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface CourseReviewsListProps {
  courseId: string;
  averageRating?: number | null;
  ratingCount?: number | null;
}

export default function CourseReviewsList({ 
  courseId, 
  averageRating, 
  ratingCount 
}: CourseReviewsListProps) {
  const { t } = useTranslation();
  const { allReviews, isLoadingReviews } = useCourseRating(courseId);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
          star <= rating
            ? "text-primary fill-primary"
            : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );

  if (isLoadingReviews) {
    return (
      <Card className="border-border">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("reviews.title")}</CardTitle>
          {averageRating && ratingCount && ratingCount > 0 && (
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-sm font-medium">
                {averageRating.toFixed(1)} ({ratingCount})
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {allReviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("reviews.noReviews")}
          </p>
        ) : (
          <div className="space-y-4">
            {allReviews.map((review) => (
              <div key={review.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.profiles?.avatar_url || undefined} />
                  <AvatarFallback>
                    {review.profiles?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {review.profiles?.full_name || t("reviews.anonymous")}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="mb-2">
                    {renderStars(review.rating)}
                  </div>
                  {review.review && (
                    <p className="text-sm text-muted-foreground">{review.review}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
