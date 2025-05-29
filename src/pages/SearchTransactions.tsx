import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search, 
  Calendar as CalendarIcon, 
  ArrowDownNarrowWide, 
  ArrowUpNarrowWide,
  Filter,
  DownloadCloud,
  RefreshCw,
  CreditCard,
  Receipt,
  Banknote,
  DollarSign,
  X,
  ChevronDown,
  MoreHorizontal,
  FileDown,
  ExternalLink,
  CircleDollarSign,
  Home,
  ShoppingBag,
  Utensils,
  Car,
  Film,
  Bookmark,
  Sparkles
} from "lucide-react";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  notes?: string;
  paymentMethod?: string;
  iconColor?: string;
}

const categories = [
  "All Categories",
  "Food",
  "Transport",
  "Entertainment",
  "Housing",
  "Utilities",
  "Shopping",
  "Health",
  "Education",
  "Travel",
  "Income",
];

const amountRanges = [
  "Any Amount",
  "₹0 - ₹50",
  "₹50 - ₹100",
  "₹100 - ₹500",
  "₹500 - ₹1000",
  "₹1000+",
];

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food':
      return <Utensils className="h-4 w-4" />;
    case 'transport':
      return <Car className="h-4 w-4" />;
    case 'entertainment':
      return <Film className="h-4 w-4" />;
    case 'housing':
      return <Home className="h-4 w-4" />;
    case 'shopping':
      return <ShoppingBag className="h-4 w-4" />;
    case 'income':
      return <Banknote className="h-4 w-4" />;
    default:
      return <Bookmark className="h-4 w-4" />;
  }
};

