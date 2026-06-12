import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type {
  InstructorService,
  ServiceFormData,
} from "@/components/instructor/services/types";

const QUERY_KEY = "instructor-services" as const;

export const useInstructorServices = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEY, user?.id],
    queryFn: async (): Promise<InstructorService[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("instructor_services")
        .select("*")
        .eq("instructor_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as InstructorService[];
    },
    enabled: !!user,
  });
};

const toServicePayload = (data: ServiceFormData, userId: string) => ({
  instructor_id: userId,
  title: data.title,
  description: data.description || null,
  price: data.price ? parseFloat(data.price) : null,
  duration_minutes: data.duration_minutes ? parseInt(data.duration_minutes, 10) : null,
  is_active: data.is_active,
});

export const useSaveInstructorService = (editingId: string | null) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServiceFormData) => {
      if (!user) throw new Error("Not authenticated");
      const payload = toServicePayload(data, user.id);
      const { error } = editingId
        ? await supabase.from("instructor_services").update(payload).eq("id", editingId)
        : await supabase.from("instructor_services").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: editingId
          ? t("instructorSettings.services.successUpdated")
          : t("instructorSettings.services.successCreated"),
        description: editingId
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
};

export const useDeleteInstructorService = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const { error } = await supabase
        .from("instructor_services")
        .delete()
        .eq("id", serviceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
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
};
