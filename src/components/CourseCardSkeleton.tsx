import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl border-border bg-card">
      {/* Image skeleton */}
      <Skeleton className="aspect-video w-full" />
      
      {/* Content skeleton */}
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Description line 1 */}
        <Skeleton className="h-4 w-full" />
        {/* Description line 2 */}
        <Skeleton className="h-4 w-2/3" />
        {/* Metadata (chapters, duration) */}
        <div className="flex items-center gap-4 pt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
      
      {/* Footer skeleton */}
      <CardFooter className="border-t border-border p-4">
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}
