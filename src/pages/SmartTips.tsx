import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb, 
  Bookmark, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Sparkles, 
  Search,
  Tag,
  TrendingUp,
  PiggyBank,
  CheckCircle,
  Filter,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight,
  Percent,
  DollarSign,
  CreditCard,
  BarChart,
  Link,
  ExternalLink,
  RefreshCcw,
  Gift,
  Heart,
  Award,
  Medal,
  Calendar,
  Share2,
  TrendingDown,
  BarChart3,
  ArrowUpDown,
  Trophy,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bestSmartTips } from "@/data/bestSmartTips";
import { tipTestimonials, Testimonial } from "@/data/tipTestimonials";
import { useNavigate } from "react-router-dom";

interface Tip {
  id: string;
  title: string;
  category: string;
  description: string;
  actionText?: string;
  actionUrl?: string;
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  relevance?: "High" | "Medium" | "Low";
  potentialSavings?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  timeToImplement?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
  tags?: string[];
  detailedSteps?: string[];
  implementationProgress?: number;
  estimatedSavings?: number;
  lastUpdated?: string;
  aiScore?: number;
  realTimeData?: {
    appliedByUsers: number;
    avgSavings: number;
    successRate: number;
  };
}

const SmartTips = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [showImplemented, setShowImplemented] = useState<boolean>(true);
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [tipImplementationProgress, setTipImplementationProgress] = useState<Record<string, number>>({});
  const [isLoadingTips, setIsLoadingTips] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeBestTipsTab, setActiveBestTipsTab] = useState<string>("all");
  const [selectedTipTestimonials, setSelectedTipTestimonials] = useState<Testimonial[]>([]);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState<boolean>(false);
  const [selectedTipForApply, setSelectedTipForApply] = useState<Tip | null>(null);
  
  // Add calculator states
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [calculatorTip, setCalculatorTip] = useState<Tip | null>(null);
  const [calculatorInput, setCalculatorInput] = useState<string>("");
  const [calculatorResult, setCalculatorResult] = useState<number | null>(null);
  
  const navigate = useNavigate();
  
  // Categories for filtering
  const categories = [
    { id: "budgeting", name: "Budgeting", icon: <BarChart className="h-4 w-4" /> },
    { id: "saving", name: "Saving", icon: <PiggyBank className="h-4 w-4" /> },
    { id: "spending", name: "Spending", icon: <CreditCard className="h-4 w-4" /> },
    { id: "debt", name: "Debt", icon: <DollarSign className="h-4 w-4" /> },
    { id: "investing", name: "Investing", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "subscriptions", name: "Subscriptions", icon: <RefreshCcw className="h-4 w-4" /> },
  ];

  // Enhanced featured tips with more realistic data
  const featuredTips: Tip[] = [
    {
      id: "1",
      title: "50/30/20 Budget Rule",
      category: "budgeting",
      description:
        "Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment for a balanced financial life.",
      actionText: "Apply to My Budget",
      actionUrl: "/budget",
      rating: 4.8,
      reviews: 246,
      isFeatured: true,
      difficulty: "Easy",
      timeToImplement: "30 minutes",
      isBookmarked: false,
      isLiked: false,
      isDisliked: false,
      tags: ["budget", "planning", "savings"],
      detailedSteps: [
        "Calculate your after-tax income",
        "List all monthly expenses and categorize as needs (50%), wants (30%), or savings/debt (20%)",
        "Adjust your spending to match these percentages",
        "Set up automatic transfers for savings",
        "Review monthly and adjust as needed"
      ],
      implementationProgress: 0,
      estimatedSavings: 315,
      aiScore: 92,
      realTimeData: {
        appliedByUsers: 1842,
        avgSavings: 284,
        successRate: 89
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: "2",
      title: "Automate Your Savings",
      category: "saving",
      description:
        "Set up automatic transfers to your savings account on payday to build your emergency fund without thinking about it.",
      actionText: "Set Up Auto-Save",
      actionUrl: "/accounts",
      rating: 4.7,
      reviews: 189,
      isFeatured: true,
      difficulty: "Easy",
      timeToImplement: "15 minutes",
      isBookmarked: true,
      isLiked: true,
      isDisliked: false,
      tags: ["automation", "savings", "emergency fund"],
      detailedSteps: [
        "Determine how much you can save each month",
        "Log in to your bank's online banking portal",
        "Set up an automatic transfer from checking to savings on payday",
        "Start with a small amount if needed",
        "Increase the amount over time as your income grows"
      ],
      implementationProgress: 100,
      estimatedSavings: 240,
      aiScore: 97,
      realTimeData: {
        appliedByUsers: 2361,
        avgSavings: 220,
        successRate: 94
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: "3",
      title: "Debt Snowball Method",
      category: "debt",
      description:
        "Pay off your smallest debts first to build momentum and motivation as you tackle larger debts.",
      actionText: "Create Debt Plan",
      actionUrl: "/debt",
      rating: 4.9,
      reviews: 320,
      isFeatured: true,
      difficulty: "Medium",
      timeToImplement: "1 hour",
      isBookmarked: false,
      isLiked: false,
      isDisliked: false,
      tags: ["debt", "payoff", "strategy"],
      detailedSteps: [
        "List all your debts from smallest to largest balance",
        "Make minimum payments on all debts",
        "Put any extra money toward the smallest debt",
        "Once the smallest debt is paid off, add that payment to the next smallest debt",
        "Continue until all debts are paid off"
      ],
      implementationProgress: 25,
      estimatedSavings: 450,
      aiScore: 89,
      realTimeData: {
        appliedByUsers: 1528,
        avgSavings: 380,
        successRate: 82
      },
      lastUpdated: new Date().toISOString()
    }
  ];

  // Enhanced personalized tips with AI-driven recommendations
  const personalizedTips: Tip[] = [
    {
      id: "4",
      title: "Reduce Food Expenses",
      category: "spending",
      description:
        "Based on your spending patterns, you could save approximately $120 per month by meal planning and reducing takeout orders.",
      relevance: "High",
      potentialSavings: "$120/month",
      difficulty: "Medium",
      timeToImplement: "Weekly",
      isBookmarked: false,
      isLiked: false,
      isDisliked: false,
      tags: ["food", "expenses", "meal planning"],
      detailedSteps: [
        "Plan meals for the week ahead",
        "Create a shopping list based on your meal plan",
        "Cook in batches to have leftovers",
        "Limit takeout orders to once a week",
        "Track your food spending to see improvements"
      ],
      estimatedSavings: 120,
      aiScore: 94,
      implementationProgress: 0,
      realTimeData: {
        appliedByUsers: 845,
        avgSavings: 102,
        successRate: 86
      }
    },
    {
      id: "5",
      title: "Entertainment Subscription Audit",
      category: "subscriptions",
      description:
        "You currently have 5 entertainment subscriptions totaling $63.95/month. Consider consolidating to your 2-3 most used services.",
      relevance: "Medium",
      potentialSavings: "$25-40/month",
      difficulty: "Easy",
      timeToImplement: "1 hour",
      isBookmarked: false,
      isLiked: true,
      isDisliked: false,
      tags: ["subscriptions", "entertainment", "streaming"],
      detailedSteps: [
        "List all your current entertainment subscriptions and their costs",
        "Track which services you use most frequently over a month",
        "Cancel subscriptions you use less than once a week",
        "Consider rotating subscriptions seasonally based on content",
        "Look for bundle deals that might save you money"
      ],
      estimatedSavings: 32,
      aiScore: 89,
      implementationProgress: 50,
      realTimeData: {
        appliedByUsers: 1204,
        avgSavings: 29,
        successRate: 92
      }
    },
    {
      id: "6",
      title: "Switch Utility Provider",
      category: "spending",
      description:
        "Based on your location and usage, switching to Provider X could save you up to $250 annually on your electricity bills.",
      relevance: "Medium",
      potentialSavings: "$250/year",
      difficulty: "Medium",
      timeToImplement: "2-3 hours",
      isBookmarked: true,
      isLiked: false,
      isDisliked: false,
      tags: ["utilities", "bills", "comparison"],
      detailedSteps: [
        "Gather your recent utility bills to understand usage patterns",
        "Research alternative providers in your area",
        "Compare rates and plans based on your typical usage",
        "Check for any switching fees or contract requirements",
        "Contact the new provider to set up service and confirm cancellation with your current provider"
      ],
      estimatedSavings: 21,
      aiScore: 76,
      implementationProgress: 0,
      realTimeData: {
        appliedByUsers: 432,
        avgSavings: 19,
        successRate: 71
      }
    },
    {
      id: "7",
      title: "Debt Repayment Strategy",
      category: "debt",
      description:
        "Applying the avalanche method to your current debts could save you $1,200 in interest and help you become debt-free 8 months sooner.",
      relevance: "High",
      potentialSavings: "$1,200 total",
      difficulty: "Medium",
      timeToImplement: "2 hours initial setup",
      isBookmarked: false,
      isLiked: false,
      isDisliked: false,
      tags: ["debt", "interest", "strategy"],
      detailedSteps: [
        "List all your debts with their balances, interest rates, and minimum payments",
        "Pay the minimum on all debts",
        "Put extra money toward the debt with the highest interest rate",
        "When that debt is paid off, move to the next highest interest rate",
        "Continue until all debts are paid off"
      ],
      estimatedSavings: 100,
      aiScore: 91,
      implementationProgress: 0,
      realTimeData: {
        appliedByUsers: 752,
        avgSavings: 127,
        successRate: 83
      }
    },
    {
      id: "8",
      title: "Maximize Credit Card Rewards",
      category: "spending",
      description:
        "By strategically using your credit cards for different categories, you could earn an additional $340 in cashback rewards annually.",
      relevance: "Medium",
      potentialSavings: "$340/year",
      difficulty: "Easy",
      timeToImplement: "30 minutes",
      isBookmarked: false,
      isLiked: true,
      isDisliked: false,
      tags: ["credit cards", "rewards", "cashback"],
      detailedSteps: [
        "Review the rewards structure of all your credit cards",
        "Create a simple chart showing which card to use for which category",
        "Use your grocery rewards card for groceries, gas card for fuel, etc.",
        "Set up automatic payments to avoid interest charges",
        "Consider a new card if there's a spending category without good rewards"
      ],
      estimatedSavings: 28,
      aiScore: 88,
      implementationProgress: 75,
      realTimeData: {
        appliedByUsers: 921,
        avgSavings: 31,
        successRate: 89
      }
    }
  ];

  // Combined tips for searching and filtering
  const allTips = [...featuredTips, ...personalizedTips, ...bestSmartTips];
  
  // Simulating real-time data fetching
  const fetchRealTimeData = useCallback(() => {
    setIsLoadingTips(true);
    // Simulate API call delay
    setTimeout(() => {
      // Update tips with "real-time" data
      const updatedFeaturedTips = featuredTips.map(tip => ({
        ...tip,
        realTimeData: {
          appliedByUsers: Math.floor(Math.random() * 1000) + 200,
          avgSavings: Math.floor(Math.random() * 300) + 50,
          successRate: Math.floor(Math.random() * 30) + 70,
        },
        lastUpdated: new Date().toISOString()
      }));
      
      // In a real app, we would update state here
      setLastRefreshed(new Date());
      setIsLoadingTips(false);
      
      toast.success("Tips refreshed with latest data", {
        description: `Updated ${updatedFeaturedTips.length} featured tips and ${personalizedTips.length} personalized recommendations`
      });
    }, 1500);
  }, []);
  
  // Simulate real-time data fetching on initial load
  useEffect(() => {
    fetchRealTimeData();
    
    // Set up periodic refresh every 5 minutes (simulating real-time updates)
    const refreshInterval = setInterval(fetchRealTimeData, 300000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchRealTimeData]);

  // Handler functions
  const handleSaveTip = (tipId: string) => {
    const updatedTips = allTips.map(tip => 
      tip.id === tipId ? { ...tip, isBookmarked: !tip.isBookmarked } : tip
    );
    
    // Update the tip in the appropriate array
    const isFeatured = featuredTips.some(tip => tip.id === tipId);
    if (isFeatured) {
      const updatedFeaturedTips = featuredTips.map(tip => 
        tip.id === tipId ? { ...tip, isBookmarked: !tip.isBookmarked } : tip
      );
      // Update featured tips state if we had state for it
    } else {
      const updatedPersonalizedTips = personalizedTips.map(tip => 
        tip.id === tipId ? { ...tip, isBookmarked: !tip.isBookmarked } : tip
      );
      // Update personalized tips state if we had state for it
    }
    
    toast.success("Tip saved to your favorites");
  };

  const handleRateTip = (tipId: string, isLike: boolean) => {
    const tip = allTips.find(t => t.id === tipId);
    if (!tip) return;
    
    if (isLike) {
      toast.success("Thanks for your positive feedback!", {
        description: "We'll use this to improve our recommendations."
      });
    } else {
      toast.success("Thanks for your feedback", {
        description: "We'll show you fewer tips like this one."
      });
    }
  };

  const handleApplyTip = (tipId: string) => {
    const tip = allTips.find(t => t.id === tipId);
    if (!tip) {
      toast.error("Tip not found");
      return;
    }
    
    setSelectedTipForApply(tip);
    setIsApplyDialogOpen(true);
  };

  const handleConfirmApply = () => {
    if (!selectedTipForApply) return;
    
    // Navigate to the implementation page with the tip data
    navigate("/tip-implementation", { state: { tip: selectedTipForApply } });
    setIsApplyDialogOpen(false);
  };

  const handleViewDetails = (tip: Tip) => {
    setSelectedTip(tip);
    
    // Find testimonials for this tip
    const tipReviews = tipTestimonials.filter(testimonial => 
      testimonial.tipId === tip.id
    );
    setSelectedTipTestimonials(tipReviews);
    
    setIsDetailOpen(true);
  };

  // Filter tips based on current filters and search
  const getFilteredTips = () => {
    return allTips.filter(tip => {
      // Filter by search query
      const matchesSearch = searchQuery === "" || 
        tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tip.tags && tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      // Filter by category
      const matchesCategory = filterCategory === null || tip.category === filterCategory;
      
      // Filter by difficulty
      const matchesDifficulty = filterDifficulty === null || tip.difficulty === filterDifficulty;
      
      // Filter by tab
      const matchesTab = activeTab === "all" || 
                         (activeTab === "featured" && tip.isFeatured) ||
                         (activeTab === "bookmarked" && tip.isBookmarked) ||
                         (activeTab === "implemented" && tip.isLiked);
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesTab;
    });
  };

  // Filter best tips based on category
  const getFilteredBestTips = () => {
    if (activeBestTipsTab === "all") {
      return bestSmartTips;
    }
    return bestSmartTips.filter(tip => tip.category === activeBestTipsTab);
  };

  // Handle opening the calculator for a specific tip
  const handleOpenCalculator = (tip: Tip) => {
    setCalculatorTip(tip);
    setCalculatorInput("");
    setCalculatorResult(null);
    setIsCalculatorOpen(true);
  };
  
  // Calculate potential savings based on user input
  const calculatePotentialSavings = () => {
    if (!calculatorTip || !calculatorInput) return;
    
    const inputValue = parseFloat(calculatorInput);
    if (isNaN(inputValue)) return;
    
    let result = 0;
    
    // Different calculation logic based on tip category
    switch (calculatorTip.category) {
      case "budgeting":
        // Estimate 15-20% savings from better budgeting
        result = inputValue * 0.175;
        break;
      case "debt":
        // Estimate interest savings based on average credit card rates
        result = inputValue * 0.18;
        break;
      case "saving":
        // Estimate compound growth over a year
        result = inputValue * 0.08;
        break;
      case "spending":
        // Estimate direct reduction in spending
        result = inputValue * 0.15;
        break;
      case "investing":
        // Estimate average market returns
        result = inputValue * 0.07;
        break;
      case "subscriptions":
        // Estimate 40-60% reduction in subscription costs
        result = inputValue * 0.5;
        break;
      default:
        result = inputValue * 0.1;
    }
    
    setCalculatorResult(Math.round(result));
    
    toast.success("Savings calculated!", {
      description: `Implementing this tip could save you approximately $${Math.round(result)} per year.`
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold">{t('smartFinancialTips')}</h1>
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={fetchRealTimeData}
              disabled={isLoadingTips}
            >
              {isLoadingTips ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tips..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Categories</p>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`px-2 py-1.5 text-sm rounded-md cursor-pointer flex items-center gap-2 ${
                          filterCategory === category.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setFilterCategory(filterCategory === category.id ? null : category.id)}
                      >
                        {category.icon}
                        <span>{category.name}</span>
                        {filterCategory === category.id && <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />}
                      </div>
                    ))}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Difficulty</p>
                  <div className="space-y-1">
                    {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                      <div
                        key={difficulty}
                        className={`px-2 py-1.5 text-sm rounded-md cursor-pointer flex items-center gap-2 ${
                          filterDifficulty === difficulty ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setFilterDifficulty(filterDifficulty === difficulty ? null : difficulty as any)}
                      >
                        <span>{difficulty}</span>
                        {filterDifficulty === difficulty && <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />}
                      </div>
                    ))}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 flex items-center justify-between">
                  <Label htmlFor="show-implemented" className="text-sm cursor-pointer">
                    Show Implemented
                  </Label>
                  <Switch
                    id="show-implemented"
                    checked={showImplemented}
                    onCheckedChange={setShowImplemented}
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setFilterCategory(null);
                  setFilterDifficulty(null);
                  setShowImplemented(true);
                  setSearchQuery('');
                }}>
                  Reset All Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last updated: {lastRefreshed.toLocaleTimeString()} • AI recommendations based on your financial patterns
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>All Tips</span>
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Featured</span>
            </TabsTrigger>
            <TabsTrigger value="bookmarked" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span>Saved</span>
            </TabsTrigger>
            <TabsTrigger value="implemented" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Implemented</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getFilteredTips().filter(tip => tip.isFeatured).map((tip) => (
                <Card key={tip.id} className="overflow-hidden border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-4 py-1 text-xs font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      <span>Featured Tip</span>
                    </div>
                    {tip.realTimeData && (
                      <Badge variant="outline" className="bg-background/50 text-xs">
                        {tip.realTimeData.appliedByUsers.toLocaleString()} users applied
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="inline-block px-2 py-1 bg-muted text-xs font-medium rounded mb-2">
                          {categories.find(cat => cat.id === tip.category)?.name || tip.category}
                        </Badge>
                        <CardTitle className="leading-tight">{tip.title}</CardTitle>
                      </div>
                      <div className="flex items-center text-amber-500">
                        <Star className="fill-amber-500 h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{tip.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">({tip.reviews})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {tip.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="mb-3">{tip.description}</p>
                    
                    {/* AI score and real-time data */}
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                      <div className="p-2 rounded-md bg-primary/5">
                        <div className="font-medium text-sm">{tip.aiScore || 85}%</div>
                        <div className="text-muted-foreground">AI Confidence</div>
                      </div>
                      {tip.realTimeData && (
                        <>
                          <div className="p-2 rounded-md bg-green-50 dark:bg-green-900/20">
                            <div className="font-medium text-sm text-green-600 dark:text-green-400">
                              ${tip.realTimeData.avgSavings}
                            </div>
                            <div className="text-muted-foreground">Avg Savings</div>
                          </div>
                          <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/20">
                            <div className="font-medium text-sm text-blue-600 dark:text-blue-400">
                              {tip.realTimeData.successRate}%
                            </div>
                            <div className="text-muted-foreground">Success Rate</div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 space-x-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tip.timeToImplement}
                        </Badge>
                        <Badge variant="secondary" className={`flex items-center gap-1 ${
                          tip.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          tip.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {tip.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(tip)}
                          className="h-8"
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApplyTip(tip.id)}
                          className="h-8 bg-gradient-to-r from-primary to-primary/80"
                        >
                          {tip.actionText || "Apply Tip"}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Implementation progress */}
                    {tip.implementationProgress !== undefined && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Implementation Progress</span>
                          <span className="font-medium">{tip.implementationProgress}%</span>
                        </div>
                        <Progress value={tip.implementationProgress} className="h-1.5" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0 pb-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRateTip(tip.id, true)}
                        className={`h-8 w-8 ${tip.isLiked ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' : ''}`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRateTip(tip.id, false)}
                        className={`h-8 w-8 ${tip.isDisliked ? 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400' : ''}`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleSaveTip(tip.id)}
                        className={`h-8 w-8 ${tip.isBookmarked ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400' : ''}`}
                      >
                        <Bookmark className="h-4 w-4" fill={tip.isBookmarked ? "currentColor" : "none"} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card className="border border-primary/10 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <CardTitle>{t('personalizedRecommendations')}</CardTitle>
                    <CardDescription>
                      AI-tailored tips based on your spending patterns and financial goals
                    </CardDescription>
                  </div>
                  <Select defaultValue="relevance" onValueChange={(val) => toast.success(`Sorted by ${val}`)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="savings">Savings Potential</SelectItem>
                      <SelectItem value="ease">Ease to Implement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  {getFilteredTips().filter(tip => !tip.isFeatured).map((tip) => (
                    <div key={tip.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-all">
                      <div className="flex items-center justify-between border-b p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              tip.relevance === "High"
                                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                                : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                            }`}
                          >
                            <Lightbulb className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{tip.title}</h3>
                            <div className="flex items-center gap-2 text-xs mt-1">
                              <span className="text-muted-foreground">
                                {categories.find(cat => cat.id === tip.category)?.name || tip.category}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded-full ${
                                  tip.relevance === "High"
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}
                              >
                                {tip.relevance} Relevance
                              </span>
                              {tip.difficulty && (
                                <span className={`px-1.5 py-0.5 rounded-full ${
                                  tip.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                  tip.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' :
                                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                  {tip.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            {tip.potentialSavings}
                          </div>
                          <div className="text-xs text-muted-foreground">{t('potentialSavings')}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-2 flex flex-wrap gap-1">
                          {tip.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm mb-4">{tip.description}</p>
                        
                        {/* AI insights and stats */}
                        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                          <div className="p-2 rounded-md bg-primary/5">
                            <div className="font-medium text-sm">{tip.aiScore || 85}%</div>
                            <div className="text-muted-foreground">AI Confidence</div>
                          </div>
                          {tip.realTimeData && (
                            <>
                              <div className="p-2 rounded-md bg-green-50 dark:bg-green-900/20">
                                <div className="font-medium text-sm text-green-600 dark:text-green-400">
                                  ${tip.realTimeData.avgSavings}/mo
                                </div>
                                <div className="text-muted-foreground">Avg Savings</div>
                              </div>
                              <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/20">
                                <div className="font-medium text-sm text-blue-600 dark:text-blue-400">
                                  {tip.realTimeData.successRate}%
                                </div>
                                <div className="text-muted-foreground">Success Rate</div>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Implementation progress */}
                        {tip.implementationProgress !== undefined && (
                          <div className="mb-4 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Implementation Progress</span>
                              <span className="font-medium">{tip.implementationProgress}%</span>
                            </div>
                            <Progress value={tip.implementationProgress} className="h-1.5" />
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{tip.timeToImplement}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(tip)}>
                              View Details
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleApplyTip(tip.id)}
                              className="bg-gradient-to-r from-primary to-primary/80"
                            >
                              Apply This Tip
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2 gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRateTip(tip.id, true)}
                            className={`h-8 w-8 ${tip.isLiked ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' : ''}`}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRateTip(tip.id, false)}
                            className={`h-8 w-8 ${tip.isDisliked ? 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400' : ''}`}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleSaveTip(tip.id)}
                            className={`h-8 w-8 ${tip.isBookmarked ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400' : ''}`}
                          >
                            <Bookmark className="h-4 w-4" fill={tip.isBookmarked ? "currentColor" : "none"} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="featured" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getFilteredTips().filter(tip => tip.isFeatured).map((tip) => (
                <Card key={tip.id} className="overflow-hidden border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-4 py-1 text-xs font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      <span>Featured Tip</span>
                    </div>
                    {tip.realTimeData && (
                      <Badge variant="outline" className="bg-background/50 text-xs">
                        {tip.realTimeData.appliedByUsers.toLocaleString()} users applied
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="inline-block px-2 py-1 bg-muted text-xs font-medium rounded mb-2">
                          {categories.find(cat => cat.id === tip.category)?.name || tip.category}
                        </Badge>
                        <CardTitle className="leading-tight">{tip.title}</CardTitle>
                      </div>
                      <div className="flex items-center text-amber-500">
                        <Star className="fill-amber-500 h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{tip.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">({tip.reviews})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {tip.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="mb-3">{tip.description}</p>
                    
                    {/* AI score and real-time data */}
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                      <div className="p-2 rounded-md bg-primary/5">
                        <div className="font-medium text-sm">{tip.aiScore || 85}%</div>
                        <div className="text-muted-foreground">AI Confidence</div>
                      </div>
                      {tip.realTimeData && (
                        <>
                          <div className="p-2 rounded-md bg-green-50 dark:bg-green-900/20">
                            <div className="font-medium text-sm text-green-600 dark:text-green-400">
                              ${tip.realTimeData.avgSavings}
                            </div>
                            <div className="text-muted-foreground">Avg Savings</div>
                          </div>
                          <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/20">
                            <div className="font-medium text-sm text-blue-600 dark:text-blue-400">
                              {tip.realTimeData.successRate}%
                            </div>
                            <div className="text-muted-foreground">Success Rate</div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 space-x-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tip.timeToImplement}
                        </Badge>
                        <Badge variant="secondary" className={`flex items-center gap-1 ${
                          tip.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          tip.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {tip.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(tip)}
                          className="h-8"
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApplyTip(tip.id)}
                          className="h-8 bg-gradient-to-r from-primary to-primary/80"
                        >
                          {tip.actionText || "Apply Tip"}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Implementation progress */}
                    {tip.implementationProgress !== undefined && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Implementation Progress</span>
                          <span className="font-medium">{tip.implementationProgress}%</span>
                        </div>
                        <Progress value={tip.implementationProgress} className="h-1.5" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0 pb-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRateTip(tip.id, true)}
                        className={`h-8 w-8 ${tip.isLiked ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' : ''}`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRateTip(tip.id, false)}
                        className={`h-8 w-8 ${tip.isDisliked ? 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400' : ''}`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleSaveTip(tip.id)}
                        className={`h-8 w-8 ${tip.isBookmarked ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400' : ''}`}
                      >
                        <Bookmark className="h-4 w-4" fill={tip.isBookmarked ? "currentColor" : "none"} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="bookmarked">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredTips().filter(tip => tip.isBookmarked).map((tip) => (
                <Card key={tip.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Badge className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium mb-2">
                      {categories.find(cat => cat.id === tip.category)?.name || tip.category}
                    </Badge>
                    <CardTitle className="leading-tight">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{tip.description}</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(tip)}>
                        Details
                      </Button>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleSaveTip(tip.id)}
                          className="h-8 w-8 text-amber-600 bg-amber-100"
                        >
                          <Bookmark className="h-4 w-4" fill="currentColor" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {getFilteredTips().filter(tip => tip.isBookmarked).length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/30 p-4 rounded-full mb-4">
                    <Bookmark className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No saved tips yet</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Bookmark tips you want to reference later or plan to implement
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="implemented">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredTips().filter(tip => tip.isLiked).map((tip) => (
                <Card key={tip.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Badge className="inline-block px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium mb-2">
                      Implemented
                    </Badge>
                    <CardTitle className="leading-tight">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{tip.description}</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(tip)}>
                        Details
                      </Button>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Implemented
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {getFilteredTips().filter(tip => tip.isLiked).length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/30 p-4 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No implemented tips yet</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Mark tips as implemented once you've applied them to your finances
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* New Best Smart Tips Section */}
        <Card className="border border-primary/10 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <CardTitle>10 Best Financial Smart Tips</CardTitle>
              </div>
              <CardDescription className="md:text-right">
                Top-rated tips with the highest success rates and largest savings
              </CardDescription>
            </div>
          </CardHeader>
          
          <div className="px-4 pb-2">
            <Tabs defaultValue="all" value={activeBestTipsTab} onValueChange={setActiveBestTipsTab} className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start mb-4 h-auto p-1 gap-1">
                <TabsTrigger value="all" className="flex items-center gap-1 h-8 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>All</span>
                </TabsTrigger>
                <TabsTrigger value="budgeting" className="flex items-center gap-1 h-8 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300">
                  <BarChart className="h-3.5 w-3.5" />
                  <span>Budgeting</span>
                </TabsTrigger>
                <TabsTrigger value="spending" className="flex items-center gap-1 h-8 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Spending</span>
                </TabsTrigger>
                <TabsTrigger value="saving" className="flex items-center gap-1 h-8 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300">
                  <PiggyBank className="h-3.5 w-3.5" />
                  <span>Saving</span>
                </TabsTrigger>
                <TabsTrigger value="debt" className="flex items-center gap-1 h-8 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Debt</span>
                </TabsTrigger>
                <TabsTrigger value="investing" className="flex items-center gap-1 h-8 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Investing</span>
                </TabsTrigger>
                <TabsTrigger value="subscriptions" className="flex items-center gap-1 h-8 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300">
                  <RefreshCcw className="h-3.5 w-3.5" />
                  <span>Subscriptions</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredBestTips().map((tip) => (
                <Card key={tip.id} className="overflow-hidden border border-amber-200 dark:border-amber-900/30 hover:shadow-md transition-all">
                  <div className="bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10 px-3 py-1 text-xs font-medium flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-800 dark:text-amber-200">Top Rated Tip</span>
                    </div>
                    <Badge variant="outline" className="bg-background/50 text-xs font-normal text-amber-800 dark:text-amber-200">
                      {tip.rating} ★ ({tip.reviews})
                    </Badge>
                  </div>
                  
                  <CardHeader className="py-3 px-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Badge className="inline-block px-2 py-0.5 bg-muted text-xs font-medium rounded mb-1">
                          {categories.find(cat => cat.id === tip.category)?.name || tip.category}
                        </Badge>
                        <CardTitle className="text-base leading-tight">{tip.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-2 px-4">
                    <p className="text-sm mb-3 line-clamp-2">{tip.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tip.tags?.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2.5 w-2.5 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {(tip.tags?.length || 0) > 2 && (
                        <Badge variant="outline" className="text-xs">+{(tip.tags?.length || 0) - 2} more</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 mb-3 text-center text-xs">
                      <div className="p-1.5 rounded-md bg-green-50 dark:bg-green-900/20">
                        <div className="font-medium text-sm text-green-600 dark:text-green-400">
                          ${tip.realTimeData?.avgSavings}
                        </div>
                        <div className="text-muted-foreground text-[10px]">Avg Savings</div>
                      </div>
                      <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                        <div className="font-medium text-sm text-blue-600 dark:text-blue-400">
                          {tip.realTimeData?.successRate}%
                        </div>
                        <div className="text-muted-foreground text-[10px]">Success Rate</div>
                      </div>
                      <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-900/20">
                        <div className="font-medium text-sm text-amber-600 dark:text-amber-400">
                          {tip.aiScore}%
                        </div>
                        <div className="text-muted-foreground text-[10px]">AI Score</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className={`text-xs ${
                        tip.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        tip.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {tip.difficulty}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenCalculator(tip)}
                          className="h-7 text-xs"
                        >
                          <DollarSign className="h-3 w-3 mr-1" />
                          Calculate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(tip)}
                          className="h-7 text-xs"
                        >
                          Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApplyTip(tip.id)}
                          className="h-7 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end pt-0 pb-2 px-4">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRateTip(tip.id, true)}
                        className="h-7 w-7"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleSaveTip(tip.id)}
                        className="h-7 w-7"
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-900/30">
              <div className="flex gap-3">
                <div className="p-2 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Why These Tips Work</h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    These 10 tips have been selected based on real user success data and financial expert recommendations. 
                    They offer the highest potential savings with implementation strategies tailored to different financial situations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Add a financial impact summary section at the top of the page */}
        <Card className="border border-primary/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Financial Impact Summary</CardTitle>
            <CardDescription>
              Potential impact if you implement all recommended tips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 text-center">
                <h3 className="text-sm text-muted-foreground mb-1">Monthly Savings</h3>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">$320</div>
                <p className="text-xs text-muted-foreground mt-1">Based on your spending patterns</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 text-center">
                <h3 className="text-sm text-muted-foreground mb-1">Annual Impact</h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$3,840</div>
                <p className="text-xs text-muted-foreground mt-1">Projected yearly savings</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 text-center">
                <h3 className="text-sm text-muted-foreground mb-1">Goal Acceleration</h3>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">14 months</div>
                <p className="text-xs text-muted-foreground mt-1">Faster achievement of savings goals</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={() => toast.success("Report generated!")}>
                <Download className="h-4 w-4 mr-2" />
                Download Full Report
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            {selectedTip && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedTip.title}</DialogTitle>
                  <DialogDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-primary/10 text-primary">
                        {categories.find(cat => cat.id === selectedTip.category)?.name || selectedTip.category}
                      </Badge>
                      {selectedTip.difficulty && (
                        <Badge className={
                          selectedTip.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          selectedTip.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }>
                          {selectedTip.difficulty} Difficulty
                        </Badge>
                      )}
                      {selectedTip.timeToImplement && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {selectedTip.timeToImplement}
                        </Badge>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 my-2">
                  <p>{selectedTip.description}</p>
                  
                  {/* AI insights section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                    <div className="bg-primary/5 rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">AI Confidence</div>
                      <div className="text-xl font-bold">{selectedTip.aiScore || 85}%</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">Est. Monthly Savings</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        ${selectedTip.estimatedSavings || 0}
                      </div>
                    </div>
                    {selectedTip.realTimeData && (
                      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedTip.realTimeData.successRate}%
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {selectedTip.potentialSavings && (
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2 font-medium text-green-700 dark:text-green-300">
                        <DollarSign className="h-5 w-5" />
                        <span>Potential Savings</span>
                      </div>
                      <p className="text-green-800 dark:text-green-200 font-bold text-lg">{selectedTip.potentialSavings}</p>
                    </div>
                  )}
                  
                  {selectedTip.detailedSteps && selectedTip.detailedSteps.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">How to implement this tip:</h3>
                      <div className="space-y-3">
                        {selectedTip.detailedSteps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p>{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Implementation tracker */}
                  {selectedTip.implementationProgress !== undefined && (
                    <div className="mt-5 space-y-3 border-t pt-4">
                      <h3 className="text-lg font-medium">Implementation Progress</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Track your progress implementing this tip
                          </span>
                          <span className="font-medium">{selectedTip.implementationProgress}%</span>
                        </div>
                        <Progress value={selectedTip.implementationProgress} className="h-2" />
                        
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Not Started</span>
                          <span>In Progress</span>
                          <span>Completed</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            // In a real app, we would update the progress in state/database
                            toast.success("Progress updated");
                          }}
                        >
                          Update Progress
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            // Mark as complete
                            toast.success("Tip marked as implemented!");
                          }}
                        >
                          Mark as Complete
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-4">
                    {selectedTip.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Community section - enhanced with testimonials */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="text-sm font-medium mb-2">Community Insights</h3>
                    <div className="text-sm text-muted-foreground mb-4">
                      {selectedTip.realTimeData && (
                        <>
                          {selectedTip.realTimeData.appliedByUsers.toLocaleString()} users have applied this tip, 
                          saving an average of ${selectedTip.realTimeData.avgSavings} per month.
                        </>
                      )}
                    </div>
                    
                    {/* Testimonials section */}
                    {selectedTipTestimonials.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <h3 className="text-sm font-medium">User Testimonials</h3>
                        <div className="max-h-[200px] overflow-y-auto pr-2 space-y-3">
                          {selectedTipTestimonials.map(testimonial => (
                            <div key={testimonial.id} className="border rounded-lg p-3 bg-muted/20">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                    {testimonial.userName.split(' ')[0][0]}{testimonial.userName.split(' ')[1]?.[0]}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{testimonial.userName}</div>
                                    <div className="flex items-center text-amber-500">
                                      {Array(5).fill(0).map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`h-3 w-3 ${i < testimonial.rating ? 'fill-amber-500' : ''}`} 
                                        />
                                      ))}
                                      <span className="text-xs text-muted-foreground ml-1">
                                        {new Date(testimonial.date).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {testimonial.verified && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm mt-2">{testimonial.text}</p>
                              <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                                Saved ${testimonial.savings}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-2 sm:space-y-0">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRateTip(selectedTip.id, true)}
                      className={selectedTip.isLiked ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' : ''}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveTip(selectedTip.id)}
                      className={selectedTip.isBookmarked ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400' : ''}
                    >
                      <Bookmark className="h-4 w-4 mr-2" fill={selectedTip.isBookmarked ? "currentColor" : "none"} />
                      {selectedTip.isBookmarked ? 'Saved' : 'Save for Later'}
                    </Button>
                  </div>
                  <Button onClick={() => handleApplyTip(selectedTip.id)}>
                    {selectedTip.actionText || "Apply This Tip"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Add Apply Tip Dialog */}
        <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Apply {selectedTipForApply?.title}</DialogTitle>
              <DialogDescription>
                Review how this tip will affect your budget
              </DialogDescription>
            </DialogHeader>
            
            {selectedTipForApply && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {selectedTipForApply.category}
                      </Badge>
                      <Badge variant="outline">
                        {selectedTipForApply.difficulty}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time to implement: {selectedTipForApply.timeToImplement}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">How it works:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedTipForApply.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Implementation Steps:</h4>
                    <div className="space-y-2">
                      {selectedTipForApply.detailedSteps?.map((step, index) => (
                        <div key={index} className="flex gap-2 text-sm">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-xs">{index + 1}</span>
                          </div>
                          <p>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedTipForApply.estimatedSavings && (
                    <div className="bg-muted/40 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <PiggyBank className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium">Potential Savings</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          Estimated monthly savings: ₹{selectedTipForApply.estimatedSavings}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Based on {selectedTipForApply.realTimeData?.appliedByUsers.toLocaleString()} users who implemented this tip
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                      <h4 className="font-medium">What to expect</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
                        <span>Your budget categories will be adjusted according to this tip</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
                        <span>You can modify the changes after they're applied</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
                        <span>Track your progress in the Budget page</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmApply}>
                Apply to My Budget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Add calculator dialog */}
        <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
          <DialogContent className="sm:max-w-md">
            {calculatorTip && (
              <>
                <DialogHeader>
                  <DialogTitle>Savings Calculator</DialogTitle>
                  <DialogDescription>
                    Estimate how much you could save by implementing <span className="font-medium">{calculatorTip.title}</span>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-spending">
                      {calculatorTip.category === "debt" 
                        ? "Current debt amount" 
                        : calculatorTip.category === "investing" 
                          ? "Amount available to invest" 
                          : "Current monthly spending"}
                    </Label>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input 
                        id="current-spending"
                        placeholder="Enter amount" 
                        value={calculatorInput}
                        onChange={(e) => setCalculatorInput(e.target.value)}
                        type="number"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  {calculatorResult !== null && (
                    <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-900/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Estimated annual savings:</span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          ${calculatorResult}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        These are estimated savings based on typical results. Your actual savings may vary based on your specific financial situation.
                      </p>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCalculatorOpen(false)}>
                    Close
                  </Button>
                  <Button type="button" onClick={calculatePotentialSavings}>
                    Calculate
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SmartTips;
