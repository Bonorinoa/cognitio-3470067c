import { useState, useEffect } from "react";
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
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import VideoUpload from "@/components/VideoUpload";

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
  visibility: "public" | "private" | "unlisted";
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
  const [visibility, setVisibility] = useState<"public" | "private" | "unlisted">("public");
  const [isPublished, setIsPublished] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [chaptersToDelete, setChaptersToDelete] = useState<string[]>([]);

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
    }
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
    } catch (error: any) {
      console.error("Error saving course:", error);
      toast.error(error.message || "Failed to save course");
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
    } catch (error: any) {
      console.error("Error deleting course:", error);
      toast.error(error.message || "Failed to delete course");
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
          <div className="lg:col-span-2 space-y-6">
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
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="AI & ML">AI & ML</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Course Visibility</Label>
                  <Select value={visibility} onValueChange={(value: "public" | "private" | "unlisted") => setVisibility(value)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible in catalog</SelectItem>
                      <SelectItem value="unlisted">Unlisted - Direct link only</SelectItem>
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
                  <div>
                    <CardTitle className="text-foreground">Course Chapters</CardTitle>
                    <CardDescription>
                      Manage your course content
                    </CardDescription>
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
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      </div>
                      <div className="flex-1 space-y-3">
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
                        <VideoUpload
                          chapterId={chapter.id}
                          onUploadComplete={(playbackId, assetId) =>
                            handleVideoUploadSuccess(chapter.id, playbackId, assetId)
                          }
                          currentPlaybackId={chapter.muxPlaybackId}
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
