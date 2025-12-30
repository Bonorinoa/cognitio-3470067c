import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructorSidebar from "@/components/InstructorSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Plus, Trash2, GripVertical, Save, ArrowLeft, Loader2 } from "lucide-react";
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
}

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private" | "unlisted">("public");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", title: "", videoUrl: "", isFreePreview: false },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const addChapter = () => {
    setChapters([
      ...chapters,
      { id: Date.now().toString(), title: "", videoUrl: "", isFreePreview: false },
    ]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      
      setImageFile(file);
      
      // Create preview
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
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeChapter = (id: string) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter((c) => c.id !== id));
    }
  };

  const updateChapter = (id: string, field: keyof Chapter, value: string | boolean) => {
    setChapters(
      chapters.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleVideoUpload = (chapterId: string, playbackId: string, assetId: string) => {
    setChapters(
      chapters.map((c) =>
        c.id === chapterId
          ? { ...c, muxPlaybackId: playbackId, muxAssetId: assetId }
          : c
      )
    );
  };

  const saveCourse = async (publish: boolean) => {
    if (!user) {
      toast.error("You must be logged in to create a course");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a course title");
      return;
    }

    const validChapters = chapters.filter(c => c.title.trim());
    if (validChapters.length === 0) {
      toast.error("Please add at least one chapter with a title");
      return;
    }

    if (publish) {
      setIsPublishing(true);
    } else {
      setIsSaving(true);
    }

    try {
      // Upload image first if provided
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      
      // Insert the course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          price: parseFloat(price) || 0,
          category: category || "Development",
          visibility: visibility,
          instructor_id: user.id,
          teacher_id: user.id, // Keep for backward compatibility during migration
          is_published: publish,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Insert chapters
      const chaptersToInsert = validChapters.map((chapter, index) => ({
        course_id: courseData.id,
        title: chapter.title.trim(),
        video_url: chapter.videoUrl.trim() || null,
        mux_playback_id: chapter.muxPlaybackId || null,
        mux_asset_id: chapter.muxAssetId || null,
        is_free_preview: chapter.isFreePreview,
        position: index,
        upload_status: chapter.muxPlaybackId ? "ready" : "pending",
      }));

      const { error: chaptersError } = await supabase
        .from("chapters")
        .insert(chaptersToInsert);

      if (chaptersError) throw chaptersError;

      toast.success(publish ? "Course published successfully!" : "Course saved as draft!");
      navigate("/instructor");
    } catch (error: any) {
      console.error("Error saving course:", error);
      toast.error(error.message || "Failed to save course");
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  const handleSave = () => saveCourse(false);
  const handlePublish = () => saveCourse(true);

  return (
    <div className="flex min-h-screen bg-background">
      <InstructorSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/instructor")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Course</h1>
              <p className="text-muted-foreground">
                Fill in the details to create your course
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSave} disabled={isSaving || isPublishing || isUploadingImage}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Draft
            </Button>
            <Button onClick={handlePublish} disabled={isSaving || isPublishing || isUploadingImage}>
              {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Course
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
                  Provide the main details about your course
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
                      <SelectItem value="public">
                        <div className="flex flex-col">
                          <span>Public</span>
                          <span className="text-xs text-muted-foreground">Visible in catalog, anyone can purchase</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="unlisted">
                        <div className="flex flex-col">
                          <span>Unlisted</span>
                          <span className="text-xs text-muted-foreground">Only accessible via direct link</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex flex-col">
                          <span>Private</span>
                          <span className="text-xs text-muted-foreground">Only enrolled students can access</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {visibility === "private" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Private courses require manual student enrollment. You can manage enrollments after publishing.
                    </p>
                  )}
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
                      Add and organize your course content
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={addChapter}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Chapter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {chapters.map((chapter, index) => (
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
                        <div className="flex items-center gap-2 ml-auto">
                          <Label
                            htmlFor={`preview-${chapter.id}`}
                            className="text-sm text-muted-foreground"
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
                        currentPlaybackId={chapter.muxPlaybackId}
                        onUploadComplete={(playbackId, assetId) =>
                          handleVideoUpload(chapter.id, playbackId, assetId)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChapter(chapter.id)}
                      disabled={chapters.length === 1}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Image */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Course Image</CardTitle>
                <CardDescription>
                  Upload a thumbnail for your course
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
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block"
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
                    <>
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 2MB
                      </p>
                    </>
                  )}
                </label>
              </CardContent>
            </Card>

            {/* Publishing Status */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium text-foreground">Draft</span>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Your course will be reviewed before it goes live. Make sure all
                  chapters have valid video URLs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateCourse;