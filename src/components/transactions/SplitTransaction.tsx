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
import { X, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplitTransactionProps {
  totalAmount: number;
  onSplit: (splits: SplitPart[]) => void;
  onCancel: () => void;
}

export interface SplitPart {
  id: string;
  amount: number;
  percentage: number;
  category: string;
  description: string;
  participant?: string;
}

export function SplitTransaction({ totalAmount, onSplit, onCancel }: SplitTransactionProps) {
  const [splitType, setSplitType] = useState<"amount" | "percentage">("amount");
  const [splits, setSplits] = useState<SplitPart[]>([
    {
      id: "split-1",
      amount: totalAmount,
      percentage: 100,
      category: "",
      description: "",
    }
  ]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");

  // Calculate remaining amount or percentage
  const calculatedTotal = splitType === "amount" 
    ? splits.reduce((acc, split) => acc + (Number(split.amount) || 0), 0)
    : splits.reduce((acc, split) => acc + (Number(split.percentage) || 0), 0);
  
  const remaining = splitType === "amount" 
    ? totalAmount - calculatedTotal 
    : 100 - calculatedTotal;

  // Add a new split part
  const addSplit = () => {
    const newAmount = remaining > 0 ? remaining : 0;
    const newPercentage = remaining > 0 ? remaining : 0;
    
    setSplits([
      ...splits,
      {
        id: `split-${splits.length + 1}`,
        amount: newAmount,
        percentage: newPercentage,
        category: "",
        description: "",
      }
    ]);
  };

  // Remove a split part
  const removeSplit = (id: string) => {
    if (splits.length === 1) return;
    setSplits(splits.filter(split => split.id !== id));
  };

  // Handle change in split amount/percentage
  const handleSplitChange = (id: string, field: keyof SplitPart, value: any) => {
    setSplits(splits.map(split => {
      if (split.id === id) {
        const updatedSplit = { ...split, [field]: value };
        
        // If changing amount, update percentage and vice versa
        if (field === "amount" && totalAmount > 0) {
          updatedSplit.percentage = (Number(value) / totalAmount) * 100;
        } else if (field === "percentage") {
          updatedSplit.amount = (Number(value) / 100) * totalAmount;
        }
        
        return updatedSplit;
      }
      return split;
    }));
  };

  // Add a new participant
  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  // Remove a participant
  const removeParticipant = (name: string) => {
    setParticipants(participants.filter(p => p !== name));
    // Also remove this participant from any splits
    setSplits(splits.map(split => 
      split.participant === name ? { ...split, participant: undefined } : split
    ));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSplit(splits);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Split Type</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={splitType === "amount" ? "default" : "outline"}
            onClick={() => setSplitType("amount")}
            className="flex-1"
          >
            By Amount
          </Button>
          <Button
            type="button"
            variant={splitType === "percentage" ? "default" : "outline"}
            onClick={() => setSplitType("percentage")}
            className="flex-1"
          >
            By Percentage
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Participants</Label>
          <div className="text-sm text-muted-foreground">
            {participants.length} people
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {participants.map(name => (
            <div key={name} className="bg-secondary flex items-center gap-1 rounded-full px-3 py-1 text-sm">
              <span>{name}</span>
              <button
                type="button"
                onClick={() => removeParticipant(name)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            placeholder="Add participant"
            className="flex-1"
          />
          <Button type="button" size="icon" onClick={addParticipant}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Split Parts</Label>
          <div className="text-sm">
            {splitType === "amount" ? (
              <span className={cn(Math.abs(remaining) < 0.01 ? "text-green-600" : "text-amber-600")}>
                {remaining < 0 ? "Over by " : remaining > 0 ? "Remaining: " : "Balanced "}
                {Math.abs(remaining).toFixed(2)}
              </span>
            ) : (
              <span className={cn(Math.abs(remaining) < 0.01 ? "text-green-600" : "text-amber-600")}>
                {remaining < 0 ? "Over by " : remaining > 0 ? "Remaining: " : "Balanced "}
                {Math.abs(remaining).toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        {splits.map((split, index) => (
          <div key={split.id} className="grid gap-3 p-3 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Part {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeSplit(split.id)}
                disabled={splits.length === 1}
                className="text-muted-foreground hover:text-destructive disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`split-${split.id}-${splitType}`}>
                  {splitType === "amount" ? "Amount" : "Percentage"}
                </Label>
                <div className="relative">
                  {splitType === "amount" && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  )}
                  <Input
                    id={`split-${split.id}-${splitType}`}
                    type="number"
                    value={splitType === "amount" ? split.amount : split.percentage}
                    onChange={(e) => handleSplitChange(
                      split.id, 
                      splitType === "amount" ? "amount" : "percentage", 
                      Number(e.target.value)
                    )}
                    className={splitType === "amount" ? "pl-7" : ""}
                    step={splitType === "amount" ? "0.01" : "1"}
                    min="0"
                    max={splitType === "amount" ? totalAmount : "100"}
                  />
                  {splitType === "percentage" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`split-${split.id}-category`}>Category</Label>
                <Select
                  value={split.category}
                  onValueChange={(value) => handleSplitChange(split.id, "category", value)}
                >
                  <SelectTrigger id={`split-${split.id}-category`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`split-${split.id}-description`}>Description</Label>
                <Input
                  id={`split-${split.id}-description`}
                  value={split.description}
                  onChange={(e) => handleSplitChange(split.id, "description", e.target.value)}
                  placeholder="What is this part for?"
                />
              </div>

              {participants.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor={`split-${split.id}-participant`}>Assigned to</Label>
                  <Select
                    value={split.participant}
                    onValueChange={(value) => handleSplitChange(split.id, "participant", value)}
                  >
                    <SelectTrigger id={`split-${split.id}-participant`}>
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent>
                      {participants.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addSplit}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Another Part
        </Button>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={Math.abs(remaining) > 0.01 || splits.some(s => !s.category)}
        >
          <Users className="h-4 w-4 mr-2" />
          Save Split Transaction
        </Button>
      </div>
    </form>
  );
}

export default SplitTransaction; 