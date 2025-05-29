import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { BrainCircuit, Plus, BarChart, ListFilter } from "lucide-react";

interface SuggestedRulesProps {
  rules: {
    keyword: string;
    category: string;
    occurrences: number;
  }[];
  onAddRule: (keyword: string, category: string) => void;
  isLoading?: boolean;
}

export function SuggestedRules({ 
  rules, 
  onAddRule,
  isLoading = false 
}: SuggestedRulesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          AI-Suggested Rules
        </CardTitle>
        <CardDescription>
          Rules automatically generated from your transaction patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ListFilter className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No suggestions yet</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              As you categorize more transactions, our AI will analyze patterns and suggest automatic categorization rules.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{rule.keyword}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {rule.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      <span>{rule.occurrences} transactions</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onAddRule(rule.keyword, rule.category)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Rule
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default SuggestedRules; 