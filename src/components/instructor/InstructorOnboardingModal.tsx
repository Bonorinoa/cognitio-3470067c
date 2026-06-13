import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  UserCircle2,
  PlusCircle,
  Wand2,
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useInstructorOnboarding,
  type OnboardingProfile,
} from "@/hooks/useInstructorOnboarding";

const STEPS = 3;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: OnboardingProfile;
  onComplete: () => Promise<void> | void;
}

export const InstructorOnboardingModal = ({
  open,
  onOpenChange,
  profile,
  onComplete,
}: Props) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const firstName = (profile.full_name || "").split(" ")[0] || "instructor";

  const profileChecks = [
    { label: "Foto de perfil", done: !!profile.avatar_url },
    { label: "Titular profesional", done: !!profile.headline },
    { label: "Biografía", done: !!profile.bio && profile.bio.length > 30 },
  ];

  const finish = async () => {
    setSubmitting(true);
    try {
      await onComplete();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        // Only allow closing via explicit buttons (avoid accidental dismiss on overlay click)
        if (!v && step < STEPS) return;
        onOpenChange(v);
      }}
    >
      <DialogContent
        className="max-w-xl p-0 overflow-hidden gap-0 border-border/60"
        onInteractOutside={(e) => {
          if (step < STEPS) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (step < STEPS) e.preventDefault();
        }}
      >
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: STEPS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i + 1 === step
                  ? "w-8 bg-primary"
                  : i + 1 < step
                    ? "w-4 bg-primary/60"
                    : "w-4 bg-muted",
              )}
            />
          ))}
        </div>

        <div className="px-8 pb-2 pt-6 min-h-[340px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  ¡Bienvenido a Cognitio, {firstName}!
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Te acompañamos en un recorrido corto (3 pasos, ~2 minutos)
                  para que dejes tu instructor studio listo y empieces a
                  publicar.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3 text-left">
                  {[
                    { icon: UserCircle2, label: "Tu perfil" },
                    { icon: PlusCircle, label: "Tu primer curso" },
                    { icon: Wand2, label: "AI Studio" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="rounded-lg border border-border/60 bg-muted/30 p-3"
                    >
                      <Icon className="h-5 w-5 text-primary mb-2" />
                      <p className="text-xs font-medium text-foreground">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <UserCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Completá tu perfil
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Los alumnos eligen instructores con foto y biografía claras.
                  Dedicale un par de minutos y vas a destacar en el directorio.
                </p>

                <ul className="mt-6 space-y-3">
                  {profileChecks.map((c) => (
                    <li
                      key={c.label}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3"
                    >
                      {c.done ? (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          c.done
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {c.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  className="mt-6 w-full sm:w-auto"
                  onClick={() => navigate("/instructor/settings")}
                >
                  Ir a editar mi perfil
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Tus herramientas
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Ya tenés todo a mano. Empezá por donde te sientas más cómodo;
                  podés volver a esta guía cuando quieras desde el menú lateral.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      icon: PlusCircle,
                      title: "Crear curso",
                      desc: "Armá tu primer curso paso a paso.",
                      to: "/instructor/create",
                    },
                    {
                      icon: Wand2,
                      title: "AI Studio",
                      desc: "Generá blogs y materiales con IA.",
                      to: "/ai-studio",
                    },
                    {
                      icon: BookOpen,
                      title: "Guía",
                      desc: "Buenas prácticas para instructores.",
                      to: "/instructor/guide",
                    },
                  ].map(({ icon: Icon, title, desc, to }) => (
                    <button
                      key={to}
                      onClick={() => navigate(to)}
                      className="text-left rounded-lg border border-border/60 bg-card p-4 transition-all hover:border-primary/60 hover:shadow-sm"
                    >
                      <Icon className="h-5 w-5 text-primary mb-2" />
                      <p className="text-sm font-semibold text-foreground">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground leading-snug">
                        {desc}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-6 py-4">
          <button
            type="button"
            onClick={finish}
            disabled={submitting}
            className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline disabled:opacity-50"
          >
            Saltar por ahora
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                disabled={submitting}
              >
                Atrás
              </Button>
            )}
            {step < STEPS ? (
              <Button size="sm" onClick={() => setStep((s) => s + 1)}>
                {step === 1 ? "Empezar" : "Siguiente"}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={finish} disabled={submitting}>
                {submitting ? "Guardando…" : "Finalizar"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
