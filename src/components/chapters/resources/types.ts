import { Code, File, FileText, Link as LinkIcon, Video } from "lucide-react";

export interface ChapterResource {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  resource_type: string;
  url: string;
  order_index: number;
  created_at: string;
}

export const resourceTypes = [
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "link", label: "Link", icon: LinkIcon },
  { value: "notebook", label: "Notebook", icon: Code },
  { value: "video", label: "Video", icon: Video },
  { value: "other", label: "Other", icon: File },
];

export const resourceIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  link: LinkIcon,
  notebook: Code,
  video: Video,
  other: File,
};
