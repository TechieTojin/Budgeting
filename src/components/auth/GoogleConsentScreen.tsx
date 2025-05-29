import React, { useState, useEffect } from "react";

interface GoogleConsentScreenProps {
  onClose: (email?: string) => void;
  mode: "login" | "signup";
}

const GoogleConsentScreen = ({ onClose, mode }: GoogleConsentScreenProps) => {
  const [step, setStep] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState("");

  // User accounts to display
  const userAccounts = [
    { name: "Tojin Varkey Simson", email: "tojin.varkey@gmail.com", avatar: "https://ui-avatars.com/api/?name=Tojin+Varkey&background=4285F4&color=fff" },
    { name: "Tojin Simson", email: "tojin.simson@outlook.com", avatar: "https://ui-avatars.com/api/?name=Tojin+Simson&background=EA4335&color=fff" },
    { name: "Jaiby Joseph", email: "jaiby.joseph@gmail.com", avatar: "https://ui-avatars.com/api/?name=Jaiby+Joseph&background=34A853&color=fff" }
  ];

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    if (step === 3) {
      const timer = setTimeout(() => {
        onClose(selectedEmail);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, onClose, selectedEmail]);

  const handleAccountSelect = (email: string) => {
    setSelectedEmail(email);
    setStep(3);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
      <header className="p-4 sm:p-6 flex justify-end">
        {step > 1 && (
          <button onClick={() => onClose()} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </header>

      {/* Loading Screen */}
      {step === 1 && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md p-8">
            <div className="flex justify-center mb-6">
              <img 
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" 
                alt="Google" 
                className="h-8" 
              />
            </div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-normal mb-2">Sign in with Google</h1>
              <p className="text-sm text-gray-600">to continue to Budgeting</p>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Account Selection Screen */}
      {step === 2 && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md p-6">
            <div className="flex justify-center mb-6">
              <img 
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" 
                alt="Google" 
                className="h-8" 
              />
            </div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-normal mb-4">Choose an account</h1>
              <p className="text-sm text-gray-600">to continue to Budgeting</p>
            </div>
            
            <div className="space-y-4 mt-8">
              {userAccounts.map((account, index) => (
                <button 
                  key={index}
                  onClick={() => handleAccountSelect(account.email)}
                  className="w-full p-3 flex items-center border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                    <img 
                      src={account.avatar}
                      alt={`${account.name} Avatar`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-gray-500">{account.email}</div>
                  </div>
                </button>
              ))}
              
              <button 
                className="w-full p-3 flex items-center border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium">Use another account</div>
                </div>
              </button>
            </div>
            
            <div className="mt-8">
              <p className="text-xs text-gray-500">
                To continue, Google will share your name, email address, language preference, and profile picture with Budgeting. 
                Before using this app, you can review Budgeting's <a href="#" className="text-blue-600">privacy policy</a> and <a href="#" className="text-blue-600">terms of service</a>.
              </p>
            </div>
          </div>
          
          <div className="mt-auto p-4 w-full flex justify-between items-center border-t">
            <button className="text-sm text-blue-600 font-medium">More options</button>
            <button onClick={() => onClose()} className="text-sm text-blue-600 font-medium">Cancel</button>
          </div>
        </div>
      )}
      
      {/* Authentication in Progress Screen */}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md p-8">
            <div className="flex justify-center mb-6">
              <img 
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" 
                alt="Google" 
                className="h-8" 
              />
            </div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-normal mb-2">
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </h1>
              <p className="text-sm text-gray-600">
                {selectedEmail ? selectedEmail : "This won't take long"}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            
            {/* Security message */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center justify-center text-green-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Secure connection</span>
              </div>
              <p className="text-xs text-gray-500">Your information is protected with TLS encryption</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleConsentScreen; 