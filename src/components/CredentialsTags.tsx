import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface CredentialsTagsProps {
  credentials: string[];
  onChange: (credentials: string[]) => void;
  editable?: boolean;
}

const CredentialsTags = ({ credentials, onChange, editable = true }: CredentialsTagsProps) => {
  const [newCredential, setNewCredential] = useState("");

  const handleAdd = () => {
    const trimmed = newCredential.trim();
    if (trimmed && !credentials.includes(trimmed)) {
      onChange([...credentials, trimmed]);
      setNewCredential("");
    }
  };

  const handleRemove = (credentialToRemove: string) => {
    onChange(credentials.filter((c) => c !== credentialToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {credentials.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No credentials added yet</p>
        ) : (
          credentials.map((credential, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1 py-1.5 px-3 text-sm bg-primary/10 text-primary border-primary/20"
            >
              {credential}
              {editable && (
                <button
                  type="button"
                  onClick={() => handleRemove(credential)}
                  className="ml-1 hover:text-destructive transition-colors"
                  aria-label={`Remove ${credential}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))
        )}
      </div>
      
      {editable && (
        <div className="flex gap-2">
          <Input
            placeholder="Add credential (e.g., Ph.D. Economics)"
            value={newCredential}
            onChange={(e) => setNewCredential(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAdd}
            disabled={!newCredential.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CredentialsTags;
