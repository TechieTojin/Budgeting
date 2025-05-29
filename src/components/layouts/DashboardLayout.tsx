import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { AIAssistant } from "../assistant/AIAssistant";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-sidebar shadow-xl",
              isMobile ? "w-[280px]" : "w-[280px]"
            )}
          >
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={cn(
        "flex flex-col flex-1 w-full overflow-hidden transition-all duration-300 ease-in-out",
        sidebarOpen && !isMobile ? "ml-[280px]" : "ml-0"
      )}>
        <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6 lg:px-8 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        <div className="fixed bottom-4 right-4 z-40">
          <AIAssistant />
        </div>
      </div>
    </div>
  );
};
