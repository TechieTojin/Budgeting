import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Globe,
  RefreshCw,
  ChevronsUpDown,
  Plus,
  DollarSign,
  Search,
  ArrowUpDown,
  PiggyBank,
  CreditCard,
  Calendar,
  Wallet,
  Tag,
  ChevronDown,
  Sparkles,
  ArrowDownUp,
  MoveRight,
  SwitchCamera,
  CircleDollarSign,
  ChevronRight,
  MoreHorizontal,
  FileDown,
  Pencil,
  Trash,
  Plane,
  ShoppingCart,
  Landmark,
  Coffee,
  Briefcase,
  Check,
  User,
  Flag,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartData,
  Filler
} from 'chart.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Currency type
interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number; // Rate to USD
  flag?: string;
}

// Transaction type with enhanced fields
interface Transaction {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  amountInUSD: number;
  paymentMethod?: string;
  location?: string;
  icon?: React.ReactNode;
}

// Category configuration
interface Category {
  name: string;
  icon: React.ReactNode;
  color: string;
}

// Currency rates visualization data
interface CurrencyRateData {
  code: string;
  name: string;
  rate: number;
  change: number; // Percentage change in the last 30 days
}

// Sample categories with icons
const categories: Record<string, Category> = {
  "Travel": { 
    name: "Travel", 
    icon: <Plane className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
  },
  "Shopping": { 
    name: "Shopping", 
    icon: <ShoppingCart className="h-4 w-4" />,
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400"
  },
  "Food": { 
    name: "Food", 
    icon: <Coffee className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
  },
  "Business": { 
    name: "Business", 
    icon: <Briefcase className="h-4 w-4" />,
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
  },
  "Accommodation": { 
    name: "Accommodation", 
    icon: <Landmark className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
  }
};

// Sample currencies data with flags
const currencies: Currency[] = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", exchangeRate: 83.20, flag: "🇮🇳" },
  { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1, flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 0.91, flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 0.78, flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", exchangeRate: 146.32, flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", exchangeRate: 1.36, flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", exchangeRate: 1.48, flag: "🇦🇺" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", exchangeRate: 7.16, flag: "🇨🇳" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", exchangeRate: 0.87, flag: "🇨🇭" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", exchangeRate: 5.07, flag: "🇧🇷" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$", exchangeRate: 16.76, flag: "🇲🇽" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", exchangeRate: 1.33, flag: "🇸🇬" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", exchangeRate: 1.62, flag: "🇳🇿" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", exchangeRate: 7.82, flag: "🇭🇰" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", exchangeRate: 10.40, flag: "🇸🇪" },
];

// Currency rate trends for visualization
const currencyRateTrends: CurrencyRateData[] = [
  { code: "EUR", name: "Euro", rate: 0.91, change: -0.8 },
  { code: "GBP", name: "British Pound", rate: 0.78, change: 1.2 },
  { code: "JPY", name: "Japanese Yen", rate: 146.32, change: -2.1 },
  { code: "INR", name: "Indian Rupee", rate: 83.20, change: 0.3 },
  { code: "CAD", name: "Canadian Dollar", rate: 1.36, change: -0.5 },
];

const defaultConversion = [
  { from: "USD", to: "EUR", amount: 100 },
  { from: "USD", to: "GBP", amount: 100 },
  { from: "USD", to: "JPY", amount: 100 },
  { from: "USD", to: "INR", amount: 100 },
];

// Update the view type
type ViewType = 'all' | 'exchange' | 'trends';

