import { useState, useRef } from "react";
import { Upload, CheckCircle, Loader2, AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { HelpTooltip } from "@/components/ui/help-tooltip";

interface VideoUploadProps {
  chapterId?: string;
  onUploadComplete: (playbackId: string, assetId: string) => void;
  currentPlaybackId?: string;
}

type UploadStatus = "idle" | "uploading" | "processing" | "ready" | "error";

const VideoUpload = ({ chapterId, onUploadComplete, currentPlaybackId }: VideoUploadProps) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<UploadStatus>(currentPlaybackId ? "ready" : "idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  // Spoken language of the lecture — drives Mux auto-subtitles and, through
  // them, everything the AI tutor reads. Spanish by default.
  const [language, setLanguage] = useState<"es" | "en">("es");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error(t("videoUpload.invalidType", "Tipo de archivo inválido: seleccione un video"));
      return;
    }

    setLastFile(file);
    setStatus("uploading");
    setProgress(0);
    setErrorMessage(null);

    try {
      const { data: uploadData, error: uploadError } = await supabase.functions.invoke("mux-upload", {
        body: { action: "create-upload", chapterId, language },
      });

      if (uploadError || !uploadData?.uploadUrl) {
        throw new Error(uploadError?.message || t("videoUpload.uploadUrlFailed", "No se pudo crear la URL de subida"));
      }

      const { uploadUrl, uploadId } = uploadData;

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(t("videoUpload.uploadFailedStatus", "Subida fallida (estado {{s}})", { s: xhr.status })));
        };
        xhr.onerror = () => reject(new Error(t("videoUpload.uploadFailed", "Subida fallida")));
        xhr.open("PUT", uploadUrl);
        xhr.send(file);
      });

      setStatus("processing");
      setProgress(100);

      let assetId: string | null = null;
      let attempts = 0;
      const maxAttempts = 60;

      while (!assetId && attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 5000));
        const { data: checkData, error: checkError } = await supabase.functions.invoke("mux-upload", {
          body: { action: "check-upload", uploadId },
        });
        if (!checkError && checkData?.assetId) assetId = checkData.assetId;
        attempts++;
      }
      if (!assetId) throw new Error(t("videoUpload.processingTimeout", "Tiempo agotado esperando procesamiento"));

      let playbackId: string | null = null;
      attempts = 0;
      while (!playbackId && attempts < 30) {
        const { data: assetData, error: assetError } = await supabase.functions.invoke("mux-upload", {
          body: { action: "get-asset", assetId, chapterId },
        });
        if (!assetError) {
          if (assetData?.status === "ready" && assetData?.playbackId) playbackId = assetData.playbackId;
          else if (assetData?.status === "errored") throw new Error(t("videoUpload.processingFailed", "El procesamiento del video falló"));
        }
        attempts++;
        if (!playbackId) await new Promise((r) => setTimeout(r, 3000));
      }
      if (!playbackId) throw new Error(t("videoUpload.playbackTimeout", "Tiempo agotado esperando playback ID"));

      setStatus("ready");
      onUploadComplete(playbackId, assetId);
      toast.success(t("videoUpload.success", "Video subido correctamente"));
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("error");
      const msg = error instanceof Error ? error.message : t("videoUpload.uploadFailed", "Subida fallida");
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await runUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRetry = async () => {
    if (lastFile) await runUpload(lastFile);
    else fileInputRef.current?.click();
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
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t("videoUpload.upload", "Subir Video")}
            </Button>
            <HelpTooltip content={t("help.videoUpload.helpTooltip")} />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="lecture-language" className="text-xs text-muted-foreground shrink-0">
              {t("videoUpload.languageLabel", "Idioma hablado en la clase")}
            </Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as "es" | "en")}>
              <SelectTrigger id="lecture-language" className="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">{t("videoUpload.languageEs", "Español")}</SelectItem>
                <SelectItem value="en">{t("videoUpload.languageEn", "Inglés")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("videoUpload.languageHint", "La transcripción automática se genera en este idioma. Elegilo antes de subir el video.")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("videoUpload.processingHint", "El procesamiento suele tardar 1-2 minutos por cada 10 minutos de video.")}
          </p>
        </div>
      )}

      {status === "uploading" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("videoUpload.uploading", "Subiendo")}... {progress}%
          </div>
          <Progress value={progress} />
        </div>
      )}

      {status === "processing" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("videoUpload.processing", "Procesando video... esto puede tardar unos minutos")}
        </div>
      )}

      {status === "ready" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle className="h-4 w-4" />
            {t("videoUpload.ready", "Video listo")}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            {t("videoUpload.replace", "Reemplazar Video")}
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{errorMessage || t("videoUpload.uploadFailed", "Subida fallida")}</span>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="default" size="sm" onClick={handleRetry}>
              <RotateCw className="h-3.5 w-3.5 mr-1.5" />
              {lastFile
                ? t("videoUpload.retrySame", "Reintentar con el mismo archivo")
                : t("videoUpload.tryAgain", "Intentar de nuevo")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setStatus("idle");
                setErrorMessage(null);
              }}
            >
              {t("videoUpload.cancel", "Cancelar")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
