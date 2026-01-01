import { Outlet } from "react-router-dom";
import AIStudioSidebar from "@/components/ai-studio/AIStudioSidebar";

export default function AIStudioLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AIStudioSidebar />
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
