import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tags, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  BrainCircuit, 
  Sparkles, 
  Zap,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Info,
  ArrowUpDown,
  Calendar,
  Clock,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Upload,
  Download,
  Settings,
  FileText,
  IndianRupee as Rupee,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Progress
} from "@/components/ui/progress";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Import our existing components
import { RealTimeCategorization } from "@/components/transactions/RealTimeCategorization";
import { BatchCategorization } from "@/components/transactions/BatchCategorization";
import { SuggestedRules } from "@/components/transactions/SuggestedRules";
import { CategorizationStats } from "@/components/transactions/CategorizationStats";
import { ConfidenceIndicator } from "@/components/transactions/ConfidenceIndicator";

// Import our new components
import { CategoryDistributionChart } from "@/components/transactions/CategoryDistributionChart";
import { TrendAnalysisChart } from "@/components/transactions/TrendAnalysisChart";
import { ModelPerformanceChart } from "@/components/transactions/ModelPerformanceChart";
import { TransactionsOverview, Transaction } from "@/components/transactions/TransactionsOverview";

// Import utilities
import { 
  TransactionData, 
  suggestCategorizationRules, 
  detectCategoryAdvanced,
  getConfidenceDisplay
} from "@/utils/advancedCategorization";

// Add this before the SmartCategorization component
const StatusBadge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "success" | "warning" }) => {
  const variantClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600",
    warning: "bg-yellow-500/10 text-yellow-600"
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

// Add this type before the SmartCategorization component
type SortField = 'date' | 'amount' | 'confidence';
type SortOrder = 'asc' | 'desc';
type CategoryStatus = "active" | "inactive" | "pending";
type RuleType = "keyword" | "amount" | "merchant" | "date" | "regex";
type RuleCondition = "contains" | "equals" | "starts_with" | "ends_with" | "matches";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  rules: Rule[];
  transactions: number;
  totalAmount: number;
  lastUpdated: Date;
  status: CategoryStatus;
}

interface Rule {
  id: string;
  type: RuleType;
  value: string;
  condition: RuleCondition;
  priority: number;
}

