import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReceiptUploader, ReceiptData } from "@/components/transactions/ReceiptUploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Trash, Upload } from "lucide-react";
import { toast } from "sonner";

const ReceiptUpload = () => {
  const [uploadedReceipts, setUploadedReceipts] = useState<ReceiptData[]>([]);
  const [viewingReceipt, setViewingReceipt] = useState<ReceiptData | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const handleSaveReceipt = (data: ReceiptData) => {
    setUploadedReceipts(prev => [
      { ...data, id: Date.now() },
      ...prev
    ]);
    setShowUploader(false);
    toast.success("Receipt uploaded and extracted successfully!");
  };

  const handleDeleteReceipt = (id: number) => {
    setUploadedReceipts(prev => prev.filter(r => r.id !== id));
    toast.success("Receipt deleted");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-background/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Upload className="h-5 w-5" />
              Upload a Receipt
            </CardTitle>
            <CardDescription>
              Upload or scan your receipt to extract transaction details automatically. Supported formats: JPG, PNG, PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowUploader(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload or Scan Receipt
            </Button>
          </CardContent>
        </Card>

        {/* ReceiptUploader Dialog */}
        <Dialog open={showUploader} onOpenChange={setShowUploader}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload or Scan Receipt</DialogTitle>
            </DialogHeader>
            <ReceiptUploader
              onSave={handleSaveReceipt}
              onCancel={() => setShowUploader(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Uploaded Receipts List */}
        <Card className="border-none shadow bg-background/80">
          <CardHeader>
            <CardTitle className="text-lg">Uploaded Receipts</CardTitle>
            <CardDescription>View and manage your uploaded receipts below.</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedReceipts.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">No receipts uploaded yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedReceipts.map(receipt => (
                    <TableRow key={receipt.id}>
                      <TableCell>{receipt.date instanceof Date ? receipt.date.toLocaleDateString() : new Date(receipt.date).toLocaleDateString()}</TableCell>
                      <TableCell>{receipt.description}</TableCell>
                      <TableCell>₹{receipt.amount.toLocaleString()}</TableCell>
                      <TableCell>{receipt.category}</TableCell>
                      <TableCell>{receipt.merchantName || '-'}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => setViewingReceipt(receipt)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteReceipt(receipt.id as number)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Receipt Dialog */}
        <Dialog open={!!viewingReceipt} onOpenChange={() => setViewingReceipt(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Receipt Details</DialogTitle>
            </DialogHeader>
            {viewingReceipt && (
              <div className="space-y-4">
                {viewingReceipt.receiptImage && (
                  <img src={viewingReceipt.receiptImage} alt="Receipt" className="rounded-lg w-full max-h-64 object-contain border" />
                )}
                <div>
                  <div className="font-medium">{viewingReceipt.description}</div>
                  <div className="text-muted-foreground text-sm">{viewingReceipt.merchantName}</div>
                  <div className="text-sm mt-2">Date: {viewingReceipt.date instanceof Date ? viewingReceipt.date.toLocaleDateString() : new Date(viewingReceipt.date).toLocaleDateString()}</div>
                  <div className="text-sm">Amount: ₹{viewingReceipt.amount.toLocaleString()}</div>
                  <div className="text-sm">Category: {viewingReceipt.category}</div>
                  <div className="text-sm">Confidence: {(viewingReceipt.confidence * 100).toFixed(0)}%</div>
                </div>
                {viewingReceipt.items && viewingReceipt.items.length > 0 && (
                  <div>
                    <div className="font-medium mb-2">Items</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {viewingReceipt.items.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          {item.name} - ₹{item.amount.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ReceiptUpload;
