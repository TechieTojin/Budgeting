import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  title: string;
  amount: number;
  percentageChange: number;
  type: "income" | "expense" | "balance" | "savings";
  icon?: React.ReactNode;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  percentageChange,
  type,
  icon = <DollarSign className="h-5 w-5" />,
}) => {
  const isPositiveChange = percentageChange >= 0;
  
  const getBackgroundColor = () => {
    switch (type) {
      case "income":
        return "bg-gradient-to-br from-green-500/20 to-green-600/20 dark:from-green-500/10 dark:to-green-600/10";
      case "expense":
        return "bg-gradient-to-br from-red-500/20 to-red-600/20 dark:from-red-500/10 dark:to-red-600/10";
      case "savings":
        return "bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-500/10 dark:to-blue-600/10";
      default:
        return "bg-gradient-to-br from-budget-teal/20 to-budget-teal2/20 dark:from-budget-teal/10 dark:to-budget-teal2/10";
    }
  };
  
  const getIconColor = () => {
    switch (type) {
      case "income":
        return "bg-green-500 text-white";
      case "expense":
        return "bg-red-500 text-white";
      case "savings":
        return "bg-blue-500 text-white";
      default:
        return "bg-budget-teal text-white";
    }
  };

  return (
    <Card className={cn("card-hover", getBackgroundColor())}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <div className={cn("p-2 rounded-full", getIconColor())}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ₹{amount.toLocaleString()}
        </div>
        <div className="flex items-center mt-2 text-sm">
          {isPositiveChange ? (
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span
            className={cn(
              isPositiveChange ? "text-green-500" : "text-red-500",
              "font-medium"
            )}
          >
            {isPositiveChange ? "+" : ""}
            {percentageChange}%
          </span>
          <span className="text-muted-foreground ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};
