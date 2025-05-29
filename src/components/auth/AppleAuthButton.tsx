import React, { useState } from "react";
import { toast } from "sonner";
import { createPortal } from "react-dom";

interface AppleAuthButtonProps {
  mode: "login" | "signup";
  className?: string;
}

const AppleAuthButton = ({ mode, className = "" }: AppleAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentScreen, setShowConsentScreen] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState("");

  const handleAppleAuth = () => {
    setIsLoading(true);
    setShowConsentScreen(true);
  };

  const handleClose = (email?: string) => {
    setShowConsentScreen(false);
    
    if (email) {
      setAuthenticatedUser(email);
    }
    
    // Simulate successful authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Get user's name for a personalized message
      let displayName = "User";
      if (authenticatedUser || email) {
        const userEmail = email || authenticatedUser;
        // Try to extract a name from the email
        const emailName = userEmail.split('@')[0].replace(/[._-]/g, ' ');
        displayName = emailName.split(' ').map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' ');
      }
      
      const actionText = mode === "login" ? "signed in" : "account created";
      toast.success(`Welcome ${displayName}! Successfully ${actionText} with Apple`);
      
      // Simulate redirect to the dashboard after successful authentication
      setTimeout(() => {
        window.location.href = "/transaction-upload";
      }, 800);
    }, 500);
  };

  return (
    <>
      <button
        type="button"
        className={`flex items-center justify-center gap-2 bg-card hover:bg-muted/80 transition-colors border rounded-lg p-3 ${className}`}
        onClick={handleAppleAuth}
        disabled={isLoading}
      >
        {isLoading && !showConsentScreen ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">Connecting...</span>
          </div>
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.94 5.19A4.38 4.38 0 0016 2a4.44 4.44 0 00-3 1.52 4.17 4.17 0 00-1 3.09 3.69 3.69 0 002.94-1.42zm2.52 7.44a4.51 4.51 0 012.16-3.81 4.66 4.66 0 00-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87A4.92 4.92 0 004.69 9.4C2.92 12.29 4.24 16.7 6 19.14c.85 1.23 1.87 2.62 3.2 2.57 1.28-.05 1.77-.82 3.31-.82s2 .82 3.33.8c1.38-.03 2.25-1.24 3.1-2.47a10.9 10.9 0 001.32-2.7 4.42 4.42 0 01-2.8-3.89z" />
            </svg>
            <span className="text-sm font-medium">Apple</span>
          </>
        )}
      </button>

      {showConsentScreen && createPortal(
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-0 z-50 bg-black">
            <AppleConsentScreen onClose={handleClose} mode={mode} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// Apple Sign In UI Component
const AppleConsentScreen = ({ onClose, mode }: { onClose: (email?: string) => void; mode: "login" | "signup" }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTouchID, setIsTouchID] = useState(false);
  const [isFaceID, setIsFaceID] = useState(true);
  const [processingBiometric, setProcessingBiometric] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [biometricFailed, setBiometricFailed] = useState(false);

  React.useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (step === 4) {
      const timer = setTimeout(() => {
        onClose(email || "apple.user@icloud.com");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, onClose, email]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFaceID) {
      setStep(3);
    } else {
      setStep(4);
    }
  };

  const handleBiometricAuth = () => {
    setProcessingBiometric(true);
    
    // Simulate biometric verification with a random success rate (90% success)
    setTimeout(() => {
      const isSuccessful = Math.random() < 0.9;
      
      if (isSuccessful) {
        setBiometricSuccess(true);
        setTimeout(() => {
          setProcessingBiometric(false);
          setStep(4);
        }, 1000);
      } else {
        setBiometricFailed(true);
        setTimeout(() => {
          setBiometricFailed(false);
          setProcessingBiometric(false);
        }, 1500);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <button onClick={() => onClose()} className="text-blue-400 text-sm font-medium">
          Cancel
        </button>
        {step > 1 && step < 4 && (
          <div className="text-sm font-medium">Sign in with Apple ID</div>
        )}
        <div className="w-14"></div> {/* Spacer for alignment */}
      </header>

      {/* Loading Screen */}
      {step === 1 && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md p-8">
            <div className="flex justify-center mb-10">
              <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.94 5.19A4.38 4.38 0 0016 2a4.44 4.44 0 00-3 1.52 4.17 4.17 0 00-1 3.09 3.69 3.69 0 002.94-1.42zm2.52 7.44a4.51 4.51 0 012.16-3.81 4.66 4.66 0 00-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87A4.92 4.92 0 004.69 9.4C2.92 12.29 4.24 16.7 6 19.14c.85 1.23 1.87 2.62 3.2 2.57 1.28-.05 1.77-.82 3.31-.82s2 .82 3.33.8c1.38-.03 2.25-1.24 3.1-2.47a10.9 10.9 0 001.32-2.7 4.42 4.42 0 01-2.8-3.89z" />
              </svg>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Login Screen */}
      {step === 2 && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md px-8">
            <div className="flex justify-center mb-8">
              <svg className="h-12 w-12 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.94 5.19A4.38 4.38 0 0016 2a4.44 4.44 0 00-3 1.52 4.17 4.17 0 00-1 3.09 3.69 3.69 0 002.94-1.42zm2.52 7.44a4.51 4.51 0 012.16-3.81 4.66 4.66 0 00-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87A4.92 4.92 0 004.69 9.4C2.92 12.29 4.24 16.7 6 19.14c.85 1.23 1.87 2.62 3.2 2.57 1.28-.05 1.77-.82 3.31-.82s2 .82 3.33.8c1.38-.03 2.25-1.24 3.1-2.47a10.9 10.9 0 001.32-2.7 4.42 4.42 0 01-2.8-3.89z" />
              </svg>
            </div>
            
            <h1 className="text-2xl text-center font-medium mb-8">
              {mode === "login" ? "Sign in with Apple" : "Sign up with Apple"}
            </h1>
            
            <form onSubmit={handleContinue} className="space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Apple ID"
                  className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isFaceID}
                    onChange={() => {
                      setIsFaceID(!isFaceID);
                      setIsTouchID(false);
                    }}
                    className="h-4 w-4 bg-zinc-800 border-zinc-700 rounded"
                  />
                  <span>Use Face ID</span>
                </label>
                
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isTouchID}
                    onChange={() => {
                      setIsTouchID(!isTouchID);
                      setIsFaceID(false);
                    }}
                    className="h-4 w-4 bg-zinc-800 border-zinc-700 rounded"
                  />
                  <span>Use Touch ID</span>
                </label>
              </div>
              
              <div>
                <button 
                  type="submit"
                  className="w-full p-3 bg-white text-black font-medium rounded-lg transition-colors hover:bg-gray-200"
                >
                  Continue
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center">
              <button className="text-blue-400 text-sm">
                Forgot Apple ID or Password?
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
              <p className="text-xs text-zinc-500 mb-2">
                {mode === "login" ? "Don't have an Apple ID?" : "Already have an Apple ID?"}
              </p>
              <button className="text-blue-400 text-sm">
                {mode === "login" ? "Create yours now" : "Sign in with your Apple ID"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Face ID / Touch ID Screen */}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md p-8 text-center">
            <div className="flex justify-center mb-8">
              {isFaceID ? (
                <div className={`relative ${biometricSuccess ? 'text-green-500' : biometricFailed ? 'text-red-500' : 'text-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 8a1 1 0 00-1 1v6a1 1 0 001 1" />
                    <path d="M15 8a1 1 0 011 1v6a1 1 0 01-1 1" />
                    <path d="M9 12h6" />
                    <path d="M9 16c0 1 1.5 2 3 2s3-1 3-2" />
                    <path d="M9 8c0-1 1.5-2 3-2s3 1 3 2" />
                  </svg>
                  {biometricSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`relative ${biometricSuccess ? 'text-green-500' : biometricFailed ? 'text-red-500' : 'text-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="4" y="4" width="16" height="16" rx="8" />
                    <path d="M12 12h.01" />
                  </svg>
                  {biometricSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-medium mb-2">
              {isFaceID ? "Face ID" : "Touch ID"}
            </h2>
            <p className="text-zinc-400 mb-8">
              {biometricFailed 
                ? `${isFaceID ? 'Face' : 'Touch'} ID not recognized. Try again.` 
                : `Sign in to Budgeting with your ${isFaceID ? 'Face ID' : 'Touch ID'}`
              }
            </p>
            
            <div className="flex justify-center">
              {!processingBiometric ? (
                <button 
                  onClick={handleBiometricAuth} 
                  className="p-4 bg-zinc-800 rounded-full transition-transform active:scale-95 hover:bg-zinc-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </button>
              ) : (
                <div className={`${biometricSuccess ? 'bg-green-500/20' : biometricFailed ? 'bg-red-500/20' : 'bg-blue-500/20'} animate-pulse h-16 w-16 rounded-full flex items-center justify-center`}>
                  <div className="animate-spin h-8 w-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => setStep(2)} 
                className="text-blue-400 text-sm"
                disabled={processingBiometric}
              >
                Use password instead
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Authentication in Progress Screen */}
      {step === 4 && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md p-8">
            <div className="flex justify-center mb-8">
              <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.94 5.19A4.38 4.38 0 0016 2a4.44 4.44 0 00-3 1.52 4.17 4.17 0 00-1 3.09a3.69 3.69 0 002.94-1.42zm2.52 7.44a4.51 4.51 0 012.16-3.81 4.66 4.66 0 00-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87A4.92 4.92 0 004.69 9.4C2.92 12.29 4.24 16.7 6 19.14c.85 1.23 1.87 2.62 3.2 2.57 1.28-.05 1.77-.82 3.31-.82s2 .82 3.33.8c1.38-.03 2.25-1.24 3.1-2.47a10.9 10.9 0 001.32-2.7 4.42 4.42 0 01-2.8-3.89z" />
              </svg>
            </div>
            
            <div className="text-center">
              <h1 className="text-2xl font-medium mb-2">
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </h1>
              <div className="flex justify-center mt-6">
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            </div>
            
            {/* Security message */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center justify-center text-green-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944A11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Secure connection</span>
              </div>
              <p className="text-xs text-zinc-500">Apple does not share your information with third parties</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppleAuthButton; 