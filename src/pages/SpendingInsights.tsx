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
  BarChart,
  Bar,
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
  Brain,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Coffee,
  Utensils,
  Home,
  Car,
  Smartphone,
  ShoppingCart,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for charts
const monthlySpendingData = [
  { month: "Jan", amount: 1200, predicted: 1200 },
  { month: "Feb", amount: 1350, predicted: 1300 },
  { month: "Mar", amount: 1450, predicted: 1400 },
  { month: "Apr", amount: 1250, predicted: 1350 },
  { month: "May", amount: 1500, predicted: 1400 },
  { month: "Jun", amount: 1650, predicted: 1550 },
  { month: "Jul", amount: 1450, predicted: 1500 },
  { month: "Aug", amount: 1350, predicted: 1400 },
  { month: "Sep", amount: 1550, predicted: 1450 },
  { month: "Oct", amount: 1750, predicted: 1600 },
  { month: "Nov", amount: null, predicted: 1700 },
  { month: "Dec", amount: null, predicted: 1750 },
];

const categoryData = [
  { name: "Groceries", value: 450, percentage: 25, color: "#0ea5e9" },
  { name: "Dining", value: 380, percentage: 21, color: "#f97316" },
  { name: "Shopping", value: 310, percentage: 17, color: "#8b5cf6" },
  { name: "Transport", value: 250, percentage: 14, color: "#10b981" },
  { name: "Utilities", value: 210, percentage: 12, color: "#f43f5e" },
  { name: "Entertainment", value: 120, percentage: 7, color: "#fbbf24" },
  { name: "Others", value: 80, percentage: 4, color: "#6b7280" },
];

const weekdaySpendingData = [
  { day: "Mon", amount: 120 },
  { day: "Tue", amount: 95 },
  { day: "Wed", amount: 135 },
  { day: "Thu", amount: 115 },
  { day: "Fri", amount: 180 },
  { day: "Sat", amount: 230 },
  { day: "Sun", amount: 170 },
];

const anomalies = [
  {
    id: "a1",
    category: "Dining",
    date: "Oct 15, 2023",
    amount: 85.50,
    typical: 35.20,
    percentIncrease: 143,
    icon: <Utensils className="h-5 w-5" />,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
  },
  {
    id: "a2",
    category: "Shopping",
    date: "Oct 22, 2023",
    amount: 215.30,
    typical: 89.75,
    percentIncrease: 140,
    icon: <ShoppingBag className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
  },
  {
    id: "a3",
    category: "Utilities",
    date: "Oct 05, 2023",
    amount: 145.90,
    typical: 95.25,
    percentIncrease: 53,
    icon: <Home className="h-5 w-5" />,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
  }
];

const insights = [
  {
    id: "i1",
    title: "Dining expenses increased by 28% this month",
    description: "You spent $380 on dining this month compared to your average of $295.",
    impact: "high",
    actionable: true,
    action: "Review your dining habits and consider cooking at home more often."
  },
  {
    id: "i2",
    title: "Consistent increase in grocery spending",
    description: "Your grocery spending has increased by 5% each month for the last 3 months.",
    impact: "medium",
    actionable: true,
    action: "Try meal planning and bulk purchasing to reduce costs."
  },
  {
    id: "i3",
    title: "Weekend spending is 45% higher than weekdays",
    description: "On average, you spend $185 per weekend day compared to $128 on weekdays.",
    impact: "medium",
    actionable: true,
    action: "Look for free weekend activities or set a weekend budget."
  },
  {
    id: "i4",
    title: "Subscription costs optimization potential",
    description: "You're spending $65 on subscriptions you haven't used in the last 30 days.",
    impact: "high",
    actionable: true,
    action: "Review and cancel unused subscriptions to save $780 annually."
  }
];

