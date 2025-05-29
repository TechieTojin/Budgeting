import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
  Download,
  FileText,
  BarChart,
  PieChart,
  Clock,
  Filter,
  FileDown,
  FileBadge,
  FileSpreadsheet,
  FileUp,
  ChevronDown,
  BarChart3,
  Share2,
  Mail,
  Printer,
  Table,
  Save,
  Check,
  CreditCard,
  CircleDollarSign,
  CalendarDays,
  LineChart,
  AreaChart,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DownloadReports = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("monthly");
  
  // Date selection states
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  // Report format states
  const [reportFormat, setReportFormat] = useState("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  
  // Selected report items
  const [selectedItems, setSelectedItems] = useState({
    income: true,
    expenses: true,
    categories: true,
    transactions: true,
    budgetComparison: true,
    trends: true,
    insights: false
  });
  
  // UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedReport, setLastGeneratedReport] = useState<string | null>(null);
  const [recentReports, setRecentReports] = useState([
    { name: "Monthly Report - April 2024", format: "pdf", date: "2024-04-01" },
    { name: "Quarterly Report - Q1 2024", format: "excel", date: "2024-03-31" },
    { name: "Annual Report - 2023", format: "pdf", date: "2023-12-31" }
  ]);
  
  const handleSelectItem = (item: keyof typeof selectedItems) => {
    setSelectedItems({
      ...selectedItems,
      [item]: !selectedItems[item]
    });
  };
  
  const handleGenerateReport = (type: string) => {
    setIsGenerating(true);
    
    // Simulate report generation with a delay
    setTimeout(() => {
      setIsGenerating(false);
      
      const reportName = `${type} Report - ${format(new Date(), 'MMMM yyyy')}`;
      setLastGeneratedReport(reportName);
      
      // Add to recent reports
      setRecentReports(prev => [
        { 
          name: reportName, 
          format: reportFormat, 
          date: format(new Date(), 'yyyy-MM-dd') 
        },
        ...prev.slice(0, 4) // Keep only the 5 most recent reports
      ]);
      
      toast.success(`${type} report generated and downloading...`, {
        description: `Your ${reportFormat.toUpperCase()} report is ready.`
      });
    }, 1500);
  };
  
  const handleShareReport = () => {
    toast.success("Share report dialog opened");
  };
  
  const handlePrintReport = () => {
    toast.success("Preparing report for printing");
  };
  
  const handleSaveTemplate = () => {
    toast.success("Report template saved for future use");
  };
  
  // Get available years for reporting
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({length: 5}, (_, i) => (currentYear - i).toString());
  
  // Get current month name for default selection
  const currentMonth = format(new Date(), 'MMMM yyyy');
  
  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, 'MMMM dd, yyyy');
  };
  
  // Get file icon based on format
  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'csv':
        return <Table className="h-4 w-4" />;
      default:
        return <FileDown className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('download_reports')}</h1>
          <p className="text-muted-foreground">
              Generate, download, and share comprehensive financial reports
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Recent Reports
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                {recentReports.length > 0 ? (
                  recentReports.map((report, index) => (
                    <DropdownMenuItem key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getFormatIcon(report.format)}
                        <span className="ml-2">{report.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.format.toUpperCase()}
                      </Badge>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No recent reports
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileUp className="mr-2 h-4 w-4" />
                  View All Reports
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button>
              <FileDown className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full sm:w-[500px] grid-cols-3">
            <TabsTrigger 
              value="monthly" 
              className="flex items-center gap-2"
              data-state={activeTab === "monthly" ? "active" : "inactive"}
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t('monthly_reports')}</span>
              <span className="sm:hidden">Monthly</span>
            </TabsTrigger>
            <TabsTrigger 
              value="yearly" 
              className="flex items-center gap-2"
              data-state={activeTab === "yearly" ? "active" : "inactive"}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('yearly_reports')}</span>
              <span className="sm:hidden">Yearly</span>
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              className="flex items-center gap-2"
              data-state={activeTab === "custom" ? "active" : "inactive"}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">{t('custom_reports')}</span>
              <span className="sm:hidden">Custom</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      {t('monthly_financial_report')}
                    </CardTitle>
                <CardDescription>
                  {t('download_detailed_monthly_report')}
                </CardDescription>
                  </div>
                  
                  {lastGeneratedReport && (
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 h-8">
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      Last: {lastGeneratedReport}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('select_month')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedMonth ? format(selectedMonth, "MMMM yyyy") : t('select_month')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedMonth}
                          onSelect={(date) => date && setSelectedMonth(date)}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={2020}
                          toYear={currentYear}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('report_format')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={reportFormat === "pdf" ? "default" : "outline"}
                        className="w-full justify-start pl-3"
                        onClick={() => setReportFormat("pdf")}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        variant={reportFormat === "excel" ? "default" : "outline"}
                        className="w-full justify-start pl-3"
                        onClick={() => setReportFormat("excel")}
                      >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Excel
                      </Button>
                      <Button 
                        variant={reportFormat === "csv" ? "default" : "outline"}
                        className="w-full justify-start pl-3"
                        onClick={() => setReportFormat("csv")}
                      >
                        <Table className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                  <Label>{t('report_contents')}</Label>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Select All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        id="income" 
                        checked={selectedItems.income}
                        onCheckedChange={() => handleSelectItem('income')}
                      />
                      <div className="flex-1 space-y-0.5">
                        <Label htmlFor="income" className="font-medium cursor-pointer">
                        {t('income_summary')}
                      </Label>
                        <p className="text-xs text-muted-foreground">
                          Breakdown of all income sources
                        </p>
                      </div>
                      <CircleDollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        id="expenses" 
                        checked={selectedItems.expenses}
                        onCheckedChange={() => handleSelectItem('expenses')}
                      />
                      <div className="flex-1 space-y-0.5">
                        <Label htmlFor="expenses" className="font-medium cursor-pointer">
                        {t('expense_summary')}
                      </Label>
                        <p className="text-xs text-muted-foreground">
                          Breakdown of all expenses
                        </p>
                      </div>
                      <CreditCard className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        id="categories" 
                        checked={selectedItems.categories}
                        onCheckedChange={() => handleSelectItem('categories')}
                      />
                      <div className="flex-1 space-y-0.5">
                        <Label htmlFor="categories" className="font-medium cursor-pointer">
                        {t('category_breakdown')}
                      </Label>
                        <p className="text-xs text-muted-foreground">
                          Spending by category
                        </p>
                      </div>
                      <PieChart className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        id="transactions" 
                        checked={selectedItems.transactions}
                        onCheckedChange={() => handleSelectItem('transactions')}
                      />
                      <div className="flex-1 space-y-0.5">
                        <Label htmlFor="transactions" className="font-medium cursor-pointer">
                        {t('transaction_list')}
                      </Label>
                        <p className="text-xs text-muted-foreground">
                          All transactions from the period
                        </p>
                      </div>
                      <Table className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        id="budgetComparison" 
                        checked={selectedItems.budgetComparison}
                        onCheckedChange={() => handleSelectItem('budgetComparison')}
                      />
                      <div className="flex-1 space-y-0.5">
                        <Label htmlFor="budgetComparison" className="font-medium cursor-pointer">
                        {t('budget_comparison')}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Actual vs. budgeted amounts
                        </p>
                      </div>
                      <BarChart className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        id="trends" 
                        checked={selectedItems.trends}
                        onCheckedChange={() => handleSelectItem('trends')}
                      />
                      <div className="flex-1 space-y-0.5">
                        <Label htmlFor="trends" className="font-medium cursor-pointer">
                          Monthly Trends
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Compare with previous months
                        </p>
                      </div>
                      <LineChart className="h-5 w-5 text-indigo-500" />
                    </div>
                  </div>
                </div>
                
                {reportFormat === "pdf" && (
                  <div className="rounded-md border p-4 bg-muted/10">
                    <p className="text-sm font-medium mb-3">Report Options</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PieChart className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="include-charts" className="font-normal cursor-pointer">
                            {t('include_charts_and_graphs')}
                          </Label>
                        </div>
                        <Switch 
                          id="include-charts"
                          checked={includeCharts}
                          onCheckedChange={setIncludeCharts}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Table className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="include-tables" className="font-normal cursor-pointer">
                            Include detailed tables
                          </Label>
                        </div>
                        <Switch 
                          id="include-tables"
                          checked={includeTables}
                          onCheckedChange={setIncludeTables}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
                  <Button 
                    variant="outline"
                    onClick={handleSaveTemplate}
                    className="sm:w-[180px]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Template
                  </Button>
                  
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleShareReport}>
                          <Mail className="mr-2 h-4 w-4" />
                          Email Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handlePrintReport}>
                          <Printer className="mr-2 h-4 w-4" />
                          Print Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                
                <Button 
                      onClick={() => handleGenerateReport('Monthly')}
                      disabled={isGenerating}
                      className="min-w-[140px]"
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileDown className="mr-2 h-4 w-4" />
                          {t('generate')}
                        </>
                      )}
                </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="yearly" className="space-y-4">
            {/* Similar improved UI for yearly reports */}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            {/* Similar improved UI for custom reports */}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DownloadReports;
