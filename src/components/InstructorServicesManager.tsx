import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstructorServices } from "@/hooks/queries/useInstructorServices";
import { ServiceListItem } from "@/components/instructor/services/ServiceListItem";
import { ServiceFormDialog } from "@/components/instructor/services/ServiceFormDialog";
import { DeleteServiceDialog } from "@/components/instructor/services/DeleteServiceDialog";
import type { InstructorService } from "@/components/instructor/services/types";

const InstructorServicesManager = () => {
  const { t } = useTranslation();
  const { data: services, isLoading } = useInstructorServices();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<InstructorService | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  };

  const openEdit = (service: InstructorService) => {
    setEditingService(service);
    setIsDialogOpen(true);
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
          <Button onClick={openCreate} size="sm" className="gap-2">
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
              <ServiceListItem
                key={service.id}
                service={service}
                onEdit={openEdit}
                onDelete={setDeleteServiceId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("instructorSettings.services.noServices")}</p>
          </div>
        )}
      </CardContent>

      <ServiceFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editing={editingService}
      />
      <DeleteServiceDialog
        serviceId={deleteServiceId}
        onClose={() => setDeleteServiceId(null)}
      />
    </Card>
  );
};

export default InstructorServicesManager;
