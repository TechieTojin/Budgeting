import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const handleNotificationClick = () => {
    toast.success(t("notifications_checked"));
  };

  return (
    <header className="sticky top-0 h-16 px-4 md:px-6 border-b flex items-center justify-between bg-background/80 backdrop-blur-sm z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full"
        >
          {isSidebarOpen ? 
            <X className="h-5 w-5" /> : 
            <Menu className="h-5 w-5" />
          }
        </Button>
        {!isMobile && (
          <h1 className="font-semibold text-lg capitalize">Budgeting</h1>
        )}
        
        <div className="hidden md:flex relative max-w-md w-full ml-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder={t("search_transactions_and_categories")} 
            className="pl-9 bg-background/50 border-muted focus:border-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full" onClick={handleNotificationClick}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 rounded-md overflow-hidden p-0">
            <div className="bg-primary/10 px-4 py-2 flex justify-between items-center">
              <h3 className="font-medium capitalize">{t("notifications")}</h3>
              <Button variant="ghost" size="sm" className="h-auto p-1">
                {t("mark_all_as_read")}
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="px-4 py-3 focus:bg-muted hover:bg-muted border-b cursor-pointer">
                <div>
                  <p className="font-medium">{t("budget_alert")}</p>
                  <p className="text-muted-foreground text-sm">{t("food_budget_alert")}</p>
                  <p className="text-xs text-muted-foreground mt-1">2 {t("hours_ago")}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-3 focus:bg-muted hover:bg-muted border-b cursor-pointer">
                <div>
                  <p className="font-medium">{t("smart_tip_available")}</p>
                  <p className="text-muted-foreground text-sm">{t("new_savings_opportunity")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("yesterday")}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-3 focus:bg-muted hover:bg-muted cursor-pointer">
                <div>
                  <p className="font-medium">{t("new_prediction_ready")}</p>
                  <p className="text-muted-foreground text-sm">{t("next_month_prediction")}</p>
                  <p className="text-xs text-muted-foreground mt-1">2 {t("days_ago")}</p>
                </div>
              </DropdownMenuItem>
            </div>
            <div className="p-2 text-center border-t">
              <Button variant="ghost" size="sm" className="w-full justify-center">
                {t("view_all_notifications")}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
