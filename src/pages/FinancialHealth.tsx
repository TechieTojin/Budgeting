import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HeartPulse,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  CreditCard,
  PiggyBank,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Shield,
  Target,
  Wallet,
  LineChart,
  PieChart,
  Activity,
  AlertTriangle,
  Calendar,
  FileText,
  Settings,
  Download,
  Share2,
  Printer,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FinancialReports } from "@/components/reports/FinancialReports";

const FinancialHealth = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [showReports, setShowReports] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState({
    overview: {
      creditScore: 750,
      debtToIncome: 0.35,
      savingsRate: 0.25,
      emergencyFund: 15000,
      monthlyIncome: 5000,
      monthlyExpenses: 3500,
      monthlySavings: 1500,
    },
    metrics: [
      {
        name: "Credit Score",
        value: 750,
        status: "Good",
        trend: "up",
        change: 15,
        target: 800,
      },
      {
        name: "Debt-to-Income Ratio",
        value: 0.35,
        status: "Good",
        trend: "down",
        change: 0.05,
        target: 0.30,
      },
      {
        name: "Savings Rate",
        value: 0.25,
        status: "Good",
        trend: "up",
        change: 0.03,
        target: 0.30,
      },
      {
        name: "Emergency Fund",
        value: 15000,
        status: "Good",
        trend: "up",
        change: 2000,
        target: 20000,
      },
    ],
    recommendations: [
      {
        title: "Increase Emergency Fund",
        description: "Your emergency fund is at 75% of the recommended amount.",
        priority: "High",
        impact: "High",
      },
      {
        title: "Reduce Credit Card Debt",
        description: "Consider consolidating high-interest credit card debt.",
        priority: "Medium",
        impact: "High",
      },
      {
        title: "Maximize Retirement Contributions",
        description: "You're not maximizing your retirement contributions.",
        priority: "Medium",
        impact: "Medium",
      },
    ],
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Implement real-time data refresh logic here
      // For example, fetch latest data from your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      // Update healthData with fresh data
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportsClick = () => {
    setShowReports(true);
  };

  const handleReportsClose = () => {
    setShowReports(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('financial_health')}</h1>
            <p className="text-muted-foreground">
              {t('monitor_and_improve_your_financial_wellbeing')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReportsClick}>
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {showReports ? (
          <FinancialReports 
            type="financial-health"
            data={healthData}
            onRefresh={handleRefresh}
          />
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HeartPulse className="h-5 w-5 text-primary" />
                      Financial Health Summary
                    </CardTitle>
                    <CardDescription>
                      Your overall financial health status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Credit Score</p>
                          <p className="text-2xl font-bold">{healthData.overview.creditScore}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Debt-to-Income</p>
                          <p className="text-2xl font-bold">{(healthData.overview.debtToIncome * 100).toFixed(0)}%</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Savings Rate</p>
                          <p className="text-2xl font-bold">{(healthData.overview.savingsRate * 100).toFixed(0)}%</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Emergency Fund</p>
                          <p className="text-2xl font-bold">₹{healthData.overview.emergencyFund.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Monthly Income</span>
                          <span className="font-medium">₹{healthData.overview.monthlyIncome.toLocaleString()}</span>
                        </div>
                        <Progress value={(healthData.overview.monthlyExpenses / healthData.overview.monthlyIncome) * 100} />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Expenses: ₹{healthData.overview.monthlyExpenses.toLocaleString()}</span>
                          <span>Savings: ₹{healthData.overview.monthlySavings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Health Alerts
                    </CardTitle>
                    <CardDescription>
                      Important financial health notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900 dark:text-amber-400">
                          Emergency Fund Alert
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-500">
                          Your emergency fund is below the recommended 6 months of expenses
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-400">
                          Credit Score Improvement
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-500">
                          Your credit score has improved by 15 points this month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {healthData.metrics.map((metric, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{metric.name}</span>
                            <Badge variant="outline" className={
                              metric.status === "Good" ? "bg-green-100 text-green-800" :
                              metric.status === "Fair" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {metric.status}
                            </Badge>
                          </div>
                          <Progress value={(metric.value / metric.target) * 100} />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Current: {metric.value}</span>
                            <span>Target: {metric.target}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {healthData.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="space-y-1">
                            <p className="font-medium">{rec.title}</p>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={
                                rec.priority === "High" ? "bg-red-100 text-red-800" :
                                rec.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }>
                                {rec.priority} Priority
                              </Badge>
                              <Badge variant="outline" className={
                                rec.impact === "High" ? "bg-red-100 text-red-800" :
                                rec.impact === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }>
                                {rec.impact} Impact
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming Checks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Credit Score Check</span>
                        <span className="text-sm">Next Month</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Debt Review</span>
                        <span className="text-sm">In 2 Weeks</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Savings Review</span>
                        <span className="text-sm">Next Week</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Budget Review</span>
                        <span className="text-sm">Tomorrow</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Detailed Metrics
                  </CardTitle>
                  <CardDescription>
                    Track and analyze your financial metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {healthData.metrics.map((metric, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{metric.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {metric.trend === "up" ? "Improving" : "Needs Attention"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{metric.value}</p>
                            <p className="text-sm text-muted-foreground">
                              {metric.trend === "up" ? "+" : "-"}{metric.change}
                            </p>
                          </div>
                        </div>
                        <Progress value={(metric.value / metric.target) * 100} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Personalized Recommendations
                  </CardTitle>
                  <CardDescription>
                    Actionable steps to improve your financial health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {healthData.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="space-y-1">
                          <p className="font-medium">{rec.title}</p>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              rec.priority === "High" ? "bg-red-100 text-red-800" :
                              rec.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }>
                              {rec.priority} Priority
                            </Badge>
                            <Badge variant="outline" className={
                              rec.impact === "High" ? "bg-red-100 text-red-800" :
                              rec.impact === "Medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }>
                              {rec.impact} Impact
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm">Learn More</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Health History
                  </CardTitle>
                  <CardDescription>
                    Track your financial health over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Add health history content here */}
                    <p className="text-muted-foreground">Health history tracking coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FinancialHealth; 