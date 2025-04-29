
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Payout } from "@/types";
import { IndianRupee } from "lucide-react";
import { SessionInfoTooltip, SessionTypeInfo } from "@/components/shared/SessionInfoTooltip";
import { formatIndianRupee } from "@/lib/utils";

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
  
  // Sample session info for tooltips - in real application, this should be provided from the payout data
  const getSessionInfoMap = (): Record<string, SessionTypeInfo> => {
    // In a real application, this would be derived from payout.sessionIds
    return {
      "Career Guidance": {
        sessionTypeName: "Career Guidance",
        totalCount: 2,
        details: [
          { student: "Alex Johnson", date: "Apr 16, 2025", count: 1 },
          { student: "Morgan Smith", date: "Apr 13, 2025", count: 1 }
        ]
      },
      "Technical Interview": {
        sessionTypeName: "Technical Interview",
        totalCount: 1,
        details: [
          { student: "Jamie Rivera", date: "Apr 18, 2025", count: 1 }
        ]
      }
    };
  };
  
  const sessionTypeInfoMap = getSessionInfoMap();

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
            <div>Mesa School of Business</div>
            <div>Address :- Prestige Cube, Site no 26, Laskar Hosur Road,</div>
            <div>Adugodi, Koramangala, Bengaluru, Karnataka- 560030</div>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="border">
                <th className="border p-2 text-left">Sr. No.</th>
                <th className="border p-2 text-left">Description of Service</th>
                <th className="border p-2 text-left">Rate</th>
                <th className="border p-2 text-left">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {payout.sessionIds.map((sessionId, index) => {
                const sessionRate = payout.rates?.find(r => r.sessionTypeId === sessionId)?.rate || 
                  (payout.amount / payout.sessionIds.length);
                
                // For demo purposes, we're using hardcoded session types
                // In a real application, this would be determined from actual session data
                const sessionType = index === 0 ? "Career Guidance" : "Technical Interview";
                
                return (
                  <tr key={sessionId} className="border">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">
                      <div className="flex items-center">
                        {sessionType} Session
                        {sessionTypeInfoMap[sessionType] && (
                          <SessionInfoTooltip 
                            sessionTypeInfo={sessionTypeInfoMap[sessionType]}
                            useHoverCard={true}
                          />
                        )}
                      </div>
                    </td>
                    <td className="border p-2"><IndianRupee className="inline h-3 w-3" /> {formatIndianRupee(sessionRate)}</td>
                    <td className="border p-2"><IndianRupee className="inline h-3 w-3" /> {formatIndianRupee(sessionRate)}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold">
                <td colSpan={3} className="border p-2">Total</td>
                <td className="border p-2"><IndianRupee className="inline h-3 w-3" /> {formatIndianRupee(payout.amount)}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="space-y-4">
            <div>Amount in words(in ₹): [Amount in words] Rupees</div>
            
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