// Helper function to get category color
const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'food':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    case 'transport':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'entertainment':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    case 'housing':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
    case 'shopping':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
    case 'health':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'education':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400';
    case 'utilities':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'travel':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
    case 'income':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const SearchTransactions = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [selectedAmountRange, setSelectedAmountRange] = useState("Any Amount");
  const [transactionType, setTransactionType] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  
  // Enhanced sample transaction data
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      title: "Grocery Store",
      amount: 75.5,
      date: "2024-04-05",
      category: "Food",
      type: "expense",
      notes: "Weekly grocery shopping",
      paymentMethod: "Credit Card"
    },
    {
      id: "2",
      title: "Salary Deposit",
      amount: 2000,
      date: "2024-04-01",
      category: "Income",
      type: "income",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "3",
      title: "Amazon Purchase",
      amount: 120.99,
      date: "2024-03-29",
      category: "Shopping",
      type: "expense",
      notes: "New headphones",
      paymentMethod: "Debit Card"
    },
    {
      id: "4",
      title: "Uber Ride",
      amount: 24.5,
      date: "2024-03-28",
      category: "Transport",
      type: "expense",
      paymentMethod: "Credit Card"
    },
    {
      id: "5",
      title: "Apartment Rent",
      amount: 1200,
      date: "2024-03-27",
      category: "Housing",
      type: "expense",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "6",
      title: "Movie Tickets",
      amount: 35.5,
      date: "2024-03-25",
      category: "Entertainment",
      type: "expense",
      notes: "Weekend movie with friends",
      paymentMethod: "Credit Card"
    },
    {
      id: "7",
      title: "Freelance Payment",
      amount: 500,
      date: "2024-03-23",
      category: "Income",
      type: "income",
      notes: "Website design project",
      paymentMethod: "PayPal"
    },
    {
      id: "8",
      title: "Electricity Bill",
      amount: 85.26,
      date: "2024-03-20",
      category: "Utilities",
      type: "expense",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "9",
      title: "Doctor Visit",
      amount: 150,
      date: "2024-03-18",
      category: "Health",
      type: "expense",
      paymentMethod: "Insurance"
    },
    {
      id: "10",
      title: "Online Course",
      amount: 199.99,
      date: "2024-03-15",
      category: "Education",
      type: "expense",
      notes: "Python programming course",
      paymentMethod: "Credit Card"
    },
    {
      id: "11",
      title: "Coffee Shop",
      amount: 4.75,
      date: "2024-03-12",
      category: "Food",
      type: "expense",
      paymentMethod: "Cash"
    },
    {
      id: "12",
      title: "Gym Membership",
      amount: 49.99,
      date: "2024-03-10",
      category: "Health",
      type: "expense",
      paymentMethod: "Credit Card"
    },
  ]);

  // Count active filters
  React.useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== "All Categories") count++;
    if (fromDate) count++;
    if (toDate) count++;
    if (selectedAmountRange !== "Any Amount") count++;
    if (transactionType !== "all") count++;
    setActiveFiltersCount(count);
  }, [searchQuery, selectedCategory, fromDate, toDate, selectedAmountRange, transactionType]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedAmountRange("Any Amount");
    setTransactionType("all");
    setSortField("date");
    setSortDirection("desc");
    toast.success("Search filters reset");
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Apply filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Text search
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (transaction.notes || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === "All Categories" || transaction.category === selectedCategory;
    
    // Date range filter
    const transactionDate = new Date(transaction.date);
    const matchesDateFrom = !fromDate || transactionDate >= fromDate;
    const matchesDateTo = !toDate || transactionDate <= toDate;
    
    // Amount range filter
    let matchesAmount = true;
    if (selectedAmountRange !== "Any Amount") {
      const amount = transaction.amount;
      switch (selectedAmountRange) {
        case "₹0 - ₹50":
          matchesAmount = amount >= 0 && amount <= 50;
          break;
        case "₹50 - ₹100":
          matchesAmount = amount > 50 && amount <= 100;
          break;
        case "₹100 - ₹500":
          matchesAmount = amount > 100 && amount <= 500;
          break;
        case "₹500 - ₹1000":
          matchesAmount = amount > 500 && amount <= 1000;
          break;
        case "₹1000+":
          matchesAmount = amount > 1000;
          break;
        default:
          matchesAmount = true;
      }
    }
    
    // Transaction type filter
    const matchesType = transactionType === "all" || transaction.type === transactionType;
    
    return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo && matchesAmount && matchesType;
  });

  // Apply sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? 
      <ArrowUpNarrowWide className="ml-1 h-4 w-4" /> : 
      <ArrowDownNarrowWide className="ml-1 h-4 w-4" />;
  };

  // Calculate total amount for filtered transactions
  const totalAmount = sortedTransactions.reduce((sum, transaction) => {
    if (transaction.type === 'income') {
      return sum + transaction.amount;
    } else {
      return sum - transaction.amount;
    }
  }, 0);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Search Transactions</h1>
            <p className="text-muted-foreground">
              Find and analyze your transactions across all accounts
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'bg-muted' : ''}>
              <Receipt className="mr-2 h-4 w-4" />
              Table View
            </Button>
            <Button variant="outline" onClick={() => setViewMode('cards')} className={viewMode === 'cards' ? 'bg-muted' : ''}>
              <CreditCard className="mr-2 h-4 w-4" />
              Card View
            </Button>
            <Button variant="outline">
              <DownloadCloud className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Search Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className="gap-1"
                >
                  {isFilterExpanded ? "Less Filters" : "More Filters"}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isFilterExpanded ? "rotate-180" : ""}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-3/5">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions by name, notes or details..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 md:w-2/5">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "All Categories" ? (
                            "All Categories"
                          ) : (
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(category)}
                              <span>{category}</span>
                            </div>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={transactionType}
                    onValueChange={setTransactionType}
                  >
                    <SelectTrigger id="transaction-type">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-green-600" />
                          <span>Income</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="expense">
                        <div className="flex items-center gap-2">
                          <CircleDollarSign className="h-4 w-4 text-red-600" />
                          <span>Expense</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isFilterExpanded && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs">Amount Range</Label>
                      <Select
                        value={selectedAmountRange}
                        onValueChange={setSelectedAmountRange}
                      >
                        <SelectTrigger id="amount-range">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          {amountRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fromDate ? format(fromDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={setFromDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label className="text-xs">To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {toDate ? format(toDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={setToDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Search Results
                <Badge variant="outline">{sortedTransactions.length}</Badge>
              </CardTitle>
              
              <div className="text-sm font-medium">
                Balance: 
                <span className={totalAmount >= 0 ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                  {formatCurrency(Math.abs(totalAmount))}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className={viewMode === 'cards' ? "p-4" : "p-0"}>
            {sortedTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => handleSort("title")} className="cursor-pointer">
                        <div className="flex items-center">
                          Description {getSortIcon("title")}
                        </div>
                      </TableHead>
                      <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
                        <div className="flex items-center">
                          Amount {getSortIcon("amount")}
                        </div>
                      </TableHead>
                      <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                        <div className="flex items-center">
                          Category {getSortIcon("category")}
                        </div>
                      </TableHead>
                      <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
                        <div className="flex items-center">
                          Date {getSortIcon("date")}
                        </div>
                      </TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.title}
                        </TableCell>
                        <TableCell className={transaction.type === "income" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getCategoryColor(transaction.category)} capitalize`}>
                            <span className="flex items-center gap-1">
                              {getCategoryIcon(transaction.category)}
                              {transaction.category}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {transaction.notes || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTransactions.map((transaction) => (
                  <Card key={transaction.id} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow cursor-pointer"
                    style={{ borderLeftColor: transaction.type === 'income' ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)' }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{transaction.title}</h3>
                        <Badge variant="outline" className={`${getCategoryColor(transaction.category)} capitalize`}>
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(transaction.category)}
                            {transaction.category}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className={transaction.type === "income" ? "text-green-600 font-bold text-lg" : "text-red-600 font-bold text-lg"}>
                          {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                        </span>
                        <span className="text-sm text-muted-foreground">{formatDate(transaction.date)}</span>
                      </div>
                      
                      {transaction.notes && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{transaction.notes}</p>
                      )}
                      
                      {transaction.paymentMethod && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                          <CreditCard className="h-3 w-3" />
                          {transaction.paymentMethod}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-xs text-muted-foreground">
              Results sorted by <span className="font-medium">{sortField}</span> in <span className="font-medium">{sortDirection === 'asc' ? 'ascending' : 'descending'}</span> order
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <FileDown className="h-3.5 w-3.5" />
              <span>Export Results</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SearchTransactions;
