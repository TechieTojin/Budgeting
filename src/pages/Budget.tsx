import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BudgetProgressCard } from "@/components/dashboard/BudgetProgressCard";
import { 
  Plus, 
  TrendingUp, 
  Lightbulb, 
  Landmark, 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  AlertTriangle, 
  Calendar,
  Wallet,
  PiggyBank,
  BarChart3,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  PieChart,
  LineChart,
  Settings,
  Edit,
  Trash2,
  MoreVertical,
  Info,
  Mail,
  Receipt,
  FileText
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';
import { SmartBudgetForm } from "@/components/budget/SmartBudgetForm";
import type { Budget } from "@/utils/budgetUtils";
import { 
  Transaction,
  BudgetInsight,
  BudgetPrediction as BudgetPredictionType,
  Recommendation,
  SpendingPattern,
  predictMonthlySpending,
  analyzeSpendingPatterns,
  generateInsights,
  generateRecommendations,
  suggestBudgetAllocation
} from "@/utils/budgetUtils";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar
} from "recharts";
import { EmailExtractedData } from "@/components/email/EmailExtractedData";

// Sample data for visualizations
const monthlyData = [
  { name: "Jan", income: 85000, expenses: 45000, savings: 40000 },
  { name: "Feb", income: 87000, expenses: 48000, savings: 39000 },
  { name: "Mar", income: 90000, expenses: 46000, savings: 44000 },
  { name: "Apr", income: 88000, expenses: 47000, savings: 41000 },
  { name: "May", income: 95000, expenses: 48000, savings: 47000 },
  { name: "Jun", income: 92000, expenses: 43000, savings: 49000 },
];

// Update the COLORS array with more vibrant and accessible colors
const COLORS = [
  '#2563eb', // Blue
  '#16a34a', // Green
  '#dc2626', // Red
  '#9333ea', // Purple
  '#ea580c', // Orange
  '#0891b2', // Cyan
  '#4f46e5', // Indigo
  '#be185d', // Pink
];

// Add section color constants
const SECTION_COLORS = {
  overview: {
    primary: '#2563eb', // Blue
    secondary: '#3b82f6',
    accent: '#60a5fa',
    bg: 'from-blue-500/5 to-blue-500/10'
  },
  categories: {
    primary: '#16a34a', // Green
    secondary: '#22c55e',
    accent: '#4ade80',
    bg: 'from-green-500/5 to-green-500/10'
  },
  trends: {
    primary: '#9333ea', // Purple
    secondary: '#a855f7',
    accent: '#c084fc',
    bg: 'from-purple-500/5 to-purple-500/10'
  },
  insights: {
    primary: '#ea580c', // Orange
    secondary: '#f97316',
    accent: '#fb923c',
    bg: 'from-orange-500/5 to-orange-500/10'
  }
};

const emailSectionColors = {
  receipts: {
    primary: 'from-blue-500 to-indigo-600',
    secondary: 'bg-blue-500/10',
    text: 'text-blue-600',
    border: 'border-blue-500/20',
    hover: 'hover:bg-blue-500/5',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20'
  },
  subscriptions: {
    primary: 'from-purple-500 to-violet-600',
    secondary: 'bg-purple-500/10',
    text: 'text-purple-600',
    border: 'border-purple-500/20',
    hover: 'hover:bg-purple-500/5',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-violet-600/20'
  },
  bills: {
    primary: 'from-amber-500 to-orange-600',
    secondary: 'bg-amber-500/10',
    text: 'text-amber-600',
    border: 'border-amber-500/20',
    hover: 'hover:bg-amber-500/5',
    gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-600/20'
  }
};

