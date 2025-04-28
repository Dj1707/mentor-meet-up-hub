
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Invoicing</h3>
        <Button onClick={() => setInvoiceDialogOpen(true)}>
          Generate Invoice
        </Button>
      </div>

      <div>
        <h4 className="text-base font-medium mb-3">Pending Sessions</h4>
        <div className="border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingSessions.map(session => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{session.sessionType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{session.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{session.student}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹{session.amount}</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">Total Pending</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  ₹{pendingSessions.reduce((sum, session) => sum + session.amount, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="text-base font-medium mb-3">Previous Invoices</h4>
        <div className="border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previousInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.sessions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge variant={invoice.status === "paid" ? "success" : "secondary"}>
                      {invoice.status === "paid" ? "Paid" : "Processing"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice for all completed sessions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">{user?.mentorProfile?.name}</p>
                  <p className="text-sm text-gray-500">{user?.mentorProfile?.address?.street}</p>
                  <p className="text-sm text-gray-500">
                    {user?.mentorProfile?.address?.city}, {user?.mentorProfile?.address?.state} {user?.mentorProfile?.address?.zipCode}
                  </p>
                  <p className="text-sm text-gray-500">{user?.mentorProfile?.address?.country}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm text-gray-500">Bank Name:</p>
                    <p className="text-sm font-medium text-right">{user?.mentorProfile?.bankDetails?.bankName}</p>
                    <p className="text-sm text-gray-500">Account Name:</p>
                    <p className="text-sm font-medium text-right">{user?.mentorProfile?.bankDetails?.accountName}</p>
                    <p className="text-sm text-gray-500">Account Number:</p>
                    <p className="text-sm font-medium text-right">{user?.mentorProfile?.bankDetails?.accountNumber}</p>
                    <p className="text-sm text-gray-500">IFSC Code:</p>
                    <p className="text-sm font-medium text-right">{user?.mentorProfile?.bankDetails?.ifscCode}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm text-gray-500">Sessions:</p>
                    <p className="text-sm font-medium text-right">{pendingSessions.length}</p>
                    <p className="text-sm text-gray-500">Total Amount:</p>
                    <p className="text-sm font-medium text-right">
                      ₹{pendingSessions.reduce((sum, session) => sum + session.amount, 0)}
                    </p>
                    <p className="text-sm text-gray-500">Invoice Date:</p>
                    <p className="text-sm font-medium text-right">Apr 28, 2025</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
