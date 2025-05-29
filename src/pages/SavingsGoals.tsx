import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Star, 
  PiggyBank,
  Wallet,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  History,
  BarChart,
  Award,
  Trophy,
  Gift,
  Home,
  Briefcase,
  Plane,
  Zap,
  Circle,
  Hourglass,
  Clock,
  ChevronUp,
  ChevronDown,
  Info,
  ArrowRight,
  Calculator
} from "lucide-react";
import { toast } from "sonner";
import { format, addMonths, differenceInDays, differenceInMonths, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority?: "high" | "medium" | "low";
  createdAt: string;
  icon?: string;
  contributions?: Contribution[];
  notes?: string;
  color?: string;
  reminderFrequency?: "daily" | "weekly" | "monthly" | "none";
  isAutoContribute?: boolean;
  autoContributeAmount?: number;
  linkedAccount?: string;
}

interface Contribution {
  id: string;
  amount: number;
  date: string;
  notes?: string;
}

interface SavingsCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface MilestoneReward {
  percentage: number;
  name: string;
  description: string;
  isRedeemed: boolean;
}

const CATEGORIES: SavingsCategory[] = [
  { id: "emergency", name: "Emergency Fund", icon: <AlertCircle />, color: "#ef4444" },
  { id: "travel", name: "Travel", icon: <Plane />, color: "#3b82f6" },
  { id: "home", name: "Home", icon: <Home />, color: "#8b5cf6" },
  { id: "tech", name: "Technology", icon: <Zap />, color: "#10b981" },
  { id: "education", name: "Education", icon: <Briefcase />, color: "#f59e0b" },
  { id: "gift", name: "Gift", icon: <Gift />, color: "#ec4899" },
  { id: "retirement", name: "Retirement", icon: <PiggyBank />, color: "#6366f1" },
  { id: "other", name: "Other", icon: <Circle />, color: "#6b7280" },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const SavingsGoals = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("current");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("progress");
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [savingsCalculator, setSavingsCalculator] = useState({
    targetAmount: '',
    initialDeposit: '',
    monthlyContribution: '',
    timeframe: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  
  // Sample milestone rewards
  const milestoneRewards: Record<string, MilestoneReward[]> = {
    "1": [
      { percentage: 25, name: "Starter", description: "You're on your way! Keep going!", isRedeemed: true },
      { percentage: 50, name: "Halfway Hero", description: "You've reached the halfway point!", isRedeemed: false },
      { percentage: 75, name: "Almost There", description: "The finish line is in sight!", isRedeemed: false },
      { percentage: 100, name: "Goal Crusher", description: "You did it! Goal achieved!", isRedeemed: false },
    ],
    "2": [
      { percentage: 25, name: "Beach Ready", description: "Starting to save for your vacation!", isRedeemed: true },
      { percentage: 50, name: "Flight Booked", description: "Halfway to paradise!", isRedeemed: true },
      { percentage: 75, name: "Adventure Awaits", description: "Almost ready for your trip!", isRedeemed: false },
      { percentage: 100, name: "Bon Voyage", description: "Your dream vacation is fully funded!", isRedeemed: false },
    ],
    "3": [
      { percentage: 25, name: "Tech Saver", description: "You're on your way to a new device!", isRedeemed: true },
      { percentage: 50, name: "Halfway Upgrade", description: "Keep saving for your tech!", isRedeemed: false },
      { percentage: 75, name: "Tech Within Reach", description: "Almost there!", isRedeemed: false },
      { percentage: 100, name: "Upgrade Complete", description: "Your new device is funded!", isRedeemed: false },
    ],
  };

  const [newGoal, setNewGoal] = useState<Partial<SavingsGoal>>({
    title: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
    category: 'other',
    priority: 'medium',
    icon: 'PiggyBank',
    notes: '',
    reminderFrequency: 'none',
    isAutoContribute: false,
    autoContributeAmount: 0,
  });

  // Enhanced sample data
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 3500,
      deadline: '2024-12-31',
      category: 'emergency',
      priority: 'high',
      createdAt: '2024-01-15',
      icon: 'AlertCircle',
      contributions: [
        { id: 'c1', amount: 1000, date: '2024-01-15', notes: 'Initial deposit' },
        { id: 'c2', amount: 1000, date: '2024-02-15', notes: 'Monthly contribution' },
        { id: 'c3', amount: 1000, date: '2024-03-15', notes: 'Monthly contribution' },
        { id: 'c4', amount: 500, date: '2024-04-15', notes: 'Bonus' },
      ],
      notes: 'Building a 3-month emergency fund for unexpected expenses',
      color: '#ef4444',
      reminderFrequency: 'monthly',
      isAutoContribute: true,
      autoContributeAmount: 1000,
      linkedAccount: 'Main Checking',
    },
    {
      id: '2',
      title: 'Vacation to Bali',
      targetAmount: 5000,
      currentAmount: 2000,
      deadline: '2024-08-15',
      category: 'travel',
      priority: 'medium',
      createdAt: '2024-02-01',
      icon: 'Plane',
      contributions: [
        { id: 'c5', amount: 500, date: '2024-02-01', notes: 'Initial deposit' },
        { id: 'c6', amount: 500, date: '2024-03-01', notes: 'Monthly contribution' },
        { id: 'c7', amount: 500, date: '2024-04-01', notes: 'Monthly contribution' },
        { id: 'c8', amount: 500, date: '2024-05-01', notes: 'Monthly contribution' },
      ],
      notes: 'Dream vacation to Bali for 10 days in September',
      color: '#3b82f6',
      reminderFrequency: 'weekly',
      isAutoContribute: true,
      autoContributeAmount: 500,
      linkedAccount: 'Savings Account',
    },
    {
      id: '3',
      title: 'New Laptop',
      targetAmount: 1500,
      currentAmount: 750,
      deadline: '2024-06-30',
      category: 'tech',
      priority: 'low',
      createdAt: '2024-03-10',
      icon: 'Zap',
      contributions: [
        { id: 'c9', amount: 250, date: '2024-03-10', notes: 'Initial deposit' },
        { id: 'c10', amount: 250, date: '2024-04-10', notes: 'Monthly contribution' },
        { id: 'c11', amount: 250, date: '2024-05-10', notes: 'Monthly contribution' },
      ],
      notes: 'Saving for a new MacBook Air',
      color: '#10b981',
      reminderFrequency: 'none',
      isAutoContribute: false,
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleAddGoal = () => {
    // Simple validation
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedCategory = CATEGORIES.find(cat => cat.id === newGoal.category);

    const goal: SavingsGoal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newGoal.title as string,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount || 0),
      deadline: newGoal.deadline as string,
      category: newGoal.category as string,
      priority: newGoal.priority as "high" | "medium" | "low",
      createdAt: new Date().toISOString().split('T')[0],
      icon: newGoal.icon,
      notes: newGoal.notes,
      color: selectedCategory?.color || "#6b7280",
      reminderFrequency: newGoal.reminderFrequency as "daily" | "weekly" | "monthly" | "none",
      isAutoContribute: newGoal.isAutoContribute,
      autoContributeAmount: Number(newGoal.autoContributeAmount || 0),
      contributions: newGoal.currentAmount && Number(newGoal.currentAmount) > 0
        ? [{ 
            id: Math.random().toString(36).substr(2, 9), 
            amount: Number(newGoal.currentAmount), 
            date: new Date().toISOString().split('T')[0],
            notes: 'Initial deposit'
          }]
        : []
    };

    setGoals([...goals, goal]);
    resetNewGoalForm();
    setIsAddingGoal(false);
    toast.success("Savings goal added successfully");
  };

  const resetNewGoalForm = () => {
    setNewGoal({
      title: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
      category: 'other',
      priority: 'medium',
      icon: 'PiggyBank',
      notes: '',
      reminderFrequency: 'none',
      isAutoContribute: false,
      autoContributeAmount: 0,
    });
  };

  const handleEditGoal = (id: string) => {
    const goalToEdit = goals.find(goal => goal.id === id);
    if (goalToEdit) {
      setNewGoal(goalToEdit);
      setEditingGoalId(id);
      setIsEditingGoal(true);
    }
  };

  const handleUpdateGoal = () => {
    if (!editingGoalId) return;
    
    // Simple validation
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedCategory = CATEGORIES.find(cat => cat.id === newGoal.category);

    setGoals(goals.map(goal => 
      goal.id === editingGoalId 
        ? {
            ...goal,
            title: newGoal.title as string,
            targetAmount: Number(newGoal.targetAmount),
            deadline: newGoal.deadline as string,
            category: newGoal.category as string,
            priority: newGoal.priority as "high" | "medium" | "low",
            icon: newGoal.icon,
            notes: newGoal.notes,
            color: selectedCategory?.color || "#6b7280",
            reminderFrequency: newGoal.reminderFrequency as "daily" | "weekly" | "monthly" | "none",
            isAutoContribute: newGoal.isAutoContribute,
            autoContributeAmount: Number(newGoal.autoContributeAmount || 0),
          }
        : goal
    ));
    
    resetNewGoalForm();
    setIsEditingGoal(false);
    setEditingGoalId(null);
    toast.success("Savings goal updated successfully");
  };

  const handleDeleteGoal = (id: string) => {
    setGoalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      setGoals(goals.filter(goal => goal.id !== goalToDelete));
      setDeleteDialogOpen(false);
      setGoalToDelete(null);
      toast.success("Savings goal deleted");
    }
  };

  const handleDeposit = () => {
    if (!depositAmount || !selectedGoalId) {
      toast.error("Please enter a valid amount");
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const newContribution = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };

    setGoals(
      goals.map(goal => 
        goal.id === selectedGoalId 
          ? { 
              ...goal, 
              currentAmount: goal.currentAmount + amount,
              contributions: [...(goal.contributions || []), newContribution]
            } 
          : goal
      )
    );
    
    // Check if any milestones have been reached with this deposit
    const updatedGoal = goals.find(goal => goal.id === selectedGoalId);
    if (updatedGoal) {
      const progress = (updatedGoal.currentAmount + amount) / updatedGoal.targetAmount * 100;
      const goalMilestones = milestoneRewards[selectedGoalId];
      
      if (goalMilestones) {
        const reachedMilestone = goalMilestones.find(
          milestone => !milestone.isRedeemed && progress >= milestone.percentage
        );
        
        if (reachedMilestone) {
          setTimeout(() => {
            toast.success(`🎉 Milestone Reached: ${reachedMilestone.name}`, {
              description: reachedMilestone.description
            });
          }, 500);
        }
      }
    }
    
    setDepositAmount('');
    setSelectedGoalId(null);
    toast.success(`${formatCurrency(amount)} added to your savings goal`);
  };

  const calculateSavings = () => {
    const targetAmount = parseFloat(savingsCalculator.targetAmount);
    const initialDeposit = parseFloat(savingsCalculator.initialDeposit || '0');
    const monthlyContribution = parseFloat(savingsCalculator.monthlyContribution);
    const timeframeMonths = parseFloat(savingsCalculator.timeframe);
    
    if (isNaN(targetAmount) || isNaN(monthlyContribution) || (isNaN(timeframeMonths) && savingsCalculator.timeframe)) {
      toast.error("Please enter valid numbers");
      return;
    }
    
    if (savingsCalculator.targetAmount && savingsCalculator.monthlyContribution && !savingsCalculator.timeframe) {
      // Calculate time needed
      const remainingAmount = targetAmount - initialDeposit;
      const monthsNeeded = Math.ceil(remainingAmount / monthlyContribution);
      
      toast.success(`To reach your goal of ${formatCurrency(targetAmount)}, it will take approximately ${monthsNeeded} months with a monthly contribution of ${formatCurrency(monthlyContribution)}.`);
    } else if (savingsCalculator.targetAmount && savingsCalculator.timeframe && !savingsCalculator.monthlyContribution) {
      // Calculate monthly contribution needed
      const remainingAmount = targetAmount - initialDeposit;
      const monthlyNeeded = remainingAmount / timeframeMonths;
      
      toast.success(`To reach your goal of ${formatCurrency(targetAmount)} in ${timeframeMonths} months, you need to save ${formatCurrency(monthlyNeeded)} per month.`);
    } else {
      toast.error("Please provide either timeframe or monthly contribution (but not both)");
    }
  };

  // Calculate days remaining for a goal
  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  };

  // Calculate monthly contribution needed
  const getRequiredMonthlyContribution = (goal: SavingsGoal): number => {
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const deadlineDate = new Date(goal.deadline);
    const today = new Date();
    const monthsRemaining = differenceInMonths(deadlineDate, today);
    
    if (monthsRemaining <= 0) return remainingAmount;
    return remainingAmount / monthsRemaining;
  };

  // Get appropriate icon for a goal
  const getGoalIcon = (category: string) => {
    const foundCategory = CATEGORIES.find(cat => cat.id === category);
    return foundCategory?.icon || <PiggyBank className="h-5 w-5" />;
  };

  // Format priority for display
  const formatPriority = (priority?: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge className="bg-blue-500">Normal</Badge>;
    }
  };

  // Filter and sort goals
  const getFilteredAndSortedGoals = () => {
    let filteredGoals = goals;
    
    // Apply category filter
    if (filterCategory) {
      filteredGoals = filteredGoals.filter(goal => goal.category === filterCategory);
    }
    
    // Apply tab filter
    if (activeTab === "completed") {
      filteredGoals = filteredGoals.filter(goal => goal.currentAmount >= goal.targetAmount);
    } else if (activeTab === "current") {
      filteredGoals = filteredGoals.filter(goal => goal.currentAmount < goal.targetAmount);
    }
    
    // Apply sorting
    return filteredGoals.sort((a, b) => {
      const progressA = (a.currentAmount / a.targetAmount) * 100;
      const progressB = (b.currentAmount / b.targetAmount) * 100;
      
      switch (sortBy) {
        case "progress":
          return progressB - progressA;
        case "amount":
          return b.targetAmount - a.targetAmount;
        case "deadline":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <Button onClick={() => setIsAddingGoal(!isAddingGoal)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Goal
          </Button>
        </div>

        {isAddingGoal && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Savings Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Name</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={newGoal.title} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                  <Input 
                    id="targetAmount" 
                    name="targetAmount" 
                    type="number" 
                    value={newGoal.targetAmount} 
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input 
                    id="deadline" 
                    name="deadline" 
                    type="date" 
                    value={newGoal.deadline} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Input 
                    id="category" 
                    name="category" 
                    value={newGoal.category} 
                    onChange={handleInputChange}
                    placeholder="e.g., Travel, Home, Education"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-2">
                <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGoal}>
                  Save Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysRemaining = getDaysRemaining(goal.deadline);
            
            return (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{goal.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {goal.category}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{formatCurrency(goal.currentAmount)}</span>
                      <span className="text-muted-foreground">of {formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Target Date</p>
                      <p className="font-medium">{goal.deadline}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {daysRemaining} days remaining
                      </p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedGoalId(goal.id)}
                        >
                          Add Money
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add money to {goal.title}</DialogTitle>
                          <DialogDescription>
                            Enter the amount you want to add to your savings goal.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="deposit-amount">Amount (₹)</Label>
                            <Input
                              id="deposit-amount"
                              type="number"
                              placeholder="0.00"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleDeposit}>Add Funds</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {goals.length === 0 && (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No savings goals yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Create your first savings goal to start tracking your progress toward financial targets.
              </p>
              <Button onClick={() => setIsAddingGoal(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Goal
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="bg-primary-foreground/5 border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Tips for Successful Saving</h3>
              <p className="text-muted-foreground mb-4">
                Setting specific, measurable, and time-bound savings goals increases your chance of success. 
                Here are some tips to help you reach your financial targets faster.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 border rounded-lg p-3">
                  <h4 className="font-medium">Start Small</h4>
                  <p className="text-sm text-muted-foreground">
                    Begin with achievable goals to build momentum and confidence in your saving ability.
                  </p>
                </div>
                <div className="space-y-2 border rounded-lg p-3">
                  <h4 className="font-medium">Save Automatically</h4>
                  <p className="text-sm text-muted-foreground">
                    Set up automatic transfers to your savings account on payday.
                  </p>
                </div>
                <div className="space-y-2 border rounded-lg p-3">
                  <h4 className="font-medium">Celebrate Milestones</h4>
                  <p className="text-sm text-muted-foreground">
                    Reward yourself when you reach 25%, 50%, and 75% of your goal.
                  </p>
                </div>
                <div className="space-y-2 border rounded-lg p-3">
                  <h4 className="font-medium">Visualize Your Goal</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep a visual reminder of what you're saving for to stay motivated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SavingsGoals;
