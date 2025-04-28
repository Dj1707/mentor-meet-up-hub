
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Payout } from "@/types";
import { IndianRupee } from "lucide-react";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payout: Payout | null;
  mentor: { id: string; name: string };
}

const InvoiceDialog = ({ open, onOpenChange, payout, mentor }: InvoiceDialogProps) => {
  if (!payout) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('-');
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice Template</DialogTitle>
        </DialogHeader>
        
        <div className="border rounded-lg p-8 space-y-6">
          <div className="text-3xl font-bold text-right">Invoice</div>
          
          <div className="space-y-2">
            <div>Name of Issuer :- {mentor.name}</div>
            <div>Address :- {payout.bankDetails?.accountName || "[Mentor's Address]"}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
            <div>Invoice No.: {payout.invoiceNumber || payout.id}</div>
            <div>Invoice Date: {payout.invoiceDate ? formatDate(payout.invoiceDate) : formatDate(payout.createdAt)}</div>
          </div>
          
          <div className="space-y-2">
            <div className="font-semibold">Bill To:</div>
            <div>Neos Kosmos Technologies Pvt. Ltd.</div>
            <div>Address :- Prestige Cube, Site no 26, Laskar Hosur Road,</div>
            <div>Adugodi, Koramangala, Bengaluru, Karnataka- 560030</div>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="border">
                <th className="border p-2 text-left">Sr. No.</th>
                <th className="border p-2 text-left">Description of Service</th>
                <th className="border p-2 text-left">Rate</th>
                <th className="border p-2 text-left">Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {payout.sessionIds.map((sessionId, index) => {
                const sessionRate = payout.rates?.find(r => r.sessionTypeId === sessionId)?.rate || 
                  (payout.amount / payout.sessionIds.length);
                
                return (
                  <tr key={sessionId} className="border">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">Mentoring Session</td>
                    <td className="border p-2"><IndianRupee className="inline h-3 w-3" /> {formatCurrency(sessionRate)}</td>
                    <td className="border p-2"><IndianRupee className="inline h-3 w-3" /> {formatCurrency(sessionRate)}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold">
                <td colSpan={3} className="border p-2">Total</td>
                <td className="border p-2"><IndianRupee className="inline h-3 w-3" /> {formatCurrency(payout.amount)}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="space-y-4">
            <div>Amount in words(in Rs.): [Amount in words] Rupees</div>
            
            <div className="space-y-1">
              <div>Account Holder Name :- {payout.bankDetails?.accountName || "[Account Holder Name]"}</div>
              <div>Bank Name :- {payout.bankDetails?.bankName || "[Bank Name]"}</div>
              <div>A/C Number :- {payout.bankDetails?.accountNumber || "[Account Number]"}</div>
              <div>IFSC :- {payout.bankDetails?.ifscCode || "[IFSC Code]"}</div>
              <div>Branch :- [Branch Name]</div>
              <div>PAN :- [PAN Number]</div>
            </div>
            
            <div className="flex justify-end">
              <div className="text-center">
                <div className="mb-2">[Signature]</div>
                <div>Signature</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
          <Button>Download PDF</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
