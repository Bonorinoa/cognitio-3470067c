import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2, Mail, Search } from "lucide-react";
import { toast } from "sonner";

interface WaitlistEntry {
  id: string;
  bundle: string;
  email: string;
  user_id: string | null;
  notes: string | null;
  created_at: string;
}

export function WaitlistManagementCard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bundleFilter, setBundleFilter] = useState<string>("all");

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["admin-waitlist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_bundle_waitlist")
        .select("id, bundle, email, user_id, notes, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as WaitlistEntry[];
    },
  });

  const bundles = useMemo(() => {
    const set = new Set(entries.map((e) => e.bundle));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries.filter((e) => {
      if (bundleFilter !== "all" && e.bundle !== bundleFilter) return false;
      if (!q) return true;
      return e.email.toLowerCase().includes(q) || e.bundle.toLowerCase().includes(q);
    });
  }, [entries, searchQuery, bundleFilter]);

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No hay entradas para exportar");
      return;
    }
    const header = ["bundle", "email", "user_id", "notes", "created_at"];
    const rows = filtered.map((e) =>
      [
        e.bundle,
        e.email,
        e.user_id ?? "",
        (e.notes ?? "").replace(/"/g, '""'),
        e.created_at,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exportadas ${filtered.length} entradas`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Waitlist de bundles
            </CardTitle>
            <CardDescription>
              Suscriptores en espera. Exporta el CSV para enviar avisos cuando un bundle esté listo.
            </CardDescription>
          </div>
          <Button onClick={handleExport} disabled={isLoading || filtered.length === 0} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email o bundle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={bundleFilter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setBundleFilter("all")}
            >
              Todos ({entries.length})
            </Badge>
            {bundles.map((b) => (
              <Badge
                key={b}
                variant={bundleFilter === b ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setBundleFilter(b)}
              >
                {b} ({entries.filter((e) => e.bundle === b).length})
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Bundle</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No hay entradas
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{e.bundle}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {e.user_id ? e.user_id.slice(0, 8) + "…" : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(e.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
