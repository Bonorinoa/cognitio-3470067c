import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration, type InstructorService } from "./types";

interface Props {
  service: InstructorService;
  onEdit: (service: InstructorService) => void;
  onDelete: (id: string) => void;
}

export const ServiceListItem = ({ service, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start justify-between p-4 rounded-lg border border-border bg-muted/30">
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
              <DollarSign className="h-3.5 w-3.5" />${service.price}
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
          onClick={() => onEdit(service)}
          className="h-8 w-8"
          aria-label={t("instructorSettings.services.editService")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(service.id)}
          className="h-8 w-8 text-destructive hover:text-destructive"
          aria-label={t("instructorSettings.services.delete")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
