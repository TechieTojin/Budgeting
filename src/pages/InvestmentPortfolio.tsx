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

interface Investment {
  id: string;
  name: string;
  type: string;
  value: number;
  allocation: number;
  performance: number;
  risk: "low" | "medium" | "high";
  lastUpdated: Date;
}

const InvestmentPortfolio = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: "1",
      name: "S&P 500 Index Fund",
      type: "Stocks",
      value: 50000,
      allocation: 40,
      performance: 12.5,
      risk: "medium",
      lastUpdated: new Date()
    },
    {
      id: "2",
      name: "Government Bonds",
      type: "Bonds",
      value: 30000,
      allocation: 25,
      performance: 4.2,
      risk: "low",
      lastUpdated: new Date()
    },
    {
      id: "3",
      name: "Tech Growth Fund",
      type: "Stocks",
      value: 25000,
      allocation: 20,
      performance: 18.7,
      risk: "high",
      lastUpdated: new Date()
    },
    {
      id: "4",
      name: "Real Estate ETF",
      type: "Real Estate",
      value: 15000,
      allocation: 15,
      performance: 8.3,
      risk: "medium",
      lastUpdated: new Date()
    }
  ]);

  // Simulated portfolio performance history
  const performanceHistory = [
    { month: "Jan", value: 100000 },
    { month: "Feb", value: 102000 },
    { month: "Mar", value: 105000 },
    { month: "Apr", value: 103000 },
    { month: "May", value: 107000 },
    { month: "Jun", value: 110000 }
  ];

  // Simulated asset allocation data
  const assetAllocation = [
    { name: "Stocks", value: 60 },
    { name: "Bonds", value: 25 },
    { name: "Real Estate", value: 15 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getPerformanceColor = (performance: number) => {
    return performance >= 0 ? "text-green-500" : "text-red-500";
  };

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalPerformance = investments.reduce((sum, inv) => sum + (inv.value * inv.performance / 100), 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Investment Portfolio</h1>
            <p className="text-muted-foreground">
              Track and analyze your investment performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Portfolio Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Value</span>
                      <span className="font-semibold">${totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Return</span>
                      <span className={cn("font-semibold", getPerformanceColor(totalPerformance))}>
                        ${totalPerformance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Number of Investments</span>
                      <span className="font-semibold">{investments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-semibold">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Asset Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetAllocation}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {assetAllocation.map((entry, index) => (
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

            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {investments.map((investment) => (
                      <div key={investment.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{investment.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {investment.type} • {investment.allocation}% of portfolio
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold">${investment.value.toLocaleString()}</p>
                              <p className={cn("text-sm", getPerformanceColor(investment.performance))}>
                                {investment.performance > 0 ? "+" : ""}{investment.performance}%
                              </p>
                            </div>
                            <Badge variant={investment.risk === "low" ? "default" : "secondary"}>
                              {investment.risk} risk
                            </Badge>
                          </div>
                        </div>
                        <Progress value={investment.allocation} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="holdings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Holdings</CardTitle>
                <CardDescription>
                  View and manage your investment holdings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add holdings content */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
                <CardDescription>
                  Detailed performance metrics and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add performance content */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Analysis</CardTitle>
                <CardDescription>
                  Get insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add analysis content */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InvestmentPortfolio; 