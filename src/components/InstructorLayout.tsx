import { useState } from "react";
import { Outlet } from "react-router-dom";
import InstructorSidebar from "@/components/InstructorSidebar";

const InstructorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 self-start h-screen shrink-0 overflow-y-auto">
        <InstructorSidebar 
          collapsed={collapsed} 
          onCollapsedChange={setCollapsed} 
        />
      </aside>
      <main className="flex-1 min-h-screen overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default InstructorLayout;
