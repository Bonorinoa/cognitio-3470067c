import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Star, Check, ShoppingCart, Loader2, LogIn, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import CourseRatingCard from "@/components/CourseRatingCard";
import CourseReviewsList from "@/components/CourseReviewsList";
import { getCategoryLabelFromDb } from "@/lib/courseCategories";

interface Chapter {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  isCompleted?: boolean;
}

interface CourseOverviewProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    price: number;
    category: string | null;
    instructor_id: string;
    average_rating?: number | null;
    rating_count?: number | null;
    instructor?: {
      full_name: string | null;
      email: string | null;
    };
  };
  chapters: Chapter[];
  totalDuration: string;
  isOwner: boolean;
  hasPurchased: boolean;
  isVerifyingAccess: boolean;
  isCheckoutLoading: boolean;
  authLoading: boolean;
  user: { id: string } | null;
  onPurchase: () => void;
  onStartLearning: () => void;
  onSelectChapter: (chapterId: string) => void;
  navigateToAuth: () => void;
}

const CourseOverview = ({
  course,
  chapters,
  totalDuration,
  isOwner,
  hasPurchased,
  isVerifyingAccess,
  isCheckoutLoading,
  authLoading,
  user,
  onPurchase,
  onStartLearning,
  onSelectChapter,
  navigateToAuth,
}: CourseOverviewProps) => {
  const { t } = useTranslation();

  const features = [
    t("coursePage.featureChapters", { count: chapters.length }),
    t("coursePage.featureLifetime"),
    t("coursePage.featureCertificate"),
    t("coursePage.featureMobile"),
  ];

  const hasAccess = hasPurchased || isOwner;
  const allChaptersCompleted = chapters.length > 0 && chapters.every(ch => ch.isCompleted);
  const canRate = hasPurchased && allChaptersCompleted;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
            <img
              src={course.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            {hasAccess && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={onStartLearning}
                  className="gap-2"
                >
                  <Play className="h-5 w-5" />
                  {t("coursePage.startLearning")}
                </Button>
              </div>
            )}
          </div>

          {/* Course Title and Meta */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              {course.average_rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  {course.average_rating}
                  {course.rating_count && course.rating_count > 0 && (
                    <span className="text-muted-foreground">({course.rating_count})</span>
                  )}
                </span>
              )}
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {chapters.length} {t("coursePage.chapters")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {totalDuration}
              </span>
              {course.category && (
                <Badge variant="secondary">{getCategoryLabelFromDb(t, course.category)}</Badge>
              )}
            </div>
            <Link
              to={`/instructor/profile/${course.instructor_id}`}
              className="inline-flex items-center gap-2 hover:text-primary transition-colors"
            >
              <span className="text-muted-foreground">{t("coursePage.by")}</span>
              <span className="font-medium text-foreground hover:underline">
                {course.instructor?.full_name || course.instructor?.email || t("coursePage.instructor")}
              </span>
            </Link>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              {t("coursePage.aboutCourse")}
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {course.description || t("coursePage.noDescription")}
            </p>
          </div>

          {/* Curriculum */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              {t("coursePage.curriculum")}
            </h2>
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => hasAccess || chapter.isPreview ? onSelectChapter(chapter.id) : undefined}
                  disabled={!hasAccess && !chapter.isPreview}
                  className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all
                    ${hasAccess || chapter.isPreview
                      ? "border-border bg-card hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
                      : "border-border bg-muted/30 cursor-not-allowed opacity-60"
                    }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                    {chapter.isCompleted ? (
                      <Check className="h-4 w-4 text-accent-foreground" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-foreground">
                      {chapter.title}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{chapter.duration}</span>
                      {chapter.isPreview && !hasAccess && (
                        <Badge variant="secondary" className="text-xs">
                          {t("coursePage.freePreview")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {(hasAccess || chapter.isPreview) && (
                    <Play className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Card - shown to enrolled students who completed the course */}
          {canRate && (
            <CourseRatingCard courseId={course.id} hasAccess={canRate} />
          )}

          {/* Reviews List - shown to everyone */}
          <CourseReviewsList 
            courseId={course.id} 
            averageRating={course.average_rating}
            ratingCount={course.rating_count}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 border-border bg-card">
            <CardContent className="p-6">
              {isOwner ? (
                <Badge className="w-full justify-center py-2 mb-6 bg-primary/20 text-primary border-primary/30">
                  <Check className="mr-2 h-4 w-4" />
                  {t("coursePage.yourCourse")}
                </Badge>
              ) : hasPurchased ? (
                <>
                  <Badge className="w-full justify-center py-2 mb-6 bg-accent/20 text-accent-foreground border-accent/30">
                    <Check className="mr-2 h-4 w-4" />
                    {t("coursePage.hasAccess")}
                  </Badge>
                  <Button
                    size="lg"
                    className="w-full mb-4"
                    onClick={onStartLearning}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    {t("coursePage.startLearning")}
                  </Button>
                  <Separator className="mb-6" />
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      ${course.price}
                    </span>
                  </div>
                  {isVerifyingAccess ? (
                    <Button size="lg" className="w-full mb-4" disabled>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("coursePage.verifyingAccess")}
                    </Button>
                  ) : !user && !authLoading ? (
                    <>
                      <Button
                        size="lg"
                        className="w-full mb-4"
                        onClick={navigateToAuth}
                      >
                        <LogIn className="mr-2 h-5 w-5" />
                        {t("coursePage.signInToPurchase")}
                      </Button>
                      <p className="text-sm text-muted-foreground text-center mb-6">
                        {t("coursePage.signInHint")}
                      </p>
                    </>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        className="w-full mb-4"
                        onClick={onPurchase}
                        disabled={isCheckoutLoading}
                      >
                        {isCheckoutLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t("coursePage.processing")}
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {t("coursePage.purchaseCourse")}
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground text-center mb-6">
                        {t("coursePage.moneyBack")}
                      </p>
                    </>
                  )}
                  <Separator className="mb-6" />
                </>
              )}

              <h3 className="font-semibold text-foreground mb-4">
                {t("coursePage.includes")}
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 text-accent-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
