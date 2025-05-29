import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChartIcon } from "lucide-react";

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
  amount?: number;
}

interface CategoryDistributionChartProps {
  data: CategoryData[];
  title?: string;
  description?: string;
  valueType?: "count" | "amount" | "percentage";
  isLoading?: boolean;
}

export function CategoryDistributionChart({
  data,
  title = "Category Distribution",
  description = "How your transactions are distributed across categories",
  valueType = "percentage",
  isLoading = false
}: CategoryDistributionChartProps) {
  // Custom colors for the pie chart
  const COLORS = [
    "#3498db", // blue
    "#2ecc71", // green
    "#9b59b6", // purple
    "#e74c3c", // red
    "#f39c12", // orange
    "#1abc9c", // teal
    "#34495e", // dark blue
    "#16a085", // green blue
    "#d35400", // dark orange
    "#8e44ad", // violet
    "#27ae60", // dark green
    "#2980b9", // dark blue
    "#f1c40f", // yellow
  ];

  // Format data for the chart
  const chartData = data.map(item => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    value: valueType === "count" ? item.count : 
           valueType === "amount" ? (item.amount || 0) : 
           item.percentage
  }));

  // Custom tooltip formatter
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md p-2 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            {valueType === "percentage" ? `${data.value}%` :
             valueType === "amount" ? `$${data.value.toFixed(2)}` :
             `${data.value} transactions`}
          </p>
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
        <CardContent className="h-[300px] animate-pulse bg-muted rounded-lg"></CardContent>
      </Card>
    );
  }

  // Render empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default CategoryDistributionChart; 