import React, { useState, useEffect, useRef } from "react";
import { Command } from "cmdk";
import { detectCategory, isLikelyIncome } from "@/utils/transactionUtils";
import { toast } from "sonner";
import { Search, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAddCommandProps {
  onAddTransaction: (transaction: {
    type: "expense" | "income";
    amount: number;
    category: string;
    description: string;
    date: Date;
  }) => void;
  recentTransactions?: {
    description: string;
    category: string;
    amount: number;
    type: "expense" | "income";
  }[];
  popularCategories?: {
    name: string;
    count: number;
  }[];
}

export function QuickAddCommand({
  onAddTransaction,
  recentTransactions = [],
  popularCategories = [],
}: QuickAddCommandProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ description: string; category: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when opened
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Helper functions for parsing input
  const parseQuickAddCommand = (input: string) => {
    // Format: /add 500 lunch food
    // or: /add 500 lunch
    // or: /income 1000 freelance
    
    const trimmedInput = input.trim();
    
    // Check if it's a proper command
    if (!trimmedInput.startsWith("/add") && !trimmedInput.startsWith("/income")) {
      return null;
    }
    
    const isIncome = trimmedInput.startsWith("/income");
    const parts = trimmedInput.split(" ").filter(Boolean);
    
    if (parts.length < 3) {
      return null;
    }
    
    const amount = parseFloat(parts[1]);
    if (isNaN(amount)) {
      return null;
    }
    
    const description = parts[2];
    // Category might be specified as the 4th part or detected from description
    let category = parts[3] || null;
    
    if (!category) {
      category = detectCategory(description) || (isIncome ? "income" : "other");
    }
    
    return {
      type: isIncome ? "income" : "expense" as "income" | "expense",
      amount,
      description,
      category,
      date: new Date(),
    };
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Generate suggestions based on input
    if (value.length > 2) {
      const filteredSuggestions = recentTransactions
        .filter(t => 
          t.description.toLowerCase().includes(value.toLowerCase()) ||
          t.category.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5)
        .map(t => ({ description: t.description, category: t.category }));
      
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = () => {
    // Check if it's a quick command format
    if (inputValue.startsWith("/")) {
      const parsedCommand = parseQuickAddCommand(inputValue);
      if (parsedCommand) {
        onAddTransaction(parsedCommand);
        setInputValue("");
        setOpen(false);
        toast.success(`${parsedCommand.type === "income" ? "Income" : "Expense"} added successfully`);
        return;
      }
    }
    
    // If not a command, try to parse as a natural language transaction
    try {
      // Check if it contains an amount
      const amountMatch = inputValue.match(/\d+(\.\d+)?/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[0]);
        
        // Clean up the description by removing the amount
        let description = inputValue.replace(amountMatch[0], "").trim();
        
        // Detect if it's likely income
        const type = isLikelyIncome(description) ? "income" : "expense";
        
        // Detect category from description
        const category = detectCategory(description) || (type === "income" ? "income" : "other");
        
        onAddTransaction({
          type,
          amount,
          description,
          category,
          date: new Date(),
        });
        
        setInputValue("");
        setOpen(false);
        toast.success(`Transaction added successfully`);
      } else {
        toast.error("Please include an amount in your transaction");
      }
    } catch (error) {
      toast.error("Could not parse your transaction. Try using the format: /add [amount] [description] [category]");
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="Add transaction... (e.g., /add 500 lunch food)"
          className="w-full pl-10 pr-16 py-2 rounded-md border border-input bg-transparent text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (inputValue.length > 0 || popularCategories.length > 0) && (
        <div className="absolute top-full mt-1 w-full z-50 rounded-md border bg-popover shadow-md">
          {inputValue.startsWith("/") && (
            <div className="p-2 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                <span>Quick Commands:</span>
              </div>
              <div className="mt-1 pl-5 text-xs space-y-1">
                <p><span className="font-mono font-medium">/add [amount] [description] [category?]</span> - Add expense</p>
                <p><span className="font-mono font-medium">/income [amount] [description] [category?]</span> - Add income</p>
              </div>
            </div>
          )}

          <div className="p-1 max-h-60 overflow-auto">
            {suggestions.length > 0 ? (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setInputValue(`/add 0 ${suggestion.description} ${suggestion.category}`);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    <div className="font-medium">{suggestion.description}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.category}</div>
                  </button>
                ))}
              </>
            ) : inputValue.length === 0 && popularCategories.length > 0 ? (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Popular Categories
                </div>
                <div className="grid grid-cols-2 gap-1 p-1">
                  {popularCategories.map((category, index) => (
                    <button
                      key={index}
                      className="text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setInputValue(`/add 0 New ${category.name}`);
                        if (inputRef.current) {
                          inputRef.current.focus();
                        }
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="px-2 py-1.5 text-sm text-center text-muted-foreground">
                {inputValue.length > 0
                  ? "No matching suggestions"
                  : "Type to search or use commands"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickAddCommand; 