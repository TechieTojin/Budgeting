import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, User, Mail, Lock, CheckCircle2, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import GoogleAuthButton from "./GoogleAuthButton";
import AppleAuthButton from "./AppleAuthButton";

export const SignupForm = () => {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasLength: false,
    hasNumber: false,
    hasUpper: false,
    hasSpecial: false
  });
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Calculate password strength on password change
    const password = formData.password;
    
    // Check different criteria
    const hasLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calculate score (0-4)
    let score = 0;
    if (hasLength) score++;
    if (hasNumber) score++;
    if (hasUpper) score++;
    if (hasSpecial) score++;
    
    setPasswordStrength({
      score,
      hasLength,
      hasNumber,
      hasUpper,
      hasSpecial
    });
  }, [formData.password]);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    setFormData({
      ...formData,
      [id]: value,
    });
    
    if (id === 'email' && value) {
      setEmailValid(validateEmail(value));
    } else if (id === 'email' && !value) {
      setEmailValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Validate password strength
    if (passwordStrength.score < 3) {
      toast.error("Please create a stronger password");
      return;
    }
    
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success("Account created successfully");
      navigate("/transaction-upload");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-budget-teal to-budget-teal2">Create an account</h1>
        <p className="text-muted-foreground">Enter your information to get started</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-center gap-4">
          <GoogleAuthButton mode="signup" className="flex-1" />
          <AppleAuthButton mode="signup" className="flex-1" />
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="pl-10"
            />
            {formData.name && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className={`pl-10 ${
                formData.password && passwordStrength.score < 2 ? 'border-red-500 focus-visible:ring-red-500' : 
                formData.password && passwordStrength.score >= 3 ? 'border-green-500 focus-visible:ring-green-500' : ''
              }`}
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
          
          {/* Enhanced Password Strength Meter */}
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <div 
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  !formData.password ? 'bg-muted' : 
                  passwordStrength.score === 0 ? 'bg-red-500' : 
                  passwordStrength.score === 1 ? 'bg-orange-500' : 
                  passwordStrength.score === 2 ? 'bg-yellow-500' : 
                  passwordStrength.score === 3 ? 'bg-green-400' : 
                  'bg-green-500'
                }`}
              ></div>
              <div 
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  !formData.password || passwordStrength.score < 1 ? 'bg-muted' : 
                  passwordStrength.score === 1 ? 'bg-orange-500' : 
                  passwordStrength.score === 2 ? 'bg-yellow-500' : 
                  passwordStrength.score === 3 ? 'bg-green-400' : 
                  'bg-green-500'
                }`}
              ></div>
              <div 
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  !formData.password || passwordStrength.score < 2 ? 'bg-muted' : 
                  passwordStrength.score === 2 ? 'bg-yellow-500' : 
                  passwordStrength.score === 3 ? 'bg-green-400' : 
                  'bg-green-500'
                }`}
              ></div>
              <div 
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  !formData.password || passwordStrength.score < 3 ? 'bg-muted' : 
                  passwordStrength.score === 3 ? 'bg-green-400' : 
                  'bg-green-500'
                }`}
              ></div>
            </div>
            
            {formData.password && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  {passwordStrength.hasLength ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span className={passwordStrength.hasLength ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                    At least 8 characters
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  {passwordStrength.hasUpper ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span className={passwordStrength.hasUpper ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                    Uppercase letter
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  {passwordStrength.hasNumber ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span className={passwordStrength.hasNumber ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                    Number (0-9)
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  {passwordStrength.hasSpecial ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span className={passwordStrength.hasSpecial ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                    Special character
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
          <Checkbox 
            id="terms" 
            checked={acceptTerms} 
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} 
          />
          <label
            htmlFor="terms"
            className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-budget-teal to-budget-teal2 hover:opacity-90 transition-opacity" 
          disabled={isLoading || !formData.name || !formData.email || !formData.password || passwordStrength.score < 3 || !acceptTerms}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
