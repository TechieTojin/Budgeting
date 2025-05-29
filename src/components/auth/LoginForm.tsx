import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Mail, Lock, Fingerprint, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import GoogleAuthButton from "./GoogleAuthButton";
import AppleAuthButton from "./AppleAuthButton";

export const LoginForm = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(null);
    }
  };

  const handleBiometricLogin = () => {
    setShowBiometricPrompt(true);
    // Simulate biometric check
    setTimeout(() => {
      setShowBiometricPrompt(false);
      setIsLoading(true);
      // Simulate login success
      setTimeout(() => {
        toast.success("Biometric login successful");
        navigate("/transaction-upload");
      }, 1000);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("Login successful");
      navigate("/transaction-upload");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-budget-teal to-budget-teal2">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Biometric login option */}
        <div className="bg-card border hover:border-budget-teal/50 transition-colors rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-budget-teal/10 rounded-full p-2">
              <Fingerprint className="h-5 w-5 text-budget-teal" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Biometric Login</h3>
              <p className="text-xs text-muted-foreground">Use fingerprint or face ID</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBiometricLogin}
            disabled={showBiometricPrompt || isLoading}
          >
            {showBiometricPrompt ? (
              <div className="flex items-center gap-2">
                <div className="animate-pulse h-2 w-2 bg-budget-teal rounded-full"></div>
                <div className="animate-pulse h-2 w-2 bg-budget-teal rounded-full" style={{ animationDelay: "200ms" }}></div>
                <div className="animate-pulse h-2 w-2 bg-budget-teal rounded-full" style={{ animationDelay: "400ms" }}></div>
              </div>
            ) : "Use"}
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <GoogleAuthButton mode="login" className="flex-1" />
        <AppleAuthButton mode="login" className="flex-1" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={handleEmailChange}
              required
              autoComplete="email"
              className={`pl-10 ${
                emailValid === false ? 'border-red-500 focus-visible:ring-red-500' : 
                emailValid === true ? 'border-green-500 focus-visible:ring-green-500' : ''
              }`}
            />
            {emailValid !== null && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {emailValid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {emailValid === false && (
            <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="pl-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-budget-teal to-budget-teal2 hover:opacity-90 transition-opacity" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
