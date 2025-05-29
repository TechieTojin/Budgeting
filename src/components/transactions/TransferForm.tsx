import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowRightLeft, RefreshCw, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock account data - in a real app, this would come from the user's accounts
const mockAccounts = [
  { id: "acc1", name: "Savings Account", balance: 24500, currency: "INR" },
  { id: "acc2", name: "Checking Account", balance: 9800, currency: "INR" },
  { id: "acc3", name: "Investment Account", balance: 36500, currency: "INR" },
  { id: "acc4", name: "USD Account", balance: 2000, currency: "USD" },
  { id: "acc5", name: "EUR Account", balance: 1500, currency: "EUR" },
];

// Mock exchange rates - in a real app, this would come from an API
const mockExchangeRates = {
  "INR": { "USD": 0.012, "EUR": 0.011, "INR": 1 },
  "USD": { "INR": 83.12, "EUR": 0.92, "USD": 1 },
  "EUR": { "INR": 90.25, "USD": 1.09, "EUR": 1 },
};

interface TransferFormProps {
  onSubmit: (transferData: TransferData) => void;
  onCancel: () => void;
}

export interface TransferData {
  fromAccount: string;
  toAccount: string;
  amount: number;
  convertedAmount?: number;
  exchangeRate?: number;
  date: Date;
  tags?: string[];
  notes?: string;
  fees?: number;
}

export function TransferForm({ onSubmit, onCancel }: TransferFormProps) {
  const [accounts] = useState(mockAccounts);
  const [formData, setFormData] = useState<TransferData>({
    fromAccount: "",
    toAccount: "",
    amount: 0,
    date: new Date(),
  });
  const [tag, setTag] = useState("");
  const [hasFees, setHasFees] = useState(false);

  // Get from and to account objects
  const fromAccount = accounts.find(acc => acc.id === formData.fromAccount);
  const toAccount = accounts.find(acc => acc.id === formData.toAccount);
  
  // Check if currencies are different
  const isDifferentCurrency = fromAccount?.currency !== toAccount?.currency;

  // Calculate converted amount when currencies or amount changes
  useEffect(() => {
    if (isDifferentCurrency && fromAccount && toAccount) {
      const rate = mockExchangeRates[fromAccount.currency][toAccount.currency];
      const converted = formData.amount * rate;
      
      setFormData(prev => ({
        ...prev,
        convertedAmount: converted,
        exchangeRate: rate,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        convertedAmount: undefined,
        exchangeRate: undefined,
      }));
    }
  }, [formData.fromAccount, formData.toAccount, formData.amount, isDifferentCurrency, fromAccount, toAccount]);

  const handleChange = (field: keyof TransferData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const addTag = () => {
    if (tag.trim()) {
      const currentTags = formData.tags || [];
      if (!currentTags.includes(tag.trim())) {
        setFormData({
          ...formData,
          tags: [...currentTags, tag.trim()],
        });
      }
      setTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (formData.tags) {
      setFormData({
        ...formData,
        tags: formData.tags.filter(t => t !== tagToRemove),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fromAccount">From Account</Label>
          <Select
            value={formData.fromAccount}
            onValueChange={(value) => handleChange("fromAccount", value)}
          >
            <SelectTrigger id="fromAccount">
              <SelectValue placeholder="Select source account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex justify-between items-center w-full">
                    <span>{account.name}</span>
                    <span className="text-muted-foreground">
                      {account.currency === "INR" ? "₹" : account.currency === "USD" ? "$" : "€"}
                      {account.balance.toLocaleString()}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toAccount">To Account</Label>
          <Select
            value={formData.toAccount}
            onValueChange={(value) => handleChange("toAccount", value)}
          >
            <SelectTrigger id="toAccount">
              <SelectValue placeholder="Select destination account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem 
                  key={account.id} 
                  value={account.id}
                  disabled={account.id === formData.fromAccount}
                >
                  <div className="flex justify-between items-center w-full">
                    <span>{account.name}</span>
                    <span className="text-muted-foreground">
                      {account.currency === "INR" ? "₹" : account.currency === "USD" ? "$" : "€"}
                      {account.balance.toLocaleString()}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {fromAccount?.currency === "INR" ? "₹" : fromAccount?.currency === "USD" ? "$" : "€"}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ""}
                onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                className="pl-7"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && handleChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {isDifferentCurrency && formData.exchangeRate && (
          <div className="rounded-lg border p-4 bg-muted/30">
            <div className="flex items-center gap-2 text-sm mb-2">
              <RefreshCw className="h-4 w-4" />
              <span className="font-medium">Currency Conversion</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>Exchange Rate:</span>
                <span>
                  1 {fromAccount?.currency} = {formData.exchangeRate.toFixed(4)} {toAccount?.currency}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Converted Amount:</span>
                <span>
                  {toAccount?.currency === "INR" ? "₹" : toAccount?.currency === "USD" ? "$" : "€"}
                  {formData.convertedAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fees">Transfer Fees</Label>
            <Switch
              id="hasFees"
              checked={hasFees}
              onCheckedChange={setHasFees}
            />
          </div>
          
          {hasFees && (
            <div className="pt-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {fromAccount?.currency === "INR" ? "₹" : fromAccount?.currency === "USD" ? "$" : "€"}
                </span>
                <Input
                  id="fees"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.fees || ""}
                  onChange={(e) => handleChange("fees", parseFloat(e.target.value))}
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags?.map((tagItem) => (
              <div key={tagItem} className="bg-secondary flex items-center gap-1 rounded-full px-3 py-1 text-sm">
                <span>{tagItem}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tagItem)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Add a tag (e.g., Savings, Investment)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="What is this transfer for?"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!formData.fromAccount || !formData.toAccount || !formData.amount}
        >
          <Banknote className="h-4 w-4 mr-2" />
          Complete Transfer
        </Button>
      </div>
    </form>
  );
}

export default TransferForm; 