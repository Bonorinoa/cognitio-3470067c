import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { HelpPopover } from "@/components/ui/help-popover";
import { COURSE_CATEGORIES } from "@/lib/courseCategories";

export type CourseVisibility = "public" | "private" | "unlisted";

interface CreateCourseBasicInfoProps {
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

export function CreateCourseBasicInfo(props: CreateCourseBasicInfoProps) {
  const { t } = useTranslation();
  const {
    title, setTitle, description, setDescription, price, setPrice,
    category, setCategory, visibility, setVisibility,
  } = props;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{t("createCourse.basicInfo")}</CardTitle>
        <CardDescription>{t("createCourse.basicInfoDesc")}</CardDescription>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="price">{t("createCourse.price")}</Label>
              <HelpPopover title={t("help.courseCreation.priceTitle")}>
                <p>{t("help.courseCreation.priceDesc")}</p>
              </HelpPopover>
            </div>
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
          <div className="flex items-center gap-2">
            <Label>{t("createCourse.visibility")}</Label>
            <HelpPopover title={t("help.courseCreation.visibilityTitle")}>
              <p className="mb-2">{t("help.courseCreation.visibilityIntro")}</p>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>{t("createCourse.public")}:</strong>{" "}
                  {t("help.courseCreation.visibilityPublic")}
                </li>
                <li>
                  <strong>{t("createCourse.private")}:</strong>{" "}
                  {t("help.courseCreation.visibilityPrivate")}
                </li>
              </ul>
            </HelpPopover>
          </div>
          <Select
            value={visibility}
            onValueChange={(value: CourseVisibility) => setVisibility(value)}
          >
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
