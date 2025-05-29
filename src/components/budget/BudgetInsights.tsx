import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, LightbulbIcon, Info } from "lucide-react";
import { BudgetInsight } from "@/utils/budgetUtils";

interface BudgetInsightsProps {
  insights: BudgetInsight[];
  isLoading?: boolean;
}

export function BudgetInsights({ insights, isLoading = false }: BudgetInsightsProps) {
  // Get icon for insight type
  const getInsightIcon = (insight: BudgetInsight) => {
    switch (insight.type) {
      case "overspend":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "trend":
        return insight.impact === "positive" 
          ? <TrendingDown className="h-5 w-5 text-green-500" /> 
          : <TrendingUp className="h-5 w-5 text-red-500" />;
      case "pattern":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "suggestion":
        return <LightbulbIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Get badge color based on impact
  const getImpactBadge = (impact: "positive" | "negative" | "neutral") => {
    switch (impact) {
      case "positive":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Positive</Badge>;
      case "negative":
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Attention</Badge>;
      case "neutral":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Info</Badge>;
      default:
        return null;
    }
  };

  // Get priority label
  const getPriorityBadge = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="border border-primary/10 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Budget Insights</CardTitle>
          <CardDescription>AI-powered analysis of your budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/10 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          Budget Insights
        </CardTitle>
        <CardDescription>AI-powered analysis of your budget</CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <LightbulbIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No insights yet</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              As you add more transactions and budgets, our AI will analyze your spending patterns and provide personalized insights.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="mt-1">
                  {getInsightIcon(insight)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {insight.category && (
                      <Badge variant="secondary" className="capitalize">
                        {insight.category}
                      </Badge>
                    )}
                    {getImpactBadge(insight.impact)}
                    {insight.priority === "high" && getPriorityBadge(insight.priority)}
                  </div>
                  <p className="text-sm">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BudgetInsights; 