import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import { AITutorSettingsCard } from "@/components/admin/AITutorSettingsCard";

const AdminAITutor = () => {
  return (
    <div className="space-y-8 lg:space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Plataforma
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            <span className="font-serif italic">AI Tutor</span>
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Configurá el modelo, la temperatura y el prompt base que guía las
            respuestas del tutor en toda la plataforma.
          </p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
      </motion.section>

      <AITutorSettingsCard />
    </div>
  );
};

export default AdminAITutor;
