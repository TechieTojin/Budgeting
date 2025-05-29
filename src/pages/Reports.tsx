import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { SpendingOverviewChart } from "@/components/dashboard/SpendingOverviewChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Calendar, 
  ChevronDown, 
  FileDown, 
  FileSpreadsheet, 
  FileText, 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  ArrowUp, 
  ArrowDown, 
  CreditCard, 
  Landmark, 
  ShoppingCart, 
  Utensils, 
  Home, 
  Car, 
  Activity,
  Share2,
  Printer,
  Mail,
  Info
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, subMonths } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Line, Bar, Pie } from 'react-chartjs-2';
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
  Filler
} from 'chart.js';

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

// Add formatCurrency function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

const Reports = () => {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState("pdf");
  const [dateRange, setDateRange] = useState<"1m" | "3m" | "6m" | "1y" | "all">("3m");
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

  // Enhanced sample data for the spending overview chart
  const monthlyData = [
    { name: "Jan", income: 3800, expenses: 2100, budget: 2500 },
    { name: "Feb", income: 3900, expenses: 2400, budget: 2500 },
    { name: "Mar", income: 4000, expenses: 2200, budget: 2500 },
    { name: "Apr", income: 3950, expenses: 2300, budget: 2500 },
    { name: "May", income: 4200, expenses: 2400, budget: 2500 },
    { name: "Jun", income: 4100, expenses: 2150, budget: 2500 },
  ];

  // Enhanced sample data for the category distribution chart
  const categoryData = [
    { name: "Housing", value: 1200, color: "#0C6E81", icon: <Home className="h-4 w-4" /> },
    { name: "Food", value: 500, color: "#2A9D8F", icon: <Utensils className="h-4 w-4" /> },
    { name: "Transport", value: 300, color: "#E9C46A", icon: <Car className="h-4 w-4" /> },
    { name: "Entertainment", value: 200, color: "#F4A261", icon: <Activity className="h-4 w-4" /> },
    { name: "Shopping", value: 250, color: "#E76F51", icon: <ShoppingCart className="h-4 w-4" /> },
  ];

  // Sample data for income sources
  const incomeSourcesData = [
    { name: "Salary", value: 3500, percentage: 70, color: "#0C6E81" },
    { name: "Freelance", value: 800, percentage: 16, color: "#2A9D8F" },
    { name: "Investments", value: 450, percentage: 9, color: "#E9C46A" },
    { name: "Other", value: 250, percentage: 5, color: "#E76F51" },
  ];

  // Sample data for expense trends
  const expenseTrendsData = [
    { month: "Jan", value: 2100, previousYear: 1950 },
    { month: "Feb", value: 2400, previousYear: 2100 },
    { month: "Mar", value: 2200, previousYear: 2050 },
    { month: "Apr", value: 2300, previousYear: 2200 },
    { month: "May", value: 2400, previousYear: 2250 },
    { month: "Jun", value: 2150, previousYear: 2000 },
  ];

  // Calculate totals and statistics
  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const totalBudget = monthlyData.reduce((sum, month) => sum + month.budget, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = (netSavings / totalIncome) * 100;
  const budgetVariance = totalBudget - totalExpenses;
  const budgetVariancePercentage = (budgetVariance / totalBudget) * 100;

  // Calculate month-over-month changes
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const incomeChange = ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100;
  const expensesChange = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;

  // Enhanced chart options with modern styling
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          padding: 10
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          padding: 10
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Enhanced income data for charts with gradients
  const incomeChartData = {
    labels: monthlyData.map(month => month.name),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(month => month.income),
        borderColor: '#0C6E81',
        backgroundColor: 'rgba(12, 110, 129, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  // Enhanced expenses data for charts with gradients
  const expensesChartData = {
    labels: monthlyData.map(month => month.name),
    datasets: [
      {
        label: 'Expenses',
        data: monthlyData.map(month => month.expenses),
        borderColor: '#E76F51',
        backgroundColor: 'rgba(231, 111, 81, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Budget',
        data: monthlyData.map(month => month.budget),
        borderColor: '#2A9D8F',
        backgroundColor: 'rgba(42, 157, 143, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  // Enhanced trends data for charts with gradients
  const trendsChartData = {
    labels: monthlyData.map(month => month.name),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(month => month.income),
        borderColor: '#0C6E81',
        backgroundColor: 'rgba(12, 110, 129, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Expenses',
        data: monthlyData.map(month => month.expenses),
        borderColor: '#E76F51',
        backgroundColor: 'rgba(231, 111, 81, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Savings',
        data: monthlyData.map(month => month.income - month.expenses),
        borderColor: '#2A9D8F',
        backgroundColor: 'rgba(42, 157, 143, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  const handleExportPDF = async () => {
    try {
      // Show loading toast
      toast.loading("Generating PDF report...");

      // Get the report content element
      const reportContent = document.getElementById('report-content');
      if (!reportContent) {
        toast.error("Could not find report content");
        return;
      }

      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add title
      pdf.setFontSize(20);
      pdf.text('Financial Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add date
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, pageWidth / 2, 30, { align: 'center' });

      // Convert the report content to canvas
      const canvas = await html2canvas(reportContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions to fit the content on the page
      const imgWidth = pageWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the content to the PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 40, imgWidth, imgHeight);

      // Add page numbers
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // Save the PDF
      pdf.save(`financial-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF report");
    }
  };

  // Update the handleDownloadReport function
  const handleDownloadReport = () => {
    if (reportType === 'pdf') {
      handleExportPDF();
    } else {
      toast.success(`${reportType.toUpperCase()} report is being generated and will download shortly.`);
    }
  };

  const handleShareReport = () => {
    toast.success("Report sharing options opened");
  };

  const handlePrintReport = () => {
    toast.success("Preparing report for printing");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <motion.h1 
              className="text-3xl font-bold tracking-tight"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {t('financial_reports')}
            </motion.h1>
            <p className="text-muted-foreground">
              Analyze your financial data with detailed reports and visualizations
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Calendar className="h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownloadReport()}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadReport()}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShareReport}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrintReport}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div id="report-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/50">
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
                    <div className="flex items-center mt-1 text-xs">
                      {incomeChange >= 0 ? (
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          {Math.abs(incomeChange).toFixed(1)}% from last month
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 dark:text-red-400">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          {Math.abs(incomeChange).toFixed(1)}% from last month
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
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
                    <div className="flex items-center mt-1 text-xs">
                      {expensesChange <= 0 ? (
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          {Math.abs(expensesChange).toFixed(1)}% from last month
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 dark:text-red-400">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          {Math.abs(expensesChange).toFixed(1)}% from last month
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50">
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Savings</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(netSavings)}</p>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        {savingsRate.toFixed(1)}% of income
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <Landmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900/50">
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Budget Variance</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {budgetVariance >= 0 ? "+" : "-"}{formatCurrency(Math.abs(budgetVariance))}
                    </p>
                    <div className="flex items-center mt-1 text-xs">
                      <span className={budgetVariance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                        {budgetVariance >= 0 ? "Under budget" : "Over budget"} by {Math.abs(budgetVariancePercentage).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full sm:w-[600px] grid-cols-4 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Income</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                <span className="hidden sm:inline">Expenses</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Monthly Overview</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Income vs. expenses over the last 6 months</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardHeader>
                  <CardContent>
                    <SpendingOverviewChart data={monthlyData} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Spending by Category</CardTitle>
                    <Badge variant="outline">{date ? format(date, "MMMM yyyy") : "Current Month"}</Badge>
                  </CardHeader>
                  <CardContent>
                    <CategoryDistributionChart data={categoryData} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Spending Categories</CardTitle>
                  <CardDescription>
                    Breakdown of your highest expense categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                              {category.icon}
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {((category.value / totalExpenses) * 100).toFixed(1)}%
                            </span>
                            <span className="font-medium">${category.value}</span>
                          </div>
                        </div>
                        <Progress value={(category.value / totalExpenses) * 100} className="h-2" style={{ backgroundColor: `${category.color}20` }}>
                          <div className="h-full" style={{ backgroundColor: category.color }}></div>
                        </Progress>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="income" className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Income Sources</CardTitle>
                  <CardDescription>
                    Breakdown of your income by source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[300px]">
                      <Pie
                        data={{
                          labels: incomeSourcesData.map(source => source.name),
                          datasets: [{
                            data: incomeSourcesData.map(source => source.value),
                            backgroundColor: incomeSourcesData.map(source => source.color),
                            borderWidth: 1,
                            borderColor: '#fff'
                          }]
                        }}
                        options={pieChartOptions}
                      />
                    </div>
                    <div className="space-y-4">
                      {incomeSourcesData.map((source) => (
                        <div key={source.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{source.name}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">
                                {source.percentage}%
                              </span>
                              <span className="font-medium">${source.value}</span>
                            </div>
                          </div>
                          <Progress 
                            value={source.percentage} 
                            className="h-2" 
                            style={{ 
                              backgroundColor: `${source.color}20`,
                              '--progress-foreground': source.color
                            } as any}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Income Trends</CardTitle>
                  <CardDescription>
                    Monthly income over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line data={incomeChartData} options={lineChartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                  <CardDescription>
                    Detailed analysis of your expenses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[300px]">
                      <Pie
                        data={{
                          labels: categoryData.map(category => category.name),
                          datasets: [{
                            data: categoryData.map(category => category.value),
                            backgroundColor: categoryData.map(category => category.color),
                            borderWidth: 1,
                            borderColor: '#fff'
                          }]
                        }}
                        options={pieChartOptions}
                      />
                    </div>
                    <div className="space-y-4">
                      {categoryData.map((category) => (
                        <div key={category.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                              {category.icon}
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className="font-medium">${category.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Expense Trends</CardTitle>
                  <CardDescription>
                    Monthly expenses compared to budget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line data={expensesChartData} options={lineChartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Financial Trends</CardTitle>
                  <CardDescription>
                    Long-term analysis of your financial patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <Line data={trendsChartData} options={lineChartOptions} />
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg">Savings Rate</CardTitle>
                    <CardDescription>
                      Percentage of income saved over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="h-32 w-32 rounded-full border-8 border-blue-200 dark:border-blue-900/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full" style={{
                          background: `conic-gradient(#0C6E81 ${savingsRate * 3.6}deg, transparent 0deg)`
                        }} />
                        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 relative z-10">
                          {savingsRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Average savings rate</p>
                        <p className="text-sm font-medium">
                          {savingsRate >= 20 ? "Excellent" : savingsRate >= 10 ? "Good" : "Needs improvement"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg">Budget Performance</CardTitle>
                    <CardDescription>
                      How well you're staying within your budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="h-32 w-32 rounded-full border-8 border-purple-200 dark:border-purple-900/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full" style={{
                          background: `conic-gradient(${budgetVariancePercentage >= 0 ? '#2A9D8F' : '#E76F51'} ${Math.abs(budgetVariancePercentage) * 3.6}deg, transparent 0deg)`
                        }} />
                        <span className={`text-3xl font-bold ${budgetVariancePercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"} relative z-10`}>
                          {Math.abs(budgetVariancePercentage).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          {budgetVariancePercentage >= 0 ? "Under budget" : "Over budget"}
                        </p>
                        <p className="text-sm font-medium">
                          {budgetVariancePercentage >= 5 ? "Great job!" : budgetVariancePercentage >= 0 ? "On track" : "Action needed"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
