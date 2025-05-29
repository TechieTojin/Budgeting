import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  LineChart,
  BrainCircuit,
  ReceiptText,
  CreditCard,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Sparkles,
  DollarSign,
  BadgePercent,
  PiggyBank,
  Landmark,
  ArrowUpRight,
  ShieldCheck,
  BarChart,
  Coins,
  HandCoins,
  Star,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  Zap,
  Target,
  Users,
  Globe,
  Calculator,
  HeartPulse,
  User,
} from "lucide-react";

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  
  const financialImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvJYR6Q9FGi97myAlncDZqQVq7b6kSmalmnsnle50HuVnJaLKBJT17Luf2dr1PAPLtwug&usqp=CAU",
    "https://c0.wallpaperflare.com/preview/816/72/895/business-iphone-laptop-office.jpg",
    "https://c1.wallpaperflare.com/preview/387/493/92/chart-graph-finance-financial.jpg"
  ];
  
  // Modern gradient backgrounds
  const gradients = [
    "bg-gradient-to-br from-budget-teal/20 via-budget-teal2/20 to-primary/20",
    "bg-gradient-to-br from-primary/20 via-budget-teal/20 to-budget-teal2/20",
    "bg-gradient-to-br from-budget-teal2/20 via-primary/20 to-budget-teal/20",
  ];
  
  // Observer for section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -100px 0px", threshold: 0.2 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === financialImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [financialImages.length]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  // Array of navigation items for better organization
  const navItems = [
    { id: "features", label: "Features" },
    { id: "how-it-works", label: "How it works" },
    { id: "pricing", label: "Pricing" },
    { id: "testimonials", label: "Testimonials" },
    { id: "faq", label: "FAQ" },
  ];

  // Modern features list
  const features = [
    {
      icon: <BrainCircuit className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Get intelligent spending analysis and personalized recommendations",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Smart Goal Tracking",
      description: "Set and track your financial goals with automated progress updates",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Investment Tracking",
      description: "Monitor your investments and get performance insights",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Split Expenses",
      description: "Easily split bills and track shared expenses with friends",
    },
    {
      icon: <ReceiptText className="h-6 w-6" />,
      title: "Receipt Upload",
      description: "Upload and categorize receipts automatically",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Currency",
      description: "Track expenses in multiple currencies",
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Tax Optimization",
      description: "Get tax-saving recommendations and track deductions",
    },
    {
      icon: <HeartPulse className="h-6 w-6" />,
      title: "Financial Health",
      description: "Monitor your overall financial health score",
    },
  ];

  // Business statistics
  const stats = [
    {
      value: "$2.5M+",
      label: "Total Savings",
      icon: <PiggyBank className="h-6 w-6" />,
    },
    {
      value: "30%",
      label: "Average Savings Increase",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      value: "90%",
      label: "User Satisfaction",
      icon: <Star className="h-6 w-6" />,
    },
    {
      value: "24/7",
      label: "AI Support",
      icon: <BrainCircuit className="h-6 w-6" />,
    },
  ];

  // Business benefits
  const benefits = [
    {
      title: "Increased Efficiency",
      description: "Automate financial tasks and save up to 10 hours per week on manual work",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "Better Decision Making",
      description: "Make informed decisions with AI-powered insights and real-time analytics",
      icon: <BrainCircuit className="h-6 w-6" />,
    },
    {
      title: "Cost Reduction",
      description: "Identify and eliminate unnecessary expenses with smart expense tracking",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      title: "Improved Cash Flow",
      description: "Optimize your cash flow with predictive analytics and smart budgeting",
      icon: <TrendingUp className="h-6 w-6" />,
    },
  ];

  // Integration partners
  const integrations = [
    {
      name: "Banking",
      partners: ["Chase", "Bank of America", "Wells Fargo", "Citibank"],
    },
    {
      name: "Payment",
      partners: ["PayPal", "Stripe", "Square", "Venmo"],
    },
    {
      name: "Accounting",
      partners: ["QuickBooks", "Xero", "FreshBooks", "Wave"],
    },
    {
      name: "Investment",
      partners: ["Robinhood", "Fidelity", "Charles Schwab", "Vanguard"],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full py-4 px-6 lg:px-12 flex items-center justify-between border-b backdrop-blur-md bg-background/80">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-budget-teal to-budget-teal2 rounded-full p-1.5">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">Budgeting</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium hover:text-primary transition-colors relative ${
                  activeSection === item.id ? "text-budget-teal" : ""
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-budget-teal rounded-full" />
                )}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-budget-teal to-budget-teal2 hover:opacity-90 transition-opacity">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-lg hover:bg-muted/80 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
      {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-[73px] left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b"
          >
          <div className="p-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`py-2 px-4 text-left rounded-lg hover:bg-muted transition-colors ${
                  activeSection === item.id ? "bg-muted/80 text-budget-teal" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
            <hr className="my-2 border-border" />
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login">
                <Button variant="outline" className="w-full justify-start">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full justify-start bg-gradient-to-r from-budget-teal to-budget-teal2 hover:opacity-90 transition-opacity">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
          </motion.div>
      )}
      </AnimatePresence>

      {/* Hero Section with Modern Design */}
      <section id="hero" ref={heroRef} className="w-full pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-32 lg:pb-32 px-6 lg:px-12 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-budget-teal/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-budget-teal2/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-6">
              <Sparkles className="h-4 w-4 text-budget-teal" />
              <span className="text-sm font-medium">AI-Powered Financial Management</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-budget-teal via-budget-teal2 to-primary">
                Smarter Budgeting
              </span>
              <br /> For Your Financial Future
        </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              Take control of your finances with advanced AI insights, intelligent predictions, and personalized recommendations tailored to your financial goals.
        </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/signup">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-budget-teal to-budget-teal2 hover:opacity-90 transition-opacity shadow-lg">
              Get Started for Free
                  <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
              <button onClick={() => scrollToSection("how-it-works")}>
                <Button size="lg" variant="outline" className="border-budget-teal/20 hover:border-budget-teal/50 transition-colors">
                  See How it Works
            </Button>
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-8 pt-4">
              <div className="flex -space-x-3">
                <img 
                  src="https://randomuser.me/api/portraits/women/79.jpg" 
                  alt="User" 
                  className="w-10 h-10 rounded-full border-2 border-background"
                />
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="User" 
                  className="w-10 h-10 rounded-full border-2 border-background"
                />
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-background"
                />
                <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-background bg-muted text-xs font-medium">
                  2k+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by thousands of users worldwide
              </p>
                </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-budget-teal/20 to-budget-teal2/20 backdrop-blur-sm"></div>
              <img
                src={financialImages[0]}
                alt="Business Dashboard Preview"
                className="w-full h-[500px] object-cover rounded-2xl"
              />
                    </div>
          </motion.div>
                  </div>

        {/* Business Stats with new background */}
        <div className="container mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
                    key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card/80 backdrop-blur-sm border rounded-xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all"
            >
            <div className="bg-gradient-to-br from-budget-teal to-budget-teal2 rounded-lg p-3 text-white">
                {stat.icon}
            </div>
            <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section with new background */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://c0.wallpaperflare.com/preview/816/72/895/business-iphone-laptop-office.jpg')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Better Financial Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your finances and achieve your financial goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-background border hover:border-budget-teal/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-budget-teal to-budget-teal2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Benefits Section with new background */}
      <section className="py-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://c1.wallpaperflare.com/preview/387/493/92/chart-graph-finance-financial.jpg')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transform Your Business Finances
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how our platform can revolutionize your financial management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border hover:border-budget-teal/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-budget-teal to-budget-teal2 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
              </div>
            </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Budgeting Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to get started with your financial journey
            </p>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                description: "Sign up and set up your profile in minutes",
                icon: <User className="h-6 w-6" />,
              },
              {
                step: "02",
                title: "Connect Your Accounts",
                description: "Link your bank accounts and credit cards securely",
                icon: <CreditCard className="h-6 w-6" />,
              },
              {
                step: "03",
                title: "Start Managing",
                description: "Get insights and track your financial progress",
                icon: <TrendingUp className="h-6 w-6" />,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="p-6 rounded-xl bg-gradient-to-br from-budget-teal/5 to-budget-teal2/5 border">
                  <div className="text-4xl font-bold text-budget-teal/20 mb-4">
                    {step.step}
                </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-budget-teal to-budget-teal2 flex items-center justify-center mb-4">
                    {step.icon}
              </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
            </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-8 w-8 text-muted-foreground" />
          </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Seamless Integrations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with your favorite tools and services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrations.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border"
              >
                <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                <div className="space-y-3">
                  {category.partners.map((partner, pIndex) => (
                    <div key={pIndex} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-budget-teal" />
                      <span>{partner}</span>
              </div>
                  ))}
              </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-6 lg:px-12 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Businesses Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CFO, TechCorp",
                image: "https://randomuser.me/api/portraits/women/42.jpg",
                quote: "Budgeting has transformed how we manage our company finances. The AI insights have helped us identify significant cost savings.",
                results: "Reduced operational costs by 25%",
              },
              {
                name: "Michael Chen",
                role: "CEO, StartupX",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                quote: "The automation features have saved us countless hours. We can now focus on growing our business instead of managing spreadsheets.",
                results: "Saved 15 hours per week on financial tasks",
              },
              {
                name: "Emily Rodriguez",
                role: "Finance Director, Global Inc",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
                quote: "The real-time analytics and reporting features have given us unprecedented visibility into our financial performance.",
                results: "Improved financial forecasting accuracy by 40%",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border hover:border-budget-teal/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium">Results:</p>
                  <p className="text-sm text-budget-teal font-semibold">{testimonial.results}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing options for businesses of all sizes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$49",
                description: "Perfect for small businesses",
                features: [
                  "Up to 5 team members",
                  "Basic financial analytics",
                  "Standard integrations",
                  "Email support",
                ],
              },
              {
                name: "Professional",
                price: "$99",
                description: "Ideal for growing businesses",
                features: [
                  "Up to 20 team members",
                  "Advanced analytics & AI insights",
                  "All integrations",
                  "Priority support",
                  "Custom reporting",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: [
                  "Unlimited team members",
                  "Custom AI solutions",
                  "API access",
                  "Dedicated account manager",
                  "Custom integrations",
                  "Advanced security",
                ],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 rounded-xl bg-card border ${
                  plan.popular ? "border-budget-teal shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-budget-teal to-budget-teal2 text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                    Most Popular
            </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
            </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-budget-teal" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-budget-teal to-budget-teal2"
                        : "variant-outline"
                    }`}
                  >
                    Get Started
              </Button>
            </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-budget-teal/10 to-budget-teal2/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business Finances?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of businesses that trust Budgeting for their financial management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-budget-teal to-budget-teal2 hover:opacity-90 transition-opacity shadow-lg">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Schedule Demo
                    </Button>
                  </Link>
                </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-12 bg-muted/50 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-budget-teal to-budget-teal2 rounded-full p-1.5">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Budgeting</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Smart AI-powered financial management for businesses of all sizes.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            
              <div>
              <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a></li>
                <li><a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
                </ul>
              </div>
            
              <div>
              <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-3">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                </ul>
              </div>
            
              <div>
              <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
                </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-muted flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Budgeting. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <select className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm text-muted-foreground">
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Theme:</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
