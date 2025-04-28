import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, ReceiptIndianRupee } from "lucide-react";

export const InvoiceTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const pendingSessions = [
    { 
      id: "1", 
      sessionType: "Career Guidance", 
      date: "Apr 16, 2025", 
      student: "Alex Johnson", 
      amount: 1200 
    },
    { 
      id: "2", 
      sessionType: "Technical Interview", 
      date: "Apr 18, 2025", 
      student: "Jamie Rivera", 
      amount: 1500 
    },
    { 
      id: "3", 
      sessionType: "Resume Review", 
      date: "Apr 20, 2025", 
      student: "Casey Kim", 
      amount: 800 
    },
  ];

  const previousInvoices = [
    { 
      id: "inv-2025-03", 
      date: "Mar 25, 2025", 
      sessions: 8, 
      amount: 9600, 
      status: "paid" 
    },
    { 
      id: "inv-2025-02", 
      date: "Feb 25, 2025", 
      sessions: 6, 
      amount: 7200, 
      status: "paid" 
    },
  ];

  const handleCreateInvoice = () => {
    toast({
      title: "Invoice Generated",
      description: "Your invoice has been submitted for processing."
    });
    setInvoiceDialogOpen(false);
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('-');
  };

  const numberToWords = (num: number): string => {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return "";
      
      if (n < 10) return units[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) {
        const digit = n % 10;
        return tens[Math.floor(n / 10)] + (digit ? " " + units[digit] : "");
      }
      const digit = n % 10;
      const rest = n % 100;
      return units[Math.floor(n / 100)] + " Hundred" + 
             (rest ? " and " + convertLessThanThousand(rest) : "");
    };

    if (num === 0) return "Zero";
    
    const billion = Math.floor(num / 1000000000);
    const million = Math.floor((num % 1000000000) / 1000000);
    const thousand = Math.floor((num % 1000000) / 1000);
    const remainder = num % 1000;
    
    let result = "";
    
    if (billion) result += convertLessThanThousand(billion) + " Billion ";
    if (million) result += convertLessThanThousand(million) + " Million ";
    if (thousand) result += convertLessThanThousand(thousand) + " Thousand ";
    if (remainder) result += convertLessThanThousand(remainder);
    
    return result.trim();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Invoicing</h3>
        <Button onClick={() => setInvoiceDialogOpen(true)}>
          <FileText className="w-4 h-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      <div>
        <h4 className="text-base font-medium mb-3">Pending Sessions</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingSessions.map(session => (
              <TableRow key={session.id}>
                <TableCell>{session.sessionType}</TableCell>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.student}</TableCell>
                <TableCell className="flex items-center">
                  <ReceiptIndianRupee className="h-4 w-4 mr-1" />
                  {session.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">Total Pending</TableCell>
              <TableCell className="font-medium flex items-center">
                <ReceiptIndianRupee className="h-4 w-4 mr-1" />
                {pendingSessions.reduce((sum, session) => sum + session.amount, 0)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div>
        <h4 className="text-base font-medium mb-3">Previous Invoices</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {previousInvoices.map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.sessions}</TableCell>
                <TableCell className="flex items-center">
                  <ReceiptIndianRupee className="h-4 w-4 mr-1" />
                  {invoice.amount}
                </TableCell>
                <TableCell>
                  <Badge variant={invoice.status === "paid" ? "success" : "secondary"}>
                    {invoice.status === "paid" ? "Paid" : "Processing"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice for all completed sessions
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-8 space-y-6">
            <div className="text-3xl font-bold text-right">Invoice</div>
            
            <div className="space-y-2">
              <div>Name of Issuer :- {user?.mentorProfile?.name}</div>
              <div>Address :- {user?.mentorProfile?.address?.street || "[Street Address]"}, {user?.mentorProfile?.address?.city || "[City]"}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
              <div>Invoice No.: INV-{Math.floor(Math.random() * 10000)}</div>
              <div>Invoice Date: {formatDate()}</div>
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
                {pendingSessions.map((session, index) => (
                  <tr key={session.id} className="border">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{session.sessionType} Session</td>
                    <td className="border p-2"><ReceiptIndianRupee className="inline h-3 w-3" /> {session.amount.toFixed(2)}</td>
                    <td className="border p-2"><ReceiptIndianRupee className="inline h-3 w-3" /> {session.amount.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="border font-bold">
                  <td colSpan={3} className="border p-2">Total</td>
                  <td className="border p-2">
                    <ReceiptIndianRupee className="inline h-3 w-3" /> 
                    {pendingSessions.reduce((sum, session) => sum + session.amount, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div className="space-y-4">
              <div>Amount in words(in Rs.): {numberToWords(pendingSessions.reduce((sum, session) => sum + session.amount, 0))} Rupees Only</div>
              
              <div className="space-y-1">
                <div>Account Holder Name :- {user?.mentorProfile?.bankDetails?.accountName || "[Account Holder Name]"}</div>
                <div>Bank Name :- {user?.mentorProfile?.bankDetails?.bankName || "[Bank Name]"}</div>
                <div>A/C Number :- {user?.mentorProfile?.bankDetails?.accountNumber || "[Account Number]"}</div>
                <div>IFSC :- {user?.mentorProfile?.bankDetails?.ifscCode || "[IFSC Code]"}</div>
                <div>Branch :- {user?.mentorProfile?.bankDetails?.bankName ? `${user?.mentorProfile?.bankDetails?.bankName} Branch` : "[Branch Name]"}</div>
                <div>PAN :- {user?.mentorProfile?.panNumber || "[PAN Number]"}</div>
              </div>
              
              <div className="flex justify-end">
                <div className="text-center">
                  <div className="mb-2">[Signature]</div>
                  <div>Signature</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="invoice-notes">Invoice Notes (Optional)</Label>
            <Textarea 
              id="invoice-notes" 
              placeholder="Add any notes to be included in the invoice"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice}>
              Generate Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