const SmartCategorization = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Groceries",
      description: "Food and household items",
      color: "#4CAF50",
      icon: "🛒",
      rules: [
        {
          id: "1",
          type: "keyword",
          value: "grocery",
          condition: "contains",
          priority: 1
        }
      ],
      transactions: 45,
      totalAmount: 1250.75,
      lastUpdated: new Date(),
      status: "active"
    },
    {
      id: "2",
      name: "Entertainment",
      description: "Movies, games, and leisure activities",
      color: "#2196F3",
      icon: "🎮",
      rules: [
        {
          id: "2",
          type: "keyword",
          value: "movie",
          condition: "contains",
          priority: 1
        }
      ],
      transactions: 12,
      totalAmount: 350.25,
      lastUpdated: new Date(),
      status: "active"
    }
  ]);

  // Dialog states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showAutoCategorize, setShowAutoCategorize] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#4CAF50",
    icon: "🛒",
    status: "active" as CategoryStatus
  });

  // New rule form state
  const [newRule, setNewRule] = useState({
    type: "keyword" as RuleType,
    value: "",
    condition: "contains" as RuleCondition,
    priority: 1
  });

  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState({
    categoryDistribution: [
      { name: "Groceries", value: 45 },
      { name: "Entertainment", value: 12 },
      { name: "Transportation", value: 25 },
      { name: "Utilities", value: 30 },
      { name: "Shopping", value: 18 }
    ],
    transactionTrends: [
      { date: "2024-01", amount: 1200 },
      { date: "2024-02", amount: 1500 },
      { date: "2024-03", amount: 1800 },
      { date: "2024-04", amount: 1600 },
      { date: "2024-05", amount: 2000 }
    ],
    categoryPerformance: [
      { name: "Groceries", transactions: 45, totalAmount: 1250.75 },
      { name: "Entertainment", transactions: 12, totalAmount: 350.25 },
      { name: "Transportation", transactions: 25, totalAmount: 800.50 },
      { name: "Utilities", transactions: 30, totalAmount: 1500.00 },
      { name: "Shopping", transactions: 18, totalAmount: 950.25 }
    ]
  });

  // Auto-categorization dialog state
  const [autoCategorizeProgress, setAutoCategorizeProgress] = useState(0);
  const [isAutoCategorizing, setIsAutoCategorizing] = useState(false);

  // Bulk edit dialog state
  const [selectedCategoriesForBulkEdit, setSelectedCategoriesForBulkEdit] = useState<string[]>([]);
  const [bulkEditAction, setBulkEditAction] = useState<"status" | "color" | "icon">("status");

  // Templates dialog state
  const [templates, setTemplates] = useState([
    { id: "1", name: "Basic Categories", description: "Essential categories for personal finance" },
    { id: "2", name: "Business Expenses", description: "Categories for business transactions" },
    { id: "3", name: "Investment Tracking", description: "Categories for investment activities" }
  ]);

  // Schedule dialog state
  const [scheduleSettings, setScheduleSettings] = useState({
    frequency: "daily",
    time: "09:00",
    days: ["monday", "wednesday", "friday"],
    notifications: true
  });

  // Filtered categories based on search
  const filteredCategories = React.useMemo(() => {
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Handle add new category
  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error("Please enter a category name");
      return;
    }

    const category: Category = {
      id: Date.now().toString(),
      ...newCategory,
      rules: [],
      transactions: 0,
      totalAmount: 0,
      lastUpdated: new Date()
    };

    setCategories(prev => [...prev, category]);
    setShowAddCategory(false);
    setNewCategory({
      name: "",
      description: "",
      color: "#4CAF50",
      icon: "🛒",
      status: "active"
    });
    toast.success("Category added successfully");
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      status: category.status
    });
    setShowAddCategory(true);
  };

  // Handle delete category
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast.success("Category deleted successfully");
  };
  
  // Handle add rule
  const handleAddRule = (categoryId: string) => {
    if (!newRule.value) {
      toast.error("Please enter a rule value");
      return;
    }

    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          rules: [...category.rules, {
            id: Date.now().toString(),
            ...newRule
          }]
        };
      }
      return category;
    }));

    setNewRule({
      type: "keyword",
      value: "",
      condition: "contains",
      priority: 1
    });
    toast.success("Rule added successfully");
  };

  // Handle edit rule
  const handleEditRule = (categoryId: string, ruleId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    const rule = category?.rules.find(r => r.id === ruleId);
    if (rule) {
      setNewRule(rule);
      // Show edit rule dialog
    }
  };
  
  // Handle delete rule
  const handleDeleteRule = (categoryId: string, ruleId: string) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          rules: category.rules.filter(rule => rule.id !== ruleId)
        };
      }
      return category;
    }));
    toast.success("Rule deleted successfully");
  };

  // Handle import categories
  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedCategories = JSON.parse(e.target?.result as string);
        setCategories(prev => [...prev, ...importedCategories]);
        toast.success("Categories imported successfully");
      } catch (error) {
        toast.error("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  // Handle export categories
  const handleExport = () => {
    const dataStr = JSON.stringify(categories, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'categories.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Categories exported successfully");
  };

  // Handle auto-categorization
  const handleAutoCategorize = () => {
    setIsAutoCategorizing(true);
    setAutoCategorizeProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setAutoCategorizeProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAutoCategorizing(false);
          toast.success("Auto-categorization completed successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  // Handle bulk edit
  const handleBulkEdit = () => {
    setShowBulkEdit(true);
  };

  // Handle bulk edit action
  const handleBulkEditAction = (action: "status" | "color" | "icon") => {
    setBulkEditAction(action);
    // Apply the action to selected categories
    setCategories(prev => prev.map(category => {
      if (selectedCategoriesForBulkEdit.includes(category.id)) {
        switch (action) {
          case "status":
            return { ...category, status: "active" as CategoryStatus };
          case "color":
            return { ...category, color: "#4CAF50" };
          case "icon":
            return { ...category, icon: "🔄" };
          default:
            return category;
        }
      }
      return category;
    }));
    toast.success("Bulk edit applied successfully");
  };

  // Handle template application
  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Apply template categories
      const newCategories = [
        {
          id: Date.now().toString(),
          name: "Groceries",
          description: "Food and household items",
          color: "#4CAF50",
          icon: "🛒",
          rules: [],
          transactions: 0,
          totalAmount: 0,
          lastUpdated: new Date(),
          status: "active" as CategoryStatus
        },
        // Add more template categories as needed
      ];
      setCategories(prev => [...prev, ...newCategories]);
      toast.success(`Applied template: ${template.name}`);
    }
  };

  // Handle schedule settings
  const handleScheduleSettings = (settings: typeof scheduleSettings) => {
    setScheduleSettings(settings);
    toast.success("Schedule settings updated");
  };

  // Handle download
  const handleDownload = () => {
    const data = {
      categories,
      analytics: analyticsData,
      settings: {
        schedule: scheduleSettings,
        templates: templates
      }
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `smart-categorization-export-${format(new Date(), 'yyyy-MM-dd')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Data exported successfully");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] p-6">
        <div className="flex items-center justify-between mb-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Tags className="h-8 w-8 text-blue-500" />
              Smart Categorization
            </h1>
            <p className="text-muted-foreground">
              Automatically categorize your transactions using AI and custom rules
            </p>
        </motion.div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowImportDialog(true)}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import categories</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowExportDialog(true)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export categories</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="categories" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
              <TabsContent value="categories" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Categories</CardTitle>
                      <Button onClick={() => setShowAddCategory(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                            <Input
                          placeholder="Search categories..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                            />
                          </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                    <div className="space-y-4">
                      {filteredCategories.map((category) => (
                        <Card key={category.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                                  style={{ backgroundColor: `${category.color}20` }}
                                >
                                  {category.icon}
                                    </div>
                                <div>
                                  <h3 className="font-semibold">{category.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {category.description}
                                  </p>
                                </div>
                              </div>
                                    <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                                  <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Transactions</p>
                                <p className="text-lg font-semibold">{category.transactions}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="text-lg font-semibold">
                                  ₹{category.totalAmount.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                <p className="text-lg font-semibold">
                                  {category.lastUpdated.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Rules</p>
                                <Button variant="ghost" size="icon" onClick={() => handleAddRule(category.id)}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Rule
                                      </Button>
                                    </div>
                              <div className="space-y-2">
                                {category.rules.map((rule) => (
                                  <div
                                    key={rule.id}
                                    className="flex items-center justify-between p-2 rounded-md bg-muted"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">
                                        {rule.type}: {rule.value}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        ({rule.condition})
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon" onClick={() => handleEditRule(category.id, rule.id)}>
                                        <Edit2 className="h-4 w-4" />
                                          </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(category.id, rule.id)}>
                                        <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                  </div>
                                  ))}
                          </div>
                        </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Rules</CardTitle>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Rule
                      </Button>
                          </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.flatMap((category) =>
                          category.rules.map((rule) => (
                            <TableRow key={rule.id}>
                              <TableCell>{category.name}</TableCell>
                              <TableCell>{rule.type}</TableCell>
                              <TableCell>{rule.value}</TableCell>
                              <TableCell>{rule.condition}</TableCell>
                              <TableCell>{rule.priority}</TableCell>
                              <TableCell>
                          <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                          </div>
                              </TableCell>
                            </TableRow>
                          ))
                    )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
          </TabsContent>
          
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                  <CardHeader>
                      <CardTitle>Category Distribution</CardTitle>
                  </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.categoryDistribution}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              label
                            />
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analyticsData.transactionTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                      </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.categoryPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="transactions" fill="#8884d8" name="Transactions" />
                          <Bar dataKey="totalAmount" fill="#82ca9d" name="Total Amount" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Category History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>2024-02-20</TableCell>
                          <TableCell>Groceries</TableCell>
                          <TableCell>Updated</TableCell>
                          <TableCell>Admin</TableCell>
                          <TableCell>Modified rules</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
                      </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                      <div className="space-y-2">
                  <Button 
                    className="w-full justify-start" 
                    onClick={handleAutoCategorize}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Auto-Categorize
                  </Button>
                                <Button
                    className="w-full justify-start" 
                    onClick={handleBulkEdit}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Bulk Edit
                                </Button>
                                <Button
                    className="w-full justify-start" 
                    onClick={() => setShowTemplates(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    onClick={() => setShowSchedule(true)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                                </Button>
                    </div>
                  </CardContent>
                </Card>

            <Card>
                  <CardHeader>
                <CardTitle>Statistics</CardTitle>
                  </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Categories</p>
                    <p className="text-2xl font-bold">{categories.length}</p>
                        </div>
                        <div>
                    <p className="text-sm text-muted-foreground">Active Rules</p>
                    <p className="text-2xl font-bold">
                      {categories.reduce((sum, cat) => sum + cat.rules.length, 0)}
                          </p>
                        </div>
                        <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">
                      {categories.reduce((sum, cat) => sum + cat.transactions, 0)}
                          </p>
                        </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Edit2 className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                      <p className="text-sm font-medium">Category Updated</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                      <p className="text-sm font-medium">New Rule Added</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                        </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
          </div>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory 
                ? "Update the category details below"
                : "Create a new category for your transactions"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={newCategory.icon}
                onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Enter emoji icon"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              {selectedCategory ? "Update" : "Add"} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Categories</DialogTitle>
            <DialogDescription>
              Import categories from a JSON file
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Categories</DialogTitle>
            <DialogDescription>
              Export your categories to a JSON file
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              This will export all your categories and their rules to a JSON file.
            </p>
                      </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownload}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-Categorize Dialog */}
      <Dialog open={showAutoCategorize} onOpenChange={setShowAutoCategorize}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auto-Categorize Transactions</DialogTitle>
            <DialogDescription>
              Automatically categorize your transactions using AI
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Progress value={autoCategorizeProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {isAutoCategorizing ? "Processing transactions..." : "Ready to start"}
            </p>
                      </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAutoCategorize(false)}>
              Cancel
            </Button>
            <Button onClick={handleAutoCategorize} disabled={isAutoCategorizing}>
              {isAutoCategorizing ? "Processing..." : "Start Auto-Categorization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Dialog */}
      <Dialog open={showBulkEdit} onOpenChange={setShowBulkEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit Categories</DialogTitle>
            <DialogDescription>
              Edit multiple categories at once
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Categories</Label>
              <ScrollArea className="h-[200px] border rounded-md p-4">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2 py-2">
                    <input
                      type="checkbox"
                      checked={selectedCategoriesForBulkEdit.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoriesForBulkEdit(prev => [...prev, category.id]);
                        } else {
                          setSelectedCategoriesForBulkEdit(prev => prev.filter(id => id !== category.id));
                        }
                      }}
                    />
                    <span>{category.name}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select
                value={bulkEditAction}
                onValueChange={(value: "status" | "color" | "icon") => handleBulkEditAction(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Change Status</SelectItem>
                  <SelectItem value="color">Change Color</SelectItem>
                  <SelectItem value="icon">Change Icon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkEdit(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowBulkEdit(false)}>
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Category Templates</DialogTitle>
            <DialogDescription>
              Choose a template to apply to your categories
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {templates.map(template => (
              <Card key={template.id} className="p-4">
                      <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                  <Button onClick={() => handleApplyTemplate(template.id)}>
                    Apply Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplates(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Settings</DialogTitle>
            <DialogDescription>
              Configure when to run auto-categorization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={scheduleSettings.frequency}
                onValueChange={(value) => handleScheduleSettings({ ...scheduleSettings, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={scheduleSettings.time}
                onChange={(e) => handleScheduleSettings({ ...scheduleSettings, time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Days</Label>
              <div className="flex flex-wrap gap-2">
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(day => (
                    <Button 
                    key={day}
                    variant={scheduleSettings.days.includes(day) ? "default" : "outline"}
                    onClick={() => {
                      const newDays = scheduleSettings.days.includes(day)
                        ? scheduleSettings.days.filter(d => d !== day)
                        : [...scheduleSettings.days, day];
                      handleScheduleSettings({ ...scheduleSettings, days: newDays });
                    }}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Button>
                ))}
      </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={scheduleSettings.notifications}
                onChange={(e) => handleScheduleSettings({ ...scheduleSettings, notifications: e.target.checked })}
              />
              <Label>Enable notifications</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSchedule(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowSchedule(false)}>
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SmartCategorization;
