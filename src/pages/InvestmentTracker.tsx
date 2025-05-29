import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  DollarSign,
  BarChart3,
  PieChartIcon,
  Eye,
  EyeOff,
  Plus,
  Calendar,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Sample data
const portfolioPerformance = [
  { month: "Jan", value: 32500 },
  { month: "Feb", value: 33800 },
  { month: "Mar", value: 33200 },
  { month: "Apr", value: 34500 },
  { month: "May", value: 35700 },
  { month: "Jun", value: 37200 },
  { month: "Jul", value: 38100 },
  { month: "Aug", value: 39500 },
  { month: "Sep", value: 41200 },
  { month: "Oct", value: 42700 },
];

const assetAllocation = [
  { name: "Stocks", value: 55, color: "#0ea5e9" },
  { name: "Bonds", value: 20, color: "#f97316" },
  { name: "Cash", value: 10, color: "#10b981" },
  { name: "Real Estate", value: 10, color: "#8b5cf6" },
  { name: "Crypto", value: 5, color: "#f43f5e" },
];

const investments = [
  {
    id: 1,
    name: "AAPL - Apple Inc.",
    category: "Stocks",
    value: 9500,
    initialInvestment: 7500,
    returnPercentage: 26.67,
    lastUpdated: "1 day ago",
    trend: "up",
  },
  {
    id: 2,
    name: "MSFT - Microsoft Corp.",
    category: "Stocks",
    value: 8300,
    initialInvestment: 6800,
    returnPercentage: 22.06,
    lastUpdated: "1 day ago",
    trend: "up",
  },
  {
    id: 3,
    name: "AMZN - Amazon.com Inc.",
    category: "Stocks",
    value: 5600,
    initialInvestment: 5900,
    returnPercentage: -5.08,
    lastUpdated: "1 day ago",
    trend: "down",
  },
  {
    id: 4,
    name: "10-Year Treasury Bond",
    category: "Bonds",
    value: 8500,
    initialInvestment: 8000,
    returnPercentage: 6.25,
    lastUpdated: "1 month ago",
    trend: "up",
  },
  {
    id: 5,
    name: "Real Estate Fund",
    category: "Real Estate",
    value: 4200,
    initialInvestment: 4000,
    returnPercentage: 5.00,
    lastUpdated: "3 months ago",
    trend: "up",
  },
  {
    id: 6,
    name: "Bitcoin",
    category: "Crypto",
    value: 2100,
    initialInvestment: 1500,
    returnPercentage: 40.00,
    lastUpdated: "1 day ago",
    trend: "up",
  },
];

