import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Link as LinkIcon, Code, Video, File, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="space-y-3">
      {resources.map((resource) => {
        const Icon = resourceIcons[resource.resource_type] || File;
        return (
          <Card key={resource.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="py-4">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
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
                    <p className="text-sm text-muted-foreground mt-1">
                      {resource.description}
                    </p>
                  )}
                  <span className="text-xs text-muted-foreground mt-1 inline-block">
                    {t(`resources.${resource.resource_type}`)}
                  </span>
                </div>
              </a>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
