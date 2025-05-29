import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Calendar, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  Wallet,
  PiggyBank,
  RefreshCw,
  ListFilter,
  Sparkles,
  Brain,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  ArrowRight,
  ChevronRight,
  Settings,
  FileText,
  Receipt,
  CreditCard,
  Banknote,
  DollarSign,
  X,
  ChevronDown,
  MoreHorizontal,
  FileDown,
  ExternalLink,
  Home,
  ShoppingBag,
  Utensils,
  Car,
  Film,
  Bookmark
} from "lucide-react";
import { ConfidenceIndicator } from "@/components/transactions/ConfidenceIndicator";
import { CategoryDistributionChart } from "@/components/transactions/CategoryDistributionChart";
import { toast } from "sonner";
import { Transaction } from "@/components/transactions/TransactionsOverview";
import { detectCategoryAdvanced } from "@/utils/advancedCategorization";
import { getCategoryIcon } from "@/utils/transactionUtils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { EmailExtractedData } from "@/components/email/EmailExtractedData";

// Enhanced Transaction interface with AI insights
interface EnhancedTransaction extends Transaction {
  aiInsights?: {
    categoryConfidence: number;
    anomalyScore?: number;
    spendingPattern?: string;
    recommendations?: string[];
  };
  merchantLogo?: string;
  merchantName?: string;
  tags?: string[];
  recurring?: boolean;
  recurringPattern?: string;
}

// AI Insights interface
interface AIInsight {
  id: string;
  type: "spending" | "saving" | "anomaly" | "recommendation";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category?: string;
  amount?: number;
  date?: Date;
  icon: React.ReactNode;
  color: string;
}

// Sample transaction data
const sampleTransactions: EnhancedTransaction[] = [
  { id: 1, name: "Salary Deposit", amount: 3000.00, date: "2024-04-01", category: "Income", type: "income", confidence: 0.98 },
  { id: 2, name: "Apartment Rent", amount: 1200.00, date: "2024-04-02", category: "Housing", type: "expense", confidence: 0.95 },
  { id: 3, name: "Grocery Store", amount: 156.32, date: "2024-04-03", category: "Food", type: "expense", confidence: 0.91 },
  { id: 4, name: "Amazon Purchase", amount: 67.99, date: "2024-04-05", category: "Shopping", type: "expense", confidence: 0.92 },
  { id: 5, name: "Uber Ride", amount: 24.50, date: "2024-04-06", category: "Transportation", type: "expense", confidence: 0.85 },
  { id: 6, name: "Corner Cafe", amount: 12.75, date: "2024-04-07", category: "Food", type: "expense", confidence: 0.76 },
  { id: 7, name: "Netflix Subscription", amount: 14.99, date: "2024-04-08", category: "Entertainment", type: "expense", confidence: 0.94 },
  { id: 8, name: "Electricity Bill", amount: 89.75, date: "2024-04-10", category: "Utilities", type: "expense", confidence: 0.88 },
  { id: 9, name: "Freelance Payment", amount: 800.00, date: "2024-04-12", category: "Income", type: "income", confidence: 0.95 },
  { id: 10, name: "Medical Visit", amount: 50.00, date: "2024-04-14", category: "Healthcare", type: "expense", confidence: 0.87 }
];

// Define category colors for consistency
const categoryColors: Record<string, string> = {
  "Income": "#2ecc71",
  "Housing": "#9b59b6",
  "Food": "#3498db",
  "Shopping": "#e74c3c",
  "Transportation": "#f39c12",
  "Entertainment": "#1abc9c",
  "Utilities": "#34495e",
  "Healthcare": "#16a085",
  "Other": "#95a5a6"
};

