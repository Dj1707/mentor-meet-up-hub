import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, IndianRupee } from "lucide-react";
import { SessionInfoTooltip, SessionTypeInfo } from "@/components/shared/SessionInfoTooltip";
import { formatIndianRupee } from "@/lib/utils";

export const InvoiceTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  // Sample data for pending sessions
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

  // Generate session type info for tooltips
  const sessionTypeInfoMap: Record<string, SessionTypeInfo> = {
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
    },
    "Resume Review": {
      sessionTypeName: "Resume Review",
      totalCount: 1,
      details: [
        { student: "Casey Kim", date: "Apr 20, 2025", count: 1 }
      ]
    }
  };

  // Sample data for previous invoices
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
    return num.toString();
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
                <TableCell className="flex items-center">
                  {session.sessionType}
                  {sessionTypeInfoMap[session.sessionType] && (
                    <SessionInfoTooltip 
                      sessionTypeInfo={sessionTypeInfoMap[session.sessionType]} 
                    />
                  )}
                </TableCell>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.student}</TableCell>
                <TableCell className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {formatIndianRupee(session.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">Total Pending</TableCell>
              <TableCell className="font-medium flex items-center">
                <IndianRupee className="h-4 w-4 mr-1" />
                {formatIndianRupee(pendingSessions.reduce((sum, session) => sum + session.amount, 0))}
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
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {formatIndianRupee(invoice.amount)}
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
                {pendingSessions.map((session, index) => (
                  <tr key={session.id} className="border">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">
                      <div className="flex items-center">
                        {session.sessionType} Session
                        {sessionTypeInfoMap[session.sessionType] && (
                          <SessionInfoTooltip 
                            sessionTypeInfo={sessionTypeInfoMap[session.sessionType]}
                            useHoverCard={true}
                          />
                        )}
                      </div>
                    </td>
                    <td className="border p-2"><IndianRupee className="inline h-3 w-3" /> {formatIndianRupee(session.amount)}</td>
                    <td className="border p-2"><IndianRupee className="inline h-3 w-3" /> {formatIndianRupee(session.amount)}</td>
                  </tr>
                ))}
                <tr className="border font-bold">
                  <td colSpan={3} className="border p-2">Total</td>
                  <td className="border p-2">
                    <IndianRupee className="inline h-3 w-3" /> 
                    {formatIndianRupee(pendingSessions.reduce((sum, session) => sum + session.amount, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div className="space-y-4">
              <div>Amount in words(in ₹): {numberToWords(pendingSessions.reduce((sum, session) => sum + session.amount, 0))} Rupees Only</div>
              
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
