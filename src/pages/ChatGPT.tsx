import React, { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Lightbulb, 
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowRight,
  BrainCircuit,
  BarChart3,
  PieChart,
  Target,
  Wallet,
  CreditCard,
  PiggyBank,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  Download,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { processFinancialQuery } from "@/services/chatService";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudgets } from "@/hooks/useBudgets";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "chart" | "insight";
}

interface Suggestion {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: "spending" | "budget" | "savings" | "analysis";
}

const suggestions: Suggestion[] = [
  {
    id: "1",
    text: "How much did I spend on groceries last month?",
    icon: <DollarSign className="h-4 w-4" />,
    category: "spending"
  },
  {
    id: "2",
    text: "What's my remaining budget for entertainment?",
    icon: <Calendar className="h-4 w-4" />,
    category: "budget"
  },
  {
    id: "3",
    text: "Can I afford a vacation this month?",
    icon: <TrendingUp className="h-4 w-4" />,
    category: "savings"
  },
  {
    id: "4",
    text: "What are my biggest expenses this month?",
    icon: <BarChart3 className="h-4 w-4" />,
    category: "analysis"
  },
  {
    id: "5",
    text: "Show me my savings rate",
    icon: <PiggyBank className="h-4 w-4" />,
    category: "savings"
  },
  {
    id: "6",
    text: "Analyze my spending patterns",
    icon: <PieChart className="h-4 w-4" />,
    category: "analysis"
  }
];

const ChatGPT = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Suggestion["category"] | "all">("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { user } = useAuth();

  // Initialize sample data
  useEffect(() => {
    if (!user) return;

    // Initialize sample transactions if none exist
    const storedTransactions = localStorage.getItem('transactions');
    if (!storedTransactions) {
      const sampleTransactions = [
        {
          id: '1',
          user_id: user.id,
          amount: 150.50,
          category: 'Groceries',
          description: 'Weekly groceries',
          date: new Date().toISOString(),
          type: 'expense',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: user.id,
          amount: 2000,
          category: 'Salary',
          description: 'Monthly salary',
          date: new Date().toISOString(),
          type: 'income',
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('transactions', JSON.stringify(sampleTransactions));
    }

    // Initialize sample budgets if none exist
    const storedBudgets = localStorage.getItem('budgets');
    if (!storedBudgets) {
      const sampleBudgets = [
        {
          id: '1',
          user_id: user.id,
          category: 'Groceries',
          amount: 500,
          spent: 150.50,
          period: 'monthly',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: user.id,
          category: 'Entertainment',
          amount: 200,
          spent: 75,
          period: 'monthly',
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('budgets', JSON.stringify(sampleBudgets));
    }
  }, [user]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await processFinancialQuery(input, transactions, budgets);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: "assistant",
        timestamp: new Date(),
        type: "text"
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (response.error) {
        toast.error("Failed to process your query. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredSuggestions = selectedCategory === "all" 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] p-6">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-blue-500" />
              AI Financial Assistant
            </h1>
            <p className="text-muted-foreground">
              Get personalized financial insights and analysis powered by AI
            </p>
          </motion.div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export chat history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share insights</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Main Chat Area */}
          <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-1 flex flex-col bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border-none shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <MessageSquare className="h-5 w-5" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea ref={scrollRef} className="h-[calc(100vh-16rem)]">
                  <div className="p-6 space-y-6">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={cn(
                            "flex gap-4",
                            message.role === "assistant" ? "justify-start" : "justify-end"
                          )}
                        >
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-blue-500" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-4",
                              message.role === "assistant"
                                ? "bg-muted/50"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <span className="text-xs text-muted-foreground mt-2 block">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-500" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about your finances..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Sparkles className="h-5 w-5" />
                    Suggested Questions
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                  >
                    {showSuggestions ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedCategory === "spending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("spending")}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Spending
                  </Button>
                  <Button
                    variant={selectedCategory === "budget" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("budget")}
                  >
                    <Wallet className="h-4 w-4 mr-1" />
                    Budget
                  </Button>
                  <Button
                    variant={selectedCategory === "savings" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("savings")}
                  >
                    <PiggyBank className="h-4 w-4 mr-1" />
                    Savings
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4"
                    >
                      {filteredSuggestions.map((suggestion) => (
                        <motion.button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className="w-full text-left p-4 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                              {suggestion.icon}
                            </div>
                            <span className="text-sm text-purple-600 dark:text-purple-400">
                              {suggestion.text}
                            </span>
                            <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Lightbulb className="h-5 w-5" />
                  Smart Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5">
                    <Target className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Set Clear Goals</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Define specific financial goals to track your progress effectively
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5">
                    <BarChart3 className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Monitor Trends</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Regularly check your spending patterns to identify areas for improvement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Stay Alert</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Set up notifications for unusual spending or budget alerts
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatGPT; 