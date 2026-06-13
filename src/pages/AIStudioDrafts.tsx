import { useState, useEffect } from "react";
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
  Pencil,
  Copy,
  Check,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Filter = "all" | DraftContentType | "pinned" | "archived";

export default function AIStudioDrafts() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Filter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [pageLimit, setPageLimit] = useState(25);

  // Debounce search input -> committed search
  useEffect(() => {
    const handle = setTimeout(() => setSearch(searchInput), 250);
    return () => clearTimeout(handle);
  }, [searchInput]);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setPageLimit(25);
  }, [filter, search]);

  const includeArchived = filter === "archived";
  const contentType: DraftContentType | "all" =
    filter === "blog" || filter === "newsletter" ? filter : "all";

  const {
    drafts: rawDrafts,
    isLoading,
    deleteDraft,
    pinDraft,
    unpinDraft,
    isPinning,
    renameDraft,
    duplicateDraft,
    isRenaming,
    isDuplicating,
    restoreDraft,
  } = useDrafts({
    contentType,
    search,
    includeArchived,
    limit: pageLimit,
  });

  // Apply pinned-only filter client-side (cheap, drafts are already capped)
  const drafts =
    filter === "pinned" ? rawDrafts.filter((d) => d.pinned) : rawDrafts;

  const FILTERS: { value: Filter; label: string; comingSoon?: boolean }[] = [
    { value: "all", label: t("drafts.filter.all", "Todos") },
    { value: "blog", label: t("drafts.filter.blog", "Blog") },
    { value: "newsletter", label: t("drafts.filter.newsletter", "Newsletter"), comingSoon: true },
    { value: "pinned", label: t("drafts.filter.pinned", "Anclados") },
    { value: "archived", label: t("drafts.filter.archived", "Archivados") },
  ];

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

  const startRename = (id: string, current: string) => {
    setRenameId(id);
    setRenameValue(current);
  };

  const confirmRename = async () => {
    if (!renameId) return;
    try {
      await renameDraft(renameId, renameValue);
      toast.success(t("drafts.renamed", "Borrador renombrado"));
      setRenameId(null);
    } catch (e) {
      toast.error(t("drafts.renameFailed", "No se pudo renombrar"));
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateDraft(id);
      toast.success(t("drafts.duplicated", "Borrador duplicado"));
    } catch {
      toast.error(t("drafts.duplicateFailed", "No se pudo duplicar"));
    }
  };

  const handleRestore = (id: string) => {
    restoreDraft(id);
    toast.success(t("drafts.restored", "Borrador restaurado"));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
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

      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-center gap-1 text-sm flex-wrap">
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("drafts.search", "Buscar por tema…")}
            className="pl-9 rounded-sm border-border bg-transparent font-light"
          />
        </div>
      </div>

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
              : filter === "archived"
              ? t("drafts.noArchived", "No hay borradores archivados.")
              : filter === "pinned"
              ? t("drafts.noPinned", "No hay borradores anclados.")
              : t("drafts.empty", "Aún no hay borradores guardados.")
          }
          description={
            search
              ? t("drafts.tryDifferent", "Pruebe otro término o limpie el filtro.")
              : t("drafts.emptyHint", "Genere y guarde su primer borrador desde el generador de blog.")
          }
          action={
            search
              ? { label: t("drafts.clearSearch", "Limpiar"), onClick: () => { setSearchInput(""); setSearch(""); } }
              : { label: t("drafts.startGenerating", "Ir al generador"), onClick: () => navigate("/ai-studio/marketing/blog") }
          }
        />
      ) : (
        <>
          <ul className="divide-y divide-border border-y border-border">
            {drafts.map((draft) => {
              const isRenamingThis = renameId === draft.id;
              return (
                <li
                  key={draft.id}
                  className={cn(
                    "group py-5 px-2 grid grid-cols-12 gap-4 items-center transition-colors",
                    !draft.is_active ? "opacity-60" : "hover:bg-muted/20"
                  )}
                >
                  <div className="col-span-12 md:col-span-7 min-w-0 flex items-start gap-3">
                    {draft.pinned && (
                      <Pin className="h-3.5 w-3.5 text-primary mt-1.5 shrink-0 fill-primary" />
                    )}
                    <div className="min-w-0 flex-1">
                      {isRenamingThis ? (
                        <div className="flex items-center gap-2">
                          <Input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") confirmRename();
                              if (e.key === "Escape") setRenameId(null);
                            }}
                            className="h-8 text-sm"
                            maxLength={200}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-primary"
                            onClick={confirmRename}
                            disabled={isRenaming}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setRenameId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-3 flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                      {draft.content_type}
                      {!draft.is_active && (
                        <span className="ml-2 text-[10px] normal-case tracking-normal text-muted-foreground/70">
                          ({t("drafts.archivedTag", "archivado")})
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground font-light">
                      {formatRelativeTime(draft.updated_at, i18n.language.startsWith("es") ? "es" : "en")}
                    </span>
                  </div>

                  <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-0.5">
                    {!draft.is_active ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleRestore(draft.id)}
                      >
                        {t("drafts.restore", "Restaurar")}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isPinning}
                          onClick={() => (draft.pinned ? unpinDraft(draft.id) : pinDraft(draft.id))}
                          title={draft.pinned ? t("drafts.unpin", "Desfijar") : t("drafts.pin", "Fijar")}
                        >
                          {draft.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => startRename(draft.id, draft.topic)}
                          title={t("drafts.rename", "Renombrar")}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isDuplicating}
                          onClick={() => handleDuplicate(draft.id)}
                          title={t("drafts.duplicate", "Duplicar")}
                        >
                          <Copy className="h-4 w-4" />
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
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {drafts.length >= pageLimit && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="rounded-sm"
                onClick={() => setPageLimit((n) => n + 25)}
              >
                {t("drafts.loadMore", "Cargar más")}
              </Button>
            </div>
          )}
        </>
      )}

      <p className="text-center text-xs text-muted-foreground font-light italic">
        {t("drafts.capNote", "Guardamos hasta 25 borradores activos. Los fijados no se archivan.")}
      </p>

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
