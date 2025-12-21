import { useState, useRef } from "react";
import { Upload, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  chapterId?: string;
  onUploadComplete: (playbackId: string, assetId: string) => void;
  currentPlaybackId?: string;
}

type UploadStatus = "idle" | "uploading" | "processing" | "ready" | "error";

const VideoUpload = ({ chapterId, onUploadComplete, currentPlaybackId }: VideoUploadProps) => {
  const [status, setStatus] = useState<UploadStatus>(currentPlaybackId ? "ready" : "idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    setStatus("uploading");
    setProgress(0);
    setErrorMessage(null);

    try {
      // Step 1: Get direct upload URL from Mux
      const { data: uploadData, error: uploadError } = await supabase.functions.invoke("mux-upload", {
        body: { action: "create-upload" },
      });

      if (uploadError || !uploadData?.uploadUrl) {
        throw new Error(uploadError?.message || "Failed to create upload URL");
      }

      const { uploadUrl, uploadId } = uploadData;

      // Step 2: Upload file directly to Mux
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("PUT", uploadUrl);
        xhr.send(file);
      });

      setStatus("processing");
      setProgress(100);

      // Step 3: Poll for asset ready status
      let assetId: string | null = null;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      while (!assetId && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        
        const { data: checkData, error: checkError } = await supabase.functions.invoke("mux-upload", {
          body: { action: "check-upload", uploadId },
        });

        if (checkError) {
          console.error("Check upload error:", checkError);
          attempts++;
          continue;
        }

        if (checkData?.assetId) {
          assetId = checkData.assetId;
        }
        attempts++;
      }

      if (!assetId) {
        throw new Error("Timed out waiting for video processing");
      }

      // Step 4: Get asset details (playback ID)
      let playbackId: string | null = null;
      attempts = 0;

      while (!playbackId && attempts < 30) {
        const { data: assetData, error: assetError } = await supabase.functions.invoke("mux-upload", {
          body: { action: "get-asset", assetId, chapterId },
        });

        if (assetError) {
          console.error("Get asset error:", assetError);
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 3000));
          continue;
        }

        if (assetData?.status === "ready" && assetData?.playbackId) {
          playbackId = assetData.playbackId;
        } else if (assetData?.status === "errored") {
          throw new Error("Video processing failed");
        } else {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      if (!playbackId) {
        throw new Error("Timed out waiting for playback ID");
      }

      setStatus("ready");
      onUploadComplete(playbackId, assetId);

      toast({
        title: "Video uploaded successfully",
        description: "Your video is now ready for playback",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={status === "uploading" || status === "processing"}
      />

      {status === "idle" && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Video
        </Button>
      )}

      {status === "uploading" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading... {progress}%
          </div>
          <Progress value={progress} />
        </div>
      )}

      {status === "processing" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing video... This may take a few minutes
        </div>
      )}

      {status === "ready" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle className="h-4 w-4" />
            Video ready
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Replace Video
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errorMessage || "Upload failed"}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setStatus("idle");
              setErrorMessage(null);
            }}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
