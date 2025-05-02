
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sessionTypes } from "@/data/sessionTypes";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Link as LinkIcon, File, ExternalLink } from "lucide-react";

interface BookSessionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const BookSessionDialog = ({ open, setOpen }: BookSessionDialogProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedSessionType, setSelectedSessionType] = useState("");
  const [mentor, setMentor] = useState("");
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
  };
  
  const handleBooking = () => {
    // Handle booking logic
    toast({
      title: "Session Booked",
      description: "Your session has been successfully booked. You'll receive a confirmation email shortly.",
    });
    
    setOpen(false);
    setStep(1);
    setSelectedSessionType("");
    setMentor("");
  };
  
  const mentors = [
    { id: "1", name: "Taylor Smith", expertise: "Career Guidance", image: "" },
    { id: "2", name: "Jordan Lee", expertise: "Technical Interviews", image: "" },
    { id: "3", name: "Morgan Jones", expertise: "Resume Review", image: "" },
  ];

  const getSelectedSessionType = () => {
    return sessionTypes.find(type => type.id === selectedSessionType);
  };

  const getSubmissionTypeText = (submissionType?: string) => {
    switch (submissionType) {
      case "resume":
        return "You'll need to upload your resume before the session.";
      case "portfolio":
        return "You'll need to share your portfolio link before the session.";
      case "collateral":
        return "You'll need to upload your materials before the session.";
      case "link":
        return "You'll need to share relevant links before the session.";
      default:
        return "";
    }
  };

  const getSubmissionTypeIcon = (submissionType?: string) => {
    switch (submissionType) {
      case "resume":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "portfolio":
        return <ExternalLink className="h-4 w-4 text-purple-500" />;
      case "collateral":
        return <File className="h-4 w-4 text-orange-500" />;
      case "link":
        return <LinkIcon className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
          <DialogDescription>
            {step === 1 && "Select a session type to get started"}
            {step === 2 && "Choose a mentor for your session"}
            {step === 3 && "Pick an available time slot"}
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {sessionTypes.map((type) => (
                <div 
                  key={type.id}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedSessionType === type.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedSessionType(type.id)}
                >
                  <div className="font-medium">{type.name}</div>
                  <div className="text-sm text-muted-foreground">Duration: {type.duration} min</div>
                  <div className="text-sm text-muted-foreground">Price: ₹{type.price}</div>
                  {type.submissionType && type.submissionType !== "none" && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      {getSubmissionTypeIcon(type.submissionType)}
                      <span className="text-blue-600">{getSubmissionTypeText(type.submissionType)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!selectedSessionType}>Next</Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search mentors..." className="pl-8" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {mentors.map((m) => (
                <div 
                  key={m.id}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    mentor === m.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => setMentor(m.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={m.image} alt={m.name} />
                      <AvatarFallback>{m.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-sm text-muted-foreground">Expertise: {m.expertise}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>Previous</Button>
              <Button onClick={handleNext} disabled={!mentor}>Next</Button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">May 16, 2025</div>
                <div className="text-sm text-muted-foreground">3:00 PM - 3:45 PM</div>
              </div>
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">May 16, 2025</div>
                <div className="text-sm text-muted-foreground">4:00 PM - 4:45 PM</div>
              </div>
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">May 17, 2025</div>
                <div className="text-sm text-muted-foreground">10:00 AM - 10:45 AM</div>
              </div>
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">May 17, 2025</div>
                <div className="text-sm text-muted-foreground">2:00 PM - 2:45 PM</div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>Previous</Button>
              <Button onClick={handleBooking}>Book Session</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
