import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Receipt,
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
  FileSpreadsheet,
  FileCheck,
  FileWarning,
  Minus,
  Plus,
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

const TaxOptimization = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [showReports, setShowReports] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taxData, setTaxData] = useState({
    overview: {
      currentYearIncome: 85000,
      estimatedTax: 17000,
      deductions: 15000,
      credits: 2000,
      taxBracket: "22%",
      effectiveTaxRate: "18.5%",
      potentialSavings: 2500,
    },
    deductions: [
      {
        name: "Mortgage Interest",
        amount: 8000,
        status: "Maximized",
        category: "Housing",
      },
      {
        name: "Property Taxes",
        amount: 3000,
        status: "Maximized",
        category: "Housing",
      },
      {
        name: "Charitable Contributions",
        amount: 2000,
        status: "Can Increase",
        category: "Charitable",
      },
      {
        name: "Retirement Contributions",
        amount: 2000,
        status: "Can Increase",
        category: "Retirement",
      },
    ],
    credits: [
      {
        name: "Child Tax Credit",
        amount: 2000,
        status: "Claimed",
        category: "Family",
      },
      {
        name: "Education Credit",
        amount: 0,
        status: "Available",
        category: "Education",
      },
      {
        name: "Energy Efficiency Credit",
        amount: 0,
        status: "Available",
        category: "Home",
      },
    ],
    opportunities: [
      {
        title: "Maximize Retirement Contributions",
        description: "Increase your 401(k) contributions to reduce taxable income",
        potentialSavings: 1000,
        difficulty: "Low",
        timeframe: "Immediate",
      },
      {
        title: "Charitable Giving Strategy",
        description: "Consider bunching charitable contributions for larger deductions",
        potentialSavings: 500,
        difficulty: "Medium",
        timeframe: "Before Year-End",
      },
      {
        title: "Energy Efficiency Upgrades",
        description: "Install energy-efficient home improvements for tax credits",
        potentialSavings: 1000,
        difficulty: "High",
        timeframe: "Before Year-End",
      },
    ],
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Implement real-time data refresh logic here
      // For example, fetch latest data from your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      // Update taxData with fresh data
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
            <h1 className="text-3xl font-bold tracking-tight">{t('tax_optimization')}</h1>
            <p className="text-muted-foreground">
              {t('optimize_your_tax_strategy_and_maximize_savings')}
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
            type="tax-optimization"
            data={taxData}
            onRefresh={handleRefresh}
          />
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="deductions" className="flex items-center gap-2">
                <Minus className="h-4 w-4" />
                Deductions
              </TabsTrigger>
              <TabsTrigger value="credits" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Credits
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Planning
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      Tax Summary
                    </CardTitle>
                    <CardDescription>
                      Your current tax situation and potential savings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Annual Income</p>
                          <p className="text-2xl font-bold">₹{taxData.overview.currentYearIncome.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Tax Bracket</p>
                          <p className="text-2xl font-bold">{taxData.overview.taxBracket}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Effective Rate</p>
                          <p className="text-2xl font-bold">{taxData.overview.effectiveTaxRate}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Estimated Tax</span>
                          <span className="font-medium">₹{taxData.overview.estimatedTax.toLocaleString()}</span>
                        </div>
                        <Progress value={(taxData.overview.deductions / taxData.overview.currentYearIncome) * 100} />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Deductions: ₹{taxData.overview.deductions.toLocaleString()}</span>
                          <span>Credits: ₹{taxData.overview.credits.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Tax Alerts
                    </CardTitle>
                    <CardDescription>
                      Important tax-related notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900 dark:text-amber-400">
                          Tax Filing Deadline
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-500">
                          Tax filing deadline is approaching in 30 days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-400">
                          Potential Savings
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-500">
                          You could save ₹{taxData.overview.potentialSavings.toLocaleString()} with available tax strategies
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
                      Key Deductions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {taxData.deductions.map((deduction, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{deduction.name}</span>
                            <Badge variant="outline" className={
                              deduction.status === "Maximized" ? "bg-green-100 text-green-800" :
                              "bg-yellow-100 text-yellow-800"
                            }>
                              {deduction.status}
                            </Badge>
                          </div>
                          <Progress value={deduction.amount / 10000 * 100} />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Amount: ₹{deduction.amount.toLocaleString()}</span>
                            <span>Category: {deduction.category}</span>
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
                      Tax Credits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {taxData.credits.map((credit, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="space-y-1">
                            <p className="font-medium">{credit.name}</p>
                            <p className="text-sm text-muted-foreground">Amount: ₹{credit.amount.toLocaleString()}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={
                                credit.status === "Claimed" ? "bg-green-100 text-green-800" :
                                "bg-blue-100 text-blue-800"
                              }>
                                {credit.status}
                              </Badge>
                              <Badge variant="outline">
                                {credit.category}
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
                      Tax Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Quarterly Estimated Tax</span>
                        <span className="text-sm">Due in 15 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tax Filing Deadline</span>
                        <span className="text-sm">April 15, 2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Extension Deadline</span>
                        <span className="text-sm">October 15, 2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Retirement Contribution</span>
                        <span className="text-sm">December 31, 2024</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="deductions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Minus className="h-5 w-5 text-primary" />
                    Available Deductions
                  </CardTitle>
                  <CardDescription>
                    Track and maximize your tax deductions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {taxData.deductions.map((deduction, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{deduction.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Category: {deduction.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{deduction.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: {deduction.status}
                            </p>
                          </div>
                        </div>
                        <Progress value={deduction.amount / 10000 * 100} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Tax Credits
                  </CardTitle>
                  <CardDescription>
                    Available tax credits and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {taxData.credits.map((credit, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="space-y-1">
                          <p className="font-medium">{credit.name}</p>
                          <p className="text-sm text-muted-foreground">Amount: ₹{credit.amount.toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              credit.status === "Claimed" ? "bg-green-100 text-green-800" :
                              "bg-blue-100 text-blue-800"
                            }>
                              {credit.status}
                            </Badge>
                            <Badge variant="outline">
                              {credit.category}
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

            <TabsContent value="planning" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Tax Planning
                  </CardTitle>
                  <CardDescription>
                    Strategic tax planning opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {taxData.opportunities.map((opp, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="space-y-1">
                          <p className="font-medium">{opp.title}</p>
                          <p className="text-sm text-muted-foreground">{opp.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              opp.difficulty === "Low" ? "bg-green-100 text-green-800" :
                              opp.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {opp.difficulty} Difficulty
                            </Badge>
                            <Badge variant="outline">
                              {opp.timeframe}
                            </Badge>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Save ₹{opp.potentialSavings.toLocaleString()}
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
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TaxOptimization; 