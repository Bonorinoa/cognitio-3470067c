import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  fullName?: string | null;
  onAvatarChange: (url: string | null) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const COMPRESSION_THRESHOLD = 2 * 1024 * 1024; // 2MB
const MAX_DIMENSION = 1200;
const COMPRESSION_QUALITY = 0.8;

// Compress and crop image to square using Canvas API
const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      
      // Calculate square crop (center-weighted)
      const size = Math.min(width, height);
      const cropX = (width - size) / 2;
      const cropY = (height - size) / 2;
      
      // Determine output size (max MAX_DIMENSION, but square)
      const outputSize = Math.min(size, MAX_DIMENSION);
      
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      // Draw cropped square image
      ctx.drawImage(
        img,
        cropX, cropY, size, size, // Source: center square crop
        0, 0, outputSize, outputSize // Dest: fill canvas
      );
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        "image/jpeg",
        COMPRESSION_QUALITY
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

const AvatarUpload = ({ userId, currentAvatarUrl, fullName, onAvatarChange }: AvatarUploadProps) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: t("instructorSettings.invalidFileType"),
        description: t("instructorSettings.invalidFileTypeDesc"),
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: t("instructorSettings.fileTooLarge"),
        description: t("instructorSettings.fileTooLargeDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      let fileToUpload: Blob | File = file;
      let fileExt = file.name.split(".").pop();
      
      // Compress if larger than threshold
      if (file.size > COMPRESSION_THRESHOLD) {
        fileToUpload = await compressImage(file);
        fileExt = "jpg"; // Compressed images are always JPEG
      }
      
      const fileName = `${userId}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, fileToUpload, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Add cache buster to URL
      const urlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlWithCacheBuster })
        .eq("id", userId);

      if (updateError) throw updateError;

      onAvatarChange(urlWithCacheBuster);
      
      toast({
        title: t("instructorSettings.avatarUpdated"),
        description: t("instructorSettings.avatarUpdatedDesc"),
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: t("instructorSettings.avatarError"),
        description: t("instructorSettings.avatarErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setIsRemoving(true);

    try {
      // List files in user's avatar folder
      const { data: files, error: listError } = await supabase.storage
        .from("avatars")
        .list(userId);

      if (listError) throw listError;

      // Delete all files in the folder
      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${userId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove(filePaths);

        if (deleteError) throw deleteError;
      }

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", userId);

      if (updateError) throw updateError;

      onAvatarChange(null);
      
      toast({
        title: t("instructorSettings.avatarRemoved"),
        description: t("instructorSettings.avatarRemovedDesc"),
      });
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast({
        title: t("instructorSettings.avatarError"),
        description: t("instructorSettings.avatarRemoveErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={currentAvatarUrl || undefined} alt={fullName || "Avatar"} />
          <AvatarFallback className="text-xl bg-muted">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isRemoving}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">
          {t("instructorSettings.avatarUploadHint")}
        </p>
        {currentAvatarUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={isRemoving || isUploading}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {t("instructorSettings.removePhoto")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
