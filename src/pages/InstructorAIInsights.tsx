import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Insights {
  totals: { total_tutor_sessions: number; unique_students: number };
  per_chapter: Array<{
    chapter_id: string;
    chapter_title: string;
    course_id: string;
    course_title: string;
    tutor_calls: number;
  }>;
}

export default function InstructorAIInsights() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["instructor-ai-insights"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_instructor_ai_insights");
      if (error) throw error;
      return data as unknown as Insights;
    },
    staleTime: 60_000,
  });

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
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Insights</span>
          </div>
          <h1 className="mb-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            <span className="font-serif italic">IA en tus cursos</span>
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Mirá dónde tus estudiantes usan más el tutor de IA. Los capítulos con más consultas suelen marcar
            puntos confusos que vale la pena revisar.
          </p>
        </div>
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </motion.section>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
        </div>
      )}
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          No se pudieron cargar los insights: {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Stat label="Sesiones con el tutor" value={(data.totals?.total_tutor_sessions ?? 0).toLocaleString("es-AR")} />
            <Stat label="Estudiantes únicos" value={(data.totals?.unique_students ?? 0).toLocaleString("es-AR")} />
          </div>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Capítulos con más consultas
            </h2>
            {data.per_chapter.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                Todavía no hay actividad del tutor en tus cursos.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {data.per_chapter.map((row) => (
                  <div key={row.chapter_id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate text-foreground">{row.chapter_title}</p>
                      <p className="truncate text-xs text-muted-foreground">{row.course_title}</p>
                    </div>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {row.tutor_calls} consultas
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-light tabular-nums text-foreground">{value}</p>
    </div>
  );
}
