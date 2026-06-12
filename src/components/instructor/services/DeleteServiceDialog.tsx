import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
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
import { useDeleteInstructorService } from "@/hooks/queries/useInstructorServices";

interface Props {
  serviceId: string | null;
  onClose: () => void;
}

export const DeleteServiceDialog = ({ serviceId, onClose }: Props) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteInstructorService();

  return (
    <AlertDialog open={!!serviceId} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("instructorSettings.services.deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("instructorSettings.services.deleteDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("instructorSettings.services.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              serviceId &&
              deleteMutation.mutate(serviceId, { onSuccess: onClose })
            }
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
  );
};