const InvestmentTracker = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showValues, setShowValues] = useState(true);
  const [timeframe, setTimeframe] = useState("1y");
  const [investmentData, setInvestmentData] = useState(investments);
  const [portfolioData, setPortfolioData] = useState(portfolioPerformance);
  const [selectedInvestment, setSelectedInvestment] = useState<number | null>(null);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [timelineFilter, setTimelineFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    category: "Stocks",
    initialInvestment: "",
    currentValue: "",
    purchaseDate: "",
  });

  // Calculate portfolio values
  const totalPortfolioValue = investmentData.reduce((total, investment) => total + investment.value, 0);
  const totalInitialInvestment = investmentData.reduce((total, investment) => total + investment.initialInvestment, 0);
  const totalReturn = totalPortfolioValue - totalInitialInvestment;
  const totalReturnPercentage = (totalReturn / totalInitialInvestment) * 100;

  // Update data based on timeframe
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Generate different performance data based on timeframe
      let newPortfolioData = [...portfolioPerformance];
      
      if (timeframe === "1m") {
        newPortfolioData = portfolioPerformance.slice(-2);
      } else if (timeframe === "3m") {
        newPortfolioData = portfolioPerformance.slice(-4);
      } else if (timeframe === "6m") {
        newPortfolioData = portfolioPerformance.slice(-7);
      } else if (timeframe === "5y") {
        // Generate additional data for 5 years
        const extended = [...portfolioPerformance];
        let lastValue = extended[extended.length - 1].value;
        
        for (let i = 0; i < 50; i++) {
          const month = `Month ${i + 11}`;
          const randomChange = (Math.random() * 0.1 - 0.03) * lastValue;
          lastValue += randomChange;
          extended.push({ month, value: Math.round(lastValue) });
        }
        
        newPortfolioData = extended;
      }
      
      setPortfolioData(newPortfolioData);
      setIsLoading(false);
      toast.success(`Timeframe updated to ${timeframe}`);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [timeframe]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update investment values with small random fluctuations
      const updatedInvestments = investmentData.map(investment => {
        const randomChange = (Math.random() * 0.04 - 0.02) * investment.value;
        const newValue = Math.round(investment.value + randomChange);
        const newReturnPercentage = ((newValue - investment.initialInvestment) / investment.initialInvestment) * 100;
        
        return {
          ...investment,
          value: newValue,
          returnPercentage: newReturnPercentage,
          lastUpdated: "just now",
          trend: newValue >= investment.value ? "up" : "down"
        };
      });
      
      setInvestmentData(updatedInvestments);
      setIsRefreshing(false);
      setIsLoading(false);
      toast.success("Investment data refreshed with latest market values");
    }, 1500);
  }, [investmentData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleRowClick = (id: number) => {
    setSelectedInvestment(id === selectedInvestment ? null : id);
  };

  const handleAddInvestment = () => {
    setShowAddInvestmentModal(true);
  };

  const handleCloseModal = () => {
    setShowAddInvestmentModal(false);
    // Reset form data
    setFormData({
      name: "",
      category: "Stocks",
      initialInvestment: "",
      currentValue: "",
      purchaseDate: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmitInvestment = () => {
    // Form validation
    if (!formData.name || !formData.initialInvestment || !formData.currentValue) {
      toast.error("Please fill all required fields");
      return;
    }

    const initialValue = parseFloat(formData.initialInvestment);
    const currentValue = parseFloat(formData.currentValue);
    
    // Calculate return percentage
    const returnPercentage = ((currentValue - initialValue) / initialValue) * 100;

    // Create new investment
    const newInvestment = {
      id: investmentData.length + 1,
      name: formData.name,
      category: formData.category,
      value: currentValue,
      initialInvestment: initialValue,
      returnPercentage: returnPercentage,
      lastUpdated: "just now",
      trend: returnPercentage >= 0 ? "up" : "down",
    };

    // Add to investments
    setInvestmentData(prev => [...prev, newInvestment]);
    
    // Update asset allocation data based on new investment
    // This would be more complex in a real app
    
    // Show success message
    toast.success(`Added new investment: ${formData.name}`);
    
    // Close modal
    handleCloseModal();
  };

  const filterInvestments = useCallback((tabKey: string) => {
    setActiveTab(tabKey);
    // The actual filtering happens in the render based on activeTab
  }, []);

  const handleTimelineFilter = useCallback((filter: string) => {
    setTimelineFilter(filter);
    toast.success(`Timeline filtered to show ${filter} events`);
  }, []);

  const getFilteredInvestments = () => {
    if (activeTab === "all") return investmentData;
    return investmentData.filter(inv => inv.category.toLowerCase() === activeTab);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Investment Tracker</h1>
            <p className="text-muted-foreground">
              Monitor and analyze your investment portfolio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={timeframe}
              onValueChange={setTimeframe}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="5y">5 Years</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowValues(!showValues)}
              className="gap-1"
            >
              {showValues ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span className="hidden sm:inline">Hide Values</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Show Values</span>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Updating investment data...</p>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${isLoading ? 'opacity-50' : ''}`}>
          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <h2 className="text-3xl font-bold">
                      {showValues ? formatCurrency(totalPortfolioValue) : "••••••"}
                    </h2>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={totalReturnPercentage >= 0 
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }
                  >
                    {totalReturnPercentage >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 mr-1" />
                    )}
                    {totalReturnPercentage.toFixed(2)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Initial Investment</span>
                    <span className="text-sm font-medium">
                      {showValues ? formatCurrency(totalInitialInvestment) : "••••••"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Return</span>
                    <span className={`text-sm font-medium ${
                      totalReturn >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {showValues ? formatCurrency(totalReturn) : "••••••"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm">{isRefreshing ? "Updating..." : investmentData[0].lastUpdated}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      onClick={(data) => {
                        filterInvestments(data.name.toLowerCase());
                        toast.info(`Filtered to ${data.name} investments`);
                      }}
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          stroke={activeTab === entry.name.toLowerCase() ? "#000" : "none"}
                          strokeWidth={activeTab === entry.name.toLowerCase() ? 2 : 0}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={portfolioData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                      domain={['dataMin - 1000', 'dataMax + 1000']}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value as number), 'Value']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={filterInvestments} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Investments</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="bonds">Bonds</TabsTrigger>
            <TabsTrigger value="other">Other Assets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Your Investments</h2>
              <Button className="gap-1" onClick={handleAddInvestment}>
                <Plus className="h-4 w-4" />
                Add Investment
              </Button>
            </div>
            
            <Card className="border-primary/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Return</TableHead>
                      <TableHead className="text-right">Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredInvestments().map((investment) => (
                      <TableRow 
                        key={investment.id} 
                        className={`cursor-pointer hover:bg-muted/50 ${selectedInvestment === investment.id ? 'bg-muted/50' : ''}`}
                        onClick={() => handleRowClick(investment.id)}
                      >
                        <TableCell className="font-medium">{investment.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{investment.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {showValues ? formatCurrency(investment.value) : "••••••"}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center ${
                            investment.returnPercentage >= 0 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {investment.returnPercentage >= 0 ? (
                              <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                            )}
                            {investment.returnPercentage.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {investment.lastUpdated}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {selectedInvestment && (
              <Card className="border-primary/10 animate-fadeIn">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    {investmentData.find(i => i.id === selectedInvestment)?.name} Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Initial Investment:</span>
                          <span className="font-medium">
                            {showValues ? formatCurrency(investmentData.find(i => i.id === selectedInvestment)?.initialInvestment || 0) : "••••••"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Value:</span>
                          <span className="font-medium">
                            {showValues ? formatCurrency(investmentData.find(i => i.id === selectedInvestment)?.value || 0) : "••••••"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Return:</span>
                          <span className={`font-medium ${
                            (investmentData.find(i => i.id === selectedInvestment)?.returnPercentage || 0) >= 0 
                              ? "text-green-600" : "text-red-600"
                          }`}>
                            {showValues ? 
                              formatCurrency((
                                investmentData.find(i => i.id === selectedInvestment)?.value || 0) - 
                                (investmentData.find(i => i.id === selectedInvestment)?.initialInvestment || 0)
                              ) : "••••••"
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions</h3>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline" onClick={() => toast.info("Buy more shares")}>
                          <Plus className="h-4 w-4 mr-2" />
                          Buy More
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast.info("Sell shares")}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Sell
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedInvestment(null);
                          toast.info("Details closed");
                        }}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="stocks" className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Stock Investments</CardTitle>
                <CardDescription>Your stock portfolio performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments
                    .filter(inv => inv.category === "Stocks")
                    .map((stock) => (
                      <div key={stock.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div>
                          <h3 className="font-medium">{stock.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Initial: {showValues ? formatCurrency(stock.initialInvestment) : "••••••"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {showValues ? formatCurrency(stock.value) : "••••••"}
                          </div>
                          <div className={`text-sm ${
                            stock.returnPercentage >= 0 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {stock.returnPercentage >= 0 ? "+" : ""}
                            {stock.returnPercentage.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bonds" className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Bond Investments</CardTitle>
                <CardDescription>Your bond holdings and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments
                    .filter(inv => inv.category === "Bonds")
                    .map((bond) => (
                      <div key={bond.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div>
                          <h3 className="font-medium">{bond.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Initial: {showValues ? formatCurrency(bond.initialInvestment) : "••••••"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {showValues ? formatCurrency(bond.value) : "••••••"}
                          </div>
                          <div className={`text-sm ${
                            bond.returnPercentage >= 0 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {bond.returnPercentage >= 0 ? "+" : ""}
                            {bond.returnPercentage.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="other" className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Other Assets</CardTitle>
                <CardDescription>Real estate, cryptocurrency, and other investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments
                    .filter(inv => inv.category !== "Stocks" && inv.category !== "Bonds")
                    .map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div>
                          <h3 className="font-medium">{asset.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{asset.category}</Badge>
                            <p className="text-sm text-muted-foreground">
                              Initial: {showValues ? formatCurrency(asset.initialInvestment) : "••••••"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {showValues ? formatCurrency(asset.value) : "••••••"}
                          </div>
                          <div className={`text-sm ${
                            asset.returnPercentage >= 0 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {asset.returnPercentage >= 0 ? "+" : ""}
                            {asset.returnPercentage.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-primary/10 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Investment Timeline
                </CardTitle>
                <CardDescription>Track your investment journey</CardDescription>
              </div>
              <Select 
                value={timelineFilter} 
                onValueChange={handleTimelineFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="buys">Purchases</SelectItem>
                  <SelectItem value="sells">Sales</SelectItem>
                  <SelectItem value="dividends">Dividends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-primary/20 pl-6 ml-6 space-y-6">
              {[
                { 
                  date: "Oct 15, 2023", 
                  title: "Purchased Apple Stock", 
                  description: "Bought 10 shares at ₹175 per share",
                  icon: <Plus />,
                  badge: "Purchase"
                },
                { 
                  date: "Sep 30, 2023", 
                  title: "Dividend Payment", 
                  description: "Received ₹45 in dividends from Microsoft Corp",
                  icon: <DollarSign />,
                  badge: "Dividend"
                },
                { 
                  date: "Aug 22, 2023", 
                  title: "Added to Bond Fund", 
                  description: "Invested additional ₹2,000 in 10-Year Treasury Bond",
                  icon: <Plus />,
                  badge: "Purchase"
                },
                { 
                  date: "Jul 10, 2023", 
                  title: "Sold Tesla Stock", 
                  description: "Sold 5 shares at ₹280 per share (15% gain)",
                  icon: <DollarSign />,
                  badge: "Sale"
                },
              ].map((event, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[33px] p-1.5 rounded-full bg-background border-2 border-primary">
                    {event.icon}
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline" className="mb-2 bg-primary/5">
                        {event.date}
                      </Badge>
                      <Badge variant="outline">
                        {event.badge}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    <p className="text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Showing most recent 4 events
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toast.info("Viewing all investment events")}
            >
              View All
            </Button>
          </CardFooter>
        </Card>

        {/* Investment Modal with Form */}
        <Dialog open={showAddInvestmentModal} onOpenChange={setShowAddInvestmentModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Investment</DialogTitle>
              <DialogDescription>
                Enter details about your investment to start tracking it.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="AAPL - Apple Inc."
                  className="col-span-3"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Category</Label>
                <RadioGroup 
                  className="col-span-3"
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Stocks" id="stocks" />
                    <Label htmlFor="stocks" className="cursor-pointer">Stocks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Bonds" id="bonds" />
                    <Label htmlFor="bonds" className="cursor-pointer">Bonds</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Real Estate" id="real-estate" />
                    <Label htmlFor="real-estate" className="cursor-pointer">Real Estate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Crypto" id="crypto" />
                    <Label htmlFor="crypto" className="cursor-pointer">Cryptocurrency</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="initialInvestment" className="text-right">
                  Initial Investment (₹)
                </Label>
                <Input
                  id="initialInvestment"
                  name="initialInvestment"
                  type="number"
                  placeholder="5000"
                  className="col-span-3"
                  value={formData.initialInvestment}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentValue" className="text-right">
                  Current Value (₹)
                </Label>
                <Input
                  id="currentValue"
                  name="currentValue"
                  type="number"
                  placeholder="5500"
                  className="col-span-3"
                  value={formData.currentValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purchaseDate" className="text-right">
                  Purchase Date
                </Label>
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  className="col-span-3"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitInvestment}>Add Investment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default InvestmentTracker; 