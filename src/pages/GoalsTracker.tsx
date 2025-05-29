import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target,
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
  Wallet,
  LineChart,
  PieChart,
  Activity,
  AlertTriangle,
  Calendar,
  FileText,
  Settings,
  Plus,
  Minus,
  Clock,
  Award,
  Trophy,
  Medal,
  Crown,
  Sparkles,
  Rocket,
  Flag,
  CheckCircle2,
  XCircle,
  HelpCircle,
  History,
  Download,
  Share2,
  Bell,
  Star,
  Lightbulb,
  FileSpreadsheet,
  FileCheck,
  FileWarning,
  Printer,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FinancialReports } from "@/components/reports/FinancialReports";

const GoalsTracker = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [showReports, setShowReports] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [goalsData, setGoalsData] = useState({
    overview: {
      totalGoals: 5,
      completedGoals: 2,
      inProgress: 3,
      totalProgress: 65,
      nextMilestone: "Emergency Fund Goal",
      daysToNextMilestone: 15,
    },
    goals: [
      {
        name: "Emergency Fund",
        target: 20000,
        current: 15000,
        startDate: "2024-01-01",
        targetDate: "2024-06-30",
        category: "Savings",
        priority: "High",
        status: "In Progress",
        progress: 75,
      },
      {
        name: "Down Payment",
        target: 50000,
        current: 25000,
        startDate: "2024-01-01",
        targetDate: "2024-12-31",
        category: "Housing",
        priority: "High",
        status: "In Progress",
        progress: 50,
      },
      {
        name: "Vacation Fund",
        target: 5000,
        current: 5000,
        startDate: "2024-01-01",
        targetDate: "2024-03-31",
        category: "Travel",
        priority: "Medium",
        status: "Completed",
        progress: 100,
      },
      {
        name: "Car Purchase",
        target: 25000,
        current: 25000,
        startDate: "2023-07-01",
        targetDate: "2024-01-31",
        category: "Transportation",
        priority: "High",
        status: "Completed",
        progress: 100,
      },
      {
        name: "Retirement Contribution",
        target: 19500,
        current: 9750,
        startDate: "2024-01-01",
        targetDate: "2024-12-31",
        category: "Retirement",
        priority: "High",
        status: "In Progress",
        progress: 50,
      },
    ],
    milestones: [
      {
        name: "Emergency Fund - 75%",
        date: "2024-03-15",
        status: "Upcoming",
        goal: "Emergency Fund",
      },
      {
        name: "Down Payment - 50%",
        date: "2024-06-30",
        status: "Upcoming",
        goal: "Down Payment",
      },
      {
        name: "Retirement - 50%",
        date: "2024-06-30",
        status: "Upcoming",
        goal: "Retirement Contribution",
      },
    ],
    recommendations: [
      {
        title: "Increase Emergency Fund Contributions",
        description: "You're on track to reach your emergency fund goal. Consider increasing monthly contributions to reach it sooner.",
        impact: "High",
        timeframe: "Immediate",
      },
      {
        title: "Review Down Payment Strategy",
        description: "Your down payment goal is progressing well. Consider exploring high-yield savings options for better returns.",
        impact: "Medium",
        timeframe: "Next Month",
      },
      {
        title: "Maximize Retirement Contributions",
        description: "You're halfway to your retirement contribution goal. Consider increasing contributions to reach the maximum limit.",
        impact: "High",
        timeframe: "Immediate",
      },
    ],
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Implement real-time data refresh logic here
      // For example, fetch latest data from your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      // Update goalsData with fresh data
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
            <h1 className="text-3xl font-bold tracking-tight">{t('goals_tracker')}</h1>
            <p className="text-muted-foreground">
              {t('track_and_manage_your_financial_goals')}
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
            type="goals-tracker"
            data={goalsData}
            onRefresh={handleRefresh}
          />
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="milestones" className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Milestones
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Goals Summary
                    </CardTitle>
                    <CardDescription>
                      Your overall progress and achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Total Goals</p>
                          <p className="text-2xl font-bold">{goalsData.overview.totalGoals}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Completed</p>
                          <p className="text-2xl font-bold">{goalsData.overview.completedGoals}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">In Progress</p>
                          <p className="text-2xl font-bold">{goalsData.overview.inProgress}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Total Progress</p>
                          <p className="text-2xl font-bold">{goalsData.overview.totalProgress}%</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Next Milestone</span>
                          <span className="font-medium">{goalsData.overview.nextMilestone}</span>
                        </div>
                        <Progress value={goalsData.overview.totalProgress} />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Days to Milestone</span>
                          <span>{goalsData.overview.daysToNextMilestone} days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Goal Alerts
                    </CardTitle>
                    <CardDescription>
                      Important goal-related notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900 dark:text-amber-400">
                          Emergency Fund Goal
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-500">
                          You're 75% of the way to your emergency fund goal
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-400">
                          Down Payment Progress
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-500">
                          You've reached 50% of your down payment goal
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
                      Active Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {goalsData.goals.filter(goal => goal.status === "In Progress").map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{goal.name}</span>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {goal.status}
                            </Badge>
                          </div>
                          <Progress value={goal.progress} />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Progress: {goal.progress}%</span>
                            <span>Target: ${goal.target.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Completed Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {goalsData.goals.filter(goal => goal.status === "Completed").map((goal, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="space-y-1">
                            <p className="font-medium">{goal.name}</p>
                            <p className="text-sm text-muted-foreground">Target: ${goal.target.toLocaleString()}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                              <Badge variant="outline">
                                {goal.category}
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
                      Upcoming Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {goalsData.milestones.map((milestone, index) => (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{milestone.name}</span>
                          <span className="text-sm">{milestone.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    All Goals
                  </CardTitle>
                  <CardDescription>
                    Track and manage your financial goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {goalsData.goals.map((goal, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{goal.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Category: {goal.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: {goal.status}
                            </p>
                          </div>
                        </div>
                        <Progress value={goal.progress} />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Start: {goal.startDate}</span>
                          <span>Target: {goal.targetDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-primary" />
                    Goal Milestones
                  </CardTitle>
                  <CardDescription>
                    Track your progress milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {goalsData.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="space-y-1">
                          <p className="font-medium">{milestone.name}</p>
                          <p className="text-sm text-muted-foreground">Goal: {milestone.goal}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              milestone.status === "Completed" ? "bg-green-100 text-green-800" :
                              "bg-blue-100 text-blue-800"
                            }>
                              {milestone.status}
                            </Badge>
                            <Badge variant="outline">
                              {milestone.date}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm">View Details</Button>
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
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Goal Recommendations
                  </CardTitle>
                  <CardDescription>
                    Personalized recommendations to help you achieve your goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {goalsData.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="space-y-1">
                          <p className="font-medium">{rec.title}</p>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              rec.impact === "High" ? "bg-red-100 text-red-800" :
                              rec.impact === "Medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }>
                              {rec.impact} Impact
                            </Badge>
                            <Badge variant="outline">
                              {rec.timeframe}
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

export default GoalsTracker; 