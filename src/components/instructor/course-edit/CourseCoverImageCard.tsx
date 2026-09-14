import { ImageIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseCoverImageCardProps {
  imagePreview: string;
  isUploadingImage: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  title?: string;
}

export function CourseCoverImageCard({
  imagePreview,
  isUploadingImage,
  onImageChange,
  description = "Actualizá la portada de tu curso",
  title = "Imagen de Portada",
}: CourseCoverImageCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          id="course-image"
          accept="image/*"
          onChange={onImageChange}
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
                alt="Vista previa del curso"
                className="mx-auto h-32 w-auto rounded-lg object-cover"
              />
              <p className="text-sm text-muted-foreground">Hacé clic para cambiar la imagen</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Hacé clic para subir una imagen</p>
            </div>
          )}
        </label>
        {isUploadingImage && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            <Loader2 className="inline h-4 w-4 animate-spin mr-1" />
            Subiendo...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