const TransactionsPage = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<EnhancedTransaction[]>(sampleTransactions);
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense" | "uncategorized">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showAiInsights, setShowAiInsights] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<EnhancedTransaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<EnhancedTransaction>>({
    name: "",
    amount: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    type: "expense"
  });

  // AI-powered insights generation
  useEffect(() => {
    generateAIInsights();
  }, [transactions]);

  const generateAIInsights = () => {
    // Simulate AI analysis of transactions
    const insights: AIInsight[] = [
      {
        id: "1",
        type: "spending",
        title: "Unusual Spending Pattern",
        description: "Your entertainment expenses are 30% higher than usual this month",
        impact: "high",
        category: "Entertainment",
        amount: 2500,
        date: new Date(),
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "text-amber-500"
      },
      {
        id: "2",
        type: "saving",
        title: "Potential Savings Opportunity",
        description: "You could save ₹500/month by optimizing your subscription services",
        impact: "medium",
        icon: <PiggyBank className="h-5 w-5" />,
        color: "text-green-500"
      },
      {
        id: "3",
        type: "recommendation",
        title: "Smart Categorization",
        description: "AI suggests categorizing 5 uncategorized transactions",
        impact: "low",
        icon: <Brain className="h-5 w-5" />,
        color: "text-blue-500"
      }
    ];
    setAiInsights(insights);
  };

  // Enhanced transaction filtering with AI-powered suggestions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by tab
    switch (activeTab) {
      case "income":
        filtered = filtered.filter(t => t.type === "income");
        break;
      case "expense":
        filtered = filtered.filter(t => t.type === "expense");
        break;
      case "uncategorized":
        filtered = filtered.filter(t => !t.category);
        break;
    }
    
    // Enhanced search with AI-powered suggestions
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) || 
        (t.category && t.category.toLowerCase().includes(query)) ||
        (t.merchantName && t.merchantName.toLowerCase().includes(query)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    // Sort transactions
    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case "amount":
          comparison = b.amount - a.amount;
          break;
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "");
          break;
        default:
          comparison = 0;
      }
      return sortDirection === "asc" ? -comparison : comparison;
    });
  };

  // Enhanced transaction handling with AI categorization
  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Get AI category suggestion with enhanced confidence
    const aiResult = detectCategoryAdvanced({
      id: Date.now(),
      description: newTransaction.name || "",
      amount: newTransaction.amount || 0,
      date: newTransaction.date || new Date()
    });

    const transaction: EnhancedTransaction = {
      id: Date.now(),
      name: newTransaction.name || "",
      amount: newTransaction.amount || 0,
      date: newTransaction.date || new Date(),
      category: newTransaction.category || aiResult.category,
      type: newTransaction.type || "expense",
      aiInsights: {
        categoryConfidence: aiResult.confidence,
        spendingPattern: "regular",
        recommendations: ["Consider setting up a budget for this category"]
      },
      tags: ["new", "ai-categorized"]
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      name: "",
      amount: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      type: "expense"
    });
    setShowAddForm(false);
    
    toast.success("Transaction added successfully with AI insights!");
  };

  // Enhanced transaction deletion with AI confirmation
  const handleDeleteTransaction = (id: string | number) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction?.recurring) {
      toast.warning("This is a recurring transaction. Are you sure you want to delete it?");
    }
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success("Transaction deleted");
  };

  // Handle editing a transaction (placeholder - would implement full edit functionality in real app)
  const handleEditTransaction = (id: string | number) => {
    toast.info(`Editing transaction ${id}`);
  };

  // Calculate enhanced statistics
  const calculateStatistics = () => {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netCashflow = totalIncome - totalExpenses;

    const uncategorizedCount = transactions
      .filter(t => !t.category)
      .length;
      
    const recurringTransactions = transactions
      .filter(t => t.recurring)
      .length;
      
    return {
      totalIncome,
      totalExpenses,
      netCashflow,
      uncategorizedCount,
      recurringTransactions
    };
  };

  const stats = calculateStatistics();
  const filteredTransactions = getFilteredTransactions();

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
      <div className="space-y-6 p-6">
        {/* Enhanced Header with AI Insights Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all your financial transactions with AI-powered insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowAiInsights(!showAiInsights)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {showAiInsights ? "Hide AI Insights" : "Show AI Insights"}
            </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
          </div>
        </div>

        {/* AI Insights Section */}
        {showAiInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {aiInsights.map((insight) => (
              <Card key={insight.id} className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${insight.color} opacity-10 rounded-full -mr-16 -mt-16`} />
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${insight.color} bg-opacity-10`}>
                      {insight.icon}
                    </div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{insight.description}</p>
                  {insight.amount && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-sm">
                        ₹{insight.amount.toLocaleString('en-IN')}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalIncome.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalExpenses.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.netCashflow.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                {stats.netCashflow >= 0 ? "Positive" : "Negative"} balance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uncategorized</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uncategorizedCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.uncategorizedCount > 0 ? "Needs attention" : "All categorized"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Add Transaction Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Transaction</CardTitle>
              <CardDescription>Enter transaction details below. AI will help categorize and analyze it.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input 
                    placeholder="Transaction description" 
                    value={newTransaction.name}
                    onChange={(e) => setNewTransaction({...newTransaction, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={newTransaction.amount || ""}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                  />
                    </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input 
                    type="date" 
                    value={newTransaction.date as string}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select 
                    value={newTransaction.type} 
                    onValueChange={(value) => setNewTransaction({...newTransaction, type: value as "income" | "expense"})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTransaction}>
                  Add Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Transaction List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Browse and manage all your transactions</CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as typeof activeTab)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}>
                  {viewMode === "table" ? <CreditCard className="h-4 w-4" /> : <Table className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {viewMode === "table" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                      <TableHead>AI Insights</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No transactions found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                        <TableRow 
                          key={transaction.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowTransactionDetails(true);
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center
                              ${transaction.type === "income" ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}
                            >
                              {transaction.type === "income" 
                                ? <ArrowUpRight className="h-4 w-4" /> 
                                : transaction.category && getCategoryIcon(transaction.category)}
                            </div>
                              <div>
                                <div className="font-medium">{transaction.name}</div>
                                {transaction.merchantName && (
                                  <div className="text-xs text-muted-foreground">{transaction.merchantName}</div>
                                )}
                              </div>
                          </div>
                        </TableCell>
                          <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                              {transaction.category || "Uncategorized"}
                              {transaction.aiInsights?.categoryConfidence && (
                              <ConfidenceIndicator 
                                  confidence={transaction.aiInsights.categoryConfidence} 
                                size="sm" 
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                              {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString('en-IN')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {transaction.aiInsights && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline" className="gap-1">
                                      <Sparkles className="h-3 w-3" />
                                      AI Insights
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Category Confidence: {transaction.aiInsights.categoryConfidence}%</p>
                                    {transaction.aiInsights.spendingPattern && (
                                      <p>Pattern: {transaction.aiInsights.spendingPattern}</p>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditTransaction(transaction.id)}>
                                Edit
                              </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteTransaction(transaction.id)}>
                                Delete
                              </DropdownMenuItem>
                                {transaction.recurring && (
                                  <DropdownMenuItem>
                                    Manage Recurring
                                  </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
        </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTransactions.map((transaction) => (
                  <Card 
                    key={transaction.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowTransactionDetails(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center
                          ${transaction.type === "income" ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}
                        >
                          {transaction.type === "income" 
                            ? <ArrowUpRight className="h-5 w-5" /> 
                            : transaction.category && getCategoryIcon(transaction.category)}
                        </div>
                        <Badge variant="outline">
                          {transaction.type === "income" ? "Income" : "Expense"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium">{transaction.name}</div>
                        {transaction.merchantName && (
                          <div className="text-sm text-muted-foreground">{transaction.merchantName}</div>
                        )}
                        <div className={`text-lg font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {format(new Date(transaction.date), "MMM d, yyyy")}
                          </span>
                          {transaction.category && (
                            <Badge variant="secondary">{transaction.category}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Details Modal */}
        {showTransactionDetails && selectedTransaction && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <CardContent className="w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Transaction Details</CardTitle>
                <Button variant="ghost" onClick={() => setShowTransactionDetails(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center
                    ${selectedTransaction.type === "income" ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}
                  >
                    {selectedTransaction.type === "income" 
                      ? <ArrowUpRight className="h-6 w-6" /> 
                      : selectedTransaction.category && getCategoryIcon(selectedTransaction.category)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedTransaction.name}</h3>
                    <p className="text-muted-foreground">
                      {format(new Date(selectedTransaction.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className={`text-2xl font-bold ${selectedTransaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {selectedTransaction.type === "income" ? "+" : "-"}₹{selectedTransaction.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="text-lg font-medium">
                      {selectedTransaction.category || "Uncategorized"}
                    </p>
                  </div>
                </div>

                {selectedTransaction.aiInsights && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Insights
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-primary/5">
                        <p className="text-sm text-muted-foreground">Category Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedTransaction.aiInsights.categoryConfidence} className="h-2" />
                          <span className="text-sm font-medium">
                            {selectedTransaction.aiInsights.categoryConfidence}%
                          </span>
                        </div>
                      </div>
                      {selectedTransaction.aiInsights.spendingPattern && (
                        <div className="p-4 rounded-lg bg-primary/5">
                          <p className="text-sm text-muted-foreground">Spending Pattern</p>
                          <p className="font-medium">{selectedTransaction.aiInsights.spendingPattern}</p>
                        </div>
                      )}
                    </div>
                    {selectedTransaction.aiInsights.recommendations && (
                      <div className="p-4 rounded-lg bg-primary/5">
                        <p className="text-sm text-muted-foreground mb-2">Recommendations</p>
                        <ul className="space-y-2">
                          {selectedTransaction.aiInsights.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Lightbulb className="h-4 w-4 text-amber-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowTransactionDetails(false)}>
                    Close
                  </Button>
                  <Button onClick={() => handleEditTransaction(selectedTransaction.id)}>
                    Edit Transaction
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <EmailExtractedData data={emailData} variant="detailed" />
          {/* Other transaction components */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
