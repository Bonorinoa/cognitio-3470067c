import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Loader2, Clock, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  is_active: boolean;
}

interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  duration_minutes: string;
  is_active: boolean;
}

const emptyForm: ServiceFormData = {
  title: "",
  description: "",
  price: "",
  duration_minutes: "",
  is_active: true,
};

const InstructorServicesManager = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(emptyForm);

  // Fetch services
  const { data: services, isLoading } = useQuery({
    queryKey: ["instructor-services", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("instructor_services")
        .select("*")
        .eq("instructor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Service[];
    },
    enabled: !!user,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      if (!user) throw new Error("Not authenticated");

      const serviceData = {
        instructor_id: user.id,
        title: data.title,
        description: data.description || null,
        price: data.price ? parseFloat(data.price) : null,
        duration_minutes: data.duration_minutes ? parseInt(data.duration_minutes) : null,
        is_active: data.is_active,
      };

      if (editingService) {
        const { error } = await supabase
          .from("instructor_services")
          .update(serviceData)
          .eq("id", editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("instructor_services")
          .insert(serviceData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-services"] });
      setIsDialogOpen(false);
      setEditingService(null);
      setFormData(emptyForm);
      toast({
        title: editingService 
          ? t("instructorSettings.services.successUpdated")
          : t("instructorSettings.services.successCreated"),
        description: editingService 
          ? t("instructorSettings.services.successUpdatedDesc")
          : t("instructorSettings.services.successCreatedDesc"),
      });
    },
    onError: (error) => {
      console.error("Error saving service:", error);
      toast({
        title: "Error",
        description: t("instructorSettings.services.errorSave"),
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const { error } = await supabase
        .from("instructor_services")
        .delete()
        .eq("id", serviceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-services"] });
      setDeleteServiceId(null);
      toast({
        title: t("instructorSettings.services.successDeleted"),
        description: t("instructorSettings.services.successDeletedDesc"),
      });
    },
    onError: (error) => {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: t("instructorSettings.services.errorDelete"),
        variant: "destructive",
      });
    },
  });

  const openCreateDialog = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || "",
      price: service.price?.toString() || "",
      duration_minutes: service.duration_minutes?.toString() || "",
      is_active: service.is_active,
    });
    setIsDialogOpen(true);
  };

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
    saveMutation.mutate(formData);
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("instructorSettings.services.title")}</CardTitle>
            <CardDescription>
              {t("instructorSettings.services.subtitle")}
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("instructorSettings.services.addService")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{service.title}</h4>
                    {!service.is_active && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {t("instructorSettings.services.inactive")}
                      </span>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {service.price != null && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        ${service.price}
                      </span>
                    )}
                    {service.duration_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(service.duration_minutes)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(service)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteServiceId(service.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("instructorSettings.services.noServices")}</p>
          </div>
        )}
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService 
                ? t("instructorSettings.services.editService")
                : t("instructorSettings.services.addNewService")}
            </DialogTitle>
            <DialogDescription>
              {editingService
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
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">{t("instructorSettings.services.activeLabel")}</Label>
                <p className="text-xs text-muted-foreground">
                  {t("instructorSettings.services.activeDescription")}
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("instructorSettings.services.cancel")}
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("instructorSettings.saving")}
                  </>
                ) : editingService ? (
                  t("instructorSettings.services.updateService")
                ) : (
                  t("instructorSettings.services.createService")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteServiceId} onOpenChange={() => setDeleteServiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("instructorSettings.services.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("instructorSettings.services.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("instructorSettings.services.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteServiceId && deleteMutation.mutate(deleteServiceId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("instructorSettings.services.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default InstructorServicesManager;
