import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Bot, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Mention {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
}

const AVAILABLE_MENTIONS: Mention[] = [
  {
    id: "cognitioai",
    name: "CognitioAI",
    icon: <Bot className="h-4 w-4" />,
    description: "AI tutor for Socratic guidance",
    available: true,
  },
  // Future mentions can be added here
  // { id: "summary", name: "Summary", icon: <FileText className="h-4 w-4" />, description: "Generate chapter summary", available: false },
];

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  aiEnabled?: boolean;
  className?: string;
}

export default function MentionInput({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  aiEnabled = true,
  className,
}: MentionInputProps) {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Filter mentions based on search
  const filteredMentions = AVAILABLE_MENTIONS.filter(
    (m) =>
      m.name.toLowerCase().includes(mentionSearch.toLowerCase()) &&
      (m.available || !aiEnabled)
  );

  // Detect @ mention trigger
  const detectMention = useCallback(
    (text: string, position: number) => {
      // Find the last @ before cursor
      const textBeforeCursor = text.slice(0, position);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");

      if (lastAtIndex === -1) {
        setShowMentions(false);
        return;
      }

      // Check if @ is at start or preceded by whitespace
      const charBefore = textBeforeCursor[lastAtIndex - 1];
      if (lastAtIndex > 0 && charBefore && !/\s/.test(charBefore)) {
        setShowMentions(false);
        return;
      }

      // Get text after @ until cursor
      const searchText = textBeforeCursor.slice(lastAtIndex + 1);

      // If there's a space after the search text, close the dropdown
      if (/\s/.test(searchText)) {
        setShowMentions(false);
        return;
      }

      setMentionSearch(searchText);
      setShowMentions(true);
      setSelectedIndex(0);
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newPosition = e.target.selectionStart || 0;
    onChange(newValue);
    setCursorPosition(newPosition);
    detectMention(newValue, newPosition);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredMentions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && filteredMentions.length > 0) {
      e.preventDefault();
      insertMention(filteredMentions[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowMentions(false);
    } else if (e.key === "Tab" && filteredMentions.length > 0) {
      e.preventDefault();
      insertMention(filteredMentions[selectedIndex]);
    }
  };

  const insertMention = (mention: Mention) => {
    if (!mention.available && aiEnabled) return;

    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    const textAfterCursor = value.slice(cursorPosition);

    const newValue =
      value.slice(0, lastAtIndex) + `@${mention.name} ` + textAfterCursor;
    onChange(newValue);
    setShowMentions(false);

    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = lastAtIndex + mention.name.length + 2;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowMentions(false);
    if (showMentions) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showMentions]);

  return (
    <div className="relative">
      <Popover open={showMentions && filteredMentions.length > 0}>
        <PopoverAnchor asChild>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={cn("resize-none", className)}
          />
        </PopoverAnchor>
        <PopoverContent
          className="w-64 p-1"
          align="start"
          side="top"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="text-xs text-muted-foreground px-2 py-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {t("discussion.mentionHint", "Mention")}
          </div>
          {filteredMentions.map((mention, index) => (
            <button
              key={mention.id}
              type="button"
              className={cn(
                "flex items-center gap-2 w-full px-2 py-2 rounded-sm text-left transition-colors",
                index === selectedIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50",
                !mention.available && aiEnabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => {
                e.stopPropagation();
                insertMention(mention);
              }}
              disabled={!mention.available && aiEnabled}
            >
              <span className="text-primary">{mention.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">@{mention.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {mention.description}
                </div>
              </div>
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
