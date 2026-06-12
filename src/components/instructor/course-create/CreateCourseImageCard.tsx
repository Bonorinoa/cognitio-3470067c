import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface CreateCourseImageCardProps {
  imagePreview: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CreateCourseImageCard({ imagePreview, onImageChange }: CreateCourseImageCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{t("createCourse.courseImage")}</CardTitle>
        <CardDescription>{t("createCourse.courseImageDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          id="course-image"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
        <label
          htmlFor="course-image"
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block"
        >
          {imagePreview ? (
            <div className="space-y-3">
              <img
                src={imagePreview}
                alt="Course preview"
                className="mx-auto h-32 w-auto rounded-lg object-cover"
              />
              <p className="text-sm text-muted-foreground">{t("createCourse.clickToChange")}</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-1">{t("createCourse.uploadImage")}</p>
              <p className="text-xs text-muted-foreground">{t("createCourse.uploadImageHint")}</p>
            </>
          )}
        </label>
      </CardContent>
    </Card>
  );
}
