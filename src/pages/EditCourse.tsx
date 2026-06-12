import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { getErrorMessage } from "@/lib/errorUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CourseMembershipManager from "@/components/CourseMembershipManager";
import { CourseBasicInfoForm } from "@/components/instructor/course-edit/CourseBasicInfoForm";
import { CourseCoverImageCard } from "@/components/instructor/course-edit/CourseCoverImageCard";
import { CourseDangerZone } from "@/components/instructor/course-edit/CourseDangerZone";
import {
  CourseChaptersEditor,
  ChapterDraft,
} from "@/components/instructor/course-edit/CourseChaptersEditor";
import { useCourseImageUpload } from "@/components/instructor/course-edit/useCourseImageUpload";

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  visibility: "public" | "private";
  is_published: boolean;
  image_url: string | null;
  instructor_id: string;
}

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [isPublished, setIsPublished] = useState(false);
  const [chapters, setChapters] = useState<ChapterDraft[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [chaptersToDelete, setChaptersToDelete] = useState<string[]>([]);

  const image = useCourseImageUpload();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course-edit", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as CourseData;
    },
    enabled: !!id,
  });

  const { data: existingChapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ["course-chapters", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("course_id", id)
        .order("position", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description || "");
      setPrice(course.price.toString());
      setCategory(course.category || "");
      setVisibility(course.visibility || "public");
      setIsPublished(course.is_published || false);
      image.setImagePreview(course.image_url || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  useEffect(() => {
    if (existingChapters) {
      setChapters(
        existingChapters.map((ch) => ({
          id: ch.id,
          title: ch.title,
          videoUrl: ch.video_url || "",
          isFreePreview: ch.is_free_preview || false,
          muxPlaybackId: ch.mux_playback_id || undefined,
          muxAssetId: ch.mux_asset_id || undefined,
        }))
      );
    }
  }, [existingChapters]);

  const isOwner = user?.id === course?.instructor_id;

  const addChapter = () => {
    setChapters([
      ...chapters,
      { id: `new-${Date.now()}`, title: "", videoUrl: "", isFreePreview: false, isNew: true },
    ]);
  };

  const removeChapter = (chapterId: string) => {
    if (chapterId.startsWith("new-")) {
      setChapters(chapters.filter((c) => c.id !== chapterId));
    } else {
      setChaptersToDelete([...chaptersToDelete, chapterId]);
      setChapters(chapters.filter((c) => c.id !== chapterId));
    }
  };

  const updateChapter = (chapterId: string, field: keyof ChapterDraft, value: string | boolean) => {
    setChapters(chapters.map((c) => (c.id === chapterId ? { ...c, [field]: value } : c)));
  };

  const handleVideoUploadSuccess = (chapterId: string, playbackId: string, assetId: string) => {
    setChapters(
      chapters.map((c) =>
        c.id === chapterId ? { ...c, muxPlaybackId: playbackId, muxAssetId: assetId } : c
      )
    );
    toast.success("Video uploaded successfully!");
  };

  const handleSave = async () => {
    if (!user || !id || !isOwner) {
      toast.error("You don't have permission to edit this course");
      return;
    }
    if (!title.trim()) {
      toast.error("Course title is required");
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = course?.image_url;
      if (image.imageFile) {
        const uploadedUrl = await image.uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const { error: courseError } = await supabase
        .from("courses")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          price: parseFloat(price) || 0,
          category: category || "Development",
          visibility,
          is_published: isPublished,
          image_url: imageUrl,
        })
        .eq("id", id);
      if (courseError) throw courseError;

      if (chaptersToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("chapters")
          .delete()
          .in("id", chaptersToDelete);
        if (deleteError) throw deleteError;
      }

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        if (chapter.id.startsWith("new-")) {
          const { error: insertError } = await supabase.from("chapters").insert({
            course_id: id,
            title: chapter.title.trim(),
            video_url: chapter.videoUrl.trim() || null,
            mux_playback_id: chapter.muxPlaybackId || null,
            mux_asset_id: chapter.muxAssetId || null,
            is_free_preview: chapter.isFreePreview,
            position: i,
            upload_status: chapter.muxPlaybackId ? "ready" : "pending",
          });
          if (insertError) throw insertError;
        } else {
          const { error: updateError } = await supabase
            .from("chapters")
            .update({
              title: chapter.title.trim(),
              video_url: chapter.videoUrl.trim() || null,
              mux_playback_id: chapter.muxPlaybackId || null,
              mux_asset_id: chapter.muxAssetId || null,
              is_free_preview: chapter.isFreePreview,
              position: i,
            })
            .eq("id", chapter.id);
          if (updateError) throw updateError;
        }
      }

      queryClient.invalidateQueries({ queryKey: ["course-edit", id] });
      queryClient.invalidateQueries({ queryKey: ["course-chapters", id] });
      queryClient.invalidateQueries({ queryKey: ["course", id] });

      toast.success("Course updated successfully!");
      setChaptersToDelete([]);
    } catch (error: unknown) {
      console.error("Error saving course:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !isOwner) return;
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
      toast.success("Course deleted successfully");
      navigate("/instructor/courses");
    } catch (error: unknown) {
      console.error("Error deleting course:", error);
      toast.error(getErrorMessage(error));
    }
  };

  if (courseLoading || chaptersLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">Course not found</h2>
        <p className="text-muted-foreground mb-4">
          This course may have been deleted or you don't have access.
        </p>
        <Button onClick={() => navigate("/instructor/courses")}>Back to Courses</Button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">
          You don't have permission to edit this course.
        </p>
        <Button onClick={() => navigate("/instructor/courses")}>Back to Courses</Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/instructor/courses")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Edit Course</h1>
              <Badge variant={isPublished ? "default" : "secondary"}>
                {isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-muted-foreground">Update your course details and content</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsPublished(!isPublished)} disabled={isSaving}>
            {isPublished ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <CourseBasicInfoForm
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

          <CourseChaptersEditor
            chapters={chapters}
            onAdd={addChapter}
            onRemove={removeChapter}
            onUpdate={updateChapter}
            onVideoUploaded={handleVideoUploadSuccess}
          />
        </div>

        <div className="space-y-6">
          <CourseCoverImageCard
            imagePreview={image.imagePreview}
            isUploadingImage={image.isUploadingImage}
            onImageChange={image.handleImageChange}
          />

          {visibility === "private" && id && <CourseMembershipManager courseId={id} />}

          <CourseDangerZone onDelete={handleDelete} />
        </div>
      </div>
    </>
  );
};

export default EditCourse;
