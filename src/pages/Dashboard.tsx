import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { SpendingOverviewChart } from "@/components/dashboard/SpendingOverviewChart";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { BudgetProgressCard } from "@/components/dashboard/BudgetProgressCard";
import { SmartInsightsCard } from "@/components/dashboard/SmartInsightsCard";
import { 
  DollarSign, 
  ShoppingCart, 
  Wallet, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell,
  Settings,
  ChevronDown,
  IndianRupee,
  Activity,
  Target,
  AlertTriangle,
  Info,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  PiggyBank,
  Landmark,
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Coffee,
  Smartphone,
  Zap,
  Brain,
  Lightbulb,
  Share2,
  Download,
  RefreshCw,
  Plus,
  Users,
  Gift,
  Award,
  Clock,
  Star,
  Heart,
  Shield,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { EmailExtractedData } from "@/components/email/EmailExtractedData";

// Define types for components
interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
  merchant: string;
  paymentMethod: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: "positive" | "negative" | "neutral";
  impact: string;
  recommendation: string;
}

// Update the BalanceCard type to include 'savings'
interface BalanceCardProps {
  title: string;
  amount: number;
  percentageChange: number;
  type: 'income' | 'expense' | 'balance' | 'savings';
  icon: React.ReactNode;
}
  
  // Function to capitalize first letter of each word
  const capitalize = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

// Update the color constants with new modern color schemes
const sectionColors = {
  investment: {
    primary: 'from-sky-500 to-blue-600',
    secondary: 'bg-sky-500/10',
    text: 'text-sky-600',
    border: 'border-sky-500/20',
    hover: 'hover:bg-sky-500/5',
    gradient: 'bg-gradient-to-br from-sky-500/20 to-blue-600/20'
  },
  health: {
    primary: 'from-teal-500 to-emerald-600',
    secondary: 'bg-teal-500/10',
    text: 'text-teal-600',
    border: 'border-teal-500/20',
    hover: 'hover:bg-teal-500/5',
    gradient: 'bg-gradient-to-br from-teal-500/20 to-emerald-600/20'
  },
  savings: {
    primary: 'from-fuchsia-500 to-purple-600',
    secondary: 'bg-fuchsia-500/10',
    text: 'text-fuchsia-600',
    border: 'border-fuchsia-500/20',
    hover: 'hover:bg-fuchsia-500/5',
    gradient: 'bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20'
  },
  predictions: {
    primary: 'from-amber-500 to-orange-600',
    secondary: 'bg-amber-500/10',
    text: 'text-amber-600',
    border: 'border-amber-500/20',
    hover: 'hover:bg-amber-500/5',
    gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-600/20'
  },
  credit: {
    primary: 'from-pink-500 to-rose-600',
    secondary: 'bg-pink-500/10',
    text: 'text-pink-600',
    border: 'border-pink-500/20',
    hover: 'hover:bg-pink-500/5',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20'
  },
  subscription: {
    primary: 'from-indigo-500 to-violet-600',
    secondary: 'bg-indigo-500/10',
    text: 'text-indigo-600',
    border: 'border-indigo-500/20',
    hover: 'hover:bg-indigo-500/5',
    gradient: 'bg-gradient-to-br from-indigo-500/20 to-violet-600/20'
  },
  tax: {
    primary: 'from-cyan-500 to-blue-600',
    secondary: 'bg-cyan-500/10',
    text: 'text-cyan-600',
    border: 'border-cyan-500/20',
    hover: 'hover:bg-cyan-500/5',
    gradient: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20'
  },
  calendar: {
    primary: 'from-green-500 to-emerald-600',
    secondary: 'bg-green-500/10',
    text: 'text-green-600',
    border: 'border-green-500/20',
    hover: 'hover:bg-green-500/5',
    gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20'
  },
  education: {
    primary: 'from-violet-500 to-purple-600',
    secondary: 'bg-violet-500/10',
    text: 'text-violet-600',
    border: 'border-violet-500/20',
    hover: 'hover:bg-violet-500/5',
    gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-600/20'
  }
};

