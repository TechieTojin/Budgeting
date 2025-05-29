import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { BudgetPrediction as BudgetPredictionType } from "@/utils/budgetUtils";
import { formatAmount } from "@/utils/transactionUtils";
import { cn } from "@/lib/utils";

interface BudgetPredictionProps {
  predictions: BudgetPredictionType[];
  isLoading?: boolean;
  currentDate?: Date;
}

export function BudgetPrediction({ 
  predictions, 
  isLoading = false,
  currentDate = new Date()
}: BudgetPredictionProps) {
  // Get risk level color
  const getRiskColor = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  // Get progress color
  const getProgressColor = (predicted: number, limit: number) => {
    const ratio = predicted / limit;
    if (ratio >= 1) return "bg-red-500";
    if (ratio >= 0.85) return "bg-amber-500";
    return "bg-green-500";
  };

  // Get risk badge
  const getRiskBadge = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            High Risk
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            Medium Risk
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            On Track
          </Badge>
        );
      default:
        return null;
    }
  };

  // Calculate days left in month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const dayOfMonth = currentDate.getDate();
  const daysLeft = daysInMonth - dayOfMonth;

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="border border-primary/10 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>End-of-Month Forecast</CardTitle>
          <CardDescription>Predictive budget analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
                <div className="h-2 bg-muted rounded w-full"></div>
                <div className="flex justify-between mt-1">
                  <div className="h-3 bg-muted rounded w-1/5"></div>
                  <div className="h-3 bg-muted rounded w-1/5"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort predictions by risk level (high to low)
  const sortedPredictions = [...predictions].sort((a, b) => {
    const riskLevelOrder = { high: 0, medium: 1, low: 2 };
    return riskLevelOrder[a.riskLevel] - riskLevelOrder[b.riskLevel];
  });

  return (
    <Card className="border border-primary/10 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              End-of-Month Forecast
            </CardTitle>
            <CardDescription>
              {daysLeft} days left in this month
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No predictions yet</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Create budgets and add transactions to get AI-powered forecasts for your spending.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedPredictions.map((prediction, index) => {
              const percentOfLimit = (prediction.predictedTotal / prediction.currentSpent) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{prediction.category}</span>
                      {getRiskBadge(prediction.riskLevel)}
                    </div>
                    <div className="flex items-center gap-1">
                      {prediction.predictedOverspend > 0 && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className={cn("font-medium", getRiskColor(prediction.riskLevel))}>
                        {formatAmount(prediction.predictedTotal)}
                      </span>
                      <span className="text-muted-foreground">/ {formatAmount(prediction.currentSpent)}</span>
                    </div>
                  </div>
                  
                  <Progress 
                    value={percentOfLimit} 
                    className={cn("h-2", getProgressColor(prediction.predictedTotal, prediction.currentSpent))} 
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Spent: {formatAmount(prediction.currentSpent)}</span>
                    <span>Predicted: {formatAmount(prediction.predictedTotal)}</span>
                  </div>
                  
                  {prediction.predictedOverspend > 0 && (
                    <div className="text-xs text-red-500 font-medium mt-1">
                      Projected to exceed budget by {formatAmount(prediction.predictedOverspend)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BudgetPrediction; 