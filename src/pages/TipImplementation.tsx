import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Brain,
  Sparkles,
  Target,
  Wallet,
  PiggyBank,
  LineChart,
  AlertTriangle,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface Tip {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: string;
  timeToImplement: string;
  detailedSteps: string[];
  estimatedSavings: number;
  aiScore: number;
  realTimeData: {
    appliedByUsers: number;
    avgSavings: number;
    successRate: number;
  };
}

const TipImplementation = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const tip = location.state?.tip as Tip;

  if (!tip) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Tip not found</h1>
          <Button onClick={() => navigate("/smart-tips")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Smart Tips
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex-1"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/smart-tips")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Smart Tips
            </Button>
            <h1 className="text-3xl font-bold mb-2">{tip.title}</h1>
            <p className="text-muted-foreground">{tip.description}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Implementation Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Time to Implement</span>
                  </div>
                  <Badge variant="outline">{tip.timeToImplement}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Difficulty</span>
                  </div>
                  <Badge variant="outline">{tip.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Estimated Savings</span>
                  </div>
                  <Badge variant="outline">${tip.estimatedSavings}/month</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Community Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Applied By</span>
                  </div>
                  <span className="font-medium">{tip.realTimeData.appliedByUsers.toLocaleString()} users</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Average Savings</span>
                  </div>
                  <span className="font-medium">${tip.realTimeData.avgSavings}/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Success Rate</span>
                  </div>
                  <span className="font-medium">{tip.realTimeData.successRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-32 w-32 rounded-full border-8 border-primary/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full" style={{
                    background: `conic-gradient(var(--primary) ${tip.aiScore}deg, transparent 0deg)`
                  }} />
                  <span className="text-3xl font-bold text-primary relative z-10">
                    {tip.aiScore}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  AI confidence score based on your financial profile and historical data
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Step-by-Step Implementation
            </CardTitle>
            <CardDescription>
              Follow these steps to implement this tip in your budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {tip.detailedSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/smart-tips")}>
            Save for Later
          </Button>
          <Button onClick={() => navigate("/budget")}>
            Apply to My Budget
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TipImplementation; 