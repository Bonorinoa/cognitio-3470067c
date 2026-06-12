import { useTranslation } from "react-i18next";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { resourceTypes } from "./types";

interface ResourceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isMutating: boolean;
  chapterTitle: string;
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  resourceType: string;
  setResourceType: (v: string) => void;
  url: string;
  setUrl: (v: string) => void;
  isUploadedFile: boolean;
  onSubmit: () => void;
}

export function ResourceFormDialog(props: ResourceFormDialogProps) {
  const { t } = useTranslation();
  const {
    open, onOpenChange, isEditing, isMutating, chapterTitle,
    title, setTitle, description, setDescription,
    resourceType, setResourceType, url, setUrl, isUploadedFile, onSubmit,
  } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("resources.editResource") : t("resources.addResource")}
          </DialogTitle>
          <DialogDescription>
            {t("resources.addMaterials")} "{chapterTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="resource-title">{t("resources.title")}</Label>
            <Input
              id="resource-title"
              placeholder={t("resources.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resource-type">{t("resources.type")}</Label>
            <Select value={resourceType} onValueChange={setResourceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isUploadedFile ? (
            <div className="space-y-2">
              <Label>{t("resources.file")}</Label>
              <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border text-sm text-muted-foreground">
                <FileText className="h-4 w-4 text-primary" />
                <span>{t("resources.fileUploadedSuccess")}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="resource-url">{t("resources.url")}</Label>
              <Input
                id="resource-url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="resource-description">{t("resources.description")}</Label>
            <Textarea
              id="resource-description"
              placeholder={t("resources.descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("resources.cancel")}
          </Button>
          <Button onClick={onSubmit} disabled={isMutating}>
            {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? t("resources.save") : t("resources.addResource")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
