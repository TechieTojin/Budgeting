import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BrainCircuit, 
  FileUp, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  FileText,
  Filter,
  Upload
} from "lucide-react";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { TransactionData, batchCategorize, validateCategories } from "@/utils/advancedCategorization";

interface BatchCategorizationProps {
  onCategorize?: (transactions: TransactionData[]) => void;
  isLoading?: boolean;
}

export function BatchCategorization({ 
  onCategorize,
  isLoading = false 
}: BatchCategorizationProps) {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [results, setResults] = useState<(TransactionData & { confidence: number })[]>([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [reliable, setReliable] = useState<(TransactionData & { confidence: number })[]>([]);
  const [uncertain, setUncertain] = useState<(TransactionData & { confidence: number })[]>([]);
  const [processed, setProcessed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Mock transaction data for now - in a real app, this would parse the file
      const mockTransactions: TransactionData[] = [
        { id: 1, description: "Amazon Prime", amount: 14.99, date: "2023-04-01" },
        { id: 2, description: "Uber ride", amount: 24.50, date: "2023-04-02" },
        { id: 3, description: "Grocery store", amount: 87.32, date: "2023-04-03" },
        { id: 4, description: "Gas station", amount: 45.00, date: "2023-04-05" },
        { id: 5, description: "Coffee shop", amount: 5.75, date: "2023-04-06" }
      ];
      setTransactions(mockTransactions);
      setProcessed(false);
      setResults([]);
      setReliable([]);
      setUncertain([]);
    }
  };

  // Handle file upload click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Process the transactions with AI categorization
  const handleProcessTransactions = () => {
    if (transactions.length === 0) return;
    
    // Use our batch categorization utility
    const categorizedTransactions = batchCategorize(transactions);
    setResults(categorizedTransactions);
    
    // Validate and separate reliable vs uncertain categorizations
    const { reliable: reliableTx, uncertain: uncertainTx } = validateCategories(
      categorizedTransactions,
      confidenceThreshold / 100 // Convert from percentage to decimal
    );
    
    setReliable(reliableTx);
    setUncertain(uncertainTx);
    setProcessed(true);
    
    if (onCategorize) {
      onCategorize(reliableTx);
    }
  };
  
  // Apply all categorizations regardless of confidence
  const handleApplyAll = () => {
    if (onCategorize) {
      onCategorize(results);
    }
  };
  
  // Apply only reliable categorizations
  const handleApplyReliable = () => {
    if (onCategorize) {
      onCategorize(reliable);
    }
  };

  // Reset the component state
  const handleReset = () => {
    setTransactions([]);
    setResults([]);
    setReliable([]);
    setUncertain([]);
    setProcessed(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Card className="border border-primary/10 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5 text-primary" />
          Batch Categorization
        </CardTitle>
        <CardDescription>
          Automatically categorize multiple transactions at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!selectedFile ? (
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-1">Upload Transactions</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Upload a CSV or Excel file with your transactions to categorize them automatically
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".csv,.xlsx,.xls"
              className="hidden"
            />
            <Button onClick={handleUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              Select File
            </Button>
          </div>
        ) : !processed ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium">{transactions.length} Transactions Ready</h3>
                <p className="text-sm text-muted-foreground">Set confidence threshold and process</p>
              </div>
              <Button onClick={handleProcessTransactions} disabled={isLoading}>
                <BrainCircuit className="mr-2 h-4 w-4" />
                {isLoading ? "Processing..." : "Process with AI"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Confidence Threshold: {confidenceThreshold}%</label>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Higher = fewer but more accurate results</span>
                </div>
              </div>
              <Slider
                value={[confidenceThreshold]}
                onValueChange={(values) => setConfidenceThreshold(values[0])}
                max={95}
                min={30}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low Threshold</span>
                <span>High Threshold</span>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.date.toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium">Categorization Results</h3>
                <p className="text-sm text-muted-foreground">
                  {reliable.length} reliable, {uncertain.length} need review
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleApplyReliable}>
                  <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                  Apply Reliable
                </Button>
                <Button variant="outline" size="sm" onClick={handleApplyAll}>
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Apply All
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="mr-1 h-4 w-4" />
                  Start Over
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                Showing transactions with confidence {confidenceThreshold}% or higher first
              </span>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reliable.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className="capitalize">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <ConfidenceIndicator confidence={transaction.confidence} size="sm" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm">Ready</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {uncertain.map((transaction) => (
                  <TableRow key={transaction.id} className="bg-amber-50/30 dark:bg-amber-900/10">
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <ConfidenceIndicator confidence={transaction.confidence} size="sm" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="text-sm">Needs review</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BatchCategorization; 