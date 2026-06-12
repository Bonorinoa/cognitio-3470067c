import { useTranslation } from "react-i18next";
import { toast } from "sonner";

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function useBlogExports(getContent: () => string, getTopic: () => string) {
  const { t } = useTranslation();

  const slug = () => getTopic().toLowerCase().replace(/\s+/g, "-").slice(0, 30) || "draft";

  const exportTxt = () => {
    const plain = getContent()
      .replace(/^#+\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    downloadFile(plain, `${slug()}.txt`, "text/plain");
    toast.success(t("aiStudio.exported", "Exported as TXT"));
  };

  const exportMd = () => {
    downloadFile(getContent(), `${slug()}.md`, "text/markdown");
    toast.success(t("aiStudio.exported", "Exported as Markdown"));
  };

  return { exportTxt, exportMd };
}
