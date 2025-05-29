import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Download, 
  Filter, 
  MoreVertical, 
  Search, 
  Edit, 
  Trash, 
  ArrowDown, 
  ArrowUp,
  FileDown,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  ChevronDown,
  Tag,
  Clock,
  CreditCard,
  FileText,
  FileSpreadsheet,
  X,
  CheckCircle2,
  CircleDollarSign,
  BadgePercent
} from "lucide-react";
import { format, isAfter, isBefore, parseISO, subDays } from "date-fns";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { DateRange } from "react-day-picker";

interface Transaction {
  id: string;
  date: Date;
  description: string;
  category: string;
  type: "expense" | "income";
  amount: number;
  paymentMethod: string;
  tags?: string[];
  status?: "completed" | "pending" | "recurring";
  notes?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const History = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [timePeriod, setTimePeriod] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Enhanced sample transaction data
  const transactions: Transaction[] = [
    {
      id: "tx1",
      date: new Date(2024, 3, 7),
      description: "Grocery Shopping",
      category: "Food",
      type: "expense",
      amount: 75.50,
      paymentMethod: "Credit Card",
      status: "completed",
      tags: ["essential", "weekly"]
    },
    {
      id: "tx2",
      date: new Date(2024, 3, 5),
      description: "Salary Deposit",
      category: "Income",
      type: "income",
      amount: 3500.00,
      paymentMethod: "Bank Transfer",
      status: "completed"
    },
    {
      id: "tx3",
      date: new Date(2024, 3, 4),
      description: "Netflix Subscription",
      category: "Entertainment",
      type: "expense",
      amount: 14.99,
      paymentMethod: "Credit Card",
      status: "recurring",
      notes: "Monthly subscription"
    },
    {
      id: "tx4",
      date: new Date(2024, 3, 3),
      description: "Gas Station",
      category: "Transportation",
      type: "expense",
      amount: 45.30,
      paymentMethod: "Debit Card",
      status: "completed"
    },
    {
      id: "tx5",
      date: new Date(2024, 3, 2),
      description: "Freelance Payment",
      category: "Income",
      type: "income",
      amount: 850.00,
      paymentMethod: "PayPal",
      status: "completed",
      tags: ["freelance", "design-work"]
    },
    {
      id: "tx6",
      date: new Date(2024, 3, 1),
      description: "Rent Payment",
      category: "Housing",
      type: "expense",
      amount: 1200.00,
      paymentMethod: "Bank Transfer",
      status: "recurring",
      tags: ["essential", "monthly"]
    },
    {
      id: "tx7",
      date: new Date(2024, 2, 28),
      description: "Internet Bill",
      category: "Utilities",
      type: "expense",
      amount: 59.99,
      paymentMethod: "Credit Card",
      status: "completed"
    },
    {
      id: "tx8",
      date: new Date(2024, 2, 25),
      description: "Restaurant Dinner",
      category: "Food",
      type: "expense",
      amount: 68.25,
      paymentMethod: "Credit Card",
      status: "completed",
      tags: ["dining-out"]
    },
    {
      id: "tx9",
      date: new Date(2024, 2, 22),
      description: "Pharmacy",
      category: "Healthcare",
      type: "expense",
      amount: 35.47,
      paymentMethod: "Debit Card",
      status: "completed",
      tags: ["essential", "health"]
    },
    {
      id: "tx10",
      date: new Date(2024, 2, 20),
      description: "Clothing Store",
      category: "Shopping",
      type: "expense",
      amount: 125.30,
      paymentMethod: "Credit Card",
      status: "completed"
    },
  ];

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
    const matchesType = !typeFilter || transaction.type === typeFilter;
    const matchesPaymentMethod = !paymentMethodFilter || transaction.paymentMethod === paymentMethodFilter;
    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    
    let matchesTimePeriod = true;
    if (dateRange?.from && dateRange?.to) {
      matchesTimePeriod = isAfter(transaction.date, dateRange.from) && 
                         isBefore(transaction.date, dateRange.to);
    } else {
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      const ninetyDaysAgo = subDays(today, 90);
      
      if (timePeriod === "30days") {
        matchesTimePeriod = isAfter(transaction.date, thirtyDaysAgo);
      } else if (timePeriod === "90days") {
        matchesTimePeriod = isAfter(transaction.date, ninetyDaysAgo);
      }
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesTimePeriod && 
           matchesPaymentMethod && matchesStatus;
  });

  // Get unique categories and payment methods for filters
  const categories = Array.from(new Set(transactions.map(tx => tx.category)));
  const paymentMethods = Array.from(new Set(transactions.map(tx => tx.paymentMethod)));

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "date":
        comparison = a.date.getTime() - b.date.getTime();
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "description":
        comparison = a.description.localeCompare(b.description);
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Actions
  const handleEdit = (id: string) => {
    toast.success(`Edit transaction ${id}`);
  };

  const handleDelete = (id: string) => {
    setSelectedTransaction(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransaction) {
      toast.success(`Transaction ${selectedTransaction} deleted`);
      setDeleteDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleExport = (format: string) => {
    toast.success(`Transactions exported as ${format}`);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter(undefined);
    setTypeFilter(undefined);
    setTimePeriod("all");
    setDateRange(undefined);
    setPaymentMethodFilter(undefined);
    setStatusFilter(undefined);
    toast.success("Filters reset");
  };

  // Calculate total income, expenses, and balance
  const totalIncome = sortedTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalExpenses = sortedTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  // Helper to get icon for payment method
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Credit Card":
        return <CreditCard className="h-4 w-4" />;
      case "Debit Card":
        return <CreditCard className="h-4 w-4" />;
      case "Bank Transfer":
        return <CircleDollarSign className="h-4 w-4" />;
      case "PayPal":
        return <CircleDollarSign className="h-4 w-4" />;
      case "Cash":
        return <CircleDollarSign className="h-4 w-4" />;
      default:
        return <CircleDollarSign className="h-4 w-4" />;
    }
  };

  // Helper to get status badge
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "recurring":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <BadgePercent className="h-3 w-3 mr-1" />
            Recurring
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
            <p className="text-muted-foreground">
              View, search, and manage your transaction history
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("CSV")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("PDF")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center border rounded-md p-1">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'card' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('card')}
                className="h-8"
              >
                <CreditCard className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/50">
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <ArrowDown className="h-5 w-5 text-green-600 dark:text-green-400 rotate-180" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50">
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                  <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50">
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Balance</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(Math.abs(balance))}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <CircleDollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Search & Filter
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                <X className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>All Types</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant={showAdvancedFilters ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showAdvancedFilters && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Time Period</Label>
                    <Select value={timePeriod} onValueChange={setTimePeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Time Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {timePeriod === "custom" && (
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(dateRange.from, "LLL dd, y")
                              )
                            ) : (
                              "Select date range"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Methods</SelectItem>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {viewMode === 'list' ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Transaction List
                </CardTitle>
                <Badge variant="outline">{sortedTransactions.length} transactions</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                        Date {getSortIcon("date")}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                        Description {getSortIcon("description")}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                        Category {getSortIcon("category")}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                        Amount {getSortIcon("amount")}
                      </TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.length > 0 ? (
                      sortedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{format(transaction.date, "MMM dd, yyyy")}</TableCell>
                          <TableCell>
                            <div className="font-medium">{transaction.description}</div>
                            {transaction.tags && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {transaction.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize px-2 py-1">
                              {transaction.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {transaction.type === "expense" ? (
                                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                              ) : (
                                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                              )}
                              <span className={transaction.type === "expense" ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                                {formatCurrency(transaction.amount)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(transaction.paymentMethod)}
                              <span>{transaction.paymentMethod}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(transaction.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(transaction.id)}
                                  className="text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Search className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No transactions found</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{sortedTransactions.length}</span> of <span className="font-medium">{transactions.length}</span> transactions
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Transaction Cards
                  </CardTitle>
                  <Badge variant="outline">{sortedTransactions.length} transactions</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {sortedTransactions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedTransactions.map((transaction) => (
                      <Card key={transaction.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4 border-b">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium">{transaction.description}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {format(transaction.date, "MMMM d, yyyy")}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(transaction.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(transaction.id)}
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-muted/10">
                            <div className="flex justify-between items-center mb-3">
                              <Badge variant="outline" className="capitalize">
                                {transaction.category}
                              </Badge>
                              {getStatusBadge(transaction.status)}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {getPaymentMethodIcon(transaction.paymentMethod)}
                                <span className="text-sm">{transaction.paymentMethod}</span>
                              </div>
                              <div className={`text-lg font-bold ${transaction.type === "expense" ? "text-red-500" : "text-green-500"}`}>
                                {transaction.type === "expense" ? "-" : "+"}{formatCurrency(transaction.amount)}
                              </div>
                            </div>
                            
                            {transaction.tags && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {transaction.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No transactions found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{sortedTransactions.length}</span> of <span className="font-medium">{transactions.length}</span> transactions
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default History;
