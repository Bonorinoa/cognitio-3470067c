import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Loader2, Eye, EyeOff, Upload, ImageIcon, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { getErrorMessage } from "@/lib/errorUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CourseMembershipManager from "@/components/CourseMembershipManager";
import { COURSE_CATEGORIES } from "@/lib/courseCategories";

// Lazy load heavy video upload component
const VideoUpload = lazy(() => import("@/components/VideoUpload"));
import ChapterResourceManager from "@/components/ChapterResourceManager";

const VideoUploadFallback = () => (
  <div className="h-10 w-full bg-muted rounded animate-pulse" />
);

interface Chapter {
  id: string;
  title: string;
  videoUrl: string;
  isFreePreview: boolean;
  muxPlaybackId?: string;
  muxAssetId?: string;
  isNew?: boolean;
}

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
  const { t } = useTranslation();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [isPublished, setIsPublished] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [chaptersToDelete, setChaptersToDelete] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch course data
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

  // Fetch chapters
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

  // Populate form when data loads
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description || "");
      setPrice(course.price.toString());
      setCategory(course.category || "");
      setVisibility(course.visibility || "public");
      setIsPublished(course.is_published || false);
      setImagePreview(course.image_url || "");
    }
  }, [course]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;
    
    setIsUploadingImage(true);
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      toast.error(getErrorMessage(error));
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

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

  // Check ownership
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

  const updateChapter = (
    chapterId: string,
    field: keyof Chapter,
    value: string | boolean
  ) => {
    setChapters(
      chapters.map((c) =>
        c.id === chapterId ? { ...c, [field]: value } : c
      )
    );
  };

  const handleVideoUploadSuccess = (
    chapterId: string,
    playbackId: string,
    assetId: string
  ) => {
    setChapters(
      chapters.map((c) =>
        c.id === chapterId
          ? { ...c, muxPlaybackId: playbackId, muxAssetId: assetId }
          : c
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
      // Upload new image if provided
      let imageUrl = course?.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Update course details
      const { error: courseError } = await supabase
        .from("courses")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          price: parseFloat(price) || 0,
          category: category || "Development",
          visibility: visibility,
          is_published: isPublished,
          image_url: imageUrl,
        })
        .eq("id", id);

      if (courseError) throw courseError;

      // Delete removed chapters
      if (chaptersToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("chapters")
          .delete()
          .in("id", chaptersToDelete);
        
        if (deleteError) throw deleteError;
      }

      // Update existing chapters and insert new ones
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        
        if (chapter.id.startsWith("new-")) {
          // Insert new chapter
          const { error: insertError } = await supabase
            .from("chapters")
            .insert({
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
          // Update existing chapter
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

      // Invalidate queries
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
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Course deleted successfully");
      navigate("/instructor/courses");
    } catch (error: unknown) {
      console.error("Error deleting course:", error);
      toast.error(getErrorMessage(error));
    }
  };

  const togglePublish = async () => {
    setIsPublished(!isPublished);
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
        <p className="text-muted-foreground mb-4">This course may have been deleted or you don't have access.</p>
        <Button onClick={() => navigate("/instructor/courses")}>
          Back to Courses
        </Button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You don't have permission to edit this course.</p>
        <Button onClick={() => navigate("/instructor/courses")}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/instructor/courses")}
            >
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
              <p className="text-muted-foreground">
                Update your course details and content
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={togglePublish}
              disabled={isSaving}
            >
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
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {/* Basic Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Basic Information</CardTitle>
                <CardDescription>
                  Update the main details about your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Complete Web Development Bootcamp"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] bg-background border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
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
                  <Label>Course Visibility</Label>
                  <Select value={visibility} onValueChange={(value: "public" | "private") => setVisibility(value)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible in catalog</SelectItem>
                      <SelectItem value="private">Private - Enrolled students only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Chapters */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <CardTitle className="text-foreground">Course Chapters</CardTitle>
                      <CardDescription>
                        Manage your course content
                      </CardDescription>
                    </div>
                    <HelpTooltip content={t("help.courseEditing.chaptersDesc")} />
                  </div>
                  <Button variant="outline" size="sm" onClick={addChapter}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Chapter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {chapters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No chapters yet. Add your first chapter above.
                  </div>
                ) : (
                  chapters.map((chapter, index) => (
                    <div
                      key={chapter.id}
                      className="flex gap-3 p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-center">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <HelpTooltip content={t("help.courseEditing.reorderDesc")} side="right" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            Chapter {index + 1}
                          </span>
                          {chapter.isNew && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                          <div className="flex items-center gap-2 ml-auto">
                            <Label
                              htmlFor={`preview-${chapter.id}`}
                              className="text-xs text-muted-foreground"
                            >
                              Free Preview
                            </Label>
                            <HelpTooltip content={t("help.courseEditing.freePreviewDesc")} />
                            <Switch
                              id={`preview-${chapter.id}`}
                              checked={chapter.isFreePreview}
                              onCheckedChange={(checked) =>
                                updateChapter(chapter.id, "isFreePreview", checked)
                              }
                            />
                          </div>
                        </div>
                        <Input
                          placeholder="Chapter title"
                          value={chapter.title}
                          onChange={(e) =>
                            updateChapter(chapter.id, "title", e.target.value)
                          }
                          className="bg-background border-border"
                        />
                        <Suspense fallback={<VideoUploadFallback />}>
                          <VideoUpload
                            chapterId={chapter.id}
                            onUploadComplete={(playbackId, assetId) =>
                              handleVideoUploadSuccess(chapter.id, playbackId, assetId)
                            }
                            currentPlaybackId={chapter.muxPlaybackId}
                          />
                        </Suspense>
                        <ChapterResourceManager 
                          chapterId={chapter.id}
                          chapterTitle={chapter.title || `Chapter ${index + 1}`}
                          isNewChapter={chapter.isNew}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeChapter(chapter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Cover Image */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Cover Image</CardTitle>
                <CardDescription>
                  Update your course thumbnail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  id="course-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="course-image"
                  className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer block"
                >
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img 
                        src={imagePreview} 
                        alt="Course preview" 
                        className="mx-auto h-32 w-auto rounded-lg object-cover"
                      />
                      <p className="text-sm text-muted-foreground">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload image
                      </p>
                    </div>
                  )}
                </label>
                {isUploadingImage && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    <Loader2 className="inline h-4 w-4 animate-spin mr-1" />
                    Uploading...
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Student Enrollment - only for private courses */}
            {visibility === "private" && id && (
              <CourseMembershipManager courseId={id} />
            )}

            {/* Danger Zone */}
            <Card className="border-destructive/50 bg-card">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions for this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Course
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        course and all associated chapters, student progress, and enrollments.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete Course
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
    </>
  );
};

export default EditCourse;
