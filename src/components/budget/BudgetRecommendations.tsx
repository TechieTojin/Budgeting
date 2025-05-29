import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LightbulbIcon, 
  ArrowRightLeft, 
  PiggyBank, 
  AlertCircle, 
  ThumbsUp, 
  BarChart
} from "lucide-react";
import { Recommendation } from "@/utils/budgetUtils";
import { formatAmount } from "@/utils/transactionUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BudgetRecommendationsProps {
  recommendations: Recommendation[];
  isLoading?: boolean;
  onApply?: (recommendation: Recommendation) => void;
}

export function BudgetRecommendations({ 
  recommendations, 
  isLoading = false,
  onApply 
}: BudgetRecommendationsProps) {
  // Get icon based on recommendation type
  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case "savings":
        return <PiggyBank className="h-4 w-4 text-green-500" />;
      case "reallocation":
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
      case "goal":
        return <BarChart className="h-4 w-4 text-purple-500" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <LightbulbIcon className="h-4 w-4 text-amber-500" />;
    }
  };

  // Get badge for impact level
  const getImpactBadge = (impact: "low" | "medium" | "high") => {
    switch (impact) {
      case "high":
        return <Badge className="bg-red-500">High Impact</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium Impact</Badge>;
      case "low":
        return <Badge variant="outline">Low Impact</Badge>;
      default:
        return null;
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="border border-primary/10 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Smart Recommendations</CardTitle>
          <CardDescription>AI-suggested actions to improve your budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg bg-card animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                </div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort recommendations by impact
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });

  return (
    <Card className="border border-primary/10 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          Smart Recommendations
        </CardTitle>
        <CardDescription>AI-suggested actions to improve your budget</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ThumbsUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No recommendations yet</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              As you track more of your spending, our AI will identify opportunities to optimize your budget.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedRecommendations.map((recommendation) => (
              <div 
                key={recommendation.id} 
                className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    {getRecommendationIcon(recommendation.type)}
                    {recommendation.category && (
                      <Badge variant="secondary" className="capitalize">
                        {recommendation.category}
                      </Badge>
                    )}
                  </div>
                  {getImpactBadge(recommendation.impact)}
                </div>
                
                <p className="text-sm mb-3">{recommendation.message}</p>
                
                {recommendation.potentialSavings && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-green-600 dark:text-green-400">
                    <PiggyBank className="h-4 w-4" />
                    <span>Potential savings: {formatAmount(recommendation.potentialSavings)}</span>
                  </div>
                )}
                
                {onApply && (
                  <div className="flex justify-end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onApply(recommendation)}
                            className="text-xs"
                          >
                            Apply This Recommendation
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Automatically adjust your budget based on this suggestion</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BudgetRecommendations; 