import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Upload, 
  Image, 
  X, 
  FileText, 
  Camera, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Loader2,
  Receipt,
  Tag,
  DollarSign,
  CalendarDays,
  Building2,
  ShoppingCart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { detectCategory } from "@/utils/transactionUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ReceiptUploaderProps {
  onSave: (transactionData: ReceiptData) => void;
  onCancel: () => void;
}

export interface ReceiptData {
  amount: number;
  description: string;
  category: string;
  date: Date;
  merchantName?: string;
  items?: { name: string; amount: number }[];
  receiptImage?: string;
  confidence: number;
}

export function ReceiptUploader({ onSave, onCancel }: ReceiptUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrData, setOcrData] = useState<ReceiptData | null>(null);
  const [formData, setFormData] = useState<ReceiptData>({
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    confidence: 0,
  });
  const [showCamera, setShowCamera] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Processing steps for the animated display
  const processingSteps = [
    { icon: <Image className="h-5 w-5" />, text: "Analyzing receipt image" },
    { icon: <FileText className="h-5 w-5" />, text: "Extracting text data" },
    { icon: <Tag className="h-5 w-5" />, text: "Identifying categories" },
    { icon: <DollarSign className="h-5 w-5" />, text: "Calculating totals" }
  ];

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processReceiptImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processReceiptImage(e.target.files[0]);
    }
  };

  const processReceiptImage = (file: File) => {
    // Check if the file is an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    // Create a preview of the image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        setUploadedImage(e.target.result as string);
        simulateOCRProcessing(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const simulateOCRProcessing = (imageData: string) => {
    setIsProcessing(true);
    setProcessingStep(0);
    
    // Simulate processing steps
    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            // Mock OCR data
            const mockData: ReceiptData = {
              amount: 45.99,
              description: "Grocery Store Purchase",
              category: "Groceries",
              date: new Date(),
              merchantName: "Local Grocery Store",
              items: [
                { name: "Milk", amount: 3.99 },
                { name: "Bread", amount: 2.49 },
                { name: "Eggs", amount: 4.99 }
              ],
              confidence: 0.95
            };
            setOcrData(mockData);
            setFormData(mockData);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const handleChange = (field: keyof ReceiptData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      receiptImage: uploadedImage || undefined,
    });
  };
  
  const startCamera = async () => {
    setShowCamera(true);
    
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access your camera. Please check permissions.");
      setShowCamera(false);
    }
  };
  
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        
        // Stop all video streams
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Process the captured image
        setUploadedImage(imageDataUrl);
        simulateOCRProcessing(imageDataUrl);
        setShowCamera(false);
      }
    }
  };
  
  const cancelCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    setShowCamera(false);
  };

  const retryUpload = () => {
    setUploadedImage(null);
    setOcrData(null);
    setFormData({
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
      confidence: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderConfidenceIndicator = (confidence: number) => {
    // Determine color and text based on confidence level
    let color = "text-red-500";
    let text = "Low";
    
    if (confidence >= 0.9) {
      color = "text-green-500";
      text = "High";
    } else if (confidence >= 0.8) {
      color = "text-emerald-500";
      text = "Good";
    } else if (confidence >= 0.7) {
      color = "text-amber-500";
      text = "Medium";
    }
    
    return (
      <div className="flex items-center gap-1">
        {confidence >= 0.8 ? (
          <CheckCircle2 className={`h-4 w-4 ${color}`} />
        ) : (
          <AlertCircle className={`h-4 w-4 ${color}`} />
        )}
        <span className={`text-sm ${color}`}>{text} confidence ({(confidence * 100).toFixed(0)}%)</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!uploadedImage ? (
        <>
          {!showCamera ? (
            <motion.div 
              className={`border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <motion.div 
                  className="p-3 rounded-full bg-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image className="h-8 w-8 text-muted-foreground" />
                </motion.div>
                
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-1">Upload Receipt</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag & drop your receipt here or click to browse
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                  <Button type="button">
                    <Upload className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, HEIC up to 10MB
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </motion.div>
          ) : (
            <motion.div 
              className="relative overflow-hidden rounded-lg border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-[300px] object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={cancelCamera}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="button"
                    size="icon"
                    onClick={takePhoto}
                    className="bg-white text-black hover:bg-white/90 h-14 w-14 rounded-full"
                  >
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <>
          {isProcessing ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 animate-spin">
                  <Loader2 className="h-full w-full text-primary" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-1">Processing Receipt</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Extracting information using OCR technology...
              </p>
              
              <div className="w-full max-w-md space-y-4">
                {processingSteps.map((step, index) => (
                  <motion.div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index <= processingStep ? "bg-primary/10" : "bg-muted/50"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`p-1.5 rounded-full ${
                      index <= processingStep ? "bg-primary/20" : "bg-muted"
                    }`}>
                      {index < processingStep ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : index === processingStep ? (
                        <div className="text-primary animate-pulse">
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
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                  <motion.div 
                    className="relative overflow-hidden rounded-lg border"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <img 
                      src={uploadedImage} 
                      alt="Receipt" 
                      className="w-full object-contain max-h-[400px]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                      onClick={retryUpload}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <Card className="p-3 text-center hover:shadow-md transition-all">
                      <Building2 className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">Merchant</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {ocrData?.merchantName || "Unknown"}
                      </p>
                    </Card>
                    <Card className="p-3 text-center hover:shadow-md transition-all">
                      <CalendarDays className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(ocrData?.date || new Date(), "MMM d")}
                      </p>
                    </Card>
                    <Card className="p-3 text-center hover:shadow-md transition-all">
                      <ShoppingCart className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">Items</p>
                      <p className="text-sm text-muted-foreground">
                        {ocrData?.items?.length || 0}
                      </p>
                    </Card>
                  </div>
                </div>
                
                <div className="md:col-span-3 space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                            className="pl-7"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.date}
                              onSelect={(date) => date && setFormData({ ...formData, date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter transaction description"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="groceries">Groceries</SelectItem>
                          <SelectItem value="dining">Dining</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {ocrData?.items && ocrData.items.length > 0 && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Items Detected</h4>
                      <div className="space-y-2">
                        {ocrData.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="font-medium">${item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between items-center font-medium">
                          <span>Total</span>
                          <span>${ocrData.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {ocrData && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        {ocrData.confidence >= 0.8 ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        )}
                        <span className={ocrData.confidence >= 0.8 ? "text-green-500" : "text-amber-500"}>
                          {ocrData.confidence >= 0.8 ? "High" : "Medium"} confidence
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        ({(ocrData.confidence * 100).toFixed(0)}% accuracy)
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={retryUpload}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Try Another
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Transaction
                    </Button>
                  </div>
                </div>
              </div>
            </motion.form>
          )}
        </>
      )}
    </div>
  );
}

export default ReceiptUploader; 