const MultiCurrency = () => {
  const { t } = useLanguage();
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [quickConversions, setQuickConversions] = useState(defaultConversion);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    currency: "USD",
    category: "Travel",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Credit Card",
    location: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCurrency, setFilterCurrency] = useState("all");
  const [currentView, setCurrentView] = useState<ViewType>('all');
  const [convertedAmount, setConvertedAmount] = useState(0);

  // Enhanced sample transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      description: "Hotel Booking - Paris",
      amount: 450,
      currency: "EUR",
      date: "2024-03-15",
      category: "Accommodation",
      amountInUSD: 489.13,
      paymentMethod: "Credit Card",
      location: "Paris, France",
      icon: categories["Accommodation"].icon
    },
    {
      id: "2",
      description: "Conference Ticket",
      amount: 350,
      currency: "GBP",
      date: "2024-03-10",
      category: "Business",
      amountInUSD: 442.18,
      paymentMethod: "Company Card",
      location: "London, UK",
      icon: categories["Business"].icon
    },
    {
      id: "3",
      description: "Restaurant - Tokyo",
      amount: 8500,
      currency: "JPY",
      date: "2024-02-25",
      category: "Food",
      amountInUSD: 56.01,
      paymentMethod: "Cash",
      location: "Tokyo, Japan",
      icon: categories["Food"].icon
    },
    {
      id: "4",
      description: "Souvenir Shopping",
      amount: 3500,
      currency: "INR",
      date: "2024-02-20",
      category: "Shopping",
      amountInUSD: 41.95,
      paymentMethod: "Debit Card",
      location: "Mumbai, India",
      icon: categories["Shopping"].icon
    },
    {
      id: "5",
      description: "Airport Transfer",
      amount: 120,
      currency: "SGD",
      date: "2024-02-18",
      category: "Travel",
      amountInUSD: 90.23,
      paymentMethod: "Credit Card",
      location: "Singapore",
      icon: categories["Travel"].icon
    },
    {
      id: "6",
      description: "Tour Package",
      amount: 1800,
      currency: "CNY",
      date: "2024-02-15",
      category: "Travel",
      amountInUSD: 251.40,
      paymentMethod: "Wire Transfer",
      location: "Beijing, China",
      icon: categories["Travel"].icon
    },
  ]);

  // Update the chart data types
  const trendsData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'EUR/USD',
        data: [0.92, 0.91, 0.90, 0.91, 0.92, 0.91],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
      },
      {
        label: 'GBP/USD',
        data: [0.79, 0.78, 0.77, 0.78, 0.79, 0.78],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.4,
      },
      {
        label: 'JPY/USD',
        data: [145, 146, 147, 146, 145, 146],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.4,
      }
    ]
  };

  // Update the bar chart data
  const barChartData: ChartData<'bar'> = {
    labels: currencyRateTrends.map(c => c.code),
    datasets: [{
      label: '30-Day Change (%)',
      data: currencyRateTrends.map(c => c.change),
      backgroundColor: currencyRateTrends.map(c => 
        c.change >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)'
      ) as string[],
      borderColor: currencyRateTrends.map(c => 
        c.change >= 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)'
      ) as string[],
      borderWidth: 1
    }]
  };

  // Add new state for trend controls
  const [trendPeriod, setTrendPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(['EUR', 'GBP', 'JPY']);

  // Add more detailed trend data
  const detailedTrendsData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'EUR/USD',
        data: [0.92, 0.91, 0.90, 0.91, 0.92, 0.91],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
      {
        label: 'GBP/USD',
        data: [0.79, 0.78, 0.77, 0.78, 0.79, 0.78],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
      {
        label: 'JPY/USD',
        data: [145, 146, 147, 146, 145, 146],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 3,
      }
    ]
  };

  // Add performance metrics data
  const performanceMetrics = {
    bestPerformer: { code: 'GBP', change: 1.2 },
    worstPerformer: { code: 'JPY', change: -2.1 },
    mostVolatile: { code: 'EUR', volatility: 0.8 },
    averageChange: 0.3
  };

  // Get exchange rate between two currencies
  const getExchangeRate = (from: string, to: string): number => {
    const fromCurrency = currencies.find(c => c.code === from);
    const toCurrency = currencies.find(c => c.code === to);
    if (!fromCurrency || !toCurrency) return 1;
    return toCurrency.exchangeRate / fromCurrency.exchangeRate;
  };

  // Convert amount between currencies
  const convertAmount = (amount: number, from: string, to: string): number => {
    return amount * getExchangeRate(from, to);
  };

  // Handle conversion
  const handleConvert = () => {
    if (!amount) return;
    const convertedAmount = convertAmount(parseFloat(amount), fromCurrency, toCurrency);
    setConvertedAmount(convertedAmount);
  };

  // Swap currencies
  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Add quick conversion
  const handleAddQuickConversion = () => {
    const newConversion = { from: fromCurrency, to: toCurrency, amount: parseFloat(amount) || 1 };
    setQuickConversions([...quickConversions, newConversion]);
    toast.success("Quick conversion added");
  };

  // Handle new transaction form change
  const handleTransactionFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  // Handle currency selection for new transaction
  const handleCurrencyChange = (value: string) => {
    setNewTransaction({ ...newTransaction, currency: value });
  };
  
  // Handle category selection for new transaction
  const handleCategoryChange = (value: string) => {
    setNewTransaction({ ...newTransaction, category: value });
  };
  
  // Handle payment method selection
  const handlePaymentMethodChange = (value: string) => {
    setNewTransaction({ ...newTransaction, paymentMethod: value });
  };
  
  // Handle date change
  const handleDateChange = (value: string) => {
    setNewTransaction({ ...newTransaction, date: value });
  };

  // Add new transaction
  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    const amountInUSD = convertAmount(amount, newTransaction.currency, "USD");
    
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: newTransaction.description,
      amount: amount,
      currency: newTransaction.currency,
      date: newTransaction.date,
      category: newTransaction.category,
      amountInUSD: amountInUSD,
      paymentMethod: newTransaction.paymentMethod,
      location: newTransaction.location,
      icon: categories[newTransaction.category]?.icon
    };
    
    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      description: "",
      amount: "",
      currency: "USD",
      category: "Travel",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Credit Card",
      location: "",
    });
    setIsAddingTransaction(false);
    toast.success("Transaction added successfully");
  };

  // Format amount with currency symbol
  const formatCurrency = (amount: number, currencyCode: string): string => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return `${currency?.symbol || ""}${amount.toFixed(2)}`;
  };

  // Calculate balance in each currency
  const calculateBalances = () => {
    const balances: Record<string, number> = {};
    
    transactions.forEach((transaction) => {
      if (!balances[transaction.currency]) {
        balances[transaction.currency] = 0;
      }
      balances[transaction.currency] -= transaction.amount;
    });
    
    return Object.entries(balances).map(([currency, amount]) => ({
      currency,
      amount,
      amountInBaseCurrency: convertAmount(amount, currency, baseCurrency),
    }));
  };

  // Total in base currency
  const totalInBaseCurrency = transactions.reduce((total, transaction) => {
    return total - convertAmount(transaction.amount, transaction.currency, baseCurrency);
  }, 0);

  // Add gradient colors for the charts
  const createGradient = (ctx: CanvasRenderingContext2D, color: string) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ', 0.2)'));
    gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0.0)'));
    return gradient;
  };

  // Add the view content based on currentView
  const renderViewContent = () => {
    switch (currentView) {
      case 'all':
        return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ArrowDownUp className="h-5 w-5 text-primary" />
                Currency Converter
              </CardTitle>
              <CardDescription>
                Convert between different currencies using the latest exchange rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount-input">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount-input"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                        className="pl-9"
                    />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="from-currency">From</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger id="from-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center gap-2">
                              <span>{currency.flag}</span>
                              <span>{currency.code} - {currency.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="to-currency">To</Label>
                    <div className="flex items-center gap-2">
                        <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger id="to-currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center gap-2">
                                <span>{currency.flag}</span>
                                <span>{currency.code} - {currency.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSwapCurrencies}
                        className="flex-shrink-0"
                      >
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {amount && (
                  <div className="bg-muted/40 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {parseFloat(amount) ? (
                        <>
                          {currencies.find(c => c.code === fromCurrency)?.symbol || ''}
                          {parseFloat(amount).toFixed(2)} = 
                          {' '}
                          {currencies.find(c => c.code === toCurrency)?.symbol || ''}
                          {(parseFloat(amount) * getExchangeRate(fromCurrency, toCurrency)).toFixed(2)}
                        </>
                      ) : '—'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Exchange rate: 1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleAddQuickConversion} className="w-1/3">
                    <Plus className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button onClick={handleConvert} className="w-1/2">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Convert
                  </Button>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Quick Conversions</h3>
                  <div className="space-y-2">
                    {quickConversions.map((conversion, index) => {
                      const rate = getExchangeRate(conversion.from, conversion.to);
                      const result = conversion.amount * rate;
                      const fromCurrencyData = currencies.find(c => c.code === conversion.from);
                      const toCurrencyData = currencies.find(c => c.code === conversion.to);
                      
                      return (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <span className="text-lg mr-1">{fromCurrencyData?.flag}</span>
                                  <span className="font-medium">{conversion.amount.toFixed(2)}</span>
                                  <span className="ml-1 text-sm text-muted-foreground">{conversion.from}</span>
                          </div>
                                <MoveRight className="h-4 w-4 text-muted-foreground mx-1" />
                                <div className="flex items-center">
                                  <span className="text-lg mr-1">{toCurrencyData?.flag}</span>
                                  <span className="font-medium">{result.toFixed(2)}</span>
                                  <span className="ml-1 text-sm text-muted-foreground">{conversion.to}</span>
                          </div>
                        </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-primary" />
                    Multi-Currency Balance
                  </CardTitle>
                  <CardDescription>
                    Your balances across different currencies
                  </CardDescription>
                </div>
                <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Base currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {calculateBalances().map(({ currency, amount, amountInBaseCurrency }) => {
                  const currencyData = currencies.find(c => c.code === currency);
                  return (
                  <div key={currency} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg">{currencyData?.flag}</span>
                        </div>
                    <div>
                      <div className="text-lg font-semibold">{formatCurrency(amount, currency)}</div>
                          <div className="text-sm text-muted-foreground">{currencyData?.name}</div>
                        </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">In {baseCurrency}</div>
                      <div className="text-lg font-semibold">{formatCurrency(amountInBaseCurrency, baseCurrency)}</div>
                    </div>
                  </div>
                  );
                })}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-medium">Total Balance:</div>
                    <div className="text-xl font-bold text-primary">
                      {formatCurrency(totalInBaseCurrency, baseCurrency)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        );

      case 'exchange':
        return (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownUp className="h-5 w-5 text-primary" />
                  Exchange Rates
                </CardTitle>
                <CardDescription>
                  Current exchange rates for major currencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currencies.map((currency) => (
                    <Card key={currency.code} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{currency.flag}</span>
                            <div>
                              <div className="font-semibold">{currency.code}</div>
                              <div className="text-sm text-muted-foreground">{currency.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {currency.exchangeRate.toFixed(4)} USD
                            </div>
                            <div className="text-sm text-muted-foreground">
                              1 USD = {(1 / currency.exchangeRate).toFixed(4)} {currency.code}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'trends':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currencies.find(c => c.code === performanceMetrics.bestPerformer.code)?.flag}</span>
                      <div>
                        <div className="font-semibold">{performanceMetrics.bestPerformer.code}</div>
                        <div className="text-sm text-green-600">+{performanceMetrics.bestPerformer.change}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Worst Performer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currencies.find(c => c.code === performanceMetrics.worstPerformer.code)?.flag}</span>
                      <div>
                        <div className="font-semibold">{performanceMetrics.worstPerformer.code}</div>
                        <div className="text-sm text-red-600">{performanceMetrics.worstPerformer.change}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Most Volatile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currencies.find(c => c.code === performanceMetrics.mostVolatile.code)?.flag}</span>
                      <div>
                        <div className="font-semibold">{performanceMetrics.mostVolatile.code}</div>
                        <div className="text-sm text-muted-foreground">±{performanceMetrics.mostVolatile.volatility}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Change</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">All Currencies</div>
                        <div className="text-sm text-muted-foreground">{performanceMetrics.averageChange}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Currency Trends
                    </CardTitle>
                    <CardDescription>
                      Historical exchange rate trends
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={trendPeriod} onValueChange={(value: '1M' | '3M' | '6M' | '1Y') => setTrendPeriod(value)}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1M">1 Month</SelectItem>
                        <SelectItem value="3M">3 Months</SelectItem>
                        <SelectItem value="6M">6 Months</SelectItem>
                        <SelectItem value="1Y">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line
                    data={detailedTrendsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart',
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: {
                              size: 12,
                              weight: 'normal',
                            },
                          },
                        },
                        title: {
                          display: true,
                          text: 'Exchange Rate Trends (vs USD)',
                          font: {
                            size: 16,
                            weight: 'bold',
                          },
                          padding: {
                            top: 10,
                            bottom: 20,
                          },
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderWidth: 1,
                          padding: 12,
                          cornerRadius: 8,
                          displayColors: true,
                          usePointStyle: true,
                          callbacks: {
                            label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(4);
                              }
                              return label;
                            },
                            title: function(context) {
                              return `Date: ${context[0].label}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                          },
                          ticks: {
                            font: {
                              size: 11,
                            },
                            padding: 10,
                          },
                          border: {
                            display: false,
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            font: {
                              size: 11,
                            },
                            padding: 10,
                          },
                          border: {
                            display: false,
                          },
                        }
                      },
                      elements: {
                        line: {
                          tension: 0.4,
                        },
                        point: {
                          radius: 4,
                          hoverRadius: 6,
                          borderWidth: 2,
                        },
                      },
                      hover: {
                        mode: 'index',
                        intersect: false,
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Currency Performance
                  </CardTitle>
                  <CardDescription>
                    Performance comparison of major currencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.parsed.y}%`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Change (%)'
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)',
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <ArrowDownUp className="h-5 w-5 text-primary" />
                    Currency Correlation
                  </CardTitle>
                  <CardDescription>
                    Correlation between major currency pairs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { pair: 'EUR/USD', correlation: 0.85 },
                      { pair: 'GBP/USD', correlation: 0.78 },
                      { pair: 'JPY/USD', correlation: -0.65 },
                      { pair: 'EUR/GBP', correlation: 0.92 },
                      { pair: 'EUR/JPY', correlation: -0.45 }
                    ].map((item) => (
                      <div key={item.pair} className="flex items-center justify-between">
                        <div className="font-medium">{item.pair}</div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.correlation > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.abs(item.correlation * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {item.correlation.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Multi-Currency Management</h1>
            <p className="text-muted-foreground">
              Convert between currencies and track foreign expenses
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('all')} 
              className={currentView === 'all' ? 'bg-muted' : ''}
            >
              <Globe className="mr-2 h-4 w-4" />
              All Currencies
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('exchange')} 
              className={currentView === 'exchange' ? 'bg-muted' : ''}
            >
              <ArrowDownUp className="mr-2 h-4 w-4" />
              Exchange
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('trends')} 
              className={currentView === 'trends' ? 'bg-muted' : ''}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Trends
            </Button>
            <Button onClick={() => setIsAddingTransaction(!isAddingTransaction)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>
        
        {renderViewContent()}
        
        {/* Add Transaction Dialog */}
        <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>
                Enter the details of your foreign currency transaction
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleTransactionFormChange}
                  placeholder="e.g., Hotel Booking - Paris"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={handleTransactionFormChange}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={newTransaction.currency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code} - {currency.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newTransaction.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{key}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={handleTransactionFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={newTransaction.paymentMethod} onValueChange={handlePaymentMethodChange}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                    <SelectItem value="Company Card">Company Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  name="location"
                  value={newTransaction.location}
                  onChange={handleTransactionFormChange}
                  placeholder="e.g., Paris, France"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingTransaction(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTransaction}>
                Add Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Foreign Currency Transactions
              </CardTitle>
              <CardDescription>
                Track your spending in different currencies around the world
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All currencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All currencies</SelectItem>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transactions
                .filter(tx => filterCurrency === 'all' || tx.currency === filterCurrency)
                .filter(tx => 
                  searchQuery === '' ||
                  tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  tx.location?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((transaction) => {
                  const currencyData = currencies.find(c => c.code === transaction.currency);
                  const categoryData = categories[transaction.category] || { 
                    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", 
                    icon: <Tag className="h-4 w-4" />
                  };
                  
                  return (
                    <Card key={transaction.id} className="overflow-hidden">
          <CardContent className="p-0">
                        <div className="p-4 border-b">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${categoryData.color}`}>
                                {categoryData.icon}
                              </div>
                              <div>
                                <div className="font-medium">{transaction.description}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileDown className="mr-2 h-4 w-4" />
                                  Export
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-muted/10">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-1">
                              <span className="text-lg mr-1">{currencyData?.flag}</span>
                              <span className="font-bold text-lg">{formatCurrency(transaction.amount, transaction.currency)}</span>
                            </div>
                            <Badge variant="outline">
                              {formatCurrency(transaction.amountInUSD, "USD")}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {transaction.paymentMethod}
                            </div>
                            {transaction.location && (
                              <div className="flex items-center gap-1">
                                <Flag className="h-3 w-3" />
                                {transaction.location}
                              </div>
                            )}
                          </div>
                        </div>
          </CardContent>
        </Card>
                  );
                })}
            </div>
            
            {transactions
              .filter(tx => filterCurrency === 'all' || tx.currency === filterCurrency)
              .filter(tx => 
                searchQuery === '' ||
                tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tx.location?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                  <h3 className="text-lg font-medium">No transactions found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search filters
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MultiCurrency;
