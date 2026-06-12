import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/lib/errorUtils";
import { ChapterResource } from "./types";

interface ResourceInput {
  title: string;
  description: string | null;
  resource_type: string;
  url: string;
}

export function useChapterResources(chapterId: string, enabled: boolean) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const queryKey = ["chapter-resources", chapterId];

  const { data: resources = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapter_resources")
        .select("*")
        .eq("chapter_id", chapterId)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as ChapterResource[];
    },
    enabled: !!chapterId && enabled,
  });

  const addResource = useMutation({
    mutationFn: async (newResource: ResourceInput & { order_index: number }) => {
      const { data, error } = await supabase
        .from("chapter_resources")
        .insert({ chapter_id: chapterId, ...newResource })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(t("resources.resourceAdded"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const updateResource = useMutation({
    mutationFn: async ({ id, ...updates }: ResourceInput & { id: string }) => {
      const { data, error } = await supabase
        .from("chapter_resources")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(t("resources.resourceUpdated"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chapter_resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(t("resources.resourceDeleted"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const reorder = useMutation({
    mutationFn: async ({ id, newIndex }: { id: string; newIndex: number }) => {
      const { error } = await supabase
        .from("chapter_resources")
        .update({ order_index: newIndex })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const moveUp = (index: number) => {
    if (index === 0) return;
    const a = resources[index];
    const b = resources[index - 1];
    reorder.mutate({ id: a.id, newIndex: b.order_index });
    reorder.mutate({ id: b.id, newIndex: a.order_index });
  };

  const moveDown = (index: number) => {
    if (index === resources.length - 1) return;
    const a = resources[index];
    const b = resources[index + 1];
    reorder.mutate({ id: a.id, newIndex: b.order_index });
    reorder.mutate({ id: b.id, newIndex: a.order_index });
  };

  return {
    resources,
    isLoading,
    addResource,
    updateResource,
    deleteResource,
    moveUp,
    moveDown,
  };
}
