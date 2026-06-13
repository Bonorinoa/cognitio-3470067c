import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { COURSE_CATEGORIES } from "@/lib/courseCategories";
import type { CourseVisibility } from "@/components/instructor/course-create/CreateCourseBasicInfo";

interface CourseBasicInfoFormProps {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  visibility: CourseVisibility;
  setVisibility: (v: CourseVisibility) => void;
}

export function CourseBasicInfoForm(props: CourseBasicInfoFormProps) {
  const { t } = useTranslation();
  const {
    title, setTitle, description, setDescription, price, setPrice,
    category, setCategory, visibility, setVisibility,
  } = props;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{t("createCourse.basicInfo")}</CardTitle>
        <CardDescription>{t("createCourse.editSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t("createCourse.courseTitle")}</Label>
          <Input
            id="title"
            placeholder={t("createCourse.courseTitlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t("createCourse.description")}</Label>
          <Textarea
            id="description"
            placeholder={t("createCourse.descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] bg-background border-border"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">{t("createCourse.price")}</Label>
            <Input
              id="price"
              type="number"
              placeholder="99.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("createCourse.category")}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder={t("createCourse.selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {COURSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.dbValue}>
                    {t(cat.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>{t("createCourse.visibility")}</Label>
          <Select value={visibility} onValueChange={(value: CourseVisibility) => setVisibility(value)}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder={t("createCourse.selectVisibility")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex flex-col">
                  <span>{t("createCourse.public")}</span>
                  <span className="text-xs text-muted-foreground">{t("createCourse.publicDesc")}</span>
                </div>
              </SelectItem>
              <SelectItem value="unlisted">
                <div className="flex flex-col">
                  <span>{t("createCourse.unlisted", "No listado")}</span>
                  <span className="text-xs text-muted-foreground">{t("createCourse.unlistedDesc", "Accesible solo con el enlace directo")}</span>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex flex-col">
                  <span>{t("createCourse.private")}</span>
                  <span className="text-xs text-muted-foreground">{t("createCourse.privateDesc")}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {visibility === "private" && (
            <p className="text-xs text-muted-foreground mt-1">{t("createCourse.privateNote")}</p>
          )}
          {visibility === "unlisted" && (
            <p className="text-xs text-muted-foreground mt-1">{t("createCourse.unlistedNote", "El curso no aparecerá en el catálogo, pero cualquiera con el enlace podrá acceder.")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
