import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  Trash2,
  Users,
  UserPlus,
  ArrowRight,
  Send,
  MoreVertical,
  Edit,
  ExternalLink,
  CreditCard,
  DollarSign,
  Receipt,
  Clock,
  CalendarDays,
  ArrowDownUp,
  CheckCircle,
  Share2,
  Split,
  User,
  Wallet,
  Calculator,
  AlertCircle,
  LucideIcon,
  Sparkles,
  TrendingUp,
  PieChart,
  BarChart3,
  LineChart,
  Settings,
  Bell,
  History,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  Star,
  Heart,
  Gift,
  PartyPopper,
  Trophy,
  Target,
  Lightbulb,
  Brain,
  Zap,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  Copy,
  QrCode,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Camera,
  Image,
  File,
  Folder,
  FolderPlus,
  FilePlus,
  FileCheck,
  FileX,
  FileWarning,
  FileQuestion,
  FileSearch,
  FileText as FileTextIcon,
  FileType,
  FileUp,
  FileDown,
  FileInput,
  FileOutput,
  FileSpreadsheet,
  FileCode,
  FileJson,
  FileArchive,
  FileAudio,
  FileVideo,
  FileImage,
  FileLock,
  FileCog,
  Grid,
  List,
  Utensils,
  Plane,
  Film
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartData,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface Group {
  id: string;
  name: string;
  members: string[];
  expenses: Expense[];
  createdAt: string;
  totalAmount?: number;
  icon?: string;
  color?: string;
  description: string;
  settings: {
    currency: string;
    defaultSplitType: 'equal' | 'custom';
    notifications: boolean;
    autoSettle: boolean;
    privacy: 'private' | 'public';
  };
  statistics: {
    totalSpent: number;
    averagePerPerson: number;
    mostExpensiveCategory: string;
    mostActiveMember: string;
    lastActivity: string;
  };
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  date: string;
  splitType: 'equal' | 'custom';
  shares?: Record<string, number>;
  category: string;
  description?: string;
  receipt?: string;
  tags?: string[];
  status: 'settled' | 'pending';
}

interface Balance {
  member: string;
  amount: number;
  colorClass: string;
}

// Helper to get random avatar color
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-red-500",
    "bg-blue-500", 
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500"
  ];
  
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length];
}

// Helper to get initials from name
const getInitials = (name: string): string => {
  if (name === 'Me') return 'ME';
  return name.split(" ")
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

// Add this helper function after the getInitials function
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Add the calculateSettlements function
const calculateSettlements = (balances: Record<string, number>) => {
  const settlements: { from: string; to: string; amount: number }[] = [];
  
  // Create separate arrays of debtors and creditors
  const debtors: { name: string; amount: number }[] = [];
  const creditors: { name: string; amount: number }[] = [];
  
  Object.entries(balances).forEach(([name, balance]) => {
    // Round to 2 decimal places to avoid floating point issues
    const roundedBalance = Math.round(balance * 100) / 100;
    
    if (roundedBalance < 0) {
      debtors.push({ name, amount: -roundedBalance });
    } else if (roundedBalance > 0) {
      creditors.push({ name, amount: roundedBalance });
    }
  });
  
  // Sort both arrays by amount (largest first)
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);
  
  // Generate settlements
  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];
    
    // Calculate the amount to settle
    const amount = Math.min(debtor.amount, creditor.amount);
    
    if (amount > 0.01) { // Only add settlements worth showing (> 1 cent)
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount
      });
    }
    
    // Update balances
    debtor.amount -= amount;
    creditor.amount -= amount;
    
    // Remove accounts that are settled
    if (debtor.amount < 0.01) debtors.shift();
    if (creditor.amount < 0.01) creditors.shift();
  }
  
  return settlements;
};

// Add formatCurrency function after the imports
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const SplitExpenses = () => {
  const { t } = useLanguage();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [activeView, setActiveView] = useState<'expenses' | 'balances' | 'summary'>('expenses');
  const [newGroup, setNewGroup] = useState({
    name: '',
    members: ['Me', ''],
  });
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    paidBy: 'Me',
    splitType: 'equal',
    category: '',
    shares: {} as Record<string, number>,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // New state for enhanced features
  const [showStatistics, setShowStatistics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReceipt, setShowReceipt] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showSettlementHistory, setShowSettlementHistory] = useState(false);
  const [showGroupInvite, setShowGroupInvite] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showMemberProfile, setShowMemberProfile] = useState<string | null>(null);
  const [showExpenseDetails, setShowExpenseDetails] = useState<string | null>(null);
  const [showAddReceipt, setShowAddReceipt] = useState(false);
  const [showSplitCalculator, setShowSplitCalculator] = useState(false);
  const [showDebtGraph, setShowDebtGraph] = useState(false);
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(false);
  const [showMemberBreakdown, setShowMemberBreakdown] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Enhanced sample data with more visual elements and features
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Beach Trip',
      members: ['Me', 'Alex', 'Jordan', 'Taylor'],
      expenses: [
        {
          id: 'e1',
          title: 'Airbnb Rental',
          amount: 800,
          paidBy: 'Me',
          date: '2024-03-15',
          splitType: 'equal',
          category: 'Accommodation',
          description: 'Luxury beachfront villa for the weekend',
          receipt: 'https://example.com/receipt1.jpg',
          tags: ['vacation', 'accommodation'],
          status: 'settled'
        },
        {
          id: 'e2',
          title: 'Groceries',
          amount: 120,
          paidBy: 'Alex',
          date: '2024-03-16',
          splitType: 'equal',
          category: 'Food',
          description: 'Breakfast and snacks for the group',
          receipt: 'https://example.com/receipt2.jpg',
          tags: ['food', 'groceries'],
          status: 'pending'
        },
        {
          id: 'e3',
          title: 'Dinner Out',
          amount: 200,
          paidBy: 'Jordan',
          date: '2024-03-17',
          splitType: 'equal',
          category: 'Food',
          description: 'Group dinner at seafood restaurant',
          receipt: 'https://example.com/receipt3.jpg',
          tags: ['food', 'dining'],
          status: 'pending'
        }
      ],
      createdAt: '2024-03-01',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      icon: '🏖️',
      description: 'Weekend getaway at the beach',
      settings: {
        currency: 'USD',
        defaultSplitType: 'equal',
        notifications: true,
        autoSettle: false,
        privacy: 'private'
      },
      statistics: {
        totalSpent: 1120,
        averagePerPerson: 280,
        mostExpensiveCategory: 'Accommodation',
        mostActiveMember: 'Me',
        lastActivity: '2024-03-17'
      }
    },
    {
      id: '2',
      name: 'Roommates',
      members: ['Me', 'Sam', 'Jamie'],
      expenses: [
        {
          id: 'e4',
          title: 'Electricity Bill',
          amount: 150,
          paidBy: 'Me',
          date: '2024-04-01',
          splitType: 'equal',
          category: 'Utilities',
          status: 'pending'
        },
        {
          id: 'e5',
          title: 'Internet',
          amount: 80,
          paidBy: 'Sam',
          date: '2024-04-05',
          splitType: 'equal',
          category: 'Utilities',
          status: 'pending'
        },
      ],
      createdAt: '2024-02-15',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      icon: '🏠',
      description: 'Monthly shared expenses with roommates',
      settings: {
        currency: 'USD',
        defaultSplitType: 'equal',
        notifications: true,
        autoSettle: false,
        privacy: 'private'
      },
      statistics: {
        totalSpent: 230,
        averagePerPerson: 76.67,
        mostExpensiveCategory: 'Utilities',
        mostActiveMember: 'Me',
        lastActivity: '2024-04-05'
      }
    },
    {
      id: '3',
      name: 'Road Trip',
      members: ['Me', 'Pat', 'Casey', 'Morgan'],
      expenses: [
        {
          id: 'e6',
          title: 'Gas',
          amount: 85,
          paidBy: 'Pat',
          date: '2024-04-10',
          splitType: 'equal',
          category: 'Transportation',
          status: 'pending'
        },
        {
          id: 'e7',
          title: 'Snacks',
          amount: 30,
          paidBy: 'Me',
          date: '2024-04-10',
          splitType: 'equal',
          category: 'Food',
          status: 'pending'
        },
      ],
      createdAt: '2024-04-08',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      icon: '🚗',
      description: 'Weekend road trip expenses',
      settings: {
        currency: 'USD',
        defaultSplitType: 'equal',
        notifications: true,
        autoSettle: false,
        privacy: 'private'
      },
      statistics: {
        totalSpent: 115,
        averagePerPerson: 28.75,
        mostExpensiveCategory: 'Transportation',
        mostActiveMember: 'Pat',
        lastActivity: '2024-04-10'
      }
    }
  ]);

  const handleNewGroupInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroup({ ...newGroup, name: e.target.value });
  };

  const handleNewGroupMemberInput = (index: number, value: string) => {
    const updatedMembers = [...newGroup.members];
    updatedMembers[index] = value;
    setNewGroup({ ...newGroup, members: updatedMembers });
  };

  const addNewMember = () => {
    setNewGroup({
      ...newGroup,
      members: [...newGroup.members, ''],
    });
  };

  const removeMember = (index: number) => {
    if (index === 0) return; // Don't remove "Me"
    const updatedMembers = [...newGroup.members];
    updatedMembers.splice(index, 1);
    setNewGroup({ ...newGroup, members: updatedMembers });
  };

  const handleAddGroup = () => {
    // Simple validation
    if (!newGroup.name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    const filteredMembers = newGroup.members.filter(member => member.trim());
    if (filteredMembers.length < 2) {
      toast.error("Please add at least one other person to your group");
      return;
    }

    const group: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGroup.name,
      members: filteredMembers,
      expenses: [],
      createdAt: new Date().toISOString().split('T')[0],
      description: '',
      settings: {
        currency: 'USD',
        defaultSplitType: 'equal',
        notifications: true,
        autoSettle: false,
        privacy: 'private'
      },
      statistics: {
        totalSpent: 0,
        averagePerPerson: 0,
        mostExpensiveCategory: '',
        mostActiveMember: '',
        lastActivity: ''
      }
    };

    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    setActiveGroup(group.id);
    setNewGroup({ name: '', members: ['Me', ''] });
    setIsAddingGroup(false);
    toast.success("Group created successfully");
  };

  const handleNewExpenseInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleSplitTypeChange = (value: string) => {
    setNewExpense({ 
      ...newExpense, 
      splitType: value as 'equal' | 'custom',
      shares: {} as Record<string, number>,
    });
  };

  const handlePaidByChange = (value: string) => {
    setNewExpense({ ...newExpense, paidBy: value });
  };

  const handleCategoryChange = (value: string) => {
    setNewExpense({ ...newExpense, category: value });
  };

  const handleShareInput = (member: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setNewExpense({
      ...newExpense,
      shares: { ...newExpense.shares, [member]: amount },
    });
  };

  const handleAddExpense = () => {
    if (!activeGroup) {
      toast.error("Please select a group first");
      return;
    }

    // Validation
    if (!newExpense.title.trim()) {
      toast.error("Please enter a title for the expense");
      return;
    }

    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!newExpense.category) {
      toast.error("Please select a category");
      return;
    }

    if (!newExpense.paidBy) {
      toast.error("Please select who paid for this expense");
      return;
    }

    if (newExpense.splitType === 'custom') {
      const totalShares = Object.values(newExpense.shares).reduce((sum, share) => sum + share, 0);
      if (Math.abs(totalShares - parseFloat(newExpense.amount)) > 0.01) {
        toast.error("Custom split amounts must equal the total expense amount");
        return;
      }
    }

    const amount = parseFloat(newExpense.amount);
    const expense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      title: newExpense.title.trim(),
      amount: amount,
      paidBy: newExpense.paidBy,
      date: newExpense.date,
      splitType: newExpense.splitType as 'equal' | 'custom',
      category: newExpense.category,
      description: newExpense.description.trim(),
      status: 'pending'
    };

    if (newExpense.splitType === 'custom') {
      expense.shares = newExpense.shares;
    }

    const updatedGroups = groups.map(group => 
      group.id === activeGroup 
        ? { ...group, expenses: [...group.expenses, expense] }
        : group
    );
    
    setGroups(updatedGroups);
    setNewExpense({
      title: '',
      amount: '',
      paidBy: 'Me',
      splitType: 'equal',
      category: '',
      shares: {} as Record<string, number>,
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAddingExpense(false);
    toast.success("Expense added successfully");
  };

  const calculateBalances = (group: Group): Record<string, number> => {
    const balances: Record<string, number> = {};
    
    // Initialize balances for all members
    group.members.forEach(member => {
      balances[member] = 0;
    });
    
    // Calculate payments and debts
    group.expenses.forEach(expense => {
      const { amount, paidBy, splitType, shares } = expense;
      
      // Add what the payer paid
      balances[paidBy] += amount;
      
      if (splitType === 'equal') {
        // Subtract equal shares from each member
        const perPerson = amount / group.members.length;
        group.members.forEach(member => {
          balances[member] -= perPerson;
        });
      } else if (splitType === 'custom' && shares) {
        // Subtract custom shares
        Object.entries(shares).forEach(([member, share]) => {
          balances[member] -= share;
        });
      }
    });
    
    return balances;
  };

  const getActiveGroup = (): Group | undefined => {
    return groups.find(group => group.id === activeGroup);
  };

  const getBalanceSummary = (group: Group) => {
    const balances = calculateBalances(group);
    return (
      <div className="space-y-4">
        {Object.entries(balances).map(([member, balance]) => (
          <div key={member} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  {getInitials(member)}
                </AvatarFallback>
              </Avatar>
              <span>{member}</span>
            </div>
            <span className={balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : ''}>
              {formatCurrency(balance)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const generateSettlementPlan = (group: Group) => {
    const balances = calculateBalances(group);
    const settlements = calculateSettlements(balances);
    
            return (
      <div className="space-y-4">
        {settlements.map((settlement, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  {getInitials(settlement.from)}
                </AvatarFallback>
              </Avatar>
              <span>{settlement.from}</span>
              <ArrowRight className="h-4 w-4" />
              <Avatar>
                <AvatarFallback>
                  {getInitials(settlement.to)}
                </AvatarFallback>
              </Avatar>
              <span>{settlement.to}</span>
            </div>
            <span className="font-medium">{formatCurrency(settlement.amount)}</span>
          </div>
        ))}
              </div>
            );
  };

  const getCategorySummary = (group: Group) => {
    const categories = group.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0);

            return (
      <div className="space-y-4">
        {Object.entries(categories).map(([category, amount]) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{category}</span>
              <span className="font-medium">{formatCurrency(amount)}</span>
            </div>
            <Progress value={(amount / total) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {((amount / total) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
              </div>
            );
  };

  const getMemberSpendingSummary = (group: Group) => {
    const memberSpending = group.expenses.reduce((acc, expense) => {
      acc[expense.paidBy] = (acc[expense.paidBy] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(memberSpending).reduce((sum, amount) => sum + amount, 0);

            return (
      <div className="space-y-4">
        {Object.entries(memberSpending).map(([member, amount]) => (
          <div key={member} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(member)}
                  </AvatarFallback>
                </Avatar>
                <span>{member}</span>
              </div>
              <span className="font-medium">{formatCurrency(amount)}</span>
            </div>
            <Progress value={(amount / total) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {((amount / total) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    );
  };

  // New handlers for enhanced features
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (category: string) => {
    setFilterCategory(category);
  };

  const handleSort = (sort: 'date' | 'amount' | 'category') => {
    setSortBy(sort);
  };

  const handleViewMode = (mode: 'list' | 'grid') => {
    setViewMode(mode);
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    // Export logic
  };

  const handleImport = (file: File) => {
    // Import logic
  };

  const handleGroupSettings = (settings: any) => {
    // Group settings logic
  };

  const handleMemberProfile = (member: string) => {
    setShowMemberProfile(member);
  };

  const handleExpenseDetails = (expenseId: string) => {
    setShowExpenseDetails(expenseId);
  };

  const handleAddReceipt = (expenseId: string) => {
    setShowAddReceipt(true);
  };

  const handleSplitCalculator = () => {
    setShowSplitCalculator(true);
  };

  const handleDebtGraph = () => {
    setShowDebtGraph(true);
  };

  const handleCategoryBreakdown = () => {
    setShowCategoryBreakdown(true);
  };

  const handleMemberBreakdown = () => {
    setShowMemberBreakdown(true);
  };

  const handleTimeline = () => {
    setShowTimeline(true);
  };

  const handleNotifications = () => {
    setShowNotifications(true);
  };

  const handleHelp = () => {
    setShowHelp(true);
  };

  const handleFeedback = () => {
    setShowFeedback(true);
  };

  const handleUpgrade = () => {
    setShowUpgrade(true);
  };

  const handlePrivacy = () => {
    setShowPrivacy(true);
  };
    
  const handleSecurity = () => {
    setShowSecurity(true);
  };

  const handleTerms = () => {
    setShowTerms(true);
  };

  const handleAbout = () => {
    setShowAbout(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Split Expenses
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track shared expenses with friends and groups
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsAddingGroup(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <PlusCircle className="h-4 w-4" />
              New Group
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
          </Button>
        </div>
          </div>
          
        {/* Search and Filter Section */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                placeholder="Search groups, expenses, or members..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
                      />
                    </div>
          </div>
          <Select value={filterCategory} onValueChange={handleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food & Dining</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
                  <Button 
                    variant="outline" 
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="flex items-center gap-2"
          >
            {viewMode === 'list' ? (
              <>
                <Grid className="h-4 w-4" />
                Grid View
              </>
            ) : (
              <>
                <List className="h-4 w-4" />
                List View
              </>
            )}
          </Button>
        </div>
        
        {/* Groups Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <motion.div
                      key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${group.color}`}>
                        <span className="text-2xl">{group.icon}</span>
                      </div>
                    <div>
                        <CardTitle>{group.name}</CardTitle>
              <CardDescription>
                          {group.members.length} members • Created {formatDate(group.createdAt)}
              </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                    </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowGroupSettings(true)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowGroupInvite(true)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite Members
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowExportOptions(true)}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {group.members.length} members
                        </span>
                          </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Total: {formatCurrency(group.expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                        </span>
                            </div>
                          </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={
                          (group.expenses.filter((exp) => exp.status === 'settled').length /
                            group.expenses.length) *
                          100
                        }
                        className="h-2"
                      />
                      <span className="text-sm text-muted-foreground">
                        {group.expenses.filter((exp) => exp.status === 'settled').length}/
                        {group.expenses.length} settled
                      </span>
                </div>
                            <div className="flex flex-wrap gap-2">
                      {group.expenses.slice(0, 3).map((expense) => (
                        <Badge
                          key={expense.id}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {expense.category === 'Food' && <Utensils className="h-3 w-3" />}
                          {expense.category === 'Travel' && <Plane className="h-3 w-3" />}
                          {expense.category === 'Utilities' && <Zap className="h-3 w-3" />}
                          {expense.category === 'Entertainment' && <Film className="h-3 w-3" />}
                          {expense.title}
                        </Badge>
                      ))}
                      {group.expenses.length > 3 && (
                        <Badge variant="outline">+{group.expenses.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                        <Button 
                    className="w-full"
                    onClick={() => setActiveGroup(group.id)}
                  >
                    View Details
                        </Button>
                </CardFooter>
              </Card>
            </motion.div>
                              ))}
                          </div>
                          
        {/* Active Group Details */}
        {activeGroup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {getActiveGroup()?.name}
                </h2>
                <p className="text-muted-foreground">
                  {getActiveGroup()?.members.length} members • Created{' '}
                  {formatDate(getActiveGroup()?.createdAt)}
                </p>
                            </div>
              <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                  onClick={() => setIsAddingExpense(true)}
                  className="flex items-center gap-2"
                  >
                  <PlusCircle className="h-4 w-4" />
                  Add Expense
                  </Button>
                              <Button
                  variant="outline"
                  onClick={() => setShowStatistics(true)}
                  className="flex items-center gap-2"
                              >
                  <BarChart3 className="h-4 w-4" />
                  Statistics
                  </Button>
                </div>
              </div>
                        
            <Tabs defaultValue="expenses" className="space-y-4">
              <TabsList>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="balances">Balances</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="expenses" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getActiveGroup()?.expenses.map((expense) => (
                    <Card key={expense.id} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{expense.title}</CardTitle>
                            <CardDescription>
                              {formatDate(expense.date)}
                            </CardDescription>
                        </div>
                          <Badge
                            variant={expense.status === 'settled' ? 'default' : 'secondary'}
                          >
                            {expense.status}
                          </Badge>
                          </div>
                      </CardHeader>
                      <CardContent>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                      <Avatar>
                                <AvatarFallback>
                                          {getInitials(expense.paidBy)}
                                        </AvatarFallback>
                                      </Avatar>
                              <span className="text-sm text-muted-foreground">
                                Paid by {expense.paidBy}
                              </span>
                        </div>
                            <div className="text-lg font-semibold">
                              {formatCurrency(expense.amount)}
                      </div>
                        </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{expense.category}</Badge>
                            {expense.tags?.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                                        </Badge>
                            ))}
                        </div>
                          {expense.description && (
                            <p className="text-sm text-muted-foreground">
                              {expense.description}
                            </p>
                        )}
                </div>
              </CardContent>
                      <CardFooter>
                        <div className="flex items-center gap-2 w-full">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleExpenseDetails(expense.id)}
                          >
                            <Info className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          {expense.receipt && (
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setShowReceipt(expense.receipt)}
                            >
                              <Receipt className="h-4 w-4 mr-2" />
                              Receipt
                            </Button>
                          )}
                                    </div>
                      </CardFooter>
            </Card>
                            ))}
              </div>
              </TabsContent>
            
              <TabsContent value="balances" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                      <CardTitle>Current Balances</CardTitle>
                      <CardDescription>
                        Who owes what to whom
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getBalanceSummary(getActiveGroup()!)}
                            </CardContent>
              </Card>
                          <Card>
                    <CardHeader>
                      <CardTitle>Settlement Plan</CardTitle>
                      <CardDescription>
                        Recommended way to settle debts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {generateSettlementPlan(getActiveGroup()!)}
                            </CardContent>
                          </Card>
                      </div>
              </TabsContent>
                          
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                    <CardHeader>
                      <CardTitle>Category Breakdown</CardTitle>
                      <CardDescription>
                        Spending by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getCategorySummary(getActiveGroup()!)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Member Spending</CardTitle>
                      <CardDescription>
                        Individual spending patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getMemberSpendingSummary(getActiveGroup()!)}
                            </CardContent>
                          </Card>
                      </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Modals and Dialogs */}
        <Dialog open={isAddingGroup} onOpenChange={setIsAddingGroup}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Set up a new group for splitting expenses
              </DialogDescription>
            </DialogHeader>
                        <div className="space-y-4">
              <div>
                <Label>Group Name</Label>
                <Input
                  value={newGroup.name}
                  onChange={(e) => handleNewGroupInput(e)}
                  placeholder="Enter group name"
                />
                    </div>
              <div>
                <Label>Members</Label>
                <div className="space-y-2">
                  {newGroup.members.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={member}
                        onChange={(e) => handleNewGroupMemberInput(index, e.target.value)}
                        placeholder="Enter member name"
                      />
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMember(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                    </Button>
                      )}
                            </div>
                          ))}
                  <Button
                    variant="outline"
                    onClick={addNewMember}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                        </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingGroup(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Record a new expense for the group
              </DialogDescription>
            </DialogHeader>
                      <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                            <Input 
                    id="title"
                              name="title"
                              value={newExpense.title} 
                              onChange={handleNewExpenseInput} 
                    placeholder="Enter expense title"
                            />
                          </div>
                          <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                            <Input 
                      id="amount"
                              name="amount"
                              type="number" 
                              value={newExpense.amount} 
                              onChange={handleNewExpenseInput}
                      placeholder="Enter amount"
                                className="pl-7"
                      min="0"
                      step="0.01"
                            />
                            </div>
                          </div>
                        </div>
                        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                            <Select 
                              value={newExpense.category} 
                              onValueChange={handleCategoryChange}
                            >
                    <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                      <SelectItem value="Food">Food & Dining</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                                <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Health">Health & Medical</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            </div>
                <div className="space-y-2">
                  <Label htmlFor="paidBy">Paid By</Label>
                  <Select
                    value={newExpense.paidBy}
                    onValueChange={handlePaidByChange}
                  >
                    <SelectTrigger id="paidBy">
                      <SelectValue placeholder="Select who paid" />
                    </SelectTrigger>
                    <SelectContent>
                      {getActiveGroup()?.members.map((member) => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                              </SelectContent>
                            </Select>
                            </div>
                          </div>
                          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                  <Label htmlFor="splitType">Split Type</Label>
                  <Select
                    value={newExpense.splitType}
                    onValueChange={handleSplitTypeChange}
                  >
                    <SelectTrigger id="splitType">
                      <SelectValue placeholder="Select split type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Equal</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newExpense.date}
                    onChange={handleNewExpenseInput}
                  />
                          </div>
                        </div>
                        
                        {newExpense.splitType === 'custom' && (
                <div className="space-y-4">
                            <Label>Custom Split</Label>
                            <div className="space-y-2">
                              {getActiveGroup()?.members.map((member) => (
                                <div key={member} className="flex items-center gap-2">
                        <Label className="w-24">{member}</Label>
                                  <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                  <Input 
                                    type="number" 
                            value={newExpense.shares[member] || ''}
                                    onChange={(e) => handleShareInput(member, e.target.value)}
                            placeholder="Enter share"
                                      className="pl-7"
                            min="0"
                            step="0.01"
                                  />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newExpense.description}
                  onChange={handleNewExpenseInput}
                  placeholder="Add any additional details about this expense"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddingExpense(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddExpense}>
                Add Expense
                          </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Additional Modals */}
        <Dialog open={showStatistics} onOpenChange={setShowStatistics}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Group Statistics</DialogTitle>
              <DialogDescription>
                Detailed analysis of group expenses
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [{
                        label: 'Total Spending',
                        data: [1200, 1900, 1500, 2100, 1800, 2400],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.4,
                      }],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                    </CardContent>
        </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <Pie
                    data={{
                      labels: ['Food', 'Travel', 'Utilities', 'Entertainment'],
                      datasets: [{
                        data: [300, 50, 100, 40],
                        backgroundColor: [
                          'rgb(255, 99, 132)',
                          'rgb(54, 162, 235)',
                          'rgb(255, 206, 86)',
                          'rgb(75, 192, 192)',
                        ],
                      }],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Expense Details Dialog */}
        <Dialog open={showExpenseDetails !== null} onOpenChange={() => setShowExpenseDetails(null)}>
          <DialogContent className="max-w-2xl">
            {showExpenseDetails && getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails) && (
              <>
                <DialogHeader>
                  <DialogTitle>Expense Details</DialogTitle>
                  <DialogDescription>
                    Detailed information about this expense
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Basic Information */}
                      <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.date)}
                        </p>
                          </div>
                      <Badge
                        variant={getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.status === 'settled' ? 'default' : 'secondary'}
                        className="text-sm"
                      >
                        {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.status}
                      </Badge>
                                        </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.amount || 0)}
                        </p>
                                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Category</p>
                        <Badge variant="outline" className="text-sm">
                          {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.category}
                                        </Badge>
                                    </div>
                                  </div>
                                    </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Payment Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Paid By</p>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.paidBy || '')}
                                              </AvatarFallback>
                                            </Avatar>
                          <span>{getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.paidBy}</span>
                                          </div>
                                    </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Split Type</p>
                        <Badge variant="outline" className="text-sm capitalize">
                          {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.splitType}
                        </Badge>
                                  </div>
                    </div>
                  </div>

                  {/* Split Details */}
                  {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.splitType === 'custom' && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Split Details</h4>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Member</TableHead>
                              <TableHead className="text-right">Share</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.shares || {}).map(([member, share]) => (
                              <TableRow key={member}>
                                <TableCell>{member}</TableCell>
                                <TableCell className="text-right">{formatCurrency(share)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                          </div>
                      </div>
                    )}
                    
                  {/* Description and Tags */}
                      <div className="space-y-4">
                    {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.description && (
                          <div className="space-y-2">
                        <h4 className="font-medium">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.description}
                        </p>
                                    </div>
                    )}
                    
                    {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.tags && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-sm">
                              {tag}
                            </Badge>
                            ))}
              </div>
                        </div>
                    )}
                      </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowExpenseDetails(null)}>
                    Close
                  </Button>
                  {getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.receipt && (
                    <Button onClick={() => setShowReceipt(getActiveGroup()?.expenses.find(e => e.id === showExpenseDetails)?.receipt)}>
                      View Receipt
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Receipt Dialog */}
        <Dialog open={showReceipt !== null} onOpenChange={() => setShowReceipt(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Receipt</DialogTitle>
              <DialogDescription>
                View and manage the receipt for this expense
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Receipt Image */}
              <div className="space-y-4">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden border">
                  {showReceipt ? (
                    <img
                      src={showReceipt}
                      alt="Receipt"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                                </div>
                              </div>

              {/* Receipt Details */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Receipt Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {formatDate(getActiveGroup()?.expenses.find(e => e.receipt === showReceipt)?.date)}
                      </p>
                                </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">
                        {formatCurrency(getActiveGroup()?.expenses.find(e => e.receipt === showReceipt)?.amount || 0)}
                      </p>
                              </div>
                  </div>
                        </div>
                        
                        <div className="space-y-4">
                  <h4 className="font-medium">Merchant Details</h4>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-medium">Sample Merchant</span>
                              </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Address</span>
                      <span className="font-medium">123 Sample Street</span>
                            </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="font-medium">+1 234 567 8900</span>
                    </div>
                  </div>
                        </div>
                        
                        <div className="space-y-4">
                  <h4 className="font-medium">Payment Details</h4>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Payment Method</span>
                      <span className="font-medium">Credit Card</span>
                                </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transaction ID</span>
                      <span className="font-medium">TXN123456789</span>
                              </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="default">Completed</Badge>
                            </div>
                        </div>
                      </div>
          </div>
              </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReceipt(null)}>
                Close
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add more modals for other features */}
      </div>
    </DashboardLayout>
  );
};

export default SplitExpenses;
