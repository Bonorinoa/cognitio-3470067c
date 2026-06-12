import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";

interface UseResourceUploadOpts {
  chapterId: string;
  onUploaded: (info: { title: string; url: string; resourceType: string }) => void;
}

export function useResourceUpload({ chapterId, onUploaded }: UseResourceUploadOpts) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error(t("resources.fileSizeError"));
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${chapterId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("resources").getPublicUrl(fileName);

      let detectedType = "other";
      const ext = fileExt?.toLowerCase() || "";
      if (ext === "pdf") detectedType = "pdf";
      else if (["ipynb", "py", "js", "ts"].includes(ext)) detectedType = "notebook";
      else if (["mp4", "webm", "mov"].includes(ext)) detectedType = "video";

      onUploaded({
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: urlData.publicUrl,
        resourceType: detectedType,
      });

      toast.success(t("resources.fileUploaded"));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return { fileInputRef, isUploading, handleFileUpload };
}
