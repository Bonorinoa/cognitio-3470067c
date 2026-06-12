import { useTranslation } from "react-i18next";
import { File, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TruncatedText } from "@/components/ui/truncated-text";
import { ChapterResource, resourceIcons } from "./types";

interface ResourceListProps {
  resources: ChapterResource[];
  onEdit: (resource: ChapterResource) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export function ResourceList({ resources, onEdit, onDelete, onMoveUp, onMoveDown }: ResourceListProps) {
  const { t: _t } = useTranslation();
  return (
    <>
      {resources.map((resource, index) => {
        const Icon = resourceIcons[resource.resource_type] || File;
        return (
          <div
            key={resource.id}
            className="flex items-center gap-2 p-2 rounded border border-border bg-background/50 text-sm group min-w-0 overflow-hidden"
          >
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => onMoveUp(index)}
                disabled={index === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <GripVertical className="h-3 w-3 rotate-90" />
              </button>
              <button
                onClick={() => onMoveDown(index)}
                disabled={index === resources.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <GripVertical className="h-3 w-3 rotate-90" />
              </button>
            </div>
            <Icon className="h-4 w-4 text-primary flex-shrink-0" />
            <TruncatedText className="flex-1 text-sm">{resource.title}</TruncatedText>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(resource)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(resource.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
}