// Add formatCurrency function after imports
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const SpendingInsights = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState("month");
  const [insightCategory, setInsightCategory] = useState("all");
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentData, setCurrentData] = useState(monthlySpendingData);
  const [currentCategoryData, setCurrentCategoryData] = useState(categoryData);
  const [currentAnomalies, setCurrentAnomalies] = useState(anomalies);
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Real-time data update based on timeframe
  useEffect(() => {
    setShowSpinner(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Modify data based on selected timeframe
      let updatedData = [...monthlySpendingData];
      let updatedCategoryData = [...categoryData];
      
      if (timeframe === "week") {
        updatedData = updatedData.slice(-4);
        updatedCategoryData = updatedCategoryData.map(cat => ({
          ...cat,
          value: Math.round(cat.value * 0.25)
        }));
      } else if (timeframe === "quarter") {
        updatedCategoryData = updatedCategoryData.map(cat => ({
          ...cat,
          value: Math.round(cat.value * 3)
        }));
      } else if (timeframe === "year") {
        updatedCategoryData = updatedCategoryData.map(cat => ({
          ...cat,
          value: Math.round(cat.value * 12)
        }));
      }
      
      setCurrentData(updatedData);
      setCurrentCategoryData(updatedCategoryData);
      setShowSpinner(false);
      
      toast.success(`Data updated for ${timeframe} view`);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [timeframe]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setShowSpinner(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate slightly different data to simulate refresh
      const refreshedData = monthlySpendingData.map(item => ({
        ...item,
        amount: item.amount ? Math.round(item.amount * (0.95 + Math.random() * 0.1)) : null,
        predicted: Math.round(item.predicted * (0.95 + Math.random() * 0.1))
      }));
      
      const refreshedCategoryData = categoryData.map(item => ({
        ...item,
        value: Math.round(item.value * (0.95 + Math.random() * 0.1))
      }));
      
      // Update data states
      setCurrentData(refreshedData);
      setCurrentCategoryData(refreshedCategoryData);
      
      // Generate a new anomaly occasionally
      if (Math.random() > 0.7) {
        const newAnomaly = {
          id: `a${currentAnomalies.length + 1}`,
          category: "Entertainment",
          date: "Oct 28, 2023",
          amount: 95.40,
          typical: 42.20,
          percentIncrease: 126,
          icon: <ShoppingCart className="h-5 w-5" />,
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        };
        
        setCurrentAnomalies([newAnomaly, ...currentAnomalies]);
        toast.info("New spending anomaly detected!");
      }
      
      setIsRefreshing(false);
      setShowSpinner(false);
      toast.success("AI insights refreshed with latest data");
    }, 1500);
  }, [currentAnomalies]);

  const filteredInsights = insightCategory === "all" 
    ? insights.filter(insight => !dismissedInsights.includes(insight.id))
    : insights.filter(insight => {
        if (dismissedInsights.includes(insight.id)) return false;
        if (insightCategory === "high") return insight.impact === "high";
        if (insightCategory === "actionable") return insight.actionable;
        return true;
      });

  const handleDismissInsight = useCallback((id: string) => {
    setDismissedInsights(prev => [...prev, id]);
    toast.info("Insight dismissed");
  }, []);

  const handleCategorySelection = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  const handleViewDetails = useCallback((insight: typeof insights[0]) => {
    toast.info(`Viewing details for insight: ${insight.title}`);
    // In a real app, this would open a detailed view or modal
  }, []);

  const handleInvestigateAnomaly = useCallback((anomaly: typeof anomalies[0]) => {
    toast.info(`Investigating ${anomaly.category} anomaly from ${anomaly.date}`);
    // In a real app, this would open a detailed investigation view
  }, []);

  // Filter chart data based on selected categories
  const filteredCategoryData = selectedCategories.length > 0
    ? currentCategoryData.filter(cat => selectedCategories.includes(cat.name))
    : currentCategoryData;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">AI-Powered Spending Insights</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                <Brain className="h-3 w-3 mr-1" />
                AI
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Advanced analysis of your spending patterns with AI-powered insights
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
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
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

        {showSpinner && (
          <div className="flex justify-center my-8">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Updating insights...</p>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${showSpinner ? 'opacity-50' : ''}`}>
          <Card className="col-span-1 md:col-span-2 border-primary/10 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Monthly Spending Trend & Prediction</CardTitle>
              <CardDescription>
                AI-powered analysis of your monthly spending with predictions for future months
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={currentData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[#0ea5e9] mr-2"></div>
                  <span>Actual Spending</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[#8b5cf6] mr-2"></div>
                  <span>AI Predicted Spending</span>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Trend: Slightly Increasing</span>
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              AI predicts your November spending will be approximately {formatCurrency(currentData[currentData.length - 1].predicted)} based on historical patterns.
            </CardFooter>
          </Card>

          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Spending by Category</CardTitle>
              <CardDescription>
                Breakdown of your spending across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      onClick={(data) => handleCategorySelection(data.name)}
                      onMouseEnter={(data) => setHoveredCategory(data.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {filteredCategoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          opacity={hoveredCategory && hoveredCategory !== entry.name ? 0.5 : 1}
                          stroke={selectedCategories.includes(entry.name) ? "#000" : "none"}
                          strokeWidth={selectedCategories.includes(entry.name) ? 2 : 0}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentCategoryData.map((category) => (
                  <Badge 
                    key={category.name}
                    variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    style={{
                      backgroundColor: selectedCategories.includes(category.name) ? `${category.color}30` : 'transparent',
                      borderColor: category.color,
                      color: category.color
                    }}
                    onClick={() => handleCategorySelection(category.name)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              {selectedCategories.length > 0 
                ? `Selected categories make up ${
                    Math.round(
                      (filteredCategoryData.reduce((sum, cat) => sum + cat.value, 0) / 
                      currentCategoryData.reduce((sum, cat) => sum + cat.value, 0)) * 100
                    )
                  }% of your expenses`
                : "Groceries and dining make up 46% of your monthly expenses."}
            </CardFooter>
          </Card>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${showSpinner ? 'opacity-50' : ''}`}>
          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Day of Week Analysis</CardTitle>
              <CardDescription>
                How your spending varies by day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weekdaySpendingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']} />
                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Highest spending day:</span>
                  <span className="font-medium">Saturday ({formatCurrency(230)})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lowest spending day:</span>
                  <span className="font-medium">Tuesday ({formatCurrency(95)})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-all md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Spending Anomalies
                  </CardTitle>
                  <CardDescription>
                    Unusual spending patterns detected by AI
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
                  {currentAnomalies.length} Detected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {currentAnomalies.map((anomaly) => (
                  <div key={anomaly.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                    <div className={`p-2 rounded-full ${anomaly.color}`}>
                      {anomaly.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium">{anomaly.category} Spending Anomaly</h4>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                          +{anomaly.percentIncrease}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        You spent {formatCurrency(anomaly.amount)} on {anomaly.date}, which is {formatCurrency(anomaly.amount - anomaly.typical)} more than your typical spending.
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span>Date: {anomaly.date}</span>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleInvestigateAnomaly(anomaly)}>
                          Investigate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={`border-primary/10 shadow-md hover:shadow-lg transition-all ${showSpinner ? 'opacity-50' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI-Generated Insights & Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable insights based on your spending patterns
                </CardDescription>
              </div>
              <Select
                value={insightCategory}
                onValueChange={setInsightCategory}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter Insights" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Insights</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                  <SelectItem value="actionable">Actionable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredInsights.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No insights available</h3>
                <p className="text-muted-foreground max-w-md">
                  You've dismissed all insights in this category. Refresh the page or change the filter to see more insights.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setDismissedInsights([])}
                >
                  Reset Dismissed Insights
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Badge variant="outline" className={`${
                        insight.impact === "high" 
                          ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" 
                          : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                      }`}>
                        {insight.impact === "high" ? "High Impact" : "Medium Impact"}
                      </Badge>
                      {insight.actionable && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          Actionable
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-base font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    {insight.actionable && (
                      <div className="bg-muted/30 p-3 rounded-md text-sm">
                        <strong className="text-primary">Recommendation:</strong> {insight.action}
                      </div>
                    )}
                    <div className="flex justify-end mt-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => handleDismissInsight(insight.id)}
                      >
                        Dismiss
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs ml-2"
                        onClick={() => handleViewDetails(insight)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="categories">Category Analysis</TabsTrigger>
            <TabsTrigger value="merchants">Top Merchants</TabsTrigger>
            <TabsTrigger value="comparison">Peer Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCategoryData.slice(0, 4).map((category) => (
                <Card key={category.name} className="border-primary/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">{category.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        style={{backgroundColor: `${category.color}20`, color: category.color}}
                      >
                        {formatCurrency(category.value)}/mo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly average:</span>
                        <span className="font-medium">{formatCurrency(category.value)}</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">% of total spending:</span>
                        <span className="font-medium">{category.percentage}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">vs. last month:</span>
                        <div className={`flex items-center ${
                          Math.random() > 0.5 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {Math.random() > 0.5 ? (
                            <>
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                              <span>-{Math.floor(Math.random() * 15) + 5}%</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              <span>+{Math.floor(Math.random() * 15) + 5}%</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full">View All Categories</Button>
          </TabsContent>
          
          <TabsContent value="merchants" className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Top 5 Merchants by Spending</CardTitle>
                <CardDescription>Where you spend the most money each month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Grocery Mart", icon: <ShoppingCart />, amount: 310, percentage: 17 },
                    { name: "Amazon", icon: <ShoppingBag />, amount: 240, percentage: 13 },
                    { name: "City Transit", icon: <Car />, amount: 180, percentage: 10 },
                    { name: "Coffee House", icon: <Coffee />, amount: 120, percentage: 7 },
                    { name: "Utility Co.", icon: <Home />, amount: 95, percentage: 5 }
                  ].map((merchant, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {merchant.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{merchant.name}</span>
                          <span className="font-medium">{formatCurrency(merchant.amount)}</span>
                        </div>
                        <Progress value={merchant.percentage} className="h-1.5" />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>{merchant.percentage}% of monthly spend</span>
                          <span>{Math.floor(Math.random() * 12) + 2} transactions</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Peer Spending Comparison</CardTitle>
                <CardDescription>How your spending compares to others in your income bracket</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Groceries", "Dining", "Transport", "Entertainment"].map((category) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.random() > 0.5 ? "Above Average" : "Below Average"}
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-xs font-semibold inline-block text-primary">
                              Your spending
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-primary">
                              {formatCurrency(Math.floor(Math.random() * 300) + 100)}/mo
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
                          <div
                            style={{ width: `${Math.floor(Math.random() * 50) + 30}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                          ></div>
                        </div>
                        <div className="absolute left-[40%] top-[20px] h-4 border-l-2 border-dashed border-orange-500 -mt-1">
                          <div className="absolute -top-[1px] -left-[30px] bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded px-1 py-0.5 text-xs whitespace-nowrap">
                            Peer average
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SpendingInsights; 