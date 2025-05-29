import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Loader2, 
  Shield, 
  FileText, 
  Calendar, 
  DollarSign, 
  Store, 
  Filter, 
  Download, 
  Upload, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  RefreshCw, 
  Key, 
  Lock, 
  Database, 
  Cpu, 
  Brain, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  IndianRupee, 
  Activity, 
  Wallet, 
  CreditCard, 
  PiggyBank, 
  Target, 
  AlertTriangle, 
  Info, 
  BrainCircuit,
  History,
  CircleDollarSign
} from 'lucide-react';
import { Line, Bar, Pie, Doughnut as DoughnutChart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  Filler
} from 'chart.js';
import { Sidebar } from '@/components/layouts/Sidebar';
import { TopBar } from '@/components/layouts/TopBar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from "framer-motion";
import { ConfidenceIndicator } from "@/components/transactions/ConfidenceIndicator";
import { TransactionData, batchCategorize, validateCategories } from "@/utils/advancedCategorization";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock OAuth configuration
const OAUTH_CONFIG = {
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/oauth/callback',
  scope: 'https://www.googleapis.com/auth/gmail.readonly',
};

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const EmailExtraction = () => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'processing' | 'complete'>('secure');
  const [selectedEmailSource, setSelectedEmailSource] = useState('gmail');
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(2024, 2, 1), new Date()]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoCategorization, setAutoCategorization] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [extractionHistory, setExtractionHistory] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [aiFeatures, setAiFeatures] = useState({
    smartCategorization: true,
    anomalyDetection: true,
    trendAnalysis: true,
    predictiveInsights: true,
  });

  // Email sources with OAuth support
  const emailSources = [
    { value: 'gmail', label: 'Gmail', icon: '📧', oauth: true },
    { value: 'outlook', label: 'Outlook', icon: '📨', oauth: true },
    { value: 'yahoo', label: 'Yahoo Mail', icon: '📩', oauth: true },
    { value: 'icloud', label: 'iCloud Mail', icon: '📬', oauth: true },
  ];

  // Categories for filtering
  const categories = [
    'Groceries',
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Health & Fitness',
    'Income',
    'Bills & Utilities',
    'Travel',
    'Education',
  ];

  // Enhanced extraction steps with AI features
  const extractionSteps = [
    {      
      name: 'Connecting to email server',     
      duration: 5000,     
      icon: <Shield className="h-5 w-5 text-blue-500" />,     
      description: 'Establishing secure connection to your email provider',     
      subSteps: ['Verifying credentials', 'Establishing secure tunnel', 'Testing connection'],     
      aiFeature: 'Security Analysis'   
    },   
    {      
      name: 'Scanning emails',     
      duration: 10000,     
      icon: <Mail className="h-5 w-5 text-purple-500" />,     
      description: 'Analyzing your email inbox for transaction-related messages',     
      subSteps: ['Indexing emails', 'Identifying transaction patterns', 'Filtering relevant messages'],     
      aiFeature: 'Pattern Recognition'   
    },   
    {      
      name: 'Extracting transaction data',     
      duration: 15000,     
      icon: <FileText className="h-5 w-5 text-green-500" />,     
      description: 'Identifying and extracting transaction details from emails',     
      subSteps: ['Parsing email content', 'Extracting amounts', 'Identifying vendors'],     
      aiFeature: 'Natural Language Processing'   
    },   
    {      
      name: 'Processing amounts and dates',     
      duration: 10000,     
      icon: <Calendar className="h-5 w-5 text-orange-500" />,     
      description: 'Converting and standardizing transaction dates and amounts',     
      subSteps: ['Normalizing dates', 'Converting currencies', 'Validating amounts'],     
      aiFeature: 'Data Standardization'   
    },   
    {      
      name: 'Categorizing transactions',     
      duration: 15000,     
      icon: <Store className="h-5 w-5 text-red-500" />,     
      description: 'Automatically categorizing transactions based on vendors and patterns',     
      subSteps: ['Applying ML models', 'Matching patterns', 'Assigning categories'],     
      aiFeature: 'Machine Learning Classification'   
    },   
    {      
      name: 'Generating insights',     
      duration: 15000,     
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,     
      description: 'Creating comprehensive financial insights from extracted data',     
      subSteps: ['Calculating trends', 'Identifying patterns', 'Generating reports'],     
      aiFeature: 'Predictive Analytics'   
    },  ];

  // Initialize chart data with empty values
  const initialChartData = {
    doughnut: {
      labels: ['High (>90%)', 'Medium (70-90%)', 'Low (<70%)'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(40, 167, 69, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(220, 53, 69, 0.7)',
        ],
        borderWidth: 2,
      }],
    } as ChartData<"doughnut">,
    bar: {
      labels: [],
      datasets: [{
        label: 'Amount',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderRadius: 4,
      }],
    } as ChartData<"bar">,
    line: {
      labels: [],
      datasets: [{
        label: 'Spending',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      }],
    } as ChartData<"line">,
    pie: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderWidth: 2,
      }],
    } as ChartData<"pie">,
  };

  // Chart data with improved styling and proper initialization
  const lineChartData: ChartData<"line"> = extractedData ? {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Spending',
      data: [1200, 1900, 1500, 2100, 1800, 2400],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
      fill: true,
    }],
  } : initialChartData.line;

  const barChartData: ChartData<"bar"> = extractedData ? {
    labels: categories,
    datasets: [{
      label: 'Amount',
      data: categories.map(category => 
        extractedData.transactions
          .filter((t: any) => t.category === category)
          .reduce((sum: number, t: any) => sum + t.amount, 0)
      ),
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderRadius: 4,
    }],
  } : initialChartData.bar;

  const categoryDistributionData: ChartData<"pie"> = extractedData ? {
    labels: categories,
    datasets: [{
      data: categories.map(category => 
        extractedData.transactions
          .filter((t: any) => t.category === category)
          .reduce((sum: number, t: any) => sum + t.amount, 0)
      ),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(40, 159, 64, 0.7)',
        'rgba(210, 199, 199, 0.7)',
      ],
      borderWidth: 2,
    }],
  } : initialChartData.pie;

  const confidenceDistributionData: ChartData<"doughnut"> = extractedData ? {
    labels: ['High (>90%)', 'Medium (70-90%)', 'Low (<70%)'],
    datasets: [{
      data: [
        extractedData.transactions.filter((t: any) => t.confidence > 90).length || 0,
        extractedData.transactions.filter((t: any) => t.confidence >= 70 && t.confidence <= 90).length || 0,
        extractedData.transactions.filter((t: any) => t.confidence < 70).length || 0,
      ],
      backgroundColor: [
        'rgba(40, 167, 69, 0.7)',
        'rgba(255, 193, 7, 0.7)',
        'rgba(220, 53, 69, 0.7)',
      ],
      borderWidth: 2,
    }],
  } : initialChartData.doughnut;

  // Enhanced chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          }
        }
      }
    }
  };

  // Handle date range changes
  const handleDateRangeChange = (index: number, value: string) => {
    const newDate = new Date(value);
    const newDateRange = [...dateRange];
    newDateRange[index] = newDate;
    setDateRange(newDateRange as [Date, Date]);
  };

  const handleAuth = async () => {
    setShowAuthDialog(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setIsAuthenticated(true);
      setShowAuthDialog(false);
      toast({
        title: "Authentication Successful",
        description: "Successfully connected to your email account.",
      });
    }, 2000);
  };

  const startExtraction = async () => {
    if (!isAuthenticated) {
      handleAuth();
      return;
    }
    try {
      setIsExtracting(true);
      setProgress(0);
      setExtractedData(null);
      setSecurityStatus('processing');
      const totalDuration = extractionSteps.reduce((sum, step) => sum + step.duration, 0);
      let currentProgress = 0;
      for (let i = 0; i < extractionSteps.length; i++) {
        const step = extractionSteps[i];
        setCurrentStep(step.name);               
        // Simulate step progress with intermediate updates
        const stepDuration = step.duration;
        const updateInterval = 200;
        const updates = stepDuration / updateInterval;
               
        for (let j = 0; j < updates; j++) {
          await new Promise(resolve => setTimeout(resolve, updateInterval));
          const stepProgress = ((j + 1) / updates) * (100 / extractionSteps.length);
          currentProgress = ((i * 100) / extractionSteps.length) + stepProgress;
          setProgress(currentProgress);
          // Simulate real-time updates
          if (j % 5 === 0) {
            toast({
              title: `${step.name} in progress`,
              description: `Processing ${Math.round((j / updates) * 100)}% complete`,
            });
          }
        }
      }
      // Simulate extracted data with more realistic transactions
      const newData = {
        transactions: [
          { date: '2024-03-01', amount: 4599, vendor: 'BigBasket', category: 'Groceries', type: 'expense', confidence: 95 },
          { date: '2024-03-02', amount: 299, vendor: 'Starbucks', category: 'Food & Dining', type: 'expense', confidence: 98 },
          { date: '2024-03-03', amount: 899, vendor: 'Shell Gas Station', category: 'Transportation', type: 'expense', confidence: 97 },
          { date: '2024-03-04', amount: 12999, vendor: 'Amazon', category: 'Shopping', type: 'expense', confidence: 99 },
          { date: '2024-03-05', amount: 599, vendor: 'Swiggy', category: 'Food & Dining', type: 'expense', confidence: 96 },
          { date: '2024-03-06', amount: 250000, vendor: 'Employer Inc.', category: 'Income', type: 'income', confidence: 100 },
          { date: '2024-03-07', amount: 399, vendor: 'Netflix', category: 'Entertainment', type: 'expense', confidence: 98 },
          { date: '2024-03-08', amount: 799, vendor: 'Cult.fit', category: 'Health & Fitness', type: 'expense', confidence: 97 },
          { date: '2024-03-09', amount: 1200, vendor: 'Tata Power', category: 'Bills & Utilities', type: 'expense', confidence: 99 },
          { date: '2024-03-10', amount: 29999, vendor: 'MakeMyTrip', category: 'Travel', type: 'expense', confidence: 98 },
        ],
        summary: {
          totalTransactions: 10,
          totalIncome: 250000,
          totalExpenses: 50992,
          averageTransactionAmount: 30099.2,
          mostFrequentCategory: 'Food & Dining',
          highestSpendingCategory: 'Travel',
          confidenceScore: 97.7,
          aiInsights: {
            spendingTrends: 'Increasing trend in dining expenses',
            unusualTransactions: ['Large payment to MakeMyTrip'],
            categoryDistribution: 'Most spending in Food & Dining category',
            predictiveAnalysis: 'Expected increase in utility bills next month',
          }
        }
      };
      setExtractedData(newData);
      setExtractionHistory(prev => [newData, ...prev]);
      setSecurityStatus('complete');
      setCurrentStep('Extraction complete');
      toast({
        title: "Extraction Complete",
        description: "Successfully extracted and analyzed your email transactions.",
      });
    } catch (error) {
      console.error('Extraction error:', error);
      toast({
        title: "Extraction Error",
        description: "An error occurred during extraction. Please try again.",
        variant: "destructive",
      });
      setSecurityStatus('secure');
    } finally {
      setIsExtracting(false);
    }
  };

  const exportData = async () => {
    setIsExporting(true);
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <ScrollArea className="flex-1 p-6">
          <motion.div
            className="space-y-6"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={staggerContainer}
          >
            <motion.div
              className="flex items-center justify-between"
              variants={fadeIn}
            >
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {t('email_extraction')}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isExtracting ? t('processing_emails') : t('ready_to_extract')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={securityStatus === 'secure' ? 'default' : securityStatus === 'processing' ? 'secondary' : 'default'}
                  className="px-4 py-1.5"
                >
                  {securityStatus === 'secure' && <Shield className="h-4 w-4 mr-2" />}
                  {securityStatus === 'processing' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {securityStatus === 'complete' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                  {securityStatus === 'secure' ? 'Secure Connection' :
                    securityStatus === 'processing' ? 'Processing' : 'Extraction Complete'}
                </Badge>
                <Button
                  onClick={startExtraction}
                  disabled={isExtracting}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      {isAuthenticated ? 'Start Extraction' : 'Connect Email'}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={fadeIn}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedEmailSource} onValueChange={setSelectedEmailSource}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select email source" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailSources.map(source => (
                        <SelectItem key={source.value} value={source.value}>
                          <span className="flex items-center gap-2">
                            {source.icon} {source.label}
                            {source.oauth && <Lock className="h-3 w-3" />}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Date Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={dateRange[0].toISOString().split('T')[0]}
                      onChange={(e) => handleDateRangeChange(0, e.target.value)}
                      className="hover:border-primary/50 transition-colors"
                    />
                    <span>to</span>
                    <Input
                      type="date"
                      value={dateRange[1].toISOString().split('T')[0]}
                      onChange={(e) => handleDateRangeChange(1, e.target.value)}
                      className="hover:border-primary/50 transition-colors"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="hover:border-primary/50 transition-colors"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-primary" />
                        {t('extraction_progress')}
                      </CardTitle>
                      <CardDescription>
                        {isExtracting ? t('processing_emails') : t('ready_to_extract')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {isExtracting ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 animate-pulse" />
                    ) : progress === 100 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{currentStep}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <AnimatePresence>
                    {isExtracting && (
                      <motion.div
                        className="mt-4 space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {extractionSteps.map((step, index) => (
                          <Collapsible key={step.name}>
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                {step.icon}
                                <div className="flex-1 text-left">
                                  <p className="text-sm font-medium">{step.name}</p>
                                  <p className="text-xs text-muted-foreground">{step.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {step.aiFeature && (
                                  <Badge variant="outline" className="text-xs">
                                    <Brain className="h-3 w-3 mr-1" />
                                    {step.aiFeature}
                                  </Badge>
                                )}
                                {currentStep === step.name ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <motion.div
                                className="pl-8 space-y-1 mt-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                {step.subSteps.map((subStep, subIndex) => (
                                  <div key={subIndex} className="text-sm text-muted-foreground">
                                    • {subStep}
                                  </div>
                                ))}
                              </motion.div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="mt-4 space-y-4 p-4 border rounded-lg bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>AI Features</Label>
                        <div className="space-y-2">
                          {Object.entries(aiFeatures).map(([key, value]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Switch
                                checked={value}
                                onCheckedChange={(checked) =>
                                  setAiFeatures(prev => ({ ...prev, [key]: checked }))
                                }
                              />
                              <span className="text-sm text-muted-foreground">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Confidence Threshold: {confidenceThreshold}%</Label>
                        <Slider
                          value={[confidenceThreshold]}
                          onValueChange={([value]) => setConfidenceThreshold(value)}
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                          <Badge
                            key={category}
                            variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                            className="cursor-pointer hover:bg-primary/10 transition-colors"
                            onClick={() => {
                              setSelectedCategories(prev =>
                                prev.includes(category)
                                  ? prev.filter(c => c !== category)
                                  : [...prev, category]
                              );
                            }}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {extractedData && (
              <motion.div
                variants={fadeIn}
                className="space-y-6"
              >
                <Separator className="my-6" />
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-primary" />
                            Total Balance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            ₹{(extractedData.summary.totalIncome - extractedData.summary.totalExpenses).toLocaleString('en-IN')}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {((extractedData.summary.totalIncome - extractedData.summary.totalExpenses) / extractedData.summary.totalIncome * 100).toFixed(1)}% of income
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            Total Income
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            ₹{extractedData.summary.totalIncome.toLocaleString('en-IN')}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {extractedData.transactions.filter((t: any) => t.type === 'income').length} transactions
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            Total Expenses
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            ₹{extractedData.summary.totalExpenses.toLocaleString('en-IN')}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {extractedData.transactions.filter((t: any) => t.type === 'expense').length} transactions
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" />
                            Average Transaction
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            ₹{extractedData.summary.averageTransactionAmount.toLocaleString('en-IN')}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Across {extractedData.summary.totalTransactions} transactions
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="h-[400px] hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-5 w-5 text-primary" />
                            Income vs Expenses Trend
                          </CardTitle>
                          <CardDescription>
                            Track your financial flow over time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Line data={lineChartData} options={chartOptions} />
                        </CardContent>
                      </Card>
                      <Card className="h-[400px] hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-primary" />
                            Category Distribution
                          </CardTitle>
                          <CardDescription>
                            Breakdown of your spending by category
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <Pie data={categoryDistributionData} options={chartOptions} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Key Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-muted/30">
                            <h4 className="font-medium mb-2">Most Active Category</h4>
                            <p className="text-2xl font-bold text-primary">
                              {extractedData.summary.mostFrequentCategory}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Most frequent transaction category
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30">
                            <h4 className="font-medium mb-2">Highest Spending</h4>
                            <p className="text-2xl font-bold text-primary">
                              {extractedData.summary.highestSpendingCategory}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Category with highest total spending
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30">
                            <h4 className="font-medium mb-2">AI Confidence</h4>
                            <p className="text-2xl font-bold text-primary">
                              {extractedData.summary.confidenceScore}%
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Overall categorization accuracy
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="transactions" className="space-y-4">
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>
                              Detailed view of all extracted transactions
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                              className="hover:bg-primary/10"
                            >
                              <Filter className="h-4 w-4 mr-2" />
                              Filters
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={exportData}
                              disabled={isExporting}
                              className="hover:bg-primary/10"
                            >
                              {isExporting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Exporting...
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-2" />
                                  Export
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {showAdvancedFilters && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-4 border rounded-lg bg-muted/30"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label>Date Range</Label>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Input
                                      type="date"
                                      value={dateRange[0].toISOString().split('T')[0]}
                                      onChange={(e) => handleDateRangeChange(0, e.target.value)}
                                    />
                                    <span>to</span>
                                    <Input
                                      type="date"
                                      value={dateRange[1].toISOString().split('T')[0]}
                                      onChange={(e) => handleDateRangeChange(1, e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Categories</Label>
                                  <Select
                                    value={selectedCategories.join(',')}
                                    onValueChange={(value) => setSelectedCategories(value.split(','))}
                                  >
                                    <SelectTrigger className="mt-2">
                                      <SelectValue placeholder="Select categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Transaction Type</Label>
                                  <Select
                                    value={searchQuery}
                                    onValueChange={setSearchQuery}
                                  >
                                    <SelectTrigger className="mt-2">
                                      <SelectValue placeholder="All transactions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Transactions</SelectItem>
                                      <SelectItem value="income">Income Only</SelectItem>
                                      <SelectItem value="expense">Expenses Only</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Confidence</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {extractedData.transactions.map((transaction: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell>{transaction.date}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      {transaction.type === 'income' ? (
                                        <IndianRupee className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <CreditCard className="h-4 w-4 text-red-500" />
                                      )}
                                      {transaction.vendor}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{transaction.category}</Badge>
                                  </TableCell>
                                  <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                                  </TableCell>
                                  <TableCell>
                                    <ConfidenceIndicator confidence={transaction.confidence} />
                                  </TableCell>
                                  <TableCell>
                                    <Button variant="ghost" size="sm">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Category Analysis
                          </CardTitle>
                          <CardDescription>
                            Detailed breakdown of spending by category
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[400px]">
                            <Bar data={barChartData} options={chartOptions} />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CircleDollarSign className="h-5 w-5 text-primary" />
                            Confidence Distribution
                          </CardTitle>
                          <CardDescription>
                            Distribution of AI confidence levels
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[400px]">
                            <DoughnutChart data={confidenceDistributionData} options={chartOptions} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Spending Trends
                        </CardTitle>
                        <CardDescription>
                          Monthly spending patterns and trends
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px]">
                          <Line data={lineChartData} options={chartOptions} />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="history" className="space-y-4">
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <History className="h-5 w-5 text-primary" />
                          Extraction History
                        </CardTitle>
                        <CardDescription>
                          Record of all email extraction sessions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {extractionHistory.map((session, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    Session {index + 1} - {new Date().toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {session.summary.totalTransactions} transactions extracted
                                  </p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-sm font-medium">Total Income</p>
                                    <p className="text-green-600">₹{session.summary.totalIncome.toLocaleString('en-IN')}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium">Total Expenses</p>
                                    <p className="text-red-600">₹{session.summary.totalExpenses.toLocaleString('en-IN')}</p>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="ai-insights" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            AI Predictions
                          </CardTitle>
                          <CardDescription>
                            AI-powered insights and predictions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-muted/30">
                              <h4 className="font-medium mb-2">Spending Trends</h4>
                              <p className="text-muted-foreground">
                                {extractedData.summary.aiInsights.spendingTrends}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <h4 className="font-medium mb-2">Unusual Transactions</h4>
                              <ul className="list-disc list-inside text-muted-foreground">
                                {extractedData.summary.aiInsights.unusualTransactions.map((transaction: string, index: number) => (
                                  <li key={index}>{transaction}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <h4 className="font-medium mb-2">Predictive Analysis</h4>
                              <p className="text-muted-foreground">
                                {extractedData.summary.aiInsights.predictiveAnalysis}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Smart Recommendations
                          </CardTitle>
                          <CardDescription>
                            AI-generated recommendations for better financial management
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-muted/30">
                              <h4 className="font-medium mb-2">Budget Optimization</h4>
                              <p className="text-muted-foreground">
                                Based on your spending patterns, consider allocating more budget to {extractedData.summary.highestSpendingCategory}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <h4 className="font-medium mb-2">Savings Opportunities</h4>
                              <p className="text-muted-foreground">
                                You could save up to 15% on your {extractedData.summary.mostFrequentCategory} expenses
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <h4 className="font-medium mb-2">Category Insights</h4>
                              <p className="text-muted-foreground">
                                {extractedData.summary.aiInsights.categoryDistribution}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </motion.div>
        </ScrollArea>
      </div>
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Email Account</DialogTitle>
            <DialogDescription>
              Connect your email account to enable automatic transaction extraction.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-full bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Secure Connection</p>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and secure
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-full bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Read-only Access</p>
                <p className="text-sm text-muted-foreground">
                  We only read your transaction emails
                </p>
              </div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={handleAuth}
              disabled={isAuthenticated}
            >
              {isAuthenticated ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Connected
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailExtraction; 