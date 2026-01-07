import * as React from "react";
import { HelpCircle, RotateCcw, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { resetAllHelp } from "@/lib/helpStorage";

interface HelpTopic {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface HelpCategory {
  id: string;
  title: string;
  topics: HelpTopic[];
}

interface HelpDrawerProps {
  categories: HelpCategory[];
  triggerLabel?: string;
  collapsed?: boolean;
  className?: string;
}

/**
 * A persistent help menu that provides access to all help topics.
 * Shows as a sidebar item that opens a dialog with categorized help content.
 */
export const HelpDrawer = ({
  categories,
  triggerLabel,
  collapsed = false,
  className,
}: HelpDrawerProps) => {
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = React.useState<HelpTopic | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleResetAllTips = () => {
    resetAllHelp();
    setOpen(false);
    // Optionally trigger a page refresh or state update
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full",
            collapsed && "justify-center px-2",
            className
          )}
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          {!collapsed && (
            <span className="font-medium">{triggerLabel || t("help.menu.title")}</span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {t("help.menu.title")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[400px]">
          {/* Topic list */}
          <ScrollArea className="w-1/3 border-r border-border">
            <div className="p-4 space-y-4">
              {categories.map((category) => (
                <div key={category.id}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {category.title}
                  </h3>
                  <div className="space-y-1">
                    {category.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                          selectedTopic?.id === topic.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span className="truncate">{topic.title}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Content area */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {selectedTopic ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{selectedTopic.title}</h3>
                  <div className="text-sm text-muted-foreground space-y-3">
                    {selectedTopic.content}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>{t("help.menu.selectTopic")}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer with reset option */}
        <div className="border-t border-border p-4 flex items-center justify-between bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {t("help.menu.description")}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAllTips}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {t("help.menu.showAllTips")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDrawer;
