import { Outlet } from "react-router-dom";
import { useState, useCallback, createContext, useContext } from "react";
import AIStudioSidebar from "@/components/ai-studio/AIStudioSidebar";
import { GenerationHistoryItem } from "@/hooks/useGenerationHistory";

interface AIStudioContextValue {
  onLoadHistory: (item: GenerationHistoryItem) => void;
  onDeleteHistory: (id: string) => void;
  setHandlers: (handlers: { 
    onLoadHistory: (item: GenerationHistoryItem) => void; 
    onDeleteHistory: (id: string) => void;
  }) => void;
}

const AIStudioContext = createContext<AIStudioContextValue | null>(null);

export function useAIStudioContext() {
  return useContext(AIStudioContext);
}

export default function AIStudioLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [handlers, setHandlers] = useState<{
    onLoadHistory: (item: GenerationHistoryItem) => void;
    onDeleteHistory: (id: string) => void;
  }>({
    onLoadHistory: () => {},
    onDeleteHistory: () => {},
  });

  const contextValue: AIStudioContextValue = {
    onLoadHistory: handlers.onLoadHistory,
    onDeleteHistory: handlers.onDeleteHistory,
    setHandlers: useCallback((newHandlers) => setHandlers(newHandlers), []),
  };

  return (
    <AIStudioContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        <div className="flex w-full">
          <AIStudioSidebar 
            onLoadHistory={handlers.onLoadHistory}
            onDeleteHistory={handlers.onDeleteHistory}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
          />
          <main className={`flex-1 p-6 lg:p-8 pt-28 lg:pt-8 transition-all duration-300 ${
            collapsed ? "lg:ml-16" : "lg:ml-64"
          }`}>
            <Outlet />
          </main>
        </div>
      </div>
    </AIStudioContext.Provider>
  );
}
