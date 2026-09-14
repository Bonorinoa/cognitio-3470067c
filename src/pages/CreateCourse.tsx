import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errorUtils";
import { useAuth } from "@/contexts/AuthContext";
import { CreateCourseBasicInfo, type CourseVisibility } from "@/components/instructor/course-create/CreateCourseBasicInfo";
import {
  CreateCourseChaptersList,
  NewChapter,
} from "@/components/instructor/course-create/CreateCourseChaptersList";
import { CreateCourseImageCard } from "@/components/instructor/course-create/CreateCourseImageCard";
import { useCourseImageUpload } from "@/components/instructor/course-edit/useCourseImageUpload";

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState<CourseVisibility>("public");
  const [chapters, setChapters] = useState<NewChapter[]>([
    { id: "1", title: "", videoUrl: "", isFreePreview: false },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const image = useCourseImageUpload();

  const addChapter = () =>
    setChapters([
      ...chapters,
      { id: Date.now().toString(), title: "", videoUrl: "", isFreePreview: false },
    ]);

  const removeChapter = (id: string) => {
    if (chapters.length > 1) setChapters(chapters.filter((c) => c.id !== id));
  };

  const updateChapter = (id: string, field: keyof NewChapter, value: string | boolean) =>
    setChapters(chapters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const handleVideoUpload = (
    chapterId: string,
    playbackId: string,
    assetId: string,
    language?: "es" | "en"
  ) =>
    setChapters(
      chapters.map((c) =>
        c.id === chapterId
          ? { ...c, muxPlaybackId: playbackId, muxAssetId: assetId, language: language ?? "es" }
          : c
      )
    );

  const saveCourse = async (publish: boolean) => {
    if (!user) {
      toast.error(t("createCourse.errorMustLogin"));
      return;
    }
    if (!title.trim()) {
      toast.error(t("createCourse.errorTitle"));
      return;
    }
    const validChapters = chapters.filter((c) => c.title.trim());
    if (validChapters.length === 0) {
      toast.error(t("createCourse.errorChapter"));
      return;
    }

    publish ? setIsPublishing(true) : setIsSaving(true);

    try {
      let imageUrl: string | null = null;
      if (image.imageFile) imageUrl = await image.uploadImage();

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          price: parseFloat(price) || 0,
          category: category || "Development",
          visibility,
          instructor_id: user.id,
          teacher_id: user.id,
          is_published: publish,
          image_url: imageUrl,
        })
        .select()
        .single();
      if (courseError) throw courseError;

      const chaptersToInsert = validChapters.map((chapter, index) => ({
        course_id: courseData.id,
        title: chapter.title.trim(),
        video_url: chapter.videoUrl.trim() || null,
        mux_playback_id: chapter.muxPlaybackId || null,
        mux_asset_id: chapter.muxAssetId || null,
        is_free_preview: chapter.isFreePreview,
        position: index,
        transcript_language: chapter.language ?? "es",
        upload_status: chapter.muxPlaybackId ? "ready" : "pending",
      }));

      const { error: chaptersError } = await supabase.from("chapters").insert(chaptersToInsert);
      if (chaptersError) throw chaptersError;

      toast.success(publish ? t("createCourse.successPublish") : t("createCourse.successDraft"));
      navigate("/instructor");
    } catch (error: unknown) {
      console.error("Error saving course:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/instructor")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("createCourse.back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("createCourse.title")}</h1>
            <p className="text-muted-foreground">{t("createCourse.subtitle")}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => saveCourse(false)}
            disabled={isSaving || isPublishing || image.isUploadingImage}
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t("createCourse.saveDraft")}
          </Button>
          <Button
            onClick={() => saveCourse(true)}
            disabled={isSaving || isPublishing || image.isUploadingImage}
          >
            {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("createCourse.publish")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreateCourseBasicInfo
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            category={category}
            setCategory={setCategory}
            visibility={visibility}
            setVisibility={setVisibility}
          />

          <CreateCourseChaptersList
            chapters={chapters}
            onAdd={addChapter}
            onRemove={removeChapter}
            onUpdate={updateChapter}
            onVideoUploaded={handleVideoUpload}
          />
        </div>

        <div className="space-y-6">
          <CreateCourseImageCard
            imagePreview={image.imagePreview}
            onImageChange={image.handleImageChange}
          />

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                {t("createCourse.publishingTips")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">• {t("createCourse.tip1")}</p>
              <p className="text-sm text-muted-foreground">• {t("createCourse.tip2")}</p>
              <p className="text-sm text-muted-foreground">• {t("createCourse.tip3")}</p>
              <p className="text-sm text-muted-foreground">• {t("createCourse.tip4")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;
