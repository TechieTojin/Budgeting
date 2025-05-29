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
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrendDataPoint {
  date: string;
  value: number;
  category?: string;
}

interface CategoryTrend {
  category: string;
  data: TrendDataPoint[];
  color: string;
}

interface TrendAnalysisChartProps {
  trends: CategoryTrend[];
  title?: string;
  description?: string;
  period?: "weekly" | "monthly" | "yearly";
  valueType?: "count" | "amount";
  isLoading?: boolean;
}

export function TrendAnalysisChart({
  trends,
  title = "Categorization Trends",
  description = "How your transaction categorization has evolved over time",
  period = "monthly",
  valueType = "count",
  isLoading = false
}: TrendAnalysisChartProps) {
  // Format data for multi-line chart
  const formatMultiLineData = () => {
    // Get all unique dates from all trends
    const allDates = new Set<string>();
    trends.forEach(trend => {
      trend.data.forEach(point => {
        allDates.add(point.date);
      });
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // Create data points for each date with all categories
    return sortedDates.map(date => {
      const dataPoint: any = { date };
      
      // Add value for each category
      trends.forEach(trend => {
        const point = trend.data.find(p => p.date === date);
        dataPoint[trend.category] = point ? point.value : 0;
      });
      
      return dataPoint;
    });
  };

  // Format data for stacked area chart
  const multiLineData = formatMultiLineData();

  // Custom tooltip formatter
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">{entry.name}:</span>
              <span className="font-medium">
                {valueType === "amount" ? `$${entry.value.toFixed(2)}` : entry.value}
              </span>
            </div>
          ))}
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
  if (!trends || trends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Not enough historical data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="line" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={multiLineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickMargin={10} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickMargin={10}
                  label={{ 
                    value: valueType === "amount" ? "Amount ($)" : "Count", 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip content={customTooltip} />
                <Legend />
                {trends.map((trend, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={trend.category}
                    name={trend.category.charAt(0).toUpperCase() + trend.category.slice(1)}
                    stroke={trend.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="area" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={multiLineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickMargin={10} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickMargin={10}
                  label={{ 
                    value: valueType === "amount" ? "Amount ($)" : "Count", 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip content={customTooltip} />
                <Legend />
                {trends.map((trend, index) => (
                  <Area
                    key={index}
                    type="monotone"
                    dataKey={trend.category}
                    name={trend.category.charAt(0).toUpperCase() + trend.category.slice(1)}
                    fill={trend.color}
                    stroke={trend.color}
                    fillOpacity={0.6}
                    stackId="1"
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default TrendAnalysisChart; 