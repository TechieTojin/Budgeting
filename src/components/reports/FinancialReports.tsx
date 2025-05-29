import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText,
  Download,
  Share2,
  Printer,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FinancialReportsProps {
  type: 'financial-health' | 'tax-optimization' | 'goals-tracker';
  data: any;
  onRefresh?: () => void;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({ type, data, onRefresh }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("summary");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: 'pdf' | 'csv' | 'excel') => {
    // Implement download functionality
    console.log(`Downloading ${format} report...`);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing report...');
  };

  const handlePrint = () => {
    // Implement print functionality
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {type === 'financial-health' ? 'Financial Health Report' :
             type === 'tax-optimization' ? 'Tax Optimization Report' :
             'Goals Progress Report'}
          </h2>
          <p className="text-muted-foreground">
            {type === 'financial-health' ? 'Comprehensive analysis of your financial health' :
             type === 'tax-optimization' ? 'Detailed tax optimization strategies and opportunities' :
             'Track and analyze your financial goals progress'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => handleDownload('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
              <CardDescription>
                {type === 'financial-health' ? 'Key financial health metrics and insights' :
                 type === 'tax-optimization' ? 'Tax optimization opportunities and recommendations' :
                 'Goals progress and achievements'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add summary content based on type */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Analysis</CardTitle>
              <CardDescription>
                Interactive charts and graphs for better understanding
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add charts content based on type */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>
                Comprehensive breakdown of all metrics and data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add detailed analysis content based on type */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Data</CardTitle>
              <CardDescription>
                Track changes and progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add historical data content based on type */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 