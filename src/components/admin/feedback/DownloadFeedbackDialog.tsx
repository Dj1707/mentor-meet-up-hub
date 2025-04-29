
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SessionType } from "@/types";

interface DownloadFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionTypes: SessionType[];
}

const DownloadFeedbackDialog = ({
  open,
  onOpenChange,
  sessionTypes,
}: DownloadFeedbackDialogProps) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>("");
  const [includeComments, setIncludeComments] = useState(true);
  const [includeRatings, setIncludeRatings] = useState(true);
  const [dateRange, setDateRange] = useState<"all" | "month" | "quarter" | "year">("month");

  const handleDownload = () => {
    // In a real implementation, this would call an API to generate and download the feedback
    toast({
      title: "Downloading feedback",
      description: `Feedback for ${sessionTypes.find(t => t.id === selectedType)?.name || "all sessions"} is being prepared for download.`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Feedback data has been downloaded successfully.",
      });
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Session Feedback</DialogTitle>
          <DialogDescription>
            Select options to download feedback for specific session types
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="session-type">Session Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Session Types</SelectItem>
                {sessionTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Select value={dateRange} onValueChange={(value: "all" | "month" | "quarter" | "year") => setDateRange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Include Data</Label>
            <div className="flex flex-col space-y-2 mt-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-ratings" 
                  checked={includeRatings} 
                  onCheckedChange={(checked) => setIncludeRatings(!!checked)} 
                />
                <Label htmlFor="include-ratings">Ratings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-comments" 
                  checked={includeComments} 
                  onCheckedChange={(checked) => setIncludeComments(!!checked)} 
                />
                <Label htmlFor="include-comments">Comments</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadFeedbackDialog;
