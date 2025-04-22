import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Filter, AlertCircle, CheckCircle, DollarSign, Info, Search, Calendar, User, Settings, IndianRupee } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MentorRate, Payout } from "@/types";
import InvoiceDialog from "@/components/admin/payouts/InvoiceDialog";

const Payouts = () => {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: "p1",
      mentorId: "m1",
      amount: 480,
      status: "pending",
      sessionIds: ["s1", "s2", "s3", "s4"],
      createdAt: new Date(2025, 3, 10)
    },
    {
      id: "p2",
      mentorId: "m2",
      amount: 320,
      status: "processed",
      sessionIds: ["s5", "s6", "s7"],
      createdAt: new Date(2025, 3, 1),
      processedAt: new Date(2025, 3, 3)
    },
    {
      id: "p3",
      mentorId: "m3",
      amount: 560,
      status: "pending",
      sessionIds: ["s8", "s9", "s10", "s11", "s12"],
      createdAt: new Date(2025, 3, 12)
    },
    {
      id: "p4",
      mentorId: "m4",
      amount: 240,
      status: "processed",
      sessionIds: ["s13", "s14"],
      createdAt: new Date(2025, 2, 15),
      processedAt: new Date(2025, 2, 18)
    },
    {
      id: "p5",
      mentorId: "m1",
      amount: 360,
      status: "processed",
      sessionIds: ["s15", "s16", "s17"],
      createdAt: new Date(2025, 2, 1),
      processedAt: new Date(2025, 2, 3)
    }
  ]);
  
  const mentors = {
    "m1": { id: "m1", name: "Jane Smith" },
    "m2": { id: "m2", name: "David Wilson" },
    "m3": { id: "m3", name: "Emily Johnson" },
    "m4": { id: "m4", name: "Michael Brown" }
  };
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "processed" | "failed">("all");
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; payout: Payout | null }>({
    open: false,
    payout: null
  });
  const [mentorRates, setMentorRates] = useState<MentorRate[]>([
    { mentorId: "m1", sessionTypeId: "1", rate: 80 },
    { mentorId: "m1", sessionTypeId: "2", rate: 90 },
    { mentorId: "m2", sessionTypeId: "1", rate: 75 },
    { mentorId: "m2", sessionTypeId: "2", rate: 85 }
  ]);
  const [rateDialog, setRateDialog] = useState<{ open: boolean; mentorId: string | null }>({
    open: false,
    mentorId: null
  });
  const [invoiceDialog, setInvoiceDialog] = useState<{ open: boolean; payout: Payout | null }>({
    open: false,
    payout: null
  });

  const sessionTypes = [
    { id: "1", name: "Career Guidance", baseRate: 80 },
    { id: "2", name: "Technical Interview Prep", baseRate: 90 },
    { id: "3", name: "Resume Review", baseRate: 70 }
  ];

  const handleProcessPayout = (payoutId: string) => {
    setPayouts(payouts.map(payout => {
      if (payout.id === payoutId) {
        return {
          ...payout,
          status: "processed",
          processedAt: new Date()
        };
      }
      return payout;
    }));
    
    toast({
      title: "Payout Processed",
      description: "The payout has been successfully processed."
    });
  };
  
  const handleViewDetails = (payout: Payout) => {
    setDetailsDialog({
      open: true,
      payout
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = mentors[payout.mentorId].name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getMentorRate = (mentorId: string, sessionTypeId: string) => {
    const rate = mentorRates.find(
      rate => rate.mentorId === mentorId && rate.sessionTypeId === sessionTypeId
    );
    return rate?.rate || sessionTypes.find(type => type.id === sessionTypeId)?.baseRate || 0;
  };

  const handleUpdateRate = (mentorId: string, sessionTypeId: string, newRate: number) => {
    setMentorRates(prevRates => {
      const existingRateIndex = prevRates.findIndex(
        rate => rate.mentorId === mentorId && rate.sessionTypeId === sessionTypeId
      );

      if (existingRateIndex >= 0) {
        const updatedRates = [...prevRates];
        updatedRates[existingRateIndex].rate = newRate;
        return updatedRates;
      }

      return [...prevRates, { mentorId, sessionTypeId, rate: newRate }];
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <MainLayout title="Mentor Payouts">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Payout Dashboard</CardTitle>
            <CardDescription>
              Manage and process payments to mentors
            </CardDescription>
          </div>
          <Button>
            <IndianRupee className="mr-2 h-4 w-4" />
            Generate New Payouts
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentor..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("processed")}>Processed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("failed")}>Failed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">
                      {mentors[payout.mentorId].name}
                    </TableCell>
                    <TableCell>{formatCurrency(payout.amount)}</TableCell>
                    <TableCell>{payout.sessionIds.length}</TableCell>
                    <TableCell>{formatDate(payout.createdAt)}</TableCell>
                    <TableCell>
                      <PayoutStatusBadge status={payout.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRateDialog({ open: true, mentorId: payout.mentorId })}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Rates
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInvoiceDialog({ open: true, payout })}
                        >
                          <IndianRupee className="mr-2 h-4 w-4" />
                          Invoice
                        </Button>
                        {payout.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleProcessPayout(payout.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Process
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayouts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No payouts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={rateDialog.open} onOpenChange={(open) => setRateDialog({ ...rateDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Mentor Rates</DialogTitle>
            <DialogDescription>
              Set custom rates for each session type for {rateDialog.mentorId ? mentors[rateDialog.mentorId].name : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {sessionTypes.map(sessionType => (
              <div key={sessionType.id} className="flex items-center justify-between space-x-4">
                <div>
                  <p className="font-medium">{sessionType.name}</p>
                  <p className="text-sm text-muted-foreground">Base rate: ${sessionType.baseRate}/session</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span>$</span>
                  <Input
                    type="number"
                    className="w-20"
                    value={getMentorRate(rateDialog.mentorId || '', sessionType.id)}
                    onChange={(e) => {
                      if (rateDialog.mentorId) {
                        handleUpdateRate(rateDialog.mentorId, sessionType.id, Number(e.target.value));
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <InvoiceDialog 
        open={invoiceDialog.open}
        onOpenChange={(open) => setInvoiceDialog({ ...invoiceDialog, open })}
        payout={invoiceDialog.payout}
        mentor={invoiceDialog.payout ? mentors[invoiceDialog.payout.mentorId] : { id: "", name: "" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PayoutStatCard 
          title="Total Outstanding" 
          value={formatCurrency(1040.00)}
          description="Pending payouts to process"
          icon={IndianRupee}
          color="text-amber-500"
        />
        <PayoutStatCard 
          title="Processed (Month)" 
          value={formatCurrency(2480.00)}
          description="Processed in April 2025"
          icon={CheckCircle}
          color="text-green-500"
        />
        <PayoutStatCard 
          title="Next Payout Date" 
          value="Apr 30, 2025" 
          description="Scheduled payout run"
          icon={Calendar}
          color="text-blue-500"
        />
        <PayoutStatCard 
          title="Active Mentors" 
          value="32" 
          description="Eligible for payouts"
          icon={User}
          color="text-purple-500"
        />
      </div>
      
      <PayoutDetailsDialog 
        open={detailsDialog.open} 
        payout={detailsDialog.payout} 
        mentors={mentors}
        onOpenChange={(open) => setDetailsDialog({ ...detailsDialog, open })}
        onProcess={handleProcessPayout}
      />
    </MainLayout>
  );
};

interface PayoutStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const PayoutStatCard = ({ title, value, description, icon: Icon, color }: PayoutStatCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`p-2 rounded-full ${color.replace('text', 'bg').replace('500', '100')}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PayoutDetailsDialogProps {
  open: boolean;
  payout: Payout | null;
  mentors: Record<string, { id: string; name: string }>;
  onOpenChange: (open: boolean) => void;
  onProcess: (payoutId: string) => void;
}

const PayoutDetailsDialog = ({ open, payout, mentors, onOpenChange, onProcess }: PayoutDetailsDialogProps) => {
  if (!payout) {
    return null;
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payout Details</DialogTitle>
          <DialogDescription>
            Details for payout #{payout.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm font-medium">Mentor</span>
            <span>{mentors[payout.mentorId].name}</span>
          </div>
          
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm font-medium">Amount</span>
            <span className="font-bold">${payout.amount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm font-medium">Status</span>
            <PayoutStatusBadge status={payout.status} />
          </div>
          
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm font-medium">Created At</span>
            <span>{formatDate(payout.createdAt)}</span>
          </div>
          
          {payout.processedAt && (
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium">Processed At</span>
              <span>{formatDate(payout.processedAt)}</span>
            </div>
          )}
          
          <div className="pb-2 border-b">
            <div className="text-sm font-medium mb-2">Session Details</div>
            <div className="text-sm">
              <div>Total Sessions: {payout.sessionIds.length}</div>
              <div className="text-muted-foreground mt-1">Session IDs: {payout.sessionIds.join(", ")}</div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {payout.status === "pending" && (
              <Button onClick={() => {
                onProcess(payout.id);
                onOpenChange(false);
              }}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Process Payout
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PayoutStatusBadge = ({ status }: { status: "pending" | "processed" | "failed" }) => {
  const variant = status === "processed" 
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    : status === "pending"
    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  
  const icon = status === "processed" 
    ? <CheckCircle className="h-3.5 w-3.5 mr-1" />
    : status === "pending"
    ? <AlertCircle className="h-3.5 w-3.5 mr-1" />
    : <AlertCircle className="h-3.5 w-3.5 mr-1" />;
  
  return (
    <Badge className={`flex items-center ${variant}`} variant="outline">
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default Payouts;
