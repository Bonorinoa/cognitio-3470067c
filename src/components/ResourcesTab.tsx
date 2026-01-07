import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Link as LinkIcon, Code, Video, File, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ResourcesTabProps {
  chapterId: string;
}

interface ChapterResource {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  resource_type: string;
  url: string;
  order_index: number;
  created_at: string;
}

const resourceIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  link: LinkIcon,
  notebook: Code,
  video: Video,
  other: File,
};

export default function ResourcesTab({ chapterId }: ResourcesTabProps) {
  const { t } = useTranslation();

  const { data: resources, isLoading } = useQuery({
    queryKey: ["chapter-resources", chapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapter_resources")
        .select("*")
        .eq("chapter_id", chapterId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as ChapterResource[];
    },
    enabled: !!chapterId,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <File className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>{t("resources.empty")}</p>
      </div>
    );
  }

  // Generate the appropriate URL for a resource
  const getResourceUrl = (resource: ChapterResource): string => {
    // For Supabase storage files, use the download proxy to bypass ad blockers
    const isStorageUrl = resource.url.includes("supabase.co/storage");
    if (isStorageUrl) {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      return `${supabaseUrl}/functions/v1/download-resource?id=${resource.id}`;
    }
    return resource.url;
  };

  const handleOpenResource = async (resource: ChapterResource) => {
    const resourceUrl = getResourceUrl(resource);

    // External links can be opened normally
    if (resource.resource_type === "link") {
      window.open(resourceUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // For PDFs/files: fetch as a Blob and open via a blob: URL.
    // This prevents the browser from navigating directly to a blocked domain.
    try {
      const res = await fetch(resourceUrl, { method: "GET" });
      if (!res.ok) throw new Error(`Failed to fetch resource: ${res.status}`);

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");

      // Give the new tab a moment to load before revoking
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (e) {
      console.error("Resource open failed", e);
      toast.error(t("common.error"), {
        description: t("resources.openBlockedHelp"),
      });
    }
  };

  return (
    <div className="space-y-3">
      {resources.map((resource) => {
        const Icon = resourceIcons[resource.resource_type] || File;

        return (
          <Card key={resource.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="py-4">
              <button
                type="button"
                onClick={() => void handleOpenResource(resource)}
                className="flex w-full items-start gap-4 group text-left"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {resource.title}
                    </h4>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                  )}
                  <span className="text-xs text-muted-foreground mt-1 inline-block">
                    {t(`resources.${resource.resource_type}`)}
                  </span>
                </div>
              </button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
