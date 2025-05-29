import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Bell, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategorySelector } from "./CategorySelector";

interface RecurringTransactionFormProps {
  onSubmit: (transaction: RecurringTransactionData) => void;
  onCancel: () => void;
  initialData?: Partial<RecurringTransactionData>;
}

export interface RecurringTransactionData {
  title: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  description?: string;
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate?: Date | null;
  hasEndDate: boolean;
  dayOfMonth?: number | null;
  dayOfWeek?: number | null;
  reminderEnabled: boolean;
  reminderDays: number;
  notes?: string;
}

export function RecurringTransactionForm({
  onSubmit,
  onCancel,
  initialData = {},
}: RecurringTransactionFormProps) {
  const [formData, setFormData] = useState<RecurringTransactionData>({
    title: initialData.title || "",
    amount: initialData.amount || 0,
    type: initialData.type || "expense",
    category: initialData.category || "",
    description: initialData.description || "",
    frequency: initialData.frequency || "monthly",
    startDate: initialData.startDate || new Date(),
    endDate: initialData.endDate || null,
    hasEndDate: Boolean(initialData.endDate),
    dayOfMonth: initialData.dayOfMonth || null,
    dayOfWeek: initialData.dayOfWeek || null,
    reminderEnabled: initialData.reminderEnabled || true,
    reminderDays: initialData.reminderDays || 2,
    notes: initialData.notes || "",
  });

  const handleChange = (field: keyof RecurringTransactionData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only include endDate if hasEndDate is true
    const finalData = {
      ...formData,
      endDate: formData.hasEndDate ? formData.endDate : null,
    };
    
    onSubmit(finalData);
  };

  // Get the appropriate day selector based on frequency
  const renderDaySelector = () => {
    if (formData.frequency === "monthly" || formData.frequency === "quarterly" || formData.frequency === "yearly") {
      const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
      
      return (
        <div className="space-y-2">
          <Label htmlFor="dayOfMonth">Day of Month</Label>
          <Select
            value={formData.dayOfMonth?.toString() || ""}
            onValueChange={(value) => handleChange("dayOfMonth", parseInt(value))}
          >
            <SelectTrigger id="dayOfMonth">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {daysInMonth.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                  {day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"}
                </SelectItem>
              ))}
              <SelectItem value="last">Last day of month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    } else if (formData.frequency === "weekly" || formData.frequency === "biweekly") {
      const daysOfWeek = [
        { value: "0", label: "Sunday" },
        { value: "1", label: "Monday" },
        { value: "2", label: "Tuesday" },
        { value: "3", label: "Wednesday" },
        { value: "4", label: "Thursday" },
        { value: "5", label: "Friday" },
        { value: "6", label: "Saturday" },
      ];
      
      return (
        <div className="space-y-2">
          <Label htmlFor="dayOfWeek">Day of Week</Label>
          <Select
            value={formData.dayOfWeek?.toString() || ""}
            onValueChange={(value) => handleChange("dayOfWeek", parseInt(value))}
          >
            <SelectTrigger id="dayOfWeek">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g., Netflix Subscription"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Transaction Type</Label>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="expense"
                name="transaction-type"
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary-500"
                checked={formData.type === "expense"}
                onChange={() => handleChange("type", "expense")}
              />
              <Label htmlFor="expense" className="text-sm font-normal">Expense</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="income"
                name="transaction-type"
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary-500"
                checked={formData.type === "income"}
                onChange={() => handleChange("type", "income")}
              />
              <Label htmlFor="income" className="text-sm font-normal">Income</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value) => 
              handleChange("frequency", value as RecurringTransactionData["frequency"])
            }
          >
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Category</Label>
        <CategorySelector
          value={formData.category}
          onChange={(value) => handleChange("category", value)}
          type={formData.type}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => date && handleChange("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {renderDaySelector()}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasEndDate"
            checked={formData.hasEndDate}
            onCheckedChange={(checked) => handleChange("hasEndDate", Boolean(checked))}
          />
          <Label htmlFor="hasEndDate" className="text-sm font-normal">
            Set an end date
          </Label>
        </div>

        {formData.hasEndDate && (
          <div className="pt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? (
                    format(formData.endDate, "PPP")
                  ) : (
                    <span>Pick an end date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.endDate || undefined}
                  onSelect={(date) => handleChange("endDate", date)}
                  disabled={(date) => 
                    date < new Date() || 
                    (formData.startDate ? date < formData.startDate : false)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="reminderEnabled"
            checked={formData.reminderEnabled}
            onCheckedChange={(checked) => handleChange("reminderEnabled", Boolean(checked))}
          />
          <Label htmlFor="reminderEnabled" className="text-sm font-normal">
            Send me a reminder before the transaction
          </Label>
        </div>

        {formData.reminderEnabled && (
          <div className="pt-2 flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Remind me</span>
            <Select
              value={formData.reminderDays.toString()}
              onValueChange={(value) => handleChange("reminderDays", parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">on the day</SelectItem>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="2">2 days</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="5">5 days</SelectItem>
                <SelectItem value="7">1 week</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm">before</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Any notes about this recurring transaction"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <CalendarClock className="h-4 w-4 mr-2" />
          Save Recurring Transaction
        </Button>
      </div>
    </form>
  );
}

export default RecurringTransactionForm; 