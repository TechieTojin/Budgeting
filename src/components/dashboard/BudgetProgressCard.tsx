import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetItem {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
}

interface BudgetProgressCardProps {
  budgets: BudgetItem[];
}

export const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  budgets,
}) => {
  // Sort budgets by percentage spent (highest first)
  const sortedBudgets = [...budgets].sort((a, b) => b.percentage - a.percentage);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-green-500";
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 70) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <Card className="col-span-2 card-hover">
      <CardHeader>
        <CardTitle>Budget Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedBudgets.map((budget) => (
            <div key={budget.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{budget.category}</span>
                <div className="flex items-center gap-2">
                  <span className={cn("font-medium", getTextColor(budget.percentage))}>
                    ₹{budget.spent} <span className="text-muted-foreground font-normal">/ ₹{budget.limit}</span>
                  </span>
                  {budget.percentage >= 90 && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <Progress 
                value={budget.percentage} 
                className={cn("h-2", getProgressColor(budget.percentage))}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
