import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isValidEmail } from "@/lib/emailValidation";

interface NotifyMeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureKey: string;
  featureName: string;
}

export default function NotifyMeModal({
  open,
  onOpenChange,
  featureKey,
  featureName,
}: NotifyMeModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setIsSuccess(false);
      setIsSubmitting(false);
      if (user?.email) {
        setEmail(user.email);
      } else {
        setEmail("");
      }
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast.error(t("aiStudio.invalidEmail", "Please enter a valid email address"));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("feature_notify_requests").insert({
        email,
        feature_key: featureKey,
        user_id: user?.id || null,
      });

      if (error) {
        // Check if it's a duplicate entry
        if (error.code === "23505") {
          toast.info(t("aiStudio.alreadyNotified", "You're already on the list for this feature!"));
          setIsSuccess(true);
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Failed to submit notification request:", error);
      toast.error(t("aiStudio.notifyError", "Failed to submit request. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSuccess 
              ? t("aiStudio.notifySuccess", "We'll notify you when it's ready!")
              : t("aiStudio.notifyMe", "Notify Me")
            }
          </DialogTitle>
          <DialogDescription>
            {isSuccess ? (
              <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                {t("aiStudio.notifySuccessDesc", "You'll receive an email when {{feature}} launches.", {
                  feature: featureName,
                })}
              </span>
            ) : (
              t("aiStudio.notifyMeDesc", "Get notified when this feature launches")
            )}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t("common.email", "Email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("aiStudio.emailPlaceholder", "Enter your email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || !!user?.email}
                  required
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {t("aiStudio.notifyPrivacy", "We'll only email you about {{feature}} and won't share your email.", {
                  feature: featureName,
                })}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.submitting", "Submitting...")}
                  </>
                ) : (
                  t("aiStudio.notifyMe", "Notify Me")
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>
              {t("common.close", "Close")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
