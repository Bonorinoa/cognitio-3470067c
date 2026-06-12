import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDrafts, formatRelativeTime, type DraftContentType } from "@/hooks/useDrafts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Search,
  Loader2,
  Pin,
  PinOff,
  Trash2,
  ExternalLink,
  Lock,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Filter = "all" | DraftContentType;

const FILTERS: { value: Filter; label: string; comingSoon?: boolean }[] = [
  { value: "all", label: "Todos" },
  { value: "blog", label: "Blog" },
  { value: "newsletter", label: "Newsletter", comingSoon: true },
];

export default function AIStudioDrafts() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<string | null>(null);

  const {
    drafts,
    isLoading,
    deleteDraft,
    pinDraft,
    unpinDraft,
    isPinning,
  } = useDrafts({
    contentType: filter === "all" ? "all" : filter,
    search,
  });

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <div className="inline-flex p-4 bg-muted rounded-full">
          <Lock className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-light">
          {t("drafts.loginRequired", "Inicie sesión para ver sus borradores")}
        </h2>
        <Link to="/auth">
          <Button className="rounded-sm">{t("nav.login", "Iniciar Sesión")}</Button>
        </Link>
      </div>
    );
  }

  const handleOpen = (id: string, type: DraftContentType) => {
    if (type === "blog") {
      navigate(`/ai-studio/marketing/blog?load=${id}`);
    } else {
      toast.info(t("drafts.toolUnavailable", "Esta herramienta aún no está disponible."));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteDraft(toDelete);
      toast.success(t("drafts.deleted", "Borrador eliminado"));
    } catch {
      toast.error(t("drafts.deleteFailed", "No se pudo eliminar"));
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Editorial header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-3">
          <div className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
            {t("drafts.eyebrow", "Borradores")}
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-foreground">
            {t("drafts.titleLead", "Su archivo de ")}
            <span className="italic font-serif">{t("drafts.titleAccent", "ideas.")}</span>
          </h1>
          <p className="text-muted-foreground font-light max-w-xl">
            {t(
              "drafts.subtitle",
              "Todo lo que ha generado y guardado. Fije los borradores importantes para que no se archiven."
            )}
          </p>
        </div>
        <Link to="/ai-studio/marketing/blog">
          <Button className="rounded-sm gap-2">
            <Plus className="h-4 w-4" />
            {t("drafts.newDraft", "Nuevo borrador")}
          </Button>
        </Link>
      </div>

      {/* Filter row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-center gap-1 text-sm">
          {FILTERS.map((f, i) => (
            <div key={f.value} className="flex items-center">
              {i > 0 && <span className="text-muted-foreground/40 px-2">·</span>}
              <button
                onClick={() => !f.comingSoon && setFilter(f.value)}
                disabled={f.comingSoon}
                className={cn(
                  "uppercase tracking-[0.15em] text-xs font-semibold transition-colors",
                  filter === f.value
                    ? "text-primary"
                    : f.comingSoon
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
                {f.comingSoon && <span className="ml-1 text-[10px]">(próx.)</span>}
              </button>
            </div>
          ))}
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("drafts.search", "Buscar por tema…")}
            className="pl-9 rounded-sm border-border bg-transparent font-light"
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : drafts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={
            search
              ? t("drafts.noMatch", "Ningún borrador coincide con su búsqueda.")
              : t("drafts.empty", "Aún no hay borradores guardados.")
          }
          description={
            search
              ? t("drafts.tryDifferent", "Pruebe otro término o limpie el filtro.")
              : t("drafts.emptyHint", "Genere y guarde su primer borrador desde el generador de blog.")
          }
          action={
            search
              ? { label: t("drafts.clearSearch", "Limpiar"), onClick: () => setSearch("") }
              : { label: t("drafts.startGenerating", "Ir al generador"), onClick: () => navigate("/ai-studio/marketing/blog") }
          }
        />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {drafts.map((draft) => (
            <li key={draft.id} className="group py-5 px-2 grid grid-cols-12 gap-4 items-center hover:bg-muted/20 transition-colors">
              {/* Pin + topic */}
              <div className="col-span-12 md:col-span-7 min-w-0 flex items-start gap-3">
                {draft.pinned && (
                  <Pin className="h-3.5 w-3.5 text-primary mt-1.5 shrink-0 fill-primary" />
                )}
                <div className="min-w-0">
                  <button
                    onClick={() => handleOpen(draft.id, draft.content_type)}
                    className="text-left block w-full"
                  >
                    <p className="text-lg font-light text-foreground truncate group-hover:text-primary transition-colors">
                      {draft.topic}
                    </p>
                  </button>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1 font-light">
                    {draft.generated_content.slice(0, 120)}…
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="col-span-6 md:col-span-3 flex flex-col gap-1 text-xs">
                <span className="uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                  {draft.content_type}
                </span>
                <span className="text-muted-foreground font-light">
                  {formatRelativeTime(draft.updated_at, i18n.language.startsWith("es") ? "es" : "en")}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={isPinning}
                  onClick={() => (draft.pinned ? unpinDraft(draft.id) : pinDraft(draft.id))}
                  title={draft.pinned ? t("drafts.unpin", "Desfijar") : t("drafts.pin", "Fijar")}
                >
                  {draft.pinned ? (
                    <PinOff className="h-4 w-4" />
                  ) : (
                    <Pin className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleOpen(draft.id, draft.content_type)}
                  title={t("drafts.open", "Abrir")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setToDelete(draft.id)}
                  title={t("drafts.delete", "Eliminar")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-xs text-muted-foreground font-light italic">
        {t("drafts.capNote", "Guardamos hasta 25 borradores activos. Los fijados no se archivan.")}
      </p>

      {/* Delete confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("drafts.deleteTitle", "¿Eliminar borrador?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("drafts.deleteDesc", "Esta acción no se puede deshacer.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel", "Cancelar")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("drafts.delete", "Eliminar")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
