import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { estimateTokens } from "@/lib/tokenUtils";
import type { 
  KnowledgeBaseDocument, 
  DocumentFormData,
  DocumentType,
  ContextRole 
} from "@/types/aiStudio";

// Map database row to typed interface
function mapRowToDocument(row: Record<string, unknown>): KnowledgeBaseDocument {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    document_type: row.document_type as DocumentType,
    context_role: row.context_role as ContextRole,
    content: row.content as string,
    content_tokens: row.content_tokens as number,
    tags: (row.tags as string[]) || [],
    is_active: row.is_active as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function useKnowledgeBase() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all documents for the user
  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ["user-knowledge-base", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_knowledge_base")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(mapRowToDocument);
    },
    enabled: !!user,
  });

  // Create a new document
  const createMutation = useMutation({
    mutationFn: async (formData: DocumentFormData) => {
      if (!user) throw new Error("Not authenticated");

      const tokenCount = estimateTokens(formData.content);

      const { data, error } = await supabase
        .from("user_knowledge_base")
        .insert({
          user_id: user.id,
          title: formData.title,
          document_type: formData.document_type,
          context_role: formData.context_role,
          content: formData.content,
          content_tokens: tokenCount,
          tags: formData.tags,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return mapRowToDocument(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-knowledge-base", user?.id] });
    },
  });

  // Update an existing document
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: DocumentFormData }) => {
      if (!user) throw new Error("Not authenticated");

      const tokenCount = estimateTokens(formData.content);

      const { data, error } = await supabase
        .from("user_knowledge_base")
        .update({
          title: formData.title,
          document_type: formData.document_type,
          context_role: formData.context_role,
          content: formData.content,
          content_tokens: tokenCount,
          tags: formData.tags,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return mapRowToDocument(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-knowledge-base", user?.id] });
    },
  });

  // Toggle document active status (soft delete)
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_knowledge_base")
        .update({ is_active: isActive })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-knowledge-base", user?.id] });
    },
  });

  // Delete document permanently
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_knowledge_base")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-knowledge-base", user?.id] });
    },
  });

  // Calculate totals
  const activeDocuments = documents.filter(d => d.is_active);
  const totalTokens = activeDocuments.reduce((sum, d) => sum + d.content_tokens, 0);

  return {
    documents,
    activeDocuments,
    totalTokens,
    isLoading,
    error,
    createDocument: createMutation.mutateAsync,
    updateDocument: updateMutation.mutateAsync,
    toggleActive: toggleActiveMutation.mutateAsync,
    deleteDocument: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