const chartColors = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#8b5cf6',
  warning: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  info: '#06b6d4'
  };

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("month");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setIsLoading(true);
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Updated to ${value} view`);
    }, 1000);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dashboard refreshed successfully");
    }, 1500);
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Handle AI Insights
  const handleAIInsights = () => {
    navigate('/ai-insights');
  };

  // Handle transaction click
  const handleTransactionClick = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  };

  // Handle category click
  const handleCategoryClick = (category: string) => {
    navigate(`/transactions?category=${category}`);
  };

  // Handle budget click
  const handleBudgetClick = (category: string) => {
    navigate(`/budget/${category}`);
  };

  // Handle insight click
  const handleInsightClick = (insightId: string) => {
    navigate(`/insights/${insightId}`);
  };

  // Enhanced sample data
  const monthlyData = [
    { name: "Jan", income: 85000, expenses: 45000, savings: 40000 },
    { name: "Feb", income: 87000, expenses: 48000, savings: 39000 },
    { name: "Mar", income: 90000, expenses: 46000, savings: 44000 },
    { name: "Apr", income: 88000, expenses: 47000, savings: 41000 },
    { name: "May", income: 95000, expenses: 48000, savings: 47000 },
    { name: "Jun", income: 92000, expenses: 43000, savings: 49000 },
  ];

  const categoryData = [
    { name: "Housing", value: 25000, color: "#0C6E81", trend: "+5%" },
    { name: "Food", value: 15000, color: "#2A9D8F", trend: "-2%" },
    { name: "Transport", value: 8000, color: "#E9C46A", trend: "+8%" },
    { name: "Entertainment", value: 5000, color: "#F4A261", trend: "-5%" },
    { name: "Shopping", value: 7000, color: "#E76F51", trend: "+12%" },
  ];

  const budgetData = [
    { category: "Housing", spent: 25000, limit: 30000, percentage: 83, trend: "+5%" },
    { category: "Food", spent: 15000, limit: 18000, percentage: 83, trend: "-2%" },
    { category: "Transport", spent: 8000, limit: 10000, percentage: 80, trend: "+8%" },
    { category: "Entertainment", spent: 5000, limit: 8000, percentage: 63, trend: "-5%" },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      date: new Date(2024, 2, 15),
      amount: 2500,
      category: 'Food',
      description: 'Grocery Shopping at BigBasket',
      type: 'expense',
      status: 'completed',
      merchant: 'BigBasket',
      paymentMethod: 'Credit Card'
    },
    {
      id: '2',
      date: new Date(2024, 2, 14),
      amount: 15000,
      category: 'Housing',
      description: 'Monthly Rent Payment',
      type: 'expense',
      status: 'completed',
      merchant: 'Apartment Complex',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '3',
      date: new Date(2024, 2, 13),
      amount: 75000,
      category: 'Income',
      description: 'Monthly Salary',
      type: 'income',
      status: 'completed',
      merchant: 'Company Inc.',
      paymentMethod: 'Direct Deposit'
    },
    {
      id: '4',
      date: new Date(2024, 2, 12),
      amount: 1200,
      category: 'Transport',
      description: 'Fuel Payment',
      type: 'expense',
      status: 'completed',
      merchant: 'Shell',
      paymentMethod: 'Debit Card'
    },
    {
      id: '5',
      date: new Date(2024, 2, 11),
      amount: 3500,
      category: 'Shopping',
      description: 'Online Shopping - Amazon',
      type: 'expense',
      status: 'pending',
      merchant: 'Amazon',
      paymentMethod: 'Credit Card'
    },
    {
      id: '6',
      date: new Date(2024, 2, 10),
      amount: 2000,
      category: 'Entertainment',
      description: 'Movie Tickets',
      type: 'expense',
      status: 'completed',
      merchant: 'PVR Cinemas',
      paymentMethod: 'UPI'
    }
  ];

  const smartInsights = [
    {
      id: "1",
      title: "Budget Alert",
      description: "Your Food category is at 83% of monthly budget. Consider adjusting your spending for the rest of the month.",
      type: "negative" as const,
      impact: "high",
      recommendation: "Try meal prepping to reduce food delivery expenses"
    },
    {
      id: "2",
      title: "Potential Savings",
      description: "We've identified ₹2,500 in potential savings from subscription services you rarely use.",
      type: "positive" as const,
      impact: "medium",
      recommendation: "Review and cancel unused subscriptions"
    },
    {
      id: "3",
      title: "Spending Trend",
      description: "Your overall spending this month is 5% lower than last month. Great job!",
      type: "positive" as const,
      impact: "high",
      recommendation: "Maintain this spending pattern"
    },
  ];

  const financialGoals = [
    {
      id: 1,
      title: "Emergency Fund",
      target: 500000,
      current: 350000,
      deadline: new Date(2024, 11, 31),
      type: "savings"
    },
    {
      id: 2,
      title: "New Car",
      target: 800000,
      current: 200000,
      deadline: new Date(2025, 5, 30),
      type: "purchase"
    },
    {
      id: 3,
      title: "Vacation Fund",
      target: 150000,
      current: 75000,
      deadline: new Date(2024, 7, 31),
      type: "travel"
    }
  ];

  const upcomingBills = [
    {
      id: 1,
      title: "Electricity Bill",
      amount: 2500,
      dueDate: new Date(2024, 2, 25),
      category: "Utilities",
      status: "pending"
    },
    {
      id: 2,
      title: "Internet Bill",
      amount: 1200,
      dueDate: new Date(2024, 2, 28),
      category: "Utilities",
      status: "pending"
    },
    {
      id: 3,
      title: "Credit Card Payment",
      amount: 15000,
      dueDate: new Date(2024, 2, 30),
      category: "Credit",
      status: "pending"
    }
  ];

  const spendingTrendData = [
    { month: 'Jan', income: 85000, expenses: 45000, savings: 40000 },
    { month: 'Feb', income: 87000, expenses: 48000, savings: 39000 },
    { month: 'Mar', income: 90000, expenses: 46000, savings: 44000 },
    { month: 'Apr', income: 88000, expenses: 47000, savings: 41000 },
    { month: 'May', income: 95000, expenses: 48000, savings: 47000 },
    { month: 'Jun', income: 92000, expenses: 43000, savings: 49000 }
  ];

  const categoryDistributionData = [
    { name: 'Housing', value: 25000, color: chartColors.primary },
    { name: 'Food', value: 15000, color: chartColors.secondary },
    { name: 'Transport', value: 8000, color: chartColors.accent },
    { name: 'Entertainment', value: 5000, color: chartColors.warning },
    { name: 'Shopping', value: 7000, color: chartColors.danger }
  ];

  const monthlyComparisonData = [
    { category: 'Housing', current: 25000, previous: 23000 },
    { category: 'Food', current: 15000, previous: 16000 },
    { category: 'Transport', current: 8000, previous: 7500 },
    { category: 'Entertainment', current: 5000, previous: 6000 },
    { category: 'Shopping', current: 7000, previous: 6500 }
  ];

  const savingsProgressData = [
    { month: 'Jan', target: 50000, actual: 40000 },
    { month: 'Feb', target: 50000, actual: 39000 },
    { month: 'Mar', target: 50000, actual: 44000 },
    { month: 'Apr', target: 50000, actual: 41000 },
    { month: 'May', target: 50000, actual: 47000 },
    { month: 'Jun', target: 50000, actual: 49000 }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

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
      <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Modern Header with Enhanced Gradient */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 dark:border-gray-800">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-extrabold capitalize bg-gradient-to-r from-sky-500 to-blue-500 text-transparent bg-clip-text drop-shadow-lg">
            {capitalize(t('dashboard'))}
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              {t('welcome_dashboard')}
            </p>
          </motion.div>
          
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px] glassmorphism border-none shadow-md">
                <SelectValue placeholder={t('select_time_range')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{t('this_week')}</SelectItem>
                <SelectItem value="month">{t('this_month')}</SelectItem>
                <SelectItem value="quarter">{t('this_quarter')}</SelectItem>
                <SelectItem value="year">{t('this_year')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="glassmorphism border-none shadow-md hover:bg-primary/10"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button 
              size="sm" 
              className="gap-2 bg-gradient-to-r from-primary to-blue-500 text-white border-none shadow-md hover:opacity-90 transition-opacity"
              onClick={handleAIInsights}
            >
              <Sparkles className="h-4 w-4" />
              {t('ai_insights')}
            </Button>
          </motion.div>
        </div>
        
        {/* Overview Cards with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: t('total_balance'),
              amount: 199000,
              percentageChange: 12.5,
              type: "balance" as const,
              icon: <IndianRupee className="h-6 w-6 text-sky-600" />,
              color: sectionColors.investment
            },
            {
              title: t('monthly_income'),
              amount: 95000,
              percentageChange: 5.2,
              type: "income" as const,
              icon: <Wallet className="h-6 w-6 text-teal-600" />,
              color: sectionColors.health
            },
            {
              title: t('monthly_expenses'),
              amount: 48000,
              percentageChange: -3.8,
              type: "expense" as const,
              icon: <ShoppingCart className="h-6 w-6 text-fuchsia-600" />,
              color: sectionColors.savings
            },
            {
              title: t('monthly_savings'),
              amount: 47000,
              percentageChange: 15.2,
              type: "savings" as const,
              icon: <PiggyBank className="h-6 w-6 text-amber-600" />,
              color: sectionColors.predictions
            }
          ].map((card, index) => (
          <motion.div 
              key={index}
              custom={index} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
              className={`glassmorphism p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-300 border ${card.color.border} ${card.color.gradient}`}
          >
            <BalanceCard
                title={card.title}
                amount={card.amount}
                percentageChange={card.percentageChange}
                type={card.type}
                icon={card.icon}
            />
          </motion.div>
          ))}
        </div>
          
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Charts and Transactions */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Spending Overview Chart */}
          <motion.div 
            custom={4} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
              className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/10"
          >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-primary" />
                  {t('spending_overview')}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/10">
                    <TrendingUp className="h-3 w-3 mr-1 text-primary" />
                    +5.2% {t('vs_last_month')}
                  </Badge>
                </div>
              </div>
              <SpendingOverviewChart data={monthlyData} />
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">{t('income_label')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-muted-foreground">{t('expenses_label')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-muted-foreground">{t('savings_label')}</span>
                  </div>
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal text-primary hover:text-primary/80" 
                  size="sm"
                  onClick={() => handleNavigation('/reports')}
                >
                  {t('view_detailed_reports')} <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
            </div>
          </motion.div>
        
            {/* Recent Transactions */}
          <motion.div
            custom={5} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
              className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {t('recent_transactions')}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/10">
                    <Activity className="h-3 w-3 mr-1 text-primary" />
                    {t('last_5_transactions')}
                  </Badge>
                </div>
              </div>
              <RecentTransactions transactions={recentTransactions} />
              <div className="mt-6 flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 hover:bg-primary/10"
                  onClick={() => handleNavigation('/transactions')}
                >
                  <Plus className="h-4 w-4" />
                  {t('add_new_transaction')}
                </Button>
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal text-primary hover:text-primary/80" 
                  size="sm"
                  onClick={() => handleNavigation('/transactions')}
                >
                  {t('view_all_transactions')} <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
            </div>
          </motion.div>
          </div>
          
          {/* Right Column - Stats and Insights */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Category Distribution */}
          <motion.div
            custom={6} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
              className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/10"
          >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  {t('category_distribution')}
                </h2>
                <Badge variant="outline" className="text-xs bg-primary/10">
                  <Activity className="h-3 w-3 mr-1 text-primary" />
                  This Month
                </Badge>
              </div>
              <CategoryDistributionChart data={categoryData} />
              <div className="mt-6 space-y-3">
                {categoryData.map((category, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between cursor-pointer hover:bg-primary/5 p-3 rounded-xl transition-colors"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">₹{category.value.toLocaleString('en-IN')}</span>
                      <Badge 
                        variant={category.trend.startsWith('+') ? 'default' : 'destructive'} 
                        className="text-xs"
                      >
                        {category.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        
            {/* Budget Progress */}
        <motion.div
          custom={7} 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
              className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                      {t('budget_progress')}
                </h2>
                <Badge variant="outline" className="text-xs bg-primary/10">
                  <Calendar className="h-3 w-3 mr-1 text-primary" />
                      April 2024
                    </Badge>
                  </div>
                  <BudgetProgressCard budgets={budgetData} />
              <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm text-muted-foreground">{t('warning_over_80')}</span>
                    </div>
                    <Button 
                      variant="link" 
                  className="p-0 h-auto font-normal text-primary hover:text-primary/80" 
                      size="sm"
                      onClick={() => handleBudgetClick('Food')}
                    >
                      {t('manage_budgets')} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Row - Additional Features */}
        <div className="grid grid-cols-12 gap-6">
          {/* Financial Goals */}
            <motion.div
              custom={8} 
              initial="hidden" 
              animate="visible" 
              variants={fadeIn}
            className="col-span-12 lg:col-span-4 glassmorphism p-6 rounded-2xl shadow-lg border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                      {t('financial_goals')}
              </h2>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
            <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {financialGoals.map((goal) => (
                  <div key={goal.id} className="space-y-3 p-4 rounded-xl hover:bg-primary/5 transition-colors">
                          <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                goal.type === 'savings' ? 'bg-green-100 text-green-600' :
                                goal.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                          {goal.type === 'savings' ? <PiggyBank className="h-5 w-5" /> :
                           goal.type === 'purchase' ? <ShoppingBag className="h-5 w-5" /> :
                           <Gift className="h-5 w-5" />}
                              </div>
                              <div>
                                <p className="font-medium">{goal.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {t('due')} {goal.deadline.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{goal.current.toLocaleString('en-IN')}</p>
                              <p className="text-sm text-muted-foreground">
                                {t('of')} ₹{goal.target.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-2 bg-primary/10"
                    />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
            </motion.div>

          {/* Upcoming Bills */}
            <motion.div
              custom={9} 
              initial="hidden" 
              animate="visible" 
              variants={fadeIn}
            className="col-span-12 lg:col-span-4 glassmorphism p-6 rounded-2xl shadow-lg border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                      {t('upcoming_bills')}
              </h2>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                      <Plus className="h-4 w-4" />
              </Button>
                  </div>
            <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {upcomingBills.map((bill) => (
                  <div 
                    key={bill.id} 
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-primary/5 transition-colors"
                  >
                          <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              bill.category === 'Utilities' ? 'bg-blue-100 text-blue-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                        {bill.category === 'Utilities' ? <Zap className="h-5 w-5" /> :
                         <CreditCard className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium">{bill.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {t('due')} {bill.dueDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{bill.amount.toLocaleString('en-IN')}</p>
                            <Badge variant="outline" className="text-xs">
                              {bill.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
            </motion.div>
        
          {/* Smart Insights */}
          <motion.div 
            custom={10} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="col-span-12 lg:col-span-4 glassmorphism p-6 rounded-2xl shadow-lg border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                    {t('smart_insights')}
              </h2>
              <Badge variant="outline" className="text-xs bg-primary/10">
                <Zap className="h-3 w-3 mr-1 text-primary" />
                    {t('ai_powered')}
                  </Badge>
                </div>
                <SmartInsightsCard insights={smartInsights} />
            <div className="mt-6 text-right">
                  <Button 
                    variant="link" 
                className="p-0 h-auto font-normal text-primary hover:text-primary/80" 
                    size="sm"
                    onClick={() => handleInsightClick('1')}
                  >
                    {t('view_all_insights')} <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
          </motion.div>
        </div>

        {/* Additional Modern Sections */}
        <div className="grid grid-cols-12 gap-6">
          {/* Investment Portfolio Section */}
          <motion.div 
            custom={11} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className={`col-span-12 lg:col-span-6 glassmorphism p-6 rounded-2xl shadow-lg border ${sectionColors.investment.border} ${sectionColors.investment.gradient}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold capitalize flex items-center gap-2 ${sectionColors.investment.text}`}>
                <TrendingUp className="h-5 w-5" />
                Investment Portfolio
              </h2>
              <Badge variant="outline" className={`text-xs ${sectionColors.investment.secondary}`}>
                <Activity className="h-3 w-3 mr-1" />
                +12.5% YTD
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl ${sectionColors.investment.secondary}`}>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">₹2,45,000</p>
                  <p className="text-xs text-green-500">+₹12,500 (5.1%)</p>
                </div>
                <div className={`p-4 rounded-xl ${sectionColors.investment.secondary}`}>
                  <p className="text-sm text-muted-foreground">Monthly Return</p>
                  <p className="text-2xl font-bold">₹8,500</p>
                  <p className="text-xs text-green-500">+₹1,200 (16.4%)</p>
                </div>
                <div className={`p-4 rounded-xl ${sectionColors.investment.secondary}`}>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-2xl font-bold">Moderate</p>
                  <p className="text-xs text-blue-500">Balanced Portfolio</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Stocks', value: 120000, change: '+8.2%', color: 'bg-blue-500' },
                  { name: 'Mutual Funds', value: 85000, change: '+5.4%', color: 'bg-indigo-500' },
                  { name: 'Fixed Deposits', value: 40000, change: '+3.2%', color: 'bg-violet-500' }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${sectionColors.investment.hover} transition-colors`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.value.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-green-500">{item.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Financial Health Score */}
          <motion.div
            custom={12} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className={`col-span-12 lg:col-span-6 glassmorphism p-6 rounded-2xl shadow-lg border ${sectionColors.health.border}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold capitalize flex items-center gap-2 ${sectionColors.health.text}`}>
                <Heart className="h-5 w-5" />
                Financial Health Score
              </h2>
              <Badge variant="outline" className={`text-xs ${sectionColors.health.secondary}`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                Good
              </Badge>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">78</span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-primary/20"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-primary"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="55.264"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Savings Rate', value: '32%', status: 'good' },
                  { label: 'Debt Ratio', value: '18%', status: 'good' },
                  { label: 'Emergency Fund', value: '6 months', status: 'good' },
                  { label: 'Investment Rate', value: '25%', status: 'average' }
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-xl bg-primary/5">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                    <p className={`text-xs ${
                      item.status === 'good' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {item.status === 'good' ? 'On Track' : 'Needs Attention'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Smart Savings Goals */}
          <motion.div
            custom={13} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className={`col-span-12 lg:col-span-4 glassmorphism p-6 rounded-2xl shadow-lg border ${sectionColors.savings.border}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold capitalize flex items-center gap-2 ${sectionColors.savings.text}`}>
                <PiggyBank className="h-5 w-5" />
                Smart Savings Goals
              </h2>
              <Button variant="ghost" size="sm" className={sectionColors.savings.hover}>
                <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Vacation Fund', target: 150000, current: 75000, deadline: '3 months' },
                { name: 'New Car', target: 800000, current: 200000, deadline: '1 year' },
                { name: 'Home Down Payment', target: 2000000, current: 500000, deadline: '2 years' }
              ].map((goal, index) => (
                <div key={index} className="p-4 rounded-xl hover:bg-primary/5 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">{goal.deadline}</span>
                  </div>
                  <Progress 
                    value={(goal.current / goal.target) * 100} 
                    className="h-2 bg-primary/10 mb-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>₹{goal.current.toLocaleString('en-IN')}</span>
                    <span className="text-muted-foreground">of ₹{goal.target.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Expense Predictions */}
          <motion.div
            custom={14} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className={`col-span-12 lg:col-span-4 glassmorphism p-6 rounded-2xl shadow-lg border ${sectionColors.predictions.border}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold capitalize flex items-center gap-2 ${sectionColors.predictions.text}`}>
                <Brain className="h-5 w-5" />
                AI Expense Predictions
              </h2>
              <Badge variant="outline" className={`text-xs ${sectionColors.predictions.secondary}`}>
                <Zap className="h-3 w-3 mr-1" />
                95% Accuracy
              </Badge>
            </div>
            <div className="space-y-4">
              {[
                { category: 'Groceries', predicted: 8500, actual: 8200, trend: 'stable' },
                { category: 'Transportation', predicted: 4500, actual: 4800, trend: 'increasing' },
                { category: 'Entertainment', predicted: 3500, actual: 3200, trend: 'decreasing' }
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl hover:bg-primary/5 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.trend === 'increasing' ? '↑' : item.trend === 'decreasing' ? '↓' : '→'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Predicted</p>
                      <p className="font-medium">₹{item.predicted.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Actual</p>
                      <p className="font-medium">₹{item.actual.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Credit Score Monitor */}
          <motion.div
            custom={15} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className={`col-span-12 lg:col-span-4 glassmorphism p-6 rounded-2xl shadow-lg border ${sectionColors.credit.border}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold capitalize flex items-center gap-2 ${sectionColors.credit.text}`}>
                <Shield className="h-5 w-5" />
                Credit Score Monitor
              </h2>
              <Badge variant="outline" className={`text-xs ${sectionColors.credit.secondary}`}>
                780
              </Badge>
            </div>
            <div className="flex items-center justify-center mb-4">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle
                  className="text-primary/20"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="30"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <span className="absolute text-3xl font-bold">780</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-primary/5">
                <p className="text-sm text-muted-foreground">Payment History</p>
                <p className="text-lg font-semibold">98%</p>
                <p className="text-xs text-green-500">Excellent</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/5">
                <p className="text-sm text-muted-foreground">Credit Utilization</p>
                <p className="text-lg font-semibold">24%</p>
                <p className="text-xs text-yellow-500">Good</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/5">
                <p className="text-sm text-muted-foreground">Credit Age</p>
                <p className="text-lg font-semibold">6 yrs</p>
                <p className="text-xs text-green-500">Excellent</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/5">
                <p className="text-sm text-muted-foreground">Inquiries</p>
                <p className="text-lg font-semibold">2</p>
                <p className="text-xs text-yellow-500">Low</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmailExtractedData data={emailData} variant="compact" />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;