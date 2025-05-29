import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  BrainCircuit, 
  LightbulbIcon, 
  PiggyBank, 
  Sparkles, 
  BadgeDollarSign 
} from "lucide-react";
import { formatAmount } from "@/utils/transactionUtils";

interface SmartBudgetFormProps {
  onSubmit: (data: {
    category: string;
    limit: number;
    isAIRecommended: boolean;
  }) => void;
  onCancel: () => void;
  suggestedBudgets?: Record<string, number>;
  monthlyIncome?: number;
}

export function SmartBudgetForm({ 
  onSubmit, 
  onCancel,
  suggestedBudgets = {},
  monthlyIncome = 0
}: SmartBudgetFormProps) {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [useAIRecommendation, setUseAIRecommendation] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  
  // Calculate suggested limit when category changes
  useEffect(() => {
    if (category && suggestedBudgets[category] && useAIRecommendation) {
      setLimit(suggestedBudgets[category].toFixed(2));
    }
  }, [category, suggestedBudgets, useAIRecommendation]);

  // Common budget categories
  const categories = [
    { value: "food", label: "Food & Dining" },
    { value: "transportation", label: "Transportation" },
    { value: "housing", label: "Housing" },
    { value: "utilities", label: "Utilities" },
    { value: "entertainment", label: "Entertainment" },
    { value: "shopping", label: "Shopping" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "personal", label: "Personal" },
    { value: "investment", label: "Investment" },
    { value: "emergency", label: "Emergency Fund" },
    { value: "other", label: "Other" }
  ];

  // Calculate percentage of income
  const getPercentageOfIncome = (amount: number) => {
    if (!monthlyIncome || monthlyIncome === 0) return 0;
    return (amount / monthlyIncome) * 100;
  };

  // Show warning if budget is outside recommended range
  const getBudgetHealthCheck = (categoryVal: string, limitVal: number) => {
    if (!categoryVal || !limitVal || !suggestedBudgets[categoryVal]) return null;
    
    const suggestedLimit = suggestedBudgets[categoryVal];
    const percentDifference = ((limitVal - suggestedLimit) / suggestedLimit) * 100;
    
    if (percentDifference > 30) {
      return {
        type: "warning",
        message: `This is ${percentDifference.toFixed(0)}% higher than the recommended budget for ${getCategoryLabel(categoryVal)}.`
      };
    } else if (percentDifference < -30) {
      return {
        type: "info",
        message: `This is ${Math.abs(percentDifference).toFixed(0)}% lower than the recommended budget for ${getCategoryLabel(categoryVal)}.`
      };
    }
    
    return {
      type: "success",
      message: "This budget is in line with recommended allocations."
    };
  };

  // Get category label from value
  const getCategoryLabel = (value: string) => {
    const category = categories.find(c => c.value === value);
    return category ? category.label : value;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      category,
      limit: parseFloat(limit),
      isAIRecommended: useAIRecommendation
    });
  };

  // Recommended ideal distribution (50/30/20 rule)
  const budgetDistribution = {
    needs: monthlyIncome * 0.5,
    wants: monthlyIncome * 0.3,
    savings: monthlyIncome * 0.2,
  };

  // Category groups for the 50/30/20 rule
  const categoryGroups = {
    needs: ["housing", "utilities", "food", "transportation", "healthcare"],
    wants: ["entertainment", "shopping", "personal"],
    savings: ["investment", "emergency"],
  };

  // Determine which group a category belongs to
  const getCategoryGroup = (categoryVal: string) => {
    if (categoryGroups.needs.includes(categoryVal)) return "needs";
    if (categoryGroups.wants.includes(categoryVal)) return "wants";
    if (categoryGroups.savings.includes(categoryVal)) return "savings";
    return "other";
  };

  const budgetHealth = limit ? getBudgetHealthCheck(category, parseFloat(limit)) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="useAI" className="text-base">Use AI Recommendations</Label>
          <Switch
            id="useAI"
            checked={useAIRecommendation}
            onCheckedChange={setUseAIRecommendation}
          />
        </div>
        {useAIRecommendation && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BrainCircuit className="h-4 w-4" />
            <span>
              AI will suggest optimal budget limits based on your spending patterns and income
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="budget-category">Category</Label>
          <Select
            value={category}
            onValueChange={setCategory}
            required
          >
            <SelectTrigger id="budget-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem 
                  key={category.value} 
                  value={category.value}
                >
                  {category.label}
                  {suggestedBudgets[category.value] && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Suggested: {formatAmount(suggestedBudgets[category.value])})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between">
            <Label htmlFor="budget-limit">Monthly Limit (₹)</Label>
            {category && suggestedBudgets[category] && (
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => {
                  setLimit(suggestedBudgets[category].toFixed(2));
                  setUseAIRecommendation(true);
                }}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Suggested: {formatAmount(suggestedBudgets[category])}
              </Badge>
            )}
          </div>
          <Input
            id="budget-limit"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
          />
          
          {limit && monthlyIncome > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              {getPercentageOfIncome(parseFloat(limit)).toFixed(1)}% of your monthly income
            </div>
          )}
        </div>

        {budgetHealth && (
          <Alert 
            variant={budgetHealth.type === "warning" ? "destructive" : budgetHealth.type === "info" ? "default" : "default"}
            className={
              budgetHealth.type === "success" 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                : budgetHealth.type === "info"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                : ""
            }
          >
            <div className="flex items-start gap-3">
              {budgetHealth.type === "success" ? (
                <PiggyBank className="h-5 w-5" />
              ) : (
                <LightbulbIcon className="h-5 w-5" />
              )}
              <div>
                <AlertTitle>Budget Health Check</AlertTitle>
                <AlertDescription>{budgetHealth.message}</AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {monthlyIncome > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Budget Distribution Guide</span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDistribution(!showDistribution)}
                className="text-xs h-7 px-2"
              >
                {showDistribution ? "Hide" : "Show"}
              </Button>
            </div>

            {showDistribution && (
              <Card className="mt-2">
                <CardContent className="pt-4">
                  <div className="space-y-4 text-sm">
                    <p className="text-muted-foreground">
                      The 50/30/20 rule suggests splitting your monthly income as follows:
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Needs (50%)</span>
                          <span>{formatAmount(budgetDistribution.needs)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "50%" }}></div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Housing, utilities, groceries, transportation, healthcare
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Wants (30%)</span>
                          <span>{formatAmount(budgetDistribution.wants)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Entertainment, dining out, shopping, subscriptions
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Savings (20%)</span>
                          <span>{formatAmount(budgetDistribution.savings)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Emergency fund, retirement, investments, debt repayment
                        </div>
                      </div>
                    </div>
                    
                    {category && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span>This category falls under:</span>
                          <Badge variant="secondary">
                            {getCategoryGroup(category).charAt(0).toUpperCase() + getCategoryGroup(category).slice(1)}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Budget
        </Button>
      </div>
    </form>
  );
}

export default SmartBudgetForm; 