import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Zap, Filter, History } from "lucide-react";
import { detectCategoryAdvanced } from "@/utils/advancedCategorization";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { getCategoryIcon } from "@/utils/transactionUtils";

interface RealTimeCategorizationProps {
  onCategorize?: (description: string, category: string, confidence: number) => void;
}

export function RealTimeCategorization({ onCategorize }: RealTimeCategorizationProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<{ category: string; confidence: number } | null>(null);
  const [recentSearches, setRecentSearches] = useState<{ description: string; category: string; confidence: number }[]>([]);
  
  const handleCategorize = () => {
    if (!description) return;
    
    const transaction = {
      id: "temp",
      description,
      amount: parseFloat(amount) || 0,
      date: new Date()
    };
    
    const categorization = detectCategoryAdvanced(transaction);
    setResult(categorization);
    
    // Add to recent searches
    setRecentSearches(prev => {
      const newSearches = [
        { description, category: categorization.category, confidence: categorization.confidence },
        ...prev
      ].slice(0, 5); // Keep only last 5 searches
      return newSearches;
    });
    
    if (onCategorize) {
      onCategorize(description, categorization.category, categorization.confidence);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCategorize();
    }
  };
  
  const handleClearResult = () => {
    setResult(null);
    setDescription("");
    setAmount("");
  };
  
  const handleUseRecentSearch = (item: { description: string; category: string; confidence: number }) => {
    setDescription(item.description);
    setResult({ category: item.category, confidence: item.confidence });
  };

  return (
    <Card className="border border-primary/10 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Real-Time Categorization
        </CardTitle>
        <CardDescription>
          Test our AI categorization engine in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="analyze">
          <TabsList className="mb-4">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyze" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter transaction description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mb-2"
                />
                <Input
                  placeholder="Amount (optional)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mb-2"
                />
                <Button onClick={handleCategorize} className="w-full">
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Categorize
                </Button>
              </div>
              
              {result && (
                <Card className="flex-1 p-4 border border-primary/10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">Result</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-[220px]">
                        {description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleClearResult}>
                      Clear
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {getCategoryIcon(result.category) && (
                        <span className="text-primary">
                          {/* Use any icon system you have */}
                          {getCategoryIcon(result.category)}
                        </span>
                      )}
                    </div>
                    <div>
                      <Badge className="capitalize mb-1">{result.category}</Badge>
                      <ConfidenceIndicator confidence={result.confidence} />
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>This categorization uses our advanced ML algorithm to analyze transaction descriptions and assign categories with confidence scores.</p>
                  </div>
                </Card>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground mt-4">
              <p className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Try descriptions like "Grocery store", "Uber ride", "Netflix", or "Rent payment"</span>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {recentSearches.length === 0 ? (
              <div className="text-center py-6">
                <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No recent searches</p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">Recent searches</h3>
                {recentSearches.map((search, index) => (
                  <div 
                    key={index}
                    className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleUseRecentSearch(search)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">{search.description}</p>
                      <Badge className="capitalize">{search.category}</Badge>
                    </div>
                    <ConfidenceIndicator confidence={search.confidence} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default RealTimeCategorization; 