
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, FileText, FileJson } from "lucide-react";
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
  const [fileFormat, setFileFormat] = useState<"csv" | "json" | "pdf">("csv");

  const handleDownload = () => {
    // In a real implementation, this would call an API to generate and download the feedback
    const sessionTypeName = selectedType ? 
      sessionTypes.find(t => t.id === selectedType)?.name || "" : 
      "all session types";
    
    toast({
      title: "Downloading feedback",
      description: `Feedback for ${sessionTypeName} is being prepared for download in ${fileFormat.toUpperCase()} format.`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `Feedback data has been downloaded successfully as ${fileFormat.toUpperCase()}.`,
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

          <div className="space-y-2">
            <Label>File Format</Label>
            <RadioGroup 
              value={fileFormat} 
              onValueChange={(value: "csv" | "json" | "pdf") => setFileFormat(value)}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center">
                  <FileJson className="w-4 h-4 mr-1" /> JSON
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> PDF
                </Label>
              </div>
            </RadioGroup>
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
