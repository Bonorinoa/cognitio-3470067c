import { useState } from "react";
import { Outlet } from "react-router-dom";
import PanelSidebar from "./PanelSidebar";
import PanelTopbar from "./PanelTopbar";
import type { PanelNavConfig } from "@/config/panelNav";

interface PanelLayoutProps {
  nav: PanelNavConfig;
}

export default function PanelLayout({ nav }: PanelLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 h-screen shrink-0 self-start overflow-y-auto">
        <PanelSidebar
          nav={nav}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <PanelTopbar nav={nav} />
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
