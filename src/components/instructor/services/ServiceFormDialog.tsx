import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useSaveInstructorService } from "@/hooks/queries/useInstructorServices";
import {
  emptyServiceForm,
  serviceToForm,
  type InstructorService,
  type ServiceFormData,
} from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: InstructorService | null;
}

export const ServiceFormDialog = ({ open, onOpenChange, editing }: Props) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ServiceFormData>(emptyServiceForm);
  const saveMutation = useSaveInstructorService(editing?.id ?? null);

  useEffect(() => {
    if (open) {
      setFormData(editing ? serviceToForm(editing) : emptyServiceForm);
    }
  }, [open, editing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: t("instructorSettings.services.validationTitle"),
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing
              ? t("instructorSettings.services.editService")
              : t("instructorSettings.services.addNewService")}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? t("instructorSettings.services.editDescription")
              : t("instructorSettings.services.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("instructorSettings.services.serviceTitle")} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t("instructorSettings.services.serviceTitlePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("instructorSettings.services.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("instructorSettings.services.descriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t("instructorSettings.services.price")}</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">{t("instructorSettings.services.duration")}</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, duration_minutes: e.target.value })
                }
                placeholder="60"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">
                {t("instructorSettings.services.activeLabel")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("instructorSettings.services.activeDescription")}
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("instructorSettings.services.cancel")}
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("instructorSettings.saving")}
                </>
              ) : editing ? (
                t("instructorSettings.services.updateService")
              ) : (
                t("instructorSettings.services.createService")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
