import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Clock,
  Shield,
  PiggyBank,
  CreditCard,
  Home,
  Car,
  GraduationCap,
  Briefcase,
  Heart,
  Brain,
  Zap,
  Lightbulb,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  Activity,
  Wallet,
  Banknote,
  Receipt,
  Calendar,
  Clock4,
  History,
  Settings,
  FileText,
  Download,
  Share2,
  Bell,
  Star,
  Award,
  Trophy,
  Medal,
  Crown,
  Sparkles,
  Rocket,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FinancialMetric {
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
}

interface Report {
  id: string;
  title: string;
  type: string;
  date: Date;
  status: "generated" | "pending" | "failed";
  url?: string;
}

const FinancialReports = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // Simulated financial metrics
  const metrics: FinancialMetric[] = [
    {
      name: "Net Worth",
      value: 250000,
      change: 5.2,
      trend: "up"
    },
    {
      name: "Monthly Savings",
      value: 2500,
      change: 12.5,
      trend: "up"
    },
    {
      name: "Investment Returns",
      value: 8500,
      change: -2.1,
      trend: "down"
    },
    {
      name: "Debt-to-Income Ratio",
      value: 0.35,
      change: -0.05,
      trend: "up"
    }
  ];

  // Simulated income vs expenses data
  const incomeExpensesData = [
    { month: "Jan", income: 8000, expenses: 6000 },
    { month: "Feb", income: 8200, expenses: 5800 },
    { month: "Mar", income: 8500, expenses: 6200 },
    { month: "Apr", income: 8300, expenses: 5900 },
    { month: "May", income: 8700, expenses: 6100 },
    { month: "Jun", income: 8900, expenses: 6300 }
  ];

  // Simulated expense categories
  const expenseCategories = [
    { name: "Housing", value: 35 },
    { name: "Transportation", value: 15 },
    { name: "Food", value: 20 },
    { name: "Utilities", value: 10 },
    { name: "Entertainment", value: 10 },
    { name: "Other", value: 10 }
  ];

  // Simulated reports
  const reports: Report[] = [
    {
      id: "1",
      title: "Monthly Financial Summary",
      type: "Monthly",
      date: new Date("2024-06-30"),
      status: "generated",
      url: "/reports/monthly-2024-06.pdf"
    },
    {
      id: "2",
      title: "Quarterly Investment Report",
      type: "Quarterly",
      date: new Date("2024-06-30"),
      status: "generated",
      url: "/reports/quarterly-2024-Q2.pdf"
    },
    {
      id: "3",
      title: "Annual Tax Summary",
      type: "Annual",
      date: new Date("2024-12-31"),
      status: "pending"
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
            <p className="text-muted-foreground">
              Comprehensive financial analysis and reporting
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <Card key={metric.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {metric.name === "Debt-to-Income Ratio" 
                            ? metric.value.toFixed(2)
                            : `$${metric.value.toLocaleString()}`}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "flex items-center gap-1",
                            getTrendColor(metric.trend)
                          )}
                        >
                          {getTrendIcon(metric.trend)}
                          {metric.change > 0 ? "+" : ""}{metric.change}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-primary" />
                    Income vs Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={incomeExpensesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                        <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Expense Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.type} • {report.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={report.status === "generated" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                        {report.url && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Reports</CardTitle>
                <CardDescription>
                  View and manage all your financial reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add reports content */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Analysis</CardTitle>
                <CardDescription>
                  Detailed financial analysis and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add analysis content */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Insights</CardTitle>
                <CardDescription>
                  Get personalized insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add insights content */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinancialReports; 