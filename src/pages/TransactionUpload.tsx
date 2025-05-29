import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Upload, 
  File, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  LoaderCircle, 
  Database, 
  Bot,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  FileUp,
  FileDown,
  FileSpreadsheet,
  FileJson,
  FileArchive,
  ReceiptText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Sample receipt data
const sampleReceipts = [
  {
    id: 1,
    vendor: "Vendeur 321861",
    store: "Magasin: Caisse: 02",
    date: "23/07/18",
    time: "10:05",
    items: [
      { name: "Shorts", code: "0603583", price: "14,99", color: "Gris", size: "40" }
    ],
    subtotal: "12,49",
    tax: "2,50",
    total: "14,99",
    payment: "CARTE BANCAIRE"
  },
  {
    id: 2,
    vendor: "Vendeur 456789",
    store: "Magasin: Caisse: 03",
    date: "24/07/18",
    time: "15:30",
    items: [
      { name: "T-Shirt", code: "0603584", price: "19,99", color: "Noir", size: "M" },
      { name: "Jeans", code: "0603585", price: "49,99", color: "Bleu", size: "38" }
    ],
    subtotal: "58,31",
    tax: "11,67",
    total: "69,98",
    payment: "CARTE BANCAIRE"
  },
  {
    id: 3,
    vendor: "Vendeur 789012",
    store: "Magasin: Caisse: 01",
    date: "25/07/18",
    time: "11:15",
    items: [
      { name: "Pull", code: "0603586", price: "29,99", color: "Rouge", size: "L" }
    ],
    subtotal: "24,99",
    tax: "5,00",
    total: "29,99",
    payment: "CARTE BANCAIRE"
  },
  {
    id: 4,
    vendor: "Vendeur 345678",
    store: "Magasin: Caisse: 04",
    date: "26/07/18",
    time: "16:45",
    items: [
      { name: "Chaussures", code: "0603587", price: "79,99", color: "Noir", size: "42" },
      { name: "Socks", code: "0603588", price: "9,99", color: "Blanc", size: "M" }
    ],
    subtotal: "74,99",
    tax: "15,00",
    total: "89,99",
    payment: "CARTE BANCAIRE"
  },
  {
    id: 5,
    vendor: "Vendeur 901234",
    store: "Magasin: Caisse: 05",
    date: "27/07/18",
    time: "14:20",
    items: [
      { name: "Veste", code: "0603589", price: "89,99", color: "Marron", size: "L" }
    ],
    subtotal: "74,99",
    tax: "15,00",
    total: "89,99",
    payment: "CARTE BANCAIRE"
  }
];

const TransactionUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
  const [processingStep, setProcessingStep] = useState(0);
  const [selectedTab, setSelectedTab] = useState("pdf");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<typeof sampleReceipts[0] | null>(null);
  
  // Processing steps for the animated display
  const processingSteps = [
    { icon: <File className="h-5 w-5" />, text: "Reading file content" },
    { icon: <FileText className="h-5 w-5" />, text: "Extracting transaction data" },
    { icon: <Database className="h-5 w-5" />, text: "Organizing transactions" },
    { icon: <Bot className="h-5 w-5" />, text: "Applying AI categorization" }
  ];

  // Supported file types
  const supportedFiles = {
    pdf: { icon: <FileText className="h-6 w-6" />, label: "PDF Statement", extensions: [".pdf"] },
    csv: { icon: <FileSpreadsheet className="h-6 w-6" />, label: "CSV File", extensions: [".csv"] },
    json: { icon: <FileJson className="h-6 w-6" />, label: "JSON Data", extensions: [".json"] },
    zip: { icon: <FileArchive className="h-6 w-6" />, label: "ZIP Archive", extensions: [".zip"] }
  };

  // Auto-redirect to learning page after successful upload + processing
  useEffect(() => {
    if (uploadState === "complete") {
      const redirectTimer = setTimeout(() => {
        navigate("/learning");
      }, 3000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [uploadState, navigate]);
  
  // Simulate upload progress
  useEffect(() => {
    if (uploadState === "uploading") {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadState("processing");
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [uploadState]);
  
  // Simulate processing steps
  useEffect(() => {
    if (uploadState === "processing") {
      const interval = setInterval(() => {
        setProcessingStep(prev => {
          if (prev >= processingSteps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadState("complete");
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
      
      return () => clearInterval(interval);
    }
  }, [uploadState, processingSteps.length]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (droppedFile: File) => {
    // Check if file type is supported
    const fileExtension = `.${droppedFile.name.split('.').pop()?.toLowerCase()}`;
    const supportedExtensions = Object.values(supportedFiles).flatMap(f => f.extensions);
    
    if (!supportedExtensions.includes(fileExtension)) {
      toast.error("Please upload a supported file type");
      return;
    }
    
    setFile(droppedFile);
    setUploadState("uploading");
    setUploadProgress(0);
    setShowReceiptPreview(true);
    // Select a random receipt from the sample receipts
    setSelectedReceipt(sampleReceipts[Math.floor(Math.random() * sampleReceipts.length)]);
    
    // Simulate file upload and processing
    toast.success("File uploaded successfully! Processing your receipt...");
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSkip = () => {
    navigate("/learning");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setShowReceiptPreview(true);
      // Select a random receipt from the sample receipts
      setSelectedReceipt(sampleReceipts[Math.floor(Math.random() * sampleReceipts.length)]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadState("uploading");
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadState("complete");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadState("error");
    }
  };

  const ReceiptPreview = ({ receipt }: { receipt: typeof sampleReceipts[0] }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto font-mono text-sm">
      <div className="text-center mb-4">
        <p className="font-bold">{receipt.vendor}</p>
        <p>{receipt.store}</p>
        <p>Date: {receipt.date}</p>
        <p>Heure: {receipt.time}</p>
      </div>
      
      <div className="border-t border-b py-4 my-4">
        {receipt.items.map((item, index) => (
          <div key={index} className="mb-2">
            <p>{item.name}</p>
            <p className="text-gray-600">{item.code}</p>
            <p>{item.price} €</p>
            <p className="text-gray-600">{item.color} - {item.size}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total</span>
          <span>{receipt.total} €</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Net</span>
          <span>{receipt.subtotal} €</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>TVA</span>
          <span>{receipt.tax} €</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-center">Regu {receipt.payment}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with glassmorphism */}
      <div className="flex justify-between items-center p-4 md:p-6 sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-r from-budget-teal to-budget-teal2 rounded-full p-1.5 group-hover:shadow-md transition-all">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold">Budgeting</span>
        </Link>
        <ThemeToggle />
      </div>
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          {uploadState === "idle" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <motion.h1 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-budget-teal to-budget-teal2 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Upload Your Transactions
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Import your financial data to get started with personalized insights and smart budgeting.
                </motion.p>
              </div>
              
              <Tabs defaultValue="pdf" className="w-full" onValueChange={setSelectedTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  {Object.entries(supportedFiles).map(([key, file]) => (
                    <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                      {file.icon}
                      {file.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={selectedTab} className="mt-0">
                  <motion.div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                      isDragging 
                        ? "border-budget-teal bg-budget-teal/5" 
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="mb-6">
                      <motion.div 
                        className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Upload className="h-8 w-8 text-budget-teal" />
                      </motion.div>
                      <h3 className="text-xl font-medium mb-2">Drag & Drop Your {supportedFiles[selectedTab as keyof typeof supportedFiles].label}</h3>
                      <p className="text-muted-foreground mb-6">
                        or <span className="text-budget-teal cursor-pointer font-medium" onClick={handleBrowseClick}>browse files</span>
                      </p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileInput}
                        accept={supportedFiles[selectedTab as keyof typeof supportedFiles].extensions.join(',')}
                        className="hidden" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      <Card className="p-4 hover:shadow-md transition-all">
                        <Sparkles className="h-6 w-6 text-budget-teal mb-2 mx-auto" />
                        <p className="text-sm font-medium">Smart Categorization</p>
                      </Card>
                      <Card className="p-4 hover:shadow-md transition-all">
                        <Shield className="h-6 w-6 text-budget-teal mb-2 mx-auto" />
                        <p className="text-sm font-medium">Secure Processing</p>
                      </Card>
                      <Card className="p-4 hover:shadow-md transition-all">
                        <Zap className="h-6 w-6 text-budget-teal mb-2 mx-auto" />
                        <p className="text-sm font-medium">Quick Import</p>
                      </Card>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Supported formats:</span> {Object.values(supportedFiles).map(f => f.extensions.join(', ')).join(', ')}
                </p>
                <Button variant="outline" onClick={handleSkip}>
                  Skip for now
                </Button>
              </div>
            </motion.div>
          )}
          
          {uploadState !== "idle" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto bg-card border rounded-xl p-8 shadow-lg"
            >
              {uploadState === "uploading" && (
                <>
                  <div className="mb-6 flex items-center justify-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="42"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-budget-teal stroke-current"
                          strokeWidth="8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="42"
                          cx="50"
                          cy="50"
                          strokeDasharray="264"
                          strokeDashoffset={264 - (uploadProgress / 100) * 264}
                        />
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-xl font-bold">{uploadProgress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium text-center mb-2">Uploading {file?.name}</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Please wait while we upload your receipt...
                  </p>
                  
                  <Progress value={uploadProgress} className="h-2" />
                </>
              )}
              
              {uploadState === "processing" && (
                <>
                  <div className="mb-6 flex items-center justify-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <div className="absolute w-full h-full animate-spin">
                        <div className="h-3 w-3 bg-budget-teal absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full"></div>
                        <div className="h-3 w-3 bg-budget-teal/60 absolute top-1/4 right-0 rounded-full"></div>
                        <div className="h-3 w-3 bg-budget-teal/40 absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full"></div>
                        <div className="h-3 w-3 bg-budget-teal/20 absolute top-1/4 left-0 rounded-full"></div>
                      </div>
                      <LoaderCircle className="h-8 w-8 text-budget-teal animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium text-center mb-2">Processing Your Receipt</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    We're extracting and organizing your receipt data
                  </p>
                  
                  <div className="space-y-4">
                    {processingSteps.map((step, index) => (
                      <motion.div 
                        key={index} 
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          index <= processingStep ? "bg-budget-teal/10" : "bg-muted/50"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`p-1.5 rounded-full ${
                          index <= processingStep ? "bg-budget-teal/20" : "bg-muted"
                        }`}>
                          {index < processingStep ? (
                            <CheckCircle className="h-4 w-4 text-budget-teal" />
                          ) : index === processingStep ? (
                            <div className="text-budget-teal animate-pulse">
                              {step.icon}
                            </div>
                          ) : (
                            <div className="text-muted-foreground/50">
                              {step.icon}
                            </div>
                          )}
                        </div>
                        <span className={index <= processingStep ? "text-foreground" : "text-muted-foreground/50"}>
                          {step.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
              
              {uploadState === "complete" && (
                <>
                  <div className="mb-6 flex items-center justify-center">
                    <motion.div 
                      className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </motion.div>
                  </div>
                  
                  <h3 className="text-xl font-medium text-center mb-2">Upload Complete!</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Your receipt has been successfully processed.
                  </p>
                  
                  {/* Receipt Preview */}
                  <div className="mb-6">
                    <ReceiptPreview receipt={selectedReceipt || sampleReceipts[0]} />
                  </div>
                  
                  <Card className="bg-muted/30 border p-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Receipt ID</span>
                        <span className="font-bold">{selectedReceipt?.id || "1"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Date</span>
                        <span className="font-bold">{selectedReceipt?.date || "23/07/18"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Amount</span>
                        <span className="font-bold">{selectedReceipt?.total || "14,99"} €</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-budget-teal to-budget-teal2"
                    onClick={() => navigate("/learning")}
                  >
                    Go to Learning Center
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    Redirecting to learning center in a few seconds...
                  </p>
                </>
              )}
              
              {uploadState === "error" && (
                <>
                  <div className="mb-6 flex items-center justify-center">
                    <motion.div 
                      className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <AlertCircle className="h-12 w-12 text-red-500" />
                    </motion.div>
                  </div>
                  
                  <h3 className="text-xl font-medium text-center mb-2">Upload Failed</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    There was an error processing your file. Please try again.
                  </p>
                  
                  <Button 
                    onClick={() => setUploadState("idle")} 
                    className="w-full bg-gradient-to-r from-budget-teal to-budget-teal2"
                  >
                    Try Again
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Decorative elements */}
        <div className="absolute pointer-events-none inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-budget-teal/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-budget-teal2/5 rounded-full blur-3xl"></div>
        </div>
      </main>
    </div>
  );
};

export default TransactionUpload; 