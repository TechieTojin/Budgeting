
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Insight {
  id: string;
  title: string;
  description: string;
  type: "positive" | "negative" | "neutral";
}

interface SmartInsightsCardProps {
  insights: Insight[];
}

export const SmartInsightsCard: React.FC<SmartInsightsCardProps> = ({
  insights,
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "negative":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
    }
  };

  const getInsightClass = (type: string) => {
    switch (type) {
      case "positive":
        return "border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20";
      case "negative":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20";
      default:
        return "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20";
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-budget-amber" />
            Smart Insights
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={cn(
                "p-3 rounded-md",
                getInsightClass(insight.type)
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
