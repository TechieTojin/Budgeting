import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mail,
  Receipt,
  Calendar,
  Tag,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  ShoppingBag,
  Home,
  Utensils,
  Car,
  Plane,
  Gift,
  Heart,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Dumbbell,
  Music,
  Book,
  Coffee,
  ShoppingCart,
  Wifi,
  Phone,
  Tv,
  GamepadIcon,
  Ticket,
  Hotel,
  Train,
  Bus,
  Ship,
  Bike,
  Walk,
  Taxi,
  Anchor,
  Compass,
  Map,
  Navigation,
  Flag,
  Star,
  Award,
  Trophy,
  Medal,
  Crown,
  Zap,
  Sparkles,
  Rocket,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Equal,
  Percent,
  Hash,
  AtSign,
  HashIcon,
  AtSignIcon,
  HashIcon as HashIcon2,
  AtSignIcon as AtSignIcon2,
} from "lucide-react";

interface EmailExtractedDataProps {
  data: {
    receipts: Array<{
      id: string;
      vendor: string;
      date: string;
      amount: number;
      category: string;
      items: Array<{
        name: string;
        price: number;
        quantity: number;
      }>;
      status: 'processed' | 'pending' | 'error';
    }>;
    subscriptions: Array<{
      id: string;
      service: string;
      amount: number;
      billingCycle: 'monthly' | 'yearly' | 'quarterly';
      nextBillingDate: string;
      status: 'active' | 'cancelled' | 'pending';
    }>;
    bills: Array<{
      id: string;
      provider: string;
      amount: number;
      dueDate: string;
      category: string;
      status: 'paid' | 'pending' | 'overdue';
    }>;
  };
  variant?: 'compact' | 'detailed';
}

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    'Shopping': <ShoppingBag className="h-4 w-4" />,
    'Housing': <Home className="h-4 w-4" />,
    'Food': <Utensils className="h-4 w-4" />,
    'Transportation': <Car className="h-4 w-4" />,
    'Travel': <Plane className="h-4 w-4" />,
    'Entertainment': <Ticket className="h-4 w-4" />,
    'Health': <Stethoscope className="h-4 w-4" />,
    'Fitness': <Dumbbell className="h-4 w-4" />,
    'Education': <GraduationCap className="h-4 w-4" />,
    'Business': <Briefcase className="h-4 w-4" />,
    'Gifts': <Gift className="h-4 w-4" />,
    'Utilities': <Wifi className="h-4 w-4" />,
    'Communication': <Phone className="h-4 w-4" />,
    'Streaming': <Tv className="h-4 w-4" />,
    'Gaming': <GamepadIcon className="h-4 w-4" />,
    'Music': <Music className="h-4 w-4" />,
    'Books': <Book className="h-4 w-4" />,
    'Coffee': <Coffee className="h-4 w-4" />,
    'Groceries': <ShoppingCart className="h-4 w-4" />,
  };
  return icons[category] || <Tag className="h-4 w-4" />;
};

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: { color: string; icon: React.ReactNode } } = {
    'processed': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
    'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
    'error': { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-4 w-4" /> },
    'active': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
    'cancelled': { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-4 w-4" /> },
    'paid': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
    'overdue': { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-4 w-4" /> },
  };

  const variant = variants[status] || variants.pending;
  return (
    <Badge variant="outline" className={`${variant.color} flex items-center gap-1`}>
      {variant.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const EmailExtractedData: React.FC<EmailExtractedDataProps> = ({ data, variant = 'detailed' }) => {
  const totalReceipts = data.receipts.length;
  const totalSubscriptions = data.subscriptions.length;
  const totalBills = data.bills.length;

  const totalAmount = data.receipts.reduce((sum, receipt) => sum + receipt.amount, 0) +
    data.subscriptions.reduce((sum, sub) => sum + sub.amount, 0) +
    data.bills.reduce((sum, bill) => sum + bill.amount, 0);

  if (variant === 'compact') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Extracted Data
          </CardTitle>
          <CardDescription>
            Summary of your email transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Receipts</p>
              <p className="text-2xl font-bold">{totalReceipts}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Subscriptions</p>
              <p className="text-2xl font-bold">{totalSubscriptions}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Bills</p>
              <p className="text-2xl font-bold">{totalBills}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Extracted Data
          </CardTitle>
          <CardDescription>
            Detailed view of your email transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Receipts Section */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Receipts ({totalReceipts})
              </h3>
              <div className="space-y-3">
                {data.receipts.map((receipt) => (
                  <div key={receipt.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{receipt.vendor}</span>
                      {getStatusBadge(receipt.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {receipt.date}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getCategoryIcon(receipt.category)}
                        {receipt.category}
                      </Badge>
                      <span className="font-medium">₹{receipt.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscriptions Section */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Subscriptions ({totalSubscriptions})
              </h3>
              <div className="space-y-3">
                {data.subscriptions.map((subscription) => (
                  <div key={subscription.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subscription.service}</span>
                      {getStatusBadge(subscription.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Next billing: {subscription.nextBillingDate}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {subscription.billingCycle}
                      </Badge>
                      <span className="font-medium">₹{subscription.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bills Section */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Bills ({totalBills})
              </h3>
              <div className="space-y-3">
                {data.bills.map((bill) => (
                  <div key={bill.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{bill.provider}</span>
                      {getStatusBadge(bill.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Due: {bill.dueDate}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getCategoryIcon(bill.category)}
                        {bill.category}
                      </Badge>
                      <span className="font-medium">₹{bill.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Receipts</p>
                <p className="text-xl font-bold">{totalReceipts}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-xl font-bold">{totalSubscriptions}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending Bills</p>
                <p className="text-xl font-bold">{totalBills}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-bold">₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 