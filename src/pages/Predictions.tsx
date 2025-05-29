import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  LineChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ArrowUp,
  ArrowDown,
  Brain,
  Sparkles,
  Target,
  Wallet,
  PiggyBank,
  LineChart as LineChartIcon,
  Calendar,
  ChevronRight,
  Info,
  Loader2
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Predictions = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("3m");
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample prediction data
  const predictionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Actual",
        data: [3000, 3200, 3100, 3300, 3400, 3500],
        borderColor: "#0C6E81",
        backgroundColor: "rgba(12, 110, 129, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: "Predicted",
        data: [3500, 3600, 3700, 3800, 3900, 4000],
        borderColor: "#2A9D8F",
        backgroundColor: "rgba(42, 157, 143, 0.1)",
        fill: true,
        tension: 0.4,
        borderDash: [5, 5]
      }
    ]
  };

  // AI Insights
  const aiInsights = [
    {
      title: "Spending Pattern Detected",
      description: "Your grocery expenses are 15% higher than usual this month",
      type: "warning",
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      title: "Savings Opportunity",
      description: "You could save ₹200/month by optimizing your subscriptions",
      type: "success",
      icon: <PiggyBank className="h-5 w-5" />
    },
    {
      title: "Income Growth",
      description: "Your income is projected to increase by 8% next quarter",
      type: "info",
      icon: <TrendingUp className="h-5 w-5" />
    }
  ];

  // Financial Goals
  const financialGoals = [
    {
      title: "Emergency Fund",
      current: 5000,
      target: 10000,
      deadline: "Dec 2024",
      icon: <Wallet className="h-5 w-5" />
    },
    {
      title: "Vacation Fund",
      current: 2000,
      target: 5000,
      deadline: "Jun 2024",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: "Investment Portfolio",
      current: 15000,
      target: 25000,
      deadline: "Dec 2024",
      icon: <LineChartIcon className="h-5 w-5" />
    }
  ];

  // Chart options
  const chartOptions = {
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
        usePointStyle: true
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would call your backend API
      // For now, we'll just show a success message
      toast.success("New insights generated successfully!");
      
      // Refresh the page data
      // In a real app, this would update the state with new data
    } catch (error) {
      toast.error("Failed to generate new insights");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewDetailedAnalysis = () => {
    navigate("/ai-insights");
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
              Financial Predictions
            </motion.h1>
            <p className="text-muted-foreground">
              AI-powered insights and future financial projections
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleGenerateInsights}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              {isGenerating ? "Generating..." : "Generate New Insights"}
            </Button>
            <Button 
              className="gap-2"
              onClick={handleViewDetailedAnalysis}
            >
              <Sparkles className="h-4 w-4" />
              View Detailed Analysis
                  </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                AI Confidence Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-32 w-32 rounded-full border-8 border-blue-200 dark:border-blue-900/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full" style={{
                    background: `conic-gradient(#0C6E81 85deg, transparent 0deg)`
                  }} />
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 relative z-10">
                    85%
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    High Confidence
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                Growth Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-32 w-32 rounded-full border-8 border-green-200 dark:border-green-900/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full" style={{
                    background: `conic-gradient(#2A9D8F 72deg, transparent 0deg)`
                  }} />
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400 relative z-10">
                    +12%
                  </span>
                    </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Next 3 Months</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Above Average
                  </p>
                    </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-32 w-32 rounded-full border-8 border-purple-200 dark:border-purple-900/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full" style={{
                    background: `conic-gradient(#6B46C1 65deg, transparent 0deg)`
                  }} />
                  <span className="text-3xl font-bold text-purple-600 dark:text-purple-400 relative z-10">
                    65%
                  </span>
                    </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    On Track
                  </p>
                    </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Financial Projections</CardTitle>
                <CardDescription>
                  AI-powered predictions based on your spending patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line data={predictionData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Insights</CardTitle>
                <CardDescription>
                  Smart recommendations for your finances
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`p-2 rounded-full ${
                      insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      insight.type === 'success' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {insight.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Goals Progress</CardTitle>
            <CardDescription>
              Track your progress towards financial goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {financialGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-muted">
                        {goal.icon}
                      </div>
                  <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">Target: ₹{goal.target} by {goal.deadline}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{goal.current}</p>
                      <p className="text-sm text-muted-foreground">
                        {((goal.current / goal.target) * 100).toFixed(1)}% Complete
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={(goal.current / goal.target) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
                    <CardDescription>
                AI analysis of potential financial risks
                    </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span>High Credit Card Usage</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30">
                    Medium Risk
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Emergency Fund Status</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30">
                    Low Risk
                              </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Investment Diversification</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30">
                    Low Risk
                  </Badge>
                </div>
                </div>
              </CardContent>
            </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Opportunities</CardTitle>
                <CardDescription>
                Potential areas for financial improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Subscription Optimization</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30">
                    Save ₹200/mo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Investment Opportunity</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30">
                    +8% ROI
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Debt Consolidation</span>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30">
                    Save ₹150/mo
                  </Badge>
                </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Predictions;
