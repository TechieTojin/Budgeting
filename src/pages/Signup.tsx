import React, { useState } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { BarChart3, ArrowLeft, ShieldCheck, CheckCircle, LockKeyhole, Sparkles, TrendingUp, Wallet, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Signup = () => {
  const [animationStep, setAnimationStep] = useState(0);

  // Simulate step animation for process visualization
  React.useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with glassmorphism */}
      <div className="flex justify-between items-center p-4 md:p-6 sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            className="bg-gradient-to-r from-budget-teal to-budget-teal2 rounded-full p-1.5 group-hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 className="h-5 w-5 text-white" />
          </motion.div>
          <span className="font-bold">Budgeting</span>
        </Link>
        <ThemeToggle />
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Feature section with glassmorphism */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-budget-teal to-budget-teal2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
          {/* Animated decorative elements */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-xl"
            animate={{ 
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-xl"
            animate={{ 
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md text-white relative z-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Start your financial journey with Budgeting
            </h2>
            <p className="mb-6 text-white/80">
              Join thousands of users who are taking control of their finances with our AI-powered budgeting platform.
            </p>
            
            {/* Process visualization */}
            <motion.div 
              className="mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-medium mb-4">How it works</h3>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Create your account",
                    description: "Sign up with your email or social accounts",
                    icon: <CheckCircle className="h-4 w-4" />
                  },
                  {
                    step: 2,
                    title: "Connect your accounts",
                    description: "Securely link your bank and credit cards",
                    icon: <LockKeyhole className="h-4 w-4" />
                  },
                  {
                    step: 3,
                    title: "Set your goals",
                    description: "Define savings targets and budget limits",
                    icon: <Target className="h-4 w-4" />
                  },
                  {
                    step: 4,
                    title: "Start saving",
                    description: "Get insights and watch your savings grow",
                    icon: <TrendingUp className="h-4 w-4" />
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <motion.div 
                      className={`rounded-full h-7 w-7 flex items-center justify-center text-xs ${animationStep === index ? 'bg-white text-budget-teal' : 'bg-white/20'} transition-colors`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.step}
                    </motion.div>
                  <div className="flex-1 pt-0.5">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-white/70 mt-1">{item.description}</p>
                  </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <div className="space-y-6">
              {[
                {
                  title: "Smart Budgeting",
                  description: "Set up categories and track spending automatically with our AI categorization.",
                  icon: <Sparkles className="h-5 w-5" />
                },
                {
                  title: "Personalized Insights",
                  description: "Get tailored financial advice based on your spending patterns and habits.",
                  icon: <TrendingUp className="h-5 w-5" />
                },
                {
                  title: "Future Projections",
                  description: "Predict future expenses and plan ahead with our AI-powered forecasting.",
                  icon: <Wallet className="h-5 w-5" />
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 shadow-lg transition-all hover:bg-white/20 hover:shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 rounded-full p-1.5">
                      {feature.icon}
                  </div>
                    <span className="font-medium">{feature.title}</span>
                  </div>
                  <p className="text-sm ml-9">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-8 hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Form section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 self-start md:hidden">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to home</span>
          </Link>
          
          {/* Security badge */}
          <motion.div 
            className="mb-6 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-muted/40 rounded-lg p-4 border border-border flex items-start gap-3">
              <div className="bg-green-500/10 rounded-full p-2 mt-0.5">
                <ShieldCheck className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Secure Sign Up</h3>
                <p className="text-xs text-muted-foreground">
                  Your data is encrypted with bank-level security. We never store your financial credentials.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <LockKeyhole className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">SSL encrypted connection</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SignupForm />
          </motion.div>
          
          {/* Testimonial */}
          <motion.div 
            className="mt-8 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <img 
                  src="https://randomuser.me/api/portraits/women/79.jpg" 
                  alt="User" 
                  className="w-10 h-10 rounded-full border-2 border-background"
                />
                <div>
                  <div className="flex items-center mb-1">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-xs font-medium">5.0</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    "Budgeting helped me save an extra $450 each month! The AI insights are spot on and helped me identify areas where I was overspending."
                  </p>
                  <p className="text-xs font-medium mt-2">Sarah J. - Marketing Manager</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
