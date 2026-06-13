import { motion } from "framer-motion";
import { Activity, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Overview {
  today: { calls: number; tokens: number };
  last_7_days: { calls: number; tokens: number };
  by_function: Array<{ fn: string; calls: number; tokens: number }>;
  top_users: Array<{ user_id: string; full_name: string | null; email: string | null; calls: number; tokens: number }>;
}

const fmt = (n: number | null | undefined) =>
  (n ?? 0).toLocaleString("es-AR");

export default function AdminAIOverview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-ai-overview"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_ai_overview");
      if (error) throw error;
      return data as unknown as Overview;
    },
    staleTime: 30_000,
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
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Plataforma</span>
          </div>
          <h1 className="mb-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            <span className="font-serif italic">Uso de IA</span>
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Métricas agregadas del uso de IA en toda la plataforma. Las cifras se actualizan cada 30 segundos.
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
          No se pudieron cargar las métricas: {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Llamadas hoy" value={fmt(data.today?.calls)} />
            <Stat label="Tokens hoy" value={fmt(data.today?.tokens)} />
            <Stat label="Llamadas (7 días)" value={fmt(data.last_7_days?.calls)} />
            <Stat label="Tokens (7 días)" value={fmt(data.last_7_days?.tokens)} />
          </div>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Por función (últimos 7 días)
            </h2>
            <div className="divide-y divide-border">
              {data.by_function.length === 0 && (
                <p className="py-4 text-sm text-muted-foreground">Sin actividad reciente.</p>
              )}
              {data.by_function.map((row) => (
                <div key={row.fn} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-mono text-foreground">{row.fn || "—"}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {fmt(row.calls)} llamadas · {fmt(row.tokens)} tokens
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Top 10 usuarios (últimos 7 días)
            </h2>
            <div className="divide-y divide-border">
              {data.top_users.length === 0 && (
                <p className="py-4 text-sm text-muted-foreground">Sin actividad reciente.</p>
              )}
              {data.top_users.map((u) => (
                <div key={u.user_id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate text-foreground">{u.full_name || u.email || u.user_id}</p>
                    {u.email && u.full_name && (
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    )}
                  </div>
                  <span className="tabular-nums text-muted-foreground">
                    {fmt(u.calls)} · {fmt(u.tokens)} tk
                  </span>
                </div>
              ))}
            </div>
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
