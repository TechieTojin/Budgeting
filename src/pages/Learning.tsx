import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PlayCircle,
  BookOpen,
  Lightbulb,
  ChevronRight,
  Star,
  Clock,
  Users,
  Shield,
  Zap,
  Brain,
  Target,
  TrendingUp,
  MessageSquare,
  Download,
  Upload,
  Search,
  Globe,
  Calculator,
  HeartPulse,
  Award,
  Bookmark,
  Share2,
  Download as DownloadIcon,
  ThumbsUp,
  Eye,
  CheckCircle2,
  ArrowRight,
  FileText,
  Video,
  BookOpenCheck,
  GraduationCap,
  Trophy,
  Sparkles,
  HelpCircle,
  Settings,
  CreditCard,
  Receipt,
  Mail,
  PieChart,
  BarChart,
  LineChart,
  DollarSign,
  Calendar,
  Bell,
  UserPlus,
  Key,
  Lock,
  Smartphone,
  Laptop,
  Tablet,
  Tags,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const Learning = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("getting-started");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Help Center States
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [showSecurityTips, setShowSecurityTips] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showBankConnection, setShowBankConnection] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [showAmountFilters, setShowAmountFilters] = useState(false);
  const [showAICategories, setShowAICategories] = useState(false);
  const [showCustomCategories, setShowCustomCategories] = useState(false);
  const [showSpendingCharts, setShowSpendingCharts] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [showSolutions, setShowSolutions] = useState<string | null>(null);

  // Add new state for main navigation dialogs
  const [showAccountSetup, setShowAccountSetup] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showReceipts, setShowReceipts] = useState(false);
  const [showEmailIntegration, setShowEmailIntegration] = useState(false);

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Get intelligent spending analysis and personalized recommendations",
      videoId: "dQw4w9WgXcQ", // Example video ID
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Smart Goal Tracking",
      description: "Set and track your financial goals with automated progress updates",
      videoId: "jNQXAC9IVRw", // Example video ID
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Investment Tracking",
      description: "Monitor your investments and get performance insights",
      videoId: "kJQP7kiw5Fk", // Example video ID
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Split Expenses",
      description: "Easily split bills and track shared expenses with friends",
      videoId: "OPf0YbXqDm0", // Example video ID
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Receipt Upload",
      description: "Upload and categorize receipts automatically",
      videoId: "RgKAFK5djSk", // Example video ID
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Email Extraction",
      description: "Automatically extract transactions from your emails",
      videoId: "09R8_2nJtjg", // Example video ID
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Search",
      description: "Quickly find any transaction with advanced search",
      videoId: "hT_nvWreIhg", // Example video ID
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Currency",
      description: "Track expenses in multiple currencies",
      videoId: "fJ9rUzIMcZQ", // Example video ID
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Tax Optimization",
      description: "Get tax-saving recommendations and track deductions",
      videoId: "YykjpeuMNEk", // Example video ID
    },
    {
      icon: <HeartPulse className="h-6 w-6" />,
      title: "Financial Health",
      description: "Monitor your overall financial health score",
      videoId: "hT_nvWreIhg", // Example video ID
    },
  ];

  const tutorials = [
    {
      title: "Getting Started with Budgeting",
      duration: "5:30",
      videoId: "dQw4w9WgXcQ",
      description: "Learn the basics of Budgeting and how to set up your account",
      views: "1.2M",
      likes: "45K",
      date: "2024-03-15",
    },
    {
      title: "Smart Categorization Guide",
      duration: "4:15",
      videoId: "jNQXAC9IVRw",
      description: "Master the art of automatic transaction categorization",
      views: "856K",
      likes: "32K",
      date: "2024-03-10",
    },
    {
      title: "Investment Tracking Tutorial",
      duration: "6:45",
      videoId: "kJQP7kiw5Fk",
      description: "Learn how to track and analyze your investments",
      views: "2.1M",
      likes: "78K",
      date: "2024-03-05",
    },
    {
      title: "Advanced Features Walkthrough",
      duration: "8:20",
      videoId: "OPf0YbXqDm0",
      description: "Explore advanced features and customization options",
      views: "1.5M",
      likes: "56K",
      date: "2024-03-01",
    },
  ];

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleShare = (videoId: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(url);
    // You can add a toast notification here
  };

  // Help Center Handlers
  const handleGuideClick = (guide: string) => {
    setActiveGuide(guide);
    toast({
      title: "Guide Opened",
      description: `Opening ${guide} guide...`,
    });
  };

  const handleSecurityTips = () => {
    setShowSecurityTips(true);
    toast({
      title: "Security Tips",
      description: "Loading security recommendations...",
    });
  };

  const handlePrivacySettings = () => {
    setShowPrivacySettings(true);
    toast({
      title: "Privacy Settings",
      description: "Loading privacy configuration...",
    });
  };

  const handleBankConnection = () => {
    setShowBankConnection(true);
    toast({
      title: "Bank Connection",
      description: "Starting bank connection process...",
    });
  };

  const handleProfileSettings = () => {
    setShowProfileSettings(true);
    toast({
      title: "Profile Settings",
      description: "Loading profile configuration...",
    });
  };

  const handleNotifications = () => {
    setShowNotifications(true);
    toast({
      title: "Notifications",
      description: "Loading notification preferences...",
    });
  };

  const handleDateFilters = () => {
    setShowDateFilters(true);
    toast({
      title: "Date Filters",
      description: "Loading date filter options...",
    });
  };

  const handleAmountFilters = () => {
    setShowAmountFilters(true);
    toast({
      title: "Amount Filters",
      description: "Loading amount filter options...",
    });
  };

  const handleAICategories = () => {
    setShowAICategories(true);
    toast({
      title: "AI Categories",
      description: "Loading AI categorization options...",
    });
  };

  const handleCustomCategories = () => {
    setShowCustomCategories(true);
    toast({
      title: "Custom Categories",
      description: "Loading custom category options...",
    });
  };

  const handleSpendingCharts = () => {
    setShowSpendingCharts(true);
    toast({
      title: "Spending Charts",
      description: "Loading spending analysis...",
    });
  };

  const handleTrends = () => {
    setShowTrends(true);
    toast({
      title: "Spending Trends",
      description: "Loading trend analysis...",
    });
  };

  const handleSolutions = (issue: string) => {
    setShowSolutions(issue);
    toast({
      title: "Solutions",
      description: `Loading solutions for ${issue}...`,
    });
  };

  // Add handlers for main navigation
  const handleAccountSetup = () => {
    setShowAccountSetup(true);
    toast({
      title: "Account Setup",
      description: "Opening account setup guide...",
    });
  };

  const handleTransactions = () => {
    setShowTransactions(true);
    toast({
      title: "Transactions",
      description: "Opening transactions guide...",
    });
  };

  const handleReceipts = () => {
    setShowReceipts(true);
    toast({
      title: "Receipts",
      description: "Opening receipts guide...",
    });
  };

  const handleEmailIntegration = () => {
    setShowEmailIntegration(true);
    toast({
      title: "Email Integration",
      description: "Opening email integration guide...",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Center</h1>
            <p className="text-muted-foreground">
              Master Budgeting with our comprehensive guides and tutorials
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Premium Content
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated Weekly
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              Certified Courses
            </Badge>
          </div>
        </div>

        {selectedVideo && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="getting-started" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
            <TabsTrigger value="help-center">Help Center</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Budgeting</CardTitle>
                <CardDescription>
                  Your all-in-one financial management solution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Start Guide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Why Choose Budgeting?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          AI-powered financial insights
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Automated expense tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Smart goal management
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Real-time financial health monitoring
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Security First
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Bank-level encryption
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Two-factor authentication
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Regular security audits
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Data privacy compliance
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Quick Start Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
                          Create your account
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
                          Connect your accounts
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">3</span>
                          Set your first budget
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">4</span>
                          Start tracking expenses
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                {/* Learning Path */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Your Learning Path
                    </CardTitle>
                    <CardDescription>
                      Follow our structured learning path to master Budgeting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <h3 className="font-medium">Beginner Level</h3>
                          </div>
                          <Progress value={100} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-2">
                            Complete basic setup and understand core features
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Completed
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                            <h3 className="font-medium">Intermediate Level</h3>
                          </div>
                          <Progress value={60} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-2">
                            Master advanced features and automation
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Continue
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="h-5 w-5 text-purple-500" />
                            <h3 className="font-medium">Advanced Level</h3>
                          </div>
                          <Progress value={20} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-2">
                            Become a power user with expert features
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Start
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Documentation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Essential Guides</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <BookOpenCheck className="h-4 w-4 text-primary" />
                            <a href="#" className="text-primary hover:underline">User Manual</a>
                          </li>
                          <li className="flex items-center gap-2">
                            <BookOpenCheck className="h-4 w-4 text-primary" />
                            <a href="#" className="text-primary hover:underline">API Documentation</a>
                          </li>
                          <li className="flex items-center gap-2">
                            <BookOpenCheck className="h-4 w-4 text-primary" />
                            <a href="#" className="text-primary hover:underline">Security Guide</a>
                          </li>
                        </ul>
                      </div>
                      <Button variant="outline" className="w-full">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download All Guides
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-primary" />
                        Video Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Featured Tutorials</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 text-primary" />
                            <a href="#" className="text-primary hover:underline">Getting Started Video Series</a>
                          </li>
                          <li className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 text-primary" />
                            <a href="#" className="text-primary hover:underline">Advanced Features Walkthrough</a>
                          </li>
                          <li className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 text-primary" />
                            <a href="#" className="text-primary hover:underline">Tips & Tricks</a>
                          </li>
                        </ul>
                      </div>
                      <Button variant="outline" className="w-full">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        View All Videos
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Community Support */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Community Support
                    </CardTitle>
                    <CardDescription>
                      Join our community for help and discussions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                        <MessageSquare className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium">Community Forum</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Connect with other users and share experiences
                        </p>
                        <Button variant="link" className="mt-2">
                          Join Forum
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                        <Lightbulb className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium">Knowledge Base</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Browse our extensive collection of articles
                        </p>
                        <Button variant="link" className="mt-2">
                          Explore Articles
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                        <BookOpen className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium">Blog</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Latest updates and feature announcements
                        </p>
                        <Button variant="link" className="mt-2">
                          Read Blog
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {feature.icon}
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleVideoSelect(feature.videoId)}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Watch Tutorial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={`https://img.youtube.com/vi/${tutorial.videoId}/maxresdefault.jpg`}
                      alt={tutorial.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {tutorial.duration}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-primary" />
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription>{tutorial.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {tutorial.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {tutorial.likes}
                      </span>
                      <span>{tutorial.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => handleVideoSelect(tutorial.videoId)}
                    >
                      Watch Tutorial
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleShare(tutorial.videoId)}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="help-center" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Help Center
                </CardTitle>
                <CardDescription>
                  Comprehensive guides and step-by-step tutorials for using Budgeting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={handleAccountSetup}
                  >
                    <Settings className="h-6 w-6" />
                    <span>Account Setup</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={handleTransactions}
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Transactions</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={handleReceipts}
                  >
                    <Receipt className="h-6 w-6" />
                    <span>Receipts</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={handleEmailIntegration}
                  >
                    <Mail className="h-6 w-6" />
                    <span>Email Integration</span>
                  </Button>
                </div>

                {/* Step-by-Step Guides */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Step-by-Step Guides</h2>
                  
                  {/* Account Setup Guide */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        Account Setup Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            1
                          </div>
                          <div>
                            <h3 className="font-medium">Create Your Account</h3>
                            <p className="text-sm text-muted-foreground">
                              Sign up with your email and create a strong password. Enable two-factor authentication for added security.
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleSecurityTips}
                              >
                                <Key className="mr-2 h-4 w-4" />
                                Security Tips
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handlePrivacySettings}
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                Privacy Settings
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            2
                          </div>
                          <div>
                            <h3 className="font-medium">Connect Your Accounts</h3>
                            <p className="text-sm text-muted-foreground">
                              Link your bank accounts, credit cards, and investment accounts securely.
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleBankConnection}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Add Bank Account
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleSecurityTips}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Security Info
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            3
                          </div>
                          <div>
                            <h3 className="font-medium">Set Up Your Profile</h3>
                            <p className="text-sm text-muted-foreground">
                              Customize your profile, set preferences, and configure notifications.
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleProfileSettings}
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Profile Settings
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleNotifications}
                              >
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transaction Management Guide */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Transaction Management Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            1
                          </div>
                          <div>
                            <h3 className="font-medium">View Transactions</h3>
                            <p className="text-sm text-muted-foreground">
                              Access your transaction history, filter by date, category, or amount.
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleDateFilters}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Date Filters
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleAmountFilters}
                              >
                                <DollarSign className="mr-2 h-4 w-4" />
                                Amount Filters
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            2
                          </div>
                          <div>
                            <h3 className="font-medium">Categorize Transactions</h3>
                            <p className="text-sm text-muted-foreground">
                              Use AI-powered categorization or manually assign categories.
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleAICategories}
                              >
                                <Brain className="mr-2 h-4 w-4" />
                                AI Categories
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleCustomCategories}
                              >
                                <Tags className="mr-2 h-4 w-4" />
                                Custom Categories
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            3
                          </div>
                          <div>
                            <h3 className="font-medium">Analyze Spending</h3>
                            <p className="text-sm text-muted-foreground">
                              View spending patterns and get insights through various charts.
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleSpendingCharts}
                              >
                                <PieChart className="mr-2 h-4 w-4" />
                                Spending Charts
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleTrends}
                              >
                                <BarChart className="mr-2 h-4 w-4" />
                                Trends
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Device Support */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-primary" />
                        Device Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                          <Smartphone className="h-8 w-8 text-primary mb-2" />
                          <h3 className="font-medium">Mobile App</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            iOS and Android support
                          </p>
                          <Button variant="link" className="mt-2">
                            Download App
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                          <Laptop className="h-8 w-8 text-primary mb-2" />
                          <h3 className="font-medium">Web Browser</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Chrome, Firefox, Safari
                          </p>
                          <Button variant="link" className="mt-2">
                            Browser Guide
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                          <Tablet className="h-8 w-8 text-primary mb-2" />
                          <h3 className="font-medium">Tablet Support</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            iPad and Android tablets
                          </p>
                          <Button variant="link" className="mt-2">
                            Tablet Guide
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Troubleshooting */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        Common Issues & Solutions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            Account Access Issues
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Solutions for login problems, password reset, and 2FA issues
                          </p>
                          <Button 
                            variant="link" 
                            className="mt-2"
                            onClick={() => handleSolutions("Account Access")}
                          >
                            View Solutions
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Transaction Sync Problems
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Fix issues with bank connections and transaction syncing
                          </p>
                          <Button 
                            variant="link" 
                            className="mt-2"
                            onClick={() => handleSolutions("Transaction Sync")}
                          >
                            View Solutions
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-primary" />
                            Receipt Upload Issues
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Troubleshoot problems with receipt scanning and processing
                          </p>
                          <Button 
                            variant="link" 
                            className="mt-2"
                            onClick={() => handleSolutions("Receipt Upload")}
                          >
                            View Solutions
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">How secure is my financial data?</h3>
                    <p className="text-sm text-muted-foreground">
                      We use bank-level encryption and security measures to protect your data. All data is encrypted in transit and at rest.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Can I connect multiple bank accounts?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can connect multiple bank accounts, credit cards, and investment accounts to get a complete view of your finances.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">How accurate is the AI categorization?</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI categorization is highly accurate and learns from your corrections to improve over time.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Is my data shared with third parties?</h3>
                    <p className="text-sm text-muted-foreground">
                      No, we never share your financial data with third parties. Your privacy is our top priority.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs for Help Center */}
      <Dialog open={showSecurityTips} onOpenChange={setShowSecurityTips}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Security Tips</DialogTitle>
            <DialogDescription>
              Essential security recommendations for your Budgeting account
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Strong Password</h3>
                <p className="text-sm text-muted-foreground">
                  Use a unique, complex password with a mix of letters, numbers, and symbols.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Enable 2FA for an extra layer of security.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Regular Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your app and devices updated with the latest security patches.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacySettings} onOpenChange={setShowPrivacySettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Settings</DialogTitle>
            <DialogDescription>
              Configure your privacy preferences
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Data Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Control how your data is shared and used.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Manage analytics and usage data collection.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showBankConnection} onOpenChange={setShowBankConnection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Bank Account</DialogTitle>
            <DialogDescription>
              Securely connect your bank account to Budgeting
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Select Your Bank</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from our list of supported banks.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Security Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the secure verification process.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileSettings} onOpenChange={setShowProfileSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>
              Customize your profile and preferences
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Personal Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your name, email, and contact information.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Set your language, currency, and time zone.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Account Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account settings and preferences.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Configure your notification preferences
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your email notification preferences.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Configure push notification settings.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Alert Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Set up budget alerts and reminders.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showDateFilters} onOpenChange={setShowDateFilters}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Date Filters</DialogTitle>
            <DialogDescription>
              Filter transactions by date range
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Quick Filters</h3>
                <p className="text-sm text-muted-foreground">
                  Select from predefined date ranges.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Custom Range</h3>
                <p className="text-sm text-muted-foreground">
                  Set custom start and end dates.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showAmountFilters} onOpenChange={setShowAmountFilters}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Amount Filters</DialogTitle>
            <DialogDescription>
              Filter transactions by amount
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Amount Range</h3>
                <p className="text-sm text-muted-foreground">
                  Set minimum and maximum amounts.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Transaction Type</h3>
                <p className="text-sm text-muted-foreground">
                  Filter by income or expenses.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showAICategories} onOpenChange={setShowAICategories}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Categories</DialogTitle>
            <DialogDescription>
              Manage AI-powered transaction categorization
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">AI Learning</h3>
                <p className="text-sm text-muted-foreground">
                  How AI learns from your categorization patterns.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Category Rules</h3>
                <p className="text-sm text-muted-foreground">
                  Set rules for automatic categorization.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showCustomCategories} onOpenChange={setShowCustomCategories}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom Categories</DialogTitle>
            <DialogDescription>
              Create and manage custom transaction categories
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Create Category</h3>
                <p className="text-sm text-muted-foreground">
                  Add new custom categories.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Manage Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Edit or delete existing categories.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showSpendingCharts} onOpenChange={setShowSpendingCharts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Spending Charts</DialogTitle>
            <DialogDescription>
              View and analyze your spending patterns
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Category Breakdown</h3>
                <p className="text-sm text-muted-foreground">
                  View spending by category.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Time Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Track spending over time.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showTrends} onOpenChange={setShowTrends}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Spending Trends</DialogTitle>
            <DialogDescription>
              Analyze your spending trends and patterns
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Monthly Trends</h3>
                <p className="text-sm text-muted-foreground">
                  View monthly spending patterns.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Category Trends</h3>
                <p className="text-sm text-muted-foreground">
                  Track category-specific trends.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showSolutions} onOpenChange={() => setShowSolutions(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showSolutions} Solutions</DialogTitle>
            <DialogDescription>
              Common solutions and troubleshooting steps
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {showSolutions === "Account Access" && (
                <>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Password Reset</h3>
                    <p className="text-sm text-muted-foreground">
                      Steps to reset your password securely.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">2FA Issues</h3>
                    <p className="text-sm text-muted-foreground">
                      Troubleshoot two-factor authentication problems.
                    </p>
                  </div>
                </>
              )}
              {showSolutions === "Transaction Sync" && (
                <>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Connection Issues</h3>
                    <p className="text-sm text-muted-foreground">
                      Fix bank connection problems.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Sync Errors</h3>
                    <p className="text-sm text-muted-foreground">
                      Resolve transaction synchronization issues.
                    </p>
                  </div>
                </>
              )}
              {showSolutions === "Receipt Upload" && (
                <>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Upload Problems</h3>
                    <p className="text-sm text-muted-foreground">
                      Fix receipt upload issues.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Processing Errors</h3>
                    <p className="text-sm text-muted-foreground">
                      Resolve receipt processing problems.
                    </p>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Add new dialogs for main navigation */}
      <Dialog open={showAccountSetup} onOpenChange={setShowAccountSetup}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Account Setup Guide</DialogTitle>
            <DialogDescription>
              Complete guide to setting up your Budgeting account
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <div className="p-6 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Create Your Account</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sign up with your email and create a strong password. Enable two-factor authentication for added security.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Verify Your Email</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check your email for the verification link and click it to activate your account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Security Setup</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Enable 2FA</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Set up two-factor authentication using an authenticator app or SMS.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Set Recovery Options</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add recovery email and phone number for account recovery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Profile Setup</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Personal Information</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add your name, profile picture, and other personal details.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Preferences</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Set your language, currency, and notification preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transactions Guide</DialogTitle>
            <DialogDescription>
              Learn how to manage and track your transactions
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <div className="p-6 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Viewing Transactions</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Transaction List</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        View all your transactions in a chronological list with detailed information.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Filters and Search</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use filters to find specific transactions by date, amount, or category.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Managing Transactions</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Adding Transactions</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manually add transactions or import them from your bank.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Editing and Deleting</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Modify transaction details or remove incorrect entries.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showReceipts} onOpenChange={setShowReceipts}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Receipts Guide</DialogTitle>
            <DialogDescription>
              Learn how to manage and organize your receipts
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <div className="p-6 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Uploading Receipts</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Take a Photo</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use your device's camera to capture receipt images.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Upload Files</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload existing receipt images or PDF files.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Managing Receipts</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Organizing</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Categorize and tag receipts for easy access.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Search and Filter</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Find receipts quickly using search and filters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmailIntegration} onOpenChange={setShowEmailIntegration}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Email Integration Guide</DialogTitle>
            <DialogDescription>
              Learn how to connect and manage your email accounts
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <div className="p-6 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Connecting Email</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Add Email Account</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Connect your email account securely using OAuth.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Verify Connection</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Confirm the connection and set up sync preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Managing Integration</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Sync Settings</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Configure how often to sync and what to sync.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Filters and Rules</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Set up rules for processing email transactions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Learning; 