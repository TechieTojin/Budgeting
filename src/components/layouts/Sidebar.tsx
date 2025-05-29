import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  PieChart,
  TrendingUp,
  Lightbulb,
  Settings,
  LogOut,
  ChevronLeft,
  Landmark,
  Bell,
  Clock,
  User,
  Tags,
  Upload,
  Download,
  RepeatIcon,
  Target,
  Users,
  Search,
  Globe,
  ChevronRight,
  Info,
  Brain,
  CreditCard,
  Mail,
  BrainCircuit,
  HeartPulse,
  Calculator,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Function to capitalize first letter of each word
  const capitalize = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const navItems = [
    { name: capitalize(t('dashboard')), icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: capitalize(t('chatgpt')), icon: <BrainCircuit size={20} />, path: "/chatgpt" },
    { name: capitalize(t('transactions')), icon: <PlusCircle size={20} />, path: "/transactions" },
    { name: capitalize(t('budget')), icon: <Landmark size={20} />, path: "/budget" },
    { name: capitalize(t('smart_categorization')), icon: <Tags size={20} />, path: "/smart-categorization" },
    { name: capitalize(t('receipt_upload')), icon: <Upload size={20} />, path: "/receipt-upload" },
    { name: capitalize(t('email_extraction')), icon: <Mail size={20} />, path: "/email-extraction" },
    { name: capitalize(t('recurring_transactions')), icon: <RepeatIcon size={20} />, path: "/recurring-transactions" },
    { name: capitalize(t('search_transactions')), icon: <Search size={20} />, path: "/search-transactions" },
    { name: capitalize(t('split_expenses')), icon: <Users size={20} />, path: "/split-expenses" },
    { name: capitalize(t('multi_currency')), icon: <Globe size={20} />, path: "/multi-currency" },
    { name: capitalize(t('history')), icon: <Clock size={20} />, path: "/history" },
    { name: capitalize(t('reports')), icon: <PieChart size={20} />, path: "/reports" },
    { name: capitalize(t('download_reports')), icon: <Download size={20} />, path: "/download-reports" },
    { name: capitalize(t('ai_spending_insights')), icon: <Brain size={20} />, path: "/spending-insights" },
    { name: capitalize(t('investment_tracker')), icon: <TrendingUp size={20} />, path: "/investment-tracker" },
    { name: capitalize(t('debt_management')), icon: <CreditCard size={20} />, path: "/debt-management" },
    { name: capitalize(t('predictions')), icon: <TrendingUp size={20} />, path: "/predictions" },
    { name: capitalize(t('savings_goals')), icon: <Target size={20} />, path: "/savings-goals" },
    { name: capitalize(t('tips')), icon: <Lightbulb size={20} />, path: "/tips" },
    { name: capitalize(t('notifications')), icon: <Bell size={20} />, path: "/notifications" },
    { name: capitalize(t('about_us')), icon: <Info size={20} />, path: "/about-us" },
    { name: capitalize(t('settings')), icon: <Settings size={20} />, path: "/settings" },
  ];

  // Group the navigation items into categories for collapsible sections
  const mainNavItems = navItems.slice(0, 4);
  const transactionNavItems = navItems.slice(4, 11);
  const analyticsNavItems = [
    ...navItems.slice(11, 17),
    { name: capitalize(t('financial_health')), icon: <HeartPulse size={20} />, path: "/financial-health" },
    { name: capitalize(t('tax_optimization')), icon: <Calculator size={20} />, path: "/tax-optimization" },
    { name: capitalize(t('goals_tracker')), icon: <Target size={20} />, path: "/goals-tracker" }
  ];
  const accountNavItems = [
    ...navItems.slice(17),
    { name: capitalize(t('feedback')), icon: <MessageSquare size={20} />, path: "/feedback" },
    { name: capitalize(t('learning')), icon: <GraduationCap size={20} />, path: "/learning" }
  ];

  const handleLogout = () => {
    toast.success(capitalize(t("logged_out_successfully")));
    // In a real app, we would handle actual logout logic here
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <Link
      to={item.path}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        location.pathname === item.path
          ? "bg-primary text-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-primary"
      )}
    >
      <span className="mr-3">{item.icon}</span>
      <span className="truncate">{item.name}</span>
      {item.name === capitalize(t('notifications')) && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          3
        </span>
      )}
    </Link>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="rounded-full bg-gradient-to-r from-budget-teal to-budget-teal2 p-1.5">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">Budgeting</span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="md:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Make the content scrollable to ensure all items are accessible */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        <div className="px-3 py-1">
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {capitalize(t('main'))}
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>

        <Separator className="my-3 mx-3" />

        <Collapsible defaultOpen className="px-3 py-1">
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground group">
            <span>{capitalize(t('transactions'))}</span>
            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="space-y-1 mt-2">
              {transactionNavItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </nav>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-3 mx-3" />

        <Collapsible defaultOpen className="px-3 py-1">
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground group">
            <span>{capitalize(t('analytics'))}</span>
            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="space-y-1 mt-2">
              {analyticsNavItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </nav>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-3 mx-3" />

        <div className="px-3 py-1">
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {capitalize(t('account'))}
          </div>
          <nav className="space-y-1">
            {accountNavItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </div>

      <div className="p-3 border-t">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-md bg-sidebar-accent/10">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>TVS</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Tojin Varkey Simson</p>
            <p className="text-xs text-muted-foreground truncate">tojin@gmail.com</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/20"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {capitalize(t('sign_out'))}
        </Button>
      </div>
    </div>
  );
};
