import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Target,
  Wallet,
  PiggyBank,
  LineChart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const AIInsights = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for insights
  const insights = [
    {
      id: 1,
      type: 'spending',
      title: 'Unusual Spending Pattern',
      description: 'Your entertainment expenses have increased by 45% compared to last month.',
      impact: 'high',
      recommendation: 'Consider reviewing your entertainment subscriptions and discretionary spending.',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 2,
      type: 'savings',
      title: 'Savings Opportunity',
      description: 'You could save ₹2,500 monthly by optimizing your food delivery expenses.',
      impact: 'medium',
      recommendation: 'Try meal prepping or cooking at home more often.',
      icon: <PiggyBank className="h-5 w-5" />
    },
    {
      id: 3,
      type: 'budget',
      title: 'Budget Alert',
      description: 'Your shopping category is approaching 90% of the monthly budget.',
      impact: 'high',
      recommendation: 'Consider postponing non-essential purchases until next month.',
      icon: <AlertTriangle className="h-5 w-5" />
    }
  ];

  // Sample data for predictions
  const predictions = [
    {
      category: 'Food',
      current: 15000,
      predicted: 16500,
      trend: 'increasing',
      confidence: 85
    },
    {
      category: 'Transport',
      current: 8000,
      predicted: 7500,
      trend: 'decreasing',
      confidence: 75
    },
    {
      category: 'Entertainment',
      current: 5000,
      predicted: 6000,
      trend: 'increasing',
      confidence: 90
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-primary" />
              AI Insights
            </h1>
            <p className="text-muted-foreground">
              Smart analysis and predictions for your financial health
            </p>
          </motion.div>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate New Insights
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Financial Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-32 w-32 rounded-full border-8 border-green-200 dark:border-green-900/30 flex items-center justify-center">
                      <span className="text-3xl font-bold text-green-600 dark:text-green-400">85%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Good financial health</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Spending Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Essential Expenses</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Discretionary Expenses</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Savings Rate</span>
                      <Badge variant="outline" className="text-green-600">+5%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Spending Growth</span>
                      <Badge variant="outline" className="text-red-600">+2%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Budget Adherence</span>
                      <Badge variant="outline" className="text-green-600">92%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {insights.map((insight) => (
                    <div key={insight.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {insight.icon}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{insight.title}</h3>
                          <Badge variant={insight.impact === 'high' ? 'destructive' : 'default'}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                        <p className="text-sm font-medium">{insight.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spending Predictions</CardTitle>
                <CardDescription>
                  AI-powered predictions for your upcoming expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{prediction.category}</span>
                          <Badge variant={prediction.trend === 'increasing' ? 'destructive' : 'default'}>
                            {prediction.trend}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{prediction.predicted.toLocaleString('en-IN')}</p>
                          <p className="text-sm text-muted-foreground">
                            {prediction.confidence}% confidence
                          </p>
                        </div>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Smart Recommendations</CardTitle>
                <CardDescription>
                  Personalized suggestions to improve your financial health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-medium mb-2">Optimize Your Savings</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Based on your spending patterns, you could increase your savings by 15% by making these adjustments:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Reduce food delivery expenses by 30%
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Consolidate your streaming subscriptions
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Set up automatic savings transfers
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AIInsights; 