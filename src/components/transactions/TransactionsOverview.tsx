import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  Clock, 
  ListFilter,
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import { getCategoryIcon } from "@/utils/transactionUtils";

export interface Transaction {
  id: string | number;
  name: string;
  description?: string;
  amount: number;
  date: string | Date;
  category?: string;
  confidence?: number;
  type?: "income" | "expense";
}

interface TransactionsOverviewProps {
  transactions: Transaction[];
  onViewAll: () => void;
  onViewTransaction?: (id: string | number) => void;
  maxItems?: number;
  isLoading?: boolean;
}

export function TransactionsOverview({
  transactions,
  onViewAll,
  onViewTransaction,
  maxItems = 10,
  isLoading = false
}: TransactionsOverviewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "recent" | "uncategorized">("recent");
  
  // Compute some statistics
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "expense" || !t.type)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const uncategorizedCount = transactions
    .filter(t => !t.category)
    .length;
    
  // Format transactions based on active tab
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    switch (activeTab) {
      case "recent":
        // Sort by date, newest first
        filtered = filtered.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "uncategorized":
        filtered = filtered.filter(t => !t.category);
        break;
      default:
        // Sort by date, newest first
        filtered = filtered.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
    
    return filtered.slice(0, maxItems);
  };
  
  // Format date in a readable way
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-40 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-60 rounded"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-2">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
              <div className="h-6 w-16 bg-muted rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Render empty state
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>You have no transactions recorded yet</CardDescription>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <Clock className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No transaction history available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Transactions Overview</CardTitle>
            <CardDescription>Your recent financial activity</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">${totalIncome.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">${totalExpenses.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mt-2">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="recent">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="all">
              <ListFilter className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger value="uncategorized">
              <Filter className="h-4 w-4 mr-2" />
              Uncategorized {uncategorizedCount > 0 && `(${uncategorizedCount})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-1">
            {getFilteredTransactions().map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onViewTransaction && onViewTransaction(transaction.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {transaction.category && getCategoryIcon(transaction.category)}
                  </div>
                  
                  <div>
                    <div className="font-medium line-clamp-1">{transaction.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(transaction.date)}</span>
                      
                      {transaction.category && (
                        <Badge variant="outline" className="capitalize ml-1">
                          {transaction.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className={`font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </span>
                  
                  {transaction.confidence !== undefined && (
                    <ConfidenceIndicator 
                      confidence={transaction.confidence} 
                      size="sm" 
                      showLabel={false} 
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="w-full" onClick={onViewAll}>
          View All Transactions
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TransactionsOverview; 