import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  BarChart2, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";

interface PerformanceDataPoint {
  date: string;
  accuracy: number;
  confidence: number;
  acceptanceRate: number;
  rejectionRate: number;
}

interface CategoryAccuracy {
  category: string;
  accuracy: number;
  count: number;
}

interface ModelPerformanceChartProps {
  performanceHistory: PerformanceDataPoint[];
  categoryAccuracy: CategoryAccuracy[];
  currentAccuracy: number;
  isLoading?: boolean;
}

export function ModelPerformanceChart({
  performanceHistory,
  categoryAccuracy,
  currentAccuracy,
  isLoading = false
}: ModelPerformanceChartProps) {
  // Custom tooltip formatter for line chart
  const lineChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: entry.stroke }}
              />
              <span>{entry.name}:</span>
              <span className="font-medium">{entry.value.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip formatter for bar chart
  const barChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium capitalize mb-1">{label}</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Accuracy:</span>
            <span className="font-medium">{payload[0].value.toFixed(0)}%</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Based on {payload[0].payload.count} transactions
          </div>
        </div>
      );
    }
    return null;
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-40 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-60 rounded"></CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] animate-pulse bg-muted rounded-lg"></CardContent>
      </Card>
    );
  }

  // Render empty state
  if (!performanceHistory || performanceHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Model Performance
          </CardTitle>
          <CardDescription>
            AI categorization model performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No performance data available yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get performance badge color and label
  const getPerformanceBadge = (accuracy: number) => {
    if (accuracy >= 90) {
      return { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Excellent" };
    } else if (accuracy >= 80) {
      return { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", label: "Good" };
    } else if (accuracy >= 70) {
      return { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", label: "Average" };
    } else {
      return { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Needs Improvement" };
    }
  };
  
  const performanceBadge = getPerformanceBadge(currentAccuracy);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              AI Model Performance
            </CardTitle>
            <CardDescription>
              Tracking the accuracy of our AI categorization model
            </CardDescription>
          </div>
          <Badge variant="outline" className={performanceBadge.color}>
            {performanceBadge.label} ({currentAccuracy}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="trends">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="categories">
                <BarChart2 className="h-4 w-4 mr-2" />
                By Category
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="trends" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickMargin={10} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickMargin={10}
                  domain={[0, 100]}
                  label={{ 
                    value: "Percentage (%)", 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip content={lineChartTooltip} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name="Accuracy"
                  stroke="#3498db"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  name="Confidence"
                  stroke="#2ecc71"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="acceptanceRate"
                  name="Acceptance Rate"
                  stroke="#9b59b6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="categories" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryAccuracy.sort((a, b) => b.accuracy - a.accuracy)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  width={100} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <Tooltip content={barChartTooltip} />
                <Bar 
                  dataKey="accuracy" 
                  fill="#3498db" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  label={{ 
                    position: 'right', 
                    formatter: (value: number) => `${value}%`,
                    fontSize: 12
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 flex justify-around text-center text-sm">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">Accepted Suggestions</span>
            </div>
            <p className="text-muted-foreground">
              {performanceHistory[performanceHistory.length - 1].acceptanceRate}%
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="font-medium">Rejected Suggestions</span>
            </div>
            <p className="text-muted-foreground">
              {performanceHistory[performanceHistory.length - 1].rejectionRate}%
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <BrainCircuit className="h-4 w-4 text-primary" />
              <span className="font-medium">Average Confidence</span>
            </div>
            <p className="text-muted-foreground">
              {performanceHistory[performanceHistory.length - 1].confidence}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ModelPerformanceChart; 