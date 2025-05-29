import React, { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { BarChart3, ArrowLeft, Info, Shield, Fingerprint, Sparkles, TrendingUp, Wallet, Target, Scan, Eye, Smartphone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [rememberDevice, setRememberDevice] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'fingerprint' | 'faceid'>('password');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleBiometricAuth = (method: 'fingerprint' | 'faceid') => {
    setAuthMethod(method);
    setIsAuthenticating(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      
      // Reset success state after animation
      setTimeout(() => {
        setAuthSuccess(false);
        setAuthMethod('password');
      }, 2000);
    }, 2000);
  };

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
        {/* Form section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 order-2 md:order-1">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 self-start md:hidden">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to home</span>
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="mb-6">
            <div className="bg-muted/40 rounded-lg p-4 border border-border flex items-start gap-3">
              <div className="bg-budget-teal/10 rounded-full p-2 mt-0.5">
                <Shield className="h-4 w-4 text-budget-teal" />
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Secure Login</h3>
                <p className="text-xs text-muted-foreground">
                  Your connection is encrypted and your information is never shared with third parties.
                </p>
              </div>
            </div>
          </div>

            {/* Biometric Authentication Options */}
            <div className="mb-6">
              <div className="flex justify-center gap-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBiometricAuth('fingerprint')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    authMethod === 'fingerprint' 
                      ? 'bg-budget-teal/10 border-budget-teal text-budget-teal' 
                      : 'bg-muted/40 border-border hover:bg-muted/60'
                  }`}
                >
                  <div className="relative">
                    <Fingerprint className="h-6 w-6" />
                    {isAuthenticating && authMethod === 'fingerprint' && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="absolute inset-0 bg-budget-teal/20 rounded-full blur-sm" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-sm font-medium">Fingerprint</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBiometricAuth('faceid')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    authMethod === 'faceid' 
                      ? 'bg-budget-teal/10 border-budget-teal text-budget-teal' 
                      : 'bg-muted/40 border-border hover:bg-muted/60'
                  }`}
                >
                  <div className="relative">
                    <Scan className="h-6 w-6" />
                    {isAuthenticating && authMethod === 'faceid' && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="absolute inset-0 bg-budget-teal/20 rounded-full blur-sm" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-sm font-medium">Face ID</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {isAuthenticating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center mb-4"
                  >
                    <p className="text-sm text-muted-foreground">
                      {authMethod === 'fingerprint' 
                        ? 'Place your finger on the sensor...' 
                        : 'Looking for your face...'}
                    </p>
                  </motion.div>
                )}

                {authSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center mb-4"
                  >
                    <div className="inline-flex items-center gap-2 text-green-500">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Authentication successful!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>
            </div>
            
          <LoginForm />
          
            <div className="mt-8">
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Trusted Device</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Info className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Enabling this will keep you logged in on this device for 30 days, requiring fewer sign-ins.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full p-1.5">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" 
                    checked={rememberDevice} 
                    onChange={() => setRememberDevice(!rememberDevice)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-budget-teal"></div>
                  <span className="ms-3 text-sm font-medium">Remember this device</span>
                </label>
              </div>
            </div>
          </div>
          </motion.div>
        </div>

        {/* Image section with gradient overlay and glassmorphism */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-budget-teal to-budget-teal2 flex items-center justify-center p-6 md:p-12 order-1 md:order-2 relative overflow-hidden">
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
            className="max-w-md text-white relative z-10 backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl"
          >
            <div className="absolute -inset-1 bg-white/10 rounded-2xl blur-sm"></div>
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Welcome back to Budgeting
              </h2>
              <p className="mb-6 text-white/80">
                Log in to access your financial dashboard and continue your journey to financial freedom with AI-powered insights.
              </p>
              
              {/* Financial data visualization */}
              <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Monthly Overview</h3>
                  <span className="text-xs opacity-70">Last 30 days</span>
                </div>
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="text-xs opacity-70">Income</p>
                    <p className="font-bold">$4,250</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70">Expenses</p>
                    <p className="font-bold">$2,830</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70">Saved</p>
                    <p className="font-bold text-green-300">$1,420</p>
                  </div>
                </div>
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-300"
                    initial={{ width: 0 }}
                    animate={{ width: "66%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs mt-2 opacity-70 text-right">Savings rate: 33%</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-white/20 rounded-full p-1">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span>Smart Budget Tracking</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-white/20 rounded-full p-1">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span>AI-Powered Insights</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-white/20 rounded-full p-1">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <span>Expense Predictions</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-white/20 rounded-full p-1">
                    <Target className="h-4 w-4" />
                  </div>
                  <span>Personalized Reports</span>
                </motion.div>
              </div>
              
              <div className="mt-8 hidden md:block">
                <Link to="/">
                  <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to home
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
