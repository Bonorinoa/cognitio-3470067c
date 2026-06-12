import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const emailSchema = z.string().trim().email().max(255);

interface WaitlistFormProps {
  bundle: string;
  /** Optional copy override; defaults pulled from i18n. */
  placeholder?: string;
  /** Compact one-line variant (used inside coming-soon rows). */
  variant?: "default" | "compact";
}

export default function WaitlistForm({ bundle, placeholder, variant = "default" }: WaitlistFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(t("waitlist.invalidEmail", "Email inválido"));
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("ai_bundle_waitlist").insert({
        bundle,
        email: parsed.data,
        user_id: user?.id ?? null,
      });

      // Duplicate is a soft success — already on the list.
      if (error && !error.message.toLowerCase().includes("duplicate")) {
        throw error;
      }

      setDone(true);
      toast.success(t("waitlist.thanks", "¡Gracias! Le avisaremos cuando esté listo."));
    } catch (err) {
      console.error(err);
      toast.error(t("waitlist.error", "No pudimos registrar su email. Intente de nuevo."));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-primary font-light">
        <Check className="h-4 w-4" />
        {t("waitlist.onList", "Está en la lista.")}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-sm">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder ?? t("waitlist.placeholder", "su@email.com")}
          className="flex-1 min-w-0 bg-transparent border-b border-border focus:border-primary outline-none py-1.5 text-sm font-light placeholder:text-muted-foreground/60 transition-colors"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !email}
          className="text-xs font-bold tracking-[0.2em] uppercase text-primary disabled:opacity-50 hover:underline underline-offset-4"
        >
          {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : t("waitlist.notifyMe", "Avíseme")}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-end gap-2 border-b border-border pb-2 focus-within:border-primary transition-colors">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder ?? t("waitlist.placeholder", "su@email.com")}
          className="flex-1 min-w-0 bg-transparent outline-none py-1 text-base font-light placeholder:text-muted-foreground/60"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !email}
          className="text-xs font-bold tracking-[0.2em] uppercase text-primary disabled:opacity-50 hover:underline underline-offset-4 pb-1"
        >
          {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : t("waitlist.notifyMe", "Avíseme →")}
        </button>
      </div>
      <p className="text-xs text-muted-foreground font-light">
        {t("waitlist.privacyNote", "Solo le escribiremos cuando el bundle esté disponible.")}
      </p>
    </form>
  );
}