const BudgetPage = () => {
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('month');
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<BudgetInsight[]>([]);
  const [predictions, setPredictions] = useState<BudgetPredictionType[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [patterns, setPatterns] = useState<SpendingPattern[]>([]);
  const [suggestedBudgets, setSuggestedBudgets] = useState<Record<string, number>>({});
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Sample data for budget progress
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: "1", category: "Housing", spent: 12000, limit: 15000, remaining: 3000, percentage: 80 },
    { id: "2", category: "Food", spent: 5000, limit: 5500, remaining: 500, percentage: 91 },
    { id: "3", category: "Transport", spent: 3000, limit: 4000, remaining: 1000, percentage: 75 },
    { id: "4", category: "Entertainment", spent: 2000, limit: 3000, remaining: 1000, percentage: 67 },
    { id: "5", category: "Shopping", spent: 2500, limit: 4000, remaining: 1500, percentage: 63 },
    { id: "6", category: "Healthcare", spent: 1200, limit: 3000, remaining: 1800, percentage: 40 },
  ]);

  // Add state for monthly data
  const [monthlyData, setMonthlyData] = useState([
    { name: "Jan", income: 85000, expenses: 45000, savings: 40000 },
    { name: "Feb", income: 87000, expenses: 48000, savings: 39000 },
    { name: "Mar", income: 90000, expenses: 46000, savings: 44000 },
    { name: "Apr", income: 88000, expenses: 47000, savings: 41000 },
    { name: "May", income: 95000, expenses: 48000, savings: 47000 },
    { name: "Jun", income: 92000, expenses: 43000, savings: 49000 },
  ]);

  // Add state for pie chart data
  const [pieChartData, setPieChartData] = useState(budgets.map(budget => ({
    name: budget.category,
    value: budget.spent,
    limit: budget.limit,
    remaining: budget.remaining
  })));

  // Generate AI insights and predictions on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const suggested = suggestBudgetAllocation([], monthlyIncome);
      setSuggestedBudgets(suggested);

      const currentDate = new Date();
      const dayOfMonth = currentDate.getDate();

      const budgetPredictions = predictMonthlySpending([], budgets, dayOfMonth);
      setPredictions(budgetPredictions);

      const spendingPatterns = analyzeSpendingPatterns([], 3);
      setPatterns(spendingPatterns);

      const budgetInsights = generateInsights([], budgets, budgetPredictions, spendingPatterns);
      setInsights(budgetInsights);

      const budgetRecommendations = generateRecommendations(budgets, budgetPredictions, spendingPatterns, []);
      setRecommendations(budgetRecommendations);

      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddBudget = (data: { category: string; limit: number; isAIRecommended: boolean }) => {
    const newBudget: Budget = {
      id: `${budgets.length + 1}`,
      category: data.category,
      limit: data.limit,
      spent: 0,
      remaining: data.limit,
      percentage: 0,
    };

    const updatedBudgets = [...budgets, newBudget];
    setBudgets(updatedBudgets);

    // Update monthly data with new budget
    const updatedMonthlyData = monthlyData.map(month => ({
      ...month,
      expenses: month.expenses + (data.limit * 0.3), // Add 30% of new budget to expenses
      savings: month.savings + (data.limit * 0.1), // Add 10% of new budget to savings
    }));
    setMonthlyData(updatedMonthlyData);

    // Update pie chart data
    const updatedPieChartData = updatedBudgets.map(budget => ({
      name: budget.category,
      value: budget.spent,
      limit: budget.limit,
      remaining: budget.remaining
    }));
    setPieChartData(updatedPieChartData);

    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    
    const newPredictions = predictMonthlySpending([], updatedBudgets, dayOfMonth);
    setPredictions(newPredictions);

    const newInsights = generateInsights([], updatedBudgets, newPredictions, patterns);
    setInsights(newInsights);

    const newRecommendations = generateRecommendations(updatedBudgets, newPredictions, patterns, []);
    setRecommendations(newRecommendations);

    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));

    toast.success(`Budget for ${data.category} added successfully${data.isAIRecommended ? ' using AI recommendations' : ''}`);
    
    setIsAddBudgetOpen(false);
  };

  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      const parsedBudgets = JSON.parse(savedBudgets);
      setBudgets(parsedBudgets);
    }
  }, []);

  const handleApplyRecommendation = (recommendation: Recommendation) => {
    if (recommendation.type === "reallocation" && recommendation.category) {
      const updatedBudgets = budgets.map(budget => 
        budget.category.toLowerCase() === recommendation.category 
          ? { ...budget, limit: budget.limit + 50, remaining: budget.remaining + 50 } 
          : budget
      );
      
      setBudgets(updatedBudgets);
      setRecommendations(recommendations.filter(r => r.id !== recommendation.id));
      toast.success(`Recommendation applied: Budget adjusted for ${recommendation.category}`);
    } else if (recommendation.type === "savings") {
      toast.success("Savings recommendation noted. We'll remind you of this strategy.");
    } else {
      toast.success("Recommendation applied successfully");
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsEditMode(true);
  };

  const handleDeleteBudget = (budgetId: string) => {
    setBudgets(budgets.filter(b => b.id !== budgetId));
    toast.success("Budget deleted successfully");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Calculate total budget statistics
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const budgetUtilization = (totalSpent / totalBudget) * 100;

  const emailData = {
    receipts: [
      {
        id: "1",
        vendor: "Amazon",
        date: "2024-03-15",
        amount: 2499,
        category: "Shopping",
        items: [
          { name: "Wireless Earbuds", price: 2499, quantity: 1 }
        ],
        status: "processed" as const
      },
      {
        id: "2",
        vendor: "Swiggy",
        date: "2024-03-14",
        amount: 450,
        category: "Food",
        items: [
          { name: "Pizza", price: 350, quantity: 1 },
          { name: "Coke", price: 100, quantity: 1 }
        ],
        status: "processed" as const
      }
    ],
    subscriptions: [
      {
        id: "1",
        service: "Netflix",
        amount: 499,
        billingCycle: "monthly" as const,
        nextBillingDate: "2024-04-15",
        status: "active" as const
      },
      {
        id: "2",
        service: "Spotify",
        amount: 119,
        billingCycle: "monthly" as const,
        nextBillingDate: "2024-04-10",
        status: "active" as const
      }
    ],
    bills: [
      {
        id: "1",
        provider: "Electricity Board",
        amount: 1200,
        dueDate: "2024-03-25",
        category: "Utilities",
        status: "pending" as const
      },
      {
        id: "2",
        provider: "Internet Provider",
        amount: 799,
        dueDate: "2024-03-20",
        category: "Utilities",
        status: "paid" as const
      }
    ]
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-1"
          >
            <h1 className="text-3xl font-bold tracking-tight">
              {t('budget_management')}
            </h1>
            <p className="text-muted-foreground">
              Manage your monthly budgets and track your spending
            </p>
          </motion.div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Plus className="h-4 w-4" />
                  {t('add_budget')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Budget</DialogTitle>
                  <DialogDescription>
                    Create a new budget category with a monthly spending limit. You can use AI recommendations based on your spending patterns.
                  </DialogDescription>
                </DialogHeader>
                <SmartBudgetForm
                  onSubmit={handleAddBudget}
                  onCancel={() => setIsAddBudgetOpen(false)}
                  suggestedBudgets={suggestedBudgets}
                  monthlyIncome={monthlyIncome}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <motion.div variants={itemAnimation}>
            <Card className={`bg-gradient-to-br ${SECTION_COLORS.overview.bg} backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg flex items-center gap-2 text-[${SECTION_COLORS.overview.primary}]`}>
                  <Wallet className="h-5 w-5" />
                  {t('total_budget')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  ₹{totalBudget.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className={`bg-[${SECTION_COLORS.overview.primary}]/10 text-[${SECTION_COLORS.overview.primary}]`}>
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Monthly budget limit
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemAnimation}>
            <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <BarChart3 className="h-5 w-5" />
                  {t('budget_utilization')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight">
                  ₹{totalSpent.toLocaleString()}
                  <span className="text-sm text-muted-foreground ml-2">
                    / ₹{totalBudget.toLocaleString()}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Percent className="h-3 w-3 mr-1" />
                    {budgetUtilization.toFixed(1)}% used
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemAnimation}>
            <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <PiggyBank className="h-5 w-5" />
                  {t('remaining_budget')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight text-green-600">
                  ₹{totalRemaining.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    Available to spend
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemAnimation}>
            <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <AlertTriangle className="h-5 w-5" />
                  {t('alerts')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight text-yellow-600">
                  {budgets.filter(budget => budget.percentage >= 80).length}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Categories near limit
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Categories and Progress */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={`bg-gradient-to-br ${SECTION_COLORS.categories.bg} backdrop-blur-sm border-none shadow-lg`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 text-[${SECTION_COLORS.categories.primary}]`}>
                    <PiggyBank className="h-5 w-5" />
                    {t('budget_categories')}
                  </CardTitle>
                  <Badge variant="outline" className={`text-xs bg-[${SECTION_COLORS.categories.primary}]/10 text-[${SECTION_COLORS.categories.primary}]`}>
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <AnimatePresence>
                    {budgets.map((budget, index) => (
                      <motion.div
                        key={budget.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative p-4 rounded-lg hover:bg-[${SECTION_COLORS.categories.primary}]/5 transition-colors"
                      >
                        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditBudget(budget)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Budget
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteBudget(budget.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Budget
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{budget.category}</span>
                            <Badge 
                              variant={budget.percentage >= 80 ? "destructive" : "default"}
                              className={cn(
                                "transition-colors",
                                  budget.percentage >= 80 
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400" 
                                    : "bg-green-500/10 text-green-600 dark:text-green-400"
                              )}
                            >
                              {budget.percentage}%
                            </Badge>
                          </div>
                          <div className="text-right">
                              <p className="font-medium text-foreground">
                              ₹{budget.spent.toLocaleString('en-IN')} / ₹{budget.limit.toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {budget.percentage >= 80 ? (
                                  <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                                  <ArrowUpRight className="h-3 w-3" />
                                  Near limit
                                </span>
                              ) : (
                                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                  <ArrowDownRight className="h-3 w-3" />
                                  On track
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Progress 
                          value={budget.percentage} 
                          className={cn(
                            "h-2 transition-all",
                              budget.percentage >= 80 
                                ? "bg-red-100 dark:bg-red-900/20" 
                                : "bg-green-100 dark:bg-green-900/20"
                          )}
                        />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend Chart */}
            <Card className={`bg-gradient-to-br ${SECTION_COLORS.trends.bg} backdrop-blur-sm border-none shadow-lg`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-[${SECTION_COLORS.trends.primary}]`}>
                  <LineChart className="h-5 w-5" />
                  Monthly Budget Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="name" 
                        className="text-sm text-muted-foreground" 
                        tick={{ fill: 'currentColor' }}
                      />
                      <YAxis 
                        className="text-sm text-muted-foreground"
                        tick={{ fill: 'currentColor' }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background)',
                          border: '1px solid var(--border)',
                          borderRadius: '0.5rem',
                          color: 'var(--foreground)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke={SECTION_COLORS.trends.primary}
                        strokeWidth={2}
                        dot={{ r: 4, fill: SECTION_COLORS.trends.primary }}
                        activeDot={{ r: 6, fill: SECTION_COLORS.trends.primary }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke={SECTION_COLORS.trends.secondary}
                        strokeWidth={2}
                        dot={{ r: 4, fill: SECTION_COLORS.trends.secondary }}
                        activeDot={{ r: 6, fill: SECTION_COLORS.trends.secondary }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke={SECTION_COLORS.trends.accent}
                        strokeWidth={2}
                        dot={{ r: 4, fill: SECTION_COLORS.trends.accent }}
                        activeDot={{ r: 6, fill: SECTION_COLORS.trends.accent }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Email Extracted Data Section */}
            <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Mail className="h-5 w-5" />
                  Email Extracted Data
                </CardTitle>
                <CardDescription>
                  Smart insights from your email transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Receipts Section */}
                  <div className={`p-4 rounded-xl ${emailSectionColors.receipts.gradient} border ${emailSectionColors.receipts.border}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-semibold flex items-center gap-2 ${emailSectionColors.receipts.text}`}>
                        <Receipt className="h-4 w-4" />
                        Receipts
                      </h3>
                      <Badge variant="outline" className={emailSectionColors.receipts.secondary}>
                        {emailData.receipts.length} items
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {emailData.receipts.map((receipt) => (
                        <div key={receipt.id} className={`p-3 rounded-lg ${emailSectionColors.receipts.hover} transition-colors`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{receipt.vendor}</span>
                            <Badge variant="outline" className={emailSectionColors.receipts.secondary}>
                              ₹{receipt.amount.toLocaleString()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {receipt.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subscriptions Section */}
                  <div className={`p-4 rounded-xl ${emailSectionColors.subscriptions.gradient} border ${emailSectionColors.subscriptions.border}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-semibold flex items-center gap-2 ${emailSectionColors.subscriptions.text}`}>
                        <FileText className="h-4 w-4" />
                        Subscriptions
                      </h3>
                      <Badge variant="outline" className={emailSectionColors.subscriptions.secondary}>
                        {emailData.subscriptions.length} active
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {emailData.subscriptions.map((subscription) => (
                        <div key={subscription.id} className={`p-3 rounded-lg ${emailSectionColors.subscriptions.hover} transition-colors`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{subscription.service}</span>
                            <Badge variant="outline" className={emailSectionColors.subscriptions.secondary}>
                              ₹{subscription.amount.toLocaleString()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            Next: {subscription.nextBillingDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bills Section */}
                  <div className={`p-4 rounded-xl ${emailSectionColors.bills.gradient} border ${emailSectionColors.bills.border}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-semibold flex items-center gap-2 ${emailSectionColors.bills.text}`}>
                        <FileText className="h-4 w-4" />
                        Bills
                      </h3>
                      <Badge variant="outline" className={emailSectionColors.bills.secondary}>
                        {emailData.bills.length} pending
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {emailData.bills.map((bill) => (
                        <div key={bill.id} className={`p-3 rounded-lg ${emailSectionColors.bills.hover} transition-colors`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{bill.provider}</span>
                            <Badge variant="outline" className={emailSectionColors.bills.secondary}>
                              ₹{bill.amount.toLocaleString()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            Due: {bill.dueDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="mt-6 p-4 rounded-xl bg-primary/5">
                  <h3 className="font-semibold mb-4">Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Receipts</p>
                      <p className="text-xl font-bold">{emailData.receipts.length}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                      <p className="text-xl font-bold">{emailData.subscriptions.length}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Pending Bills</p>
                      <p className="text-xl font-bold">{emailData.bills.length}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl font-bold">₹{(
                        emailData.receipts.reduce((sum, r) => sum + r.amount, 0) +
                        emailData.subscriptions.reduce((sum, s) => sum + s.amount, 0) +
                        emailData.bills.reduce((sum, b) => sum + b.amount, 0)
                      ).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Budget Distribution */}
            <Card className={`bg-gradient-to-br ${SECTION_COLORS.trends.bg} backdrop-blur-sm border-none shadow-lg`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-[${SECTION_COLORS.trends.primary}]`}>
                  <PieChart className="h-5 w-5" />
                  Budget Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background)',
                          border: '1px solid var(--border)',
                          borderRadius: '0.5rem',
                          color: 'var(--foreground)'
                        }}
                      />
                      <Legend 
                        formatter={(value) => (
                          <span className="text-foreground">{value}</span>
                        )}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Smart Insights */}
            <Card className={`bg-gradient-to-br ${SECTION_COLORS.insights.bg} backdrop-blur-sm border-none shadow-lg`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-[${SECTION_COLORS.insights.primary}]`}>
                  <BrainCircuit className="h-5 w-5" />
                  Smart Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {insights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start gap-3 p-4 bg-[${SECTION_COLORS.insights.primary}]/5 rounded-lg hover:bg-[${SECTION_COLORS.insights.primary}]/10 transition-colors`}
                      >
                        <Lightbulb className={cn(
                          "h-5 w-5 mt-0.5",
                          insight.type === 'warning' ? "text-yellow-500" :
                          insight.type === 'success' ? "text-green-500" :
                          `text-[${SECTION_COLORS.insights.primary}]`
                        )} />
                        <div>
                          <p className="font-medium text-foreground">{insight.title}</p>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className={`bg-gradient-to-br ${SECTION_COLORS.insights.bg} backdrop-blur-sm border-none shadow-lg`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-[${SECTION_COLORS.insights.primary}]`}>
                  <Sparkles className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {recommendations.map((recommendation, index) => (
                      <motion.div
                        key={recommendation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      className={`p-4 bg-[${SECTION_COLORS.insights.primary}]/5 rounded-lg hover:bg-[${SECTION_COLORS.insights.primary}]/10 transition-colors`}
                      >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{recommendation.title}</p>
                            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplyRecommendation(recommendation)}
                          className={`bg-[${SECTION_COLORS.insights.primary}]/10 text-[${SECTION_COLORS.insights.primary}] hover:bg-[${SECTION_COLORS.insights.primary}]/20`}
                        >
                          Apply
                        </Button>
                      </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BudgetPage;
