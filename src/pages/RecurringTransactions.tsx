import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircle,
  Edit2,
  Trash2,
  RepeatIcon,
  Calendar,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
  CalendarDays,
  PauseCircle,
  PlayCircle,
  Tag,
  Settings,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Clock,
  ArrowUpRight,
  BarChart,
  Calendar as CalendarIcon,
  Home as HomeIcon,
  Activity,
  ShoppingCart,
  Zap,
  Car,
  Film,
  Stethoscope,
  GraduationCap,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, addDays, addMonths, addWeeks, addYears, isBefore, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDate: string;
  status: 'active' | 'paused';
  createdAt: string;
  lastProcessed?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  description?: string;
  icon?: React.ReactNode;
  autoPay?: boolean;
}

const RecurringTransactions = () => {
  const { t } = useLanguage();
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'nextDate', direction: 'asc' });
  const [newTransaction, setNewTransaction] = useState({
    title: '',
    amount: '',
    category: '',
    frequency: 'monthly',
    description: '',
    autoPay: false,
  });

  // Sample data
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([
    {
      id: '1',
      title: 'Netflix Subscription',
      amount: 14.99,
      category: 'Entertainment',
      frequency: 'monthly',
      nextDate: '2024-05-15',
      status: 'active',
      createdAt: '2024-04-01',
      lastProcessed: '2024-04-15',
      dayOfMonth: 15,
      description: 'Monthly streaming subscription',
      autoPay: true,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: '2',
      title: 'Rent Payment',
      amount: 1200,
      category: 'Housing',
      frequency: 'monthly',
      nextDate: '2024-05-01',
      status: 'active',
      createdAt: '2024-04-01',
      lastProcessed: '2024-04-01',
      dayOfMonth: 1,
      description: 'Monthly apartment rent',
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      id: '3',
      title: 'Gym Membership',
      amount: 49.99,
      category: 'Fitness',
      frequency: 'monthly',
      nextDate: '2024-05-10',
      status: 'active',
      createdAt: '2024-04-01',
      lastProcessed: '2024-04-10',
      dayOfMonth: 10,
      description: 'Monthly fitness membership fee',
      autoPay: true,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      id: '4',
      title: 'Salary Deposit',
      amount: 3500,
      category: 'Income',
      frequency: 'monthly',
      nextDate: '2024-05-25',
      status: 'active',
      createdAt: '2024-04-01',
      lastProcessed: '2024-04-25',
      dayOfMonth: 25,
      description: 'Monthly salary payment',
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      id: '5',
      title: 'Electric Bill',
      amount: 85.75,
      category: 'Utilities',
      frequency: 'monthly',
      nextDate: '2024-05-18',
      status: 'paused',
      createdAt: '2024-04-01',
      lastProcessed: '2024-04-18',
      dayOfMonth: 18,
      description: 'Monthly electricity bill',
      icon: <Zap className="h-4 w-4" />,
    },
    {
      id: '6',
      title: 'Weekly Grocery Shopping',
      amount: 120,
      category: 'Food',
      frequency: 'weekly',
      nextDate: '2024-05-05',
      status: 'active',
      createdAt: '2024-04-01',
      dayOfWeek: 0, // Sunday
      description: 'Weekly grocery shopping budget',
      icon: <ShoppingCart className="h-4 w-4" />,
    },
  ]);

  // Helper function to get the next date based on frequency
  const getNextDate = (frequency: string, currentDate = new Date(), dayOfMonth?: number, dayOfWeek?: number) => {
    let nextDate;
    const now = new Date(currentDate);
    
    switch (frequency) {
      case 'daily':
        nextDate = addDays(now, 1);
        break;
      case 'weekly':
        if (dayOfWeek !== undefined) {
          // Set to the specific day of week
          const daysUntilNextDay = (7 + dayOfWeek - now.getDay()) % 7;
          nextDate = addDays(now, daysUntilNextDay === 0 ? 7 : daysUntilNextDay);
        } else {
          nextDate = addWeeks(now, 1);
        }
        break;
      case 'monthly':
        if (dayOfMonth !== undefined) {
          // Set to the specific day of month
          const nextMonth = addMonths(now, 1);
          nextDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), dayOfMonth);
          
          // If the day doesn't exist in the month (e.g., Feb 30), use the last day
          if (nextDate.getMonth() !== nextMonth.getMonth()) {
            nextDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
          }
        } else {
          nextDate = addMonths(now, 1);
        }
        break;
      case 'yearly':
        nextDate = addYears(now, 1);
        break;
      default:
        nextDate = addMonths(now, 1);
    }
    
    return format(nextDate, 'yyyy-MM-dd');
  };

  // Calculate upcoming payments
  const getUpcomingTotal = () => {
    const now = new Date();
    const thirtyDaysLater = addDays(now, 30);
    
    // Filter for active transactions with next date in the next 30 days
    const upcomingTransactions = transactions.filter(t => 
      t.status === 'active' && 
      isBefore(parseISO(t.nextDate), thirtyDaysLater)
    );
    
    // Sum amounts by category (expenses and income)
    const expenses = upcomingTransactions
      .filter(t => t.category !== 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const income = upcomingTransactions
      .filter(t => t.category === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { expenses, income, net: income - expenses };
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get filtered and sorted transactions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valA, valB;
      
      // Determine values to compare based on sort field
      switch (sortBy.field) {
        case 'amount':
          valA = a.amount;
          valB = b.amount;
          break;
        case 'title':
          valA = a.title;
          valB = b.title;
          break;
        case 'category':
          valA = a.category;
          valB = b.category;
          break;
        case 'nextDate':
        default:
          valA = new Date(a.nextDate).getTime();
          valB = new Date(b.nextDate).getTime();
      }
      
      // Apply sort direction
      if (sortBy.direction === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    
    return filtered;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction({ ...newTransaction, [name]: value });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNewTransaction({ ...newTransaction, [name]: checked });
  };

  const handleAddTransaction = () => {
    // Simple validation
    if (!newTransaction.title || !newTransaction.amount || !newTransaction.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Calculate appropriate next date based on frequency
    const nextDate = getNextDate(newTransaction.frequency);
    
    // For monthly, determine day of month
    let dayOfMonth;
    if (newTransaction.frequency === 'monthly') {
      dayOfMonth = new Date(nextDate).getDate();
    }
    
    // For weekly, determine day of week
    let dayOfWeek;
    if (newTransaction.frequency === 'weekly') {
      dayOfWeek = new Date(nextDate).getDay();
    }

    const transaction: RecurringTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTransaction.title,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      frequency: newTransaction.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
      nextDate,
      status: 'active',
      createdAt: new Date().toISOString(),
      description: newTransaction.description,
      autoPay: newTransaction.autoPay,
      dayOfMonth,
      dayOfWeek,
      // Determine icon based on category
      icon: getCategoryIcon(newTransaction.category),
    };

    setTransactions([...transactions, transaction]);
    setNewTransaction({ 
      title: '', 
      amount: '', 
      category: '', 
      frequency: 'monthly',
      description: '',
      autoPay: false 
    });
    setIsAddingTransaction(false);
    toast.success("Recurring transaction added successfully");
  };

  const handleToggleStatus = (id: string) => {
    setTransactions(
      transactions.map(transaction => 
        transaction.id === id 
          ? { 
              ...transaction, 
              status: transaction.status === 'active' ? 'paused' : 'active' 
            } 
          : transaction
      )
    );
    
    const status = transactions.find(t => t.id === id)?.status === 'active' ? 'paused' : 'active';
    toast.success(`Recurring transaction ${status}`);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    toast.success("Recurring transaction deleted");
  };
  
  const handleSortChange = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Get an appropriate icon for a category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'housing':
        return <HomeIcon className="h-4 w-4" />;
      case 'food':
        return <ShoppingCart className="h-4 w-4" />;
      case 'transportation':
        return <Car className="h-4 w-4" />;
      case 'entertainment':
        return <Film className="h-4 w-4" />;
      case 'utilities':
        return <Zap className="h-4 w-4" />;
      case 'income':
        return <DollarSign className="h-4 w-4" />;
      case 'fitness':
        return <Activity className="h-4 w-4" />;
      case 'healthcare':
        return <Stethoscope className="h-4 w-4" />;
      case 'education':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };
  
  // Calculate financial summary
  const upcomingPayments = getUpcomingTotal();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recurring Transactions</h1>
            <p className="text-muted-foreground">
              Schedule and manage your recurring payments and income
            </p>
          </div>
          
          <Button onClick={() => setIsAddingTransaction(!isAddingTransaction)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Recurring Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-400">Upcoming Income</CardTitle>
              <CardDescription className="text-green-700 dark:text-green-500">Next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{formatCurrency(upcomingPayments.income)}</div>
                <div className="h-10 w-10 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-green-700 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-400">Upcoming Expenses</CardTitle>
              <CardDescription className="text-red-700 dark:text-red-500">Next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">{formatCurrency(upcomingPayments.expenses)}</div>
                <div className="h-10 w-10 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center">
                  <ArrowDownRight className="h-5 w-5 text-red-700 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br ${upcomingPayments.net >= 0 
            ? "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800" 
            : "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800"}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${upcomingPayments.net >= 0 
                ? "text-blue-800 dark:text-blue-400" 
                : "text-orange-800 dark:text-orange-400"}`}
              >
                Net Balance
              </CardTitle>
              <CardDescription className={upcomingPayments.net >= 0 
                ? "text-blue-700 dark:text-blue-500" 
                : "text-orange-700 dark:text-orange-500"}
              >
                Upcoming 30-day projection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className={`text-2xl font-bold ${upcomingPayments.net >= 0 
                  ? "text-blue-700 dark:text-blue-400" 
                  : "text-orange-700 dark:text-orange-400"}`}
                >
                  {formatCurrency(upcomingPayments.net)}
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${upcomingPayments.net >= 0 
                  ? "bg-blue-200 dark:bg-blue-800" 
                  : "bg-orange-200 dark:bg-orange-800"}`}
                >
                  <BarChart className={`h-5 w-5 ${upcomingPayments.net >= 0 
                    ? "text-blue-700 dark:text-blue-400" 
                    : "text-orange-700 dark:text-orange-400"}`} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isAddingTransaction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                New Recurring Transaction
              </CardTitle>
              <CardDescription>
                Set up a new scheduled payment or income
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Description</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={newTransaction.title} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Netflix Subscription"
                  />
                </div>
                  
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                      <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        value={newTransaction.amount} 
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                  </div>
                  
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                    <Select 
                    value={newTransaction.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Fitness">Fitness</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={newTransaction.frequency} 
                    onValueChange={(value) => handleSelectChange('frequency', value)}
                  >
                      <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span>Daily</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="weekly">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span>Weekly</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="monthly">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Monthly</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="yearly">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Yearly</span>
                          </div>
                        </SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Notes (Optional)</Label>
                    <Input 
                      id="description" 
                      name="description" 
                      value={newTransaction.description} 
                      onChange={handleInputChange}
                      placeholder="Additional details about this transaction"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="autoPay" 
                      checked={newTransaction.autoPay}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('autoPay', checked as boolean)
                      } 
                    />
                    <Label htmlFor="autoPay" className="text-sm font-normal cursor-pointer">
                      This is an automatic payment
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <Button variant="outline" onClick={() => setIsAddingTransaction(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTransaction}>
                  Save Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <RepeatIcon className="h-5 w-5 text-primary" />
                Scheduled Transactions
              </CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8 w-full sm:w-[200px] md:w-[240px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select 
                  value={statusFilter || "all"} 
                  onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter(null);
                  }}
                  disabled={!searchQuery && !statusFilter}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange('title')}>
                      <div className="flex items-center gap-1">
                        Description
                        {sortBy.field === 'title' && (
                          sortBy.direction === 'asc' ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange('amount')}>
                      <div className="flex items-center gap-1">
                        Amount
                        {sortBy.field === 'amount' && (
                          sortBy.direction === 'asc' ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange('category')}>
                      <div className="flex items-center gap-1">
                        Category
                        {sortBy.field === 'category' && (
                          sortBy.direction === 'asc' ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                  <TableHead>Frequency</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange('nextDate')}>
                      <div className="flex items-center gap-1">
                        Next Date
                        {sortBy.field === 'nextDate' && (
                          sortBy.direction === 'asc' ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {getFilteredTransactions().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <RepeatIcon className="h-12 w-12 mb-2" />
                          {searchQuery || statusFilter ? (
                            <>
                              <p className="text-lg font-medium">No matching transactions found</p>
                              <p className="text-sm">Try changing your search or filter</p>
                            </>
                          ) : (
                            <>
                              <p className="text-lg font-medium">No recurring transactions yet</p>
                              <p className="text-sm">Add your first recurring transaction to get started</p>
                            </>
                          )}
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery("");
                              setStatusFilter(null);
                              setIsAddingTransaction(true);
                            }}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Transaction
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    getFilteredTransactions().map((transaction) => (
                      <TableRow key={transaction.id} className="group">
                    <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center
                              ${transaction.category === 'Income' ? 
                                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                                "bg-primary/10 text-primary dark:bg-primary/20"}`}
                            >
                              {transaction.icon || <Tag className="h-4 w-4" />}
                            </div>
                            <div>
                              <div className="font-medium">{transaction.title}</div>
                              {transaction.description && (
                                <div className="text-xs text-muted-foreground">{transaction.description}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={transaction.category === 'Income' ? "text-green-600 font-medium" : "font-medium"}>
                          {transaction.category === 'Income' ? "+" : "-"}{formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize bg-primary/5">
                            {transaction.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          <div className="flex items-center gap-2">
                            {transaction.frequency === 'daily' || transaction.frequency === 'weekly' ? (
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span>{transaction.frequency}</span>
                            
                            {transaction.autoPay && (
                              <Badge variant="secondary" className="ml-1 h-5 text-xs">Auto</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{format(new Date(transaction.nextDate), 'MMM d, yyyy')}</span>
                          </div>
                          {transaction.lastProcessed && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Last: {format(new Date(transaction.lastProcessed), 'MMM d')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                            {transaction.status === 'active' ? (
                              <CheckCircle className="mr-1 h-3.5 w-3.5" />
                            ) : (
                              <PauseCircle className="mr-1 h-3.5 w-3.5" />
                            )}
                        {transaction.status}
                          </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                          <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleStatus(transaction.id)}
                          title={transaction.status === 'active' ? 'Pause' : 'Activate'}
                        >
                              {transaction.status === 'active' ? (
                                <PauseCircle className="h-4 w-4 text-amber-600" />
                              ) : (
                                <PlayCircle className="h-4 w-4 text-green-600" />
                              )}
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary-foreground/5 border rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <RepeatIcon className="h-6 w-6" />
            </div>
            <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-xl font-medium mb-2">Recurring Transactions</h3>
                <p className="text-muted-foreground">
                Setting up recurring transactions helps you track your regular expenses automatically. 
                These transactions will be added to your records based on the frequency you set,
                helping you maintain accurate financial data without manual entry.
              </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Benefits
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Automatically track recurring bills</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Get notified before payments are due</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Keep track of your subscriptions</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Monitor regular income sources</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Tips
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                      <span>Set up automatic payments for recurring bills to avoid late fees</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                      <span>Review your recurring transactions regularly to identify unnecessary subscriptions</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                      <span>Use the "Pause" feature for temporary subscriptions</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>Your next recurring payment: </span>
                    <span className="font-medium">
                      {getFilteredTransactions()
                        .filter(t => t.status === 'active' && t.category !== 'Income')
                        .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())[0]?.title || 'None'} 
                      {getFilteredTransactions()
                        .filter(t => t.status === 'active' && t.category !== 'Income')
                        .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())[0]?.nextDate 
                        ? ` (${format(new Date(getFilteredTransactions()
                            .filter(t => t.status === 'active' && t.category !== 'Income')
                            .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())[0]?.nextDate), 'MMM d')})` 
                        : ''}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    View Calendar
                  </Button>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RecurringTransactions;
