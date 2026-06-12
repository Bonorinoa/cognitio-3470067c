import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { PanelNavConfig } from "@/config/panelNav";

interface PanelTopbarProps {
  nav: PanelNavConfig;
  /** Optional right-side slot (quick actions per page). */
  actions?: React.ReactNode;
}

interface Crumb {
  label: string;
  href?: string;
}

function buildBreadcrumbs(pathname: string, nav: PanelNavConfig): Crumb[] {
  const allItems = nav.sections.flatMap((s) => s.items);
  // Find longest matching item href
  const matches = allItems
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
    .sort((a, b) => b.href.length - a.href.length);

  const root: Crumb = { label: nav.roleLabel, href: allItems[0]?.href };

  if (matches.length === 0) return [root];

  const current = matches[0];
  if (current.href === root.href) return [{ ...root, href: undefined }];

  return [root, { label: current.label }];
}

export default function PanelTopbar({ nav, actions }: PanelTopbarProps) {
  const location = useLocation();
  const crumbs = buildBreadcrumbs(location.pathname, nav);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <div key={`${crumb.label}-${idx}`} className="flex min-w-0 items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              )}
              {crumb.href && !isLast ? (
                <Link
                  to={crumb.href}
                  className="truncate text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "truncate font-medium text-foreground"
                      : "truncate text-muted-foreground"
                  }
                >
                  {crumb.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
