import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  PieChart, 
  CheckCircle, 
  AlertCircle, 
  BrainCircuit, 
  Sparkles,
  RefreshCcw,
  LucideIcon
} from "lucide-react";

interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
  aiAccuracy?: number;
}

interface CategorizationStatsProps {
  stats: {
    total: number;
    categorized: number;
    uncategorized: number;
    aiCategorized: number;
    manualCategorized: number;
    categoriesByCount: CategoryStat[];
    aiAccuracy: number;
  };
  isLoading?: boolean;
}

export function CategorizationStats({ 
  stats, 
  isLoading = false 
}: CategorizationStatsProps) {
  // Function to get color based on percentage
  const getColorClass = (percentage: number): string => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-red-500";
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-40 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-60 rounded"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-muted h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="animate-pulse bg-muted h-40 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate categorization rate
  const categorizationRate = stats.total > 0 
    ? Math.round((stats.categorized / stats.total) * 100) 
    : 0;
  
  // Calculate AI categorization rate
  const aiRate = stats.categorized > 0 
    ? Math.round((stats.aiCategorized / stats.categorized) * 100) 
    : 0;
  
  // Calculate manual categorization rate
  const manualRate = stats.categorized > 0 
    ? Math.round((stats.manualCategorized / stats.categorized) * 100) 
    : 0;

  return (
    <Card className="border border-primary/10 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Categorization Statistics
        </CardTitle>
        <CardDescription>
          Analytics about your transaction categorization performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Transactions" 
            value={stats.total} 
            icon={PieChart}
          />
          <StatCard 
            title="Categorized" 
            value={stats.categorized} 
            percentage={categorizationRate}
            icon={CheckCircle}
            colorClass={getColorClass(categorizationRate)}
          />
          <StatCard 
            title="AI Categorized" 
            value={stats.aiCategorized} 
            percentage={aiRate}
            icon={BrainCircuit}
            colorClass="bg-purple-500"
          />
          <StatCard 
            title="Manual Categorized" 
            value={stats.manualCategorized} 
            percentage={manualRate}
            icon={Sparkles}
            colorClass="bg-blue-500"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">AI Accuracy</h3>
            <Badge 
              variant="outline" 
              className={stats.aiAccuracy >= 90 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                : stats.aiAccuracy >= 70 
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              }
            >
              {stats.aiAccuracy}% Accuracy
            </Badge>
          </div>
          <Progress 
            value={stats.aiAccuracy} 
            className={getColorClass(stats.aiAccuracy)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Based on accepted AI categorization suggestions
          </p>
        </div>
        
        <Tabs defaultValue="categories">
          <TabsList className="mb-4">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="accuracy">AI Accuracy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Top Categories</h3>
              
              {stats.categoriesByCount.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No categorized transactions yet
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.categoriesByCount.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm capitalize">{category.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {category.count} ({category.percentage}%)
                        </span>
                      </div>
                      <Progress 
                        value={category.percentage} 
                        className={`h-2 ${index === 0 
                          ? "bg-green-500" 
                          : index === 1 
                          ? "bg-blue-500" 
                          : index === 2 
                          ? "bg-purple-500" 
                          : "bg-amber-500"}`}
                      />
                      {category.aiAccuracy !== undefined && (
                        <div className="flex justify-end">
                          <span className="text-xs text-muted-foreground">
                            AI accuracy: {category.aiAccuracy}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="accuracy">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">AI Categorization Performance</h3>
                <RefreshCcw className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <span className="font-medium">ML Model Performance</span>
                  </div>
                  <Badge 
                    variant={stats.aiAccuracy >= 85 ? "default" : "outline"}
                    className={stats.aiAccuracy >= 85 ? "" : ""}
                  >
                    {stats.aiAccuracy >= 85 ? "Good" : "Needs Training"}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Accepted suggestions</span>
                    <span>{stats.aiCategorized} transactions</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rejected suggestions</span>
                    <span>{stats.manualCategorized} transactions</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Overall accuracy</span>
                    <span className="font-medium">{stats.aiAccuracy}%</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  AI accuracy improves as you approve or correct more categorization suggestions.
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper component for stat cards
interface StatCardProps {
  title: string;
  value: number;
  percentage?: number;
  icon: LucideIcon;
  colorClass?: string;
}

function StatCard({ title, value, percentage, icon: Icon, colorClass = "bg-primary" }: StatCardProps) {
  return (
    <div className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        {percentage !== undefined && (
          <div className="flex flex-col items-end">
            <Progress value={percentage} className={`w-12 h-1.5 ${colorClass}`} />
            <span className="text-xs text-muted-foreground mt-1">{percentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategorizationStats; 