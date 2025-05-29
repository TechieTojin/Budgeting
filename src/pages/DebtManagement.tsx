import React, { useState, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingDown,
  RefreshCw,
  AlertCircle,
  DollarSign,
  Plus,
  Calendar,
  CreditCard,
  Home,
  ArrowDownRight,
  Info,
  BarChart3,
  Clock,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Download,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

interface Debt {
  id: string;
  name: string;
  type: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: Date;
  priority: "high" | "medium" | "low";
  status: "active" | "paid" | "overdue";
}

const DebtManagement = () => {
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [newDebtAccounts, setNewDebtAccounts] = useState<Debt[]>([
    {
      id: "1",
      name: "Credit Card",
      type: "Credit Card",
      balance: 5000,
      interestRate: 19.99,
      minimumPayment: 150,
      dueDate: new Date("2024-07-15"),
      priority: "high",
      status: "active"
    },
    {
      id: "2",
      name: "Car Loan",
      type: "Auto Loan",
      balance: 25000,
      interestRate: 4.5,
      minimumPayment: 450,
      dueDate: new Date("2024-07-01"),
      priority: "medium",
      status: "active"
    },
    {
      id: "3",
      name: "Student Loan",
      type: "Education",
      balance: 35000,
      interestRate: 3.8,
      minimumPayment: 300,
      dueDate: new Date("2024-07-10"),
      priority: "low",
      status: "active"
    }
  ]);
  const [formData, setFormData] = useState({
    name: "",
    type: "Credit Card",
    balance: "",
    interestRate: "",
    minimumPayment: "",
    dueDate: "",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const totalDebt = newDebtAccounts.reduce((total, account) => total + account.balance, 0);
  const totalMinimumPayment = newDebtAccounts.reduce((total, account) => total + account.minimumPayment, 0);
  const highInterestDebt = newDebtAccounts.filter(account => account.interestRate > 10).reduce((total, account) => total + account.balance, 0);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Debt information refreshed");
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddDebt = () => {
    setShowAddDebtModal(true);
  };

  const handleCloseModal = () => {
    setShowAddDebtModal(false);
    // Reset form data
    setFormData({
      name: "",
      type: "Credit Card",
      balance: "",
      interestRate: "",
      minimumPayment: "",
      dueDate: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleSubmit = () => {
    // Form validation
    if (!formData.name || !formData.balance || !formData.interestRate || !formData.minimumPayment || !formData.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    // Create new debt account
    const newDebt = {
      id: (newDebtAccounts.length + 1).toString(),
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      interestRate: parseFloat(formData.interestRate),
      minimumPayment: parseFloat(formData.minimumPayment),
      dueDate: new Date(formData.dueDate),
      priority: formData.type === "Credit Card" ? "high" : "medium",
      status: "active"
    };

    // Add to debt accounts
    setNewDebtAccounts(prev => [...prev, newDebt]);
    
    // Show success message
    toast.success(`Added new ${formData.type}: ${formData.name}`);
    
    // Close modal
    handleCloseModal();
  };

  const handlePayNow = (accountId: string) => {
    toast.success(`Payment initiated for account #${accountId}`);
    // In a real app, this would open a payment flow
  };

  const applyStrategy = (strategy: string) => {
    setSelectedStrategy(strategy);
    toast.success(`Applied ${strategy} repayment strategy`);
    // In a real app, this would update the payment allocation
  };

  const handleAccountSelection = (id: string) => {
    setSelectedAccount(id === selectedAccount ? null : id);
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Debt Management</h1>
            <p className="text-muted-foreground">
              Track and manage your debt repayment strategy
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button className="gap-1" onClick={handleAddDebt}>
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="debts">Debts</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card className="border-primary/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Interest Rate</TableHead>
                      <TableHead className="text-right">Minimum Payment</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newDebtAccounts.map((account) => (
                      <TableRow 
                        key={account.id} 
                        className={`cursor-pointer hover:bg-muted/50 ${selectedAccount === account.id ? 'bg-muted/50' : ''}`}
                        onClick={() => handleAccountSelection(account.id)}
                      >
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{account.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(account.balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          {account.interestRate}%
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(account.minimumPayment)}
                        </TableCell>
                        <TableCell>{account.dueDate.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={account.status === "overdue" ? "destructive" : "outline"}>
                            {account.status === "overdue" ? "Overdue" : "Upcoming"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {selectedAccount && (
              <Card className="border-primary/10 animate-fadeIn">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    {newDebtAccounts.find(acc => acc.id === selectedAccount)?.name} Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Current Balance:</span>
                          <span className="font-medium">{formatCurrency(newDebtAccounts.find(acc => acc.id === selectedAccount)?.balance || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Rate:</span>
                          <span className="font-medium">{newDebtAccounts.find(acc => acc.id === selectedAccount)?.interestRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Minimum Payment:</span>
                          <span className="font-medium">{formatCurrency(newDebtAccounts.find(acc => acc.id === selectedAccount)?.minimumPayment || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Payment Due:</span>
                          <span className="font-medium">{newDebtAccounts.find(acc => acc.id === selectedAccount)?.dueDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions</h3>
                      <div className="space-x-2">
                        <Button size="sm" variant="default" onClick={() => handlePayNow(selectedAccount)}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Make Payment
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedAccount(null);
                          toast.info("Details closed");
                        }}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="debts" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>All Debts</CardTitle>
                  <CardDescription>
                  View and manage all your debts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {/* Add debts content */}
                </CardContent>
              </Card>
          </TabsContent>
              
          <TabsContent value="strategy" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Repayment Strategy</CardTitle>
                <CardDescription>
                  Optimize your debt repayment plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add strategy content */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Debt Insights</CardTitle>
                <CardDescription>
                  Get personalized insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add insights content */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Debt Modal */}
        <Dialog open={showAddDebtModal} onOpenChange={setShowAddDebtModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
              <DialogDescription>
                Enter the details of your debt account to start tracking it.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Credit Card #1"
                  className="col-span-3"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <RadioGroup 
                  className="col-span-3"
                  value={formData.type}
                  onValueChange={handleTypeChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Credit Card" id="credit-card" />
                    <Label htmlFor="credit-card" className="cursor-pointer">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Mortgage" id="mortgage" />
                    <Label htmlFor="mortgage" className="cursor-pointer">Mortgage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Student Loan" id="student-loan" />
                    <Label htmlFor="student-loan" className="cursor-pointer">Student Loan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Auto Loan" id="auto-loan" />
                    <Label htmlFor="auto-loan" className="cursor-pointer">Auto Loan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Personal Loan" id="personal-loan" />
                    <Label htmlFor="personal-loan" className="cursor-pointer">Personal Loan</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="balance" className="text-right">
                  Balance (₹)
                </Label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  placeholder="5000"
                  className="col-span-3"
                  value={formData.balance}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="interestRate" className="text-right">
                  Interest Rate (%)
                </Label>
                <Input
                  id="interestRate"
                  name="interestRate"
                  type="number"
                  placeholder="15.99"
                  className="col-span-3"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minimumPayment" className="text-right">
                  Min. Payment (₹)
                </Label>
                <Input
                  id="minimumPayment"
                  name="minimumPayment"
                  type="number"
                  placeholder="100"
                  className="col-span-3"
                  value={formData.minimumPayment}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  placeholder="15th"
                  className="col-span-3"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Add Debt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DebtManagement; 