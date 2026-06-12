import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { useAuth } from "@/contexts/AuthContext";

export function useCourseImageUpload(initialPreview = "") {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialPreview);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;
    setIsUploadingImage(true);
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("course-images")
        .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("course-images").getPublicUrl(filePath);
      return publicUrl;
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      toast.error(getErrorMessage(error));
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  return {
    imageFile,
    imagePreview,
    setImagePreview,
    isUploadingImage,
    handleImageChange,
    uploadImage,
  };
}
