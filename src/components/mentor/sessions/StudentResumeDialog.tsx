
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

interface StudentResumeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  resumeUrl: string;
  studentName: string;
}

export const StudentResumeDialog = ({
  open,
  setOpen,
  resumeUrl,
  studentName
}: StudentResumeDialogProps) => {
  // Function to get filename from URL for download
  const getFilenameFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const openInNewTab = () => {
    window.open(resumeUrl, '_blank');
  };

  const isPdf = resumeUrl.toLowerCase().endsWith('.pdf');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{studentName}'s Resume</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openInNewTab}
          >
            <ExternalLink className="h-4 w-4 mr-1" /> Open in New Tab
          </Button>
          <a 
            href={resumeUrl} 
            download={getFilenameFromUrl(resumeUrl)}
            className="inline-flex"
          >
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </a>
        </div>
        <div className="w-full overflow-hidden rounded border border-gray-200" style={{ height: "60vh" }}>
          {isPdf ? (
            <iframe
              src={`${resumeUrl}#view=FitH`}
              className="w-full h-full"
              title={`${studentName}'s resume`}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <Button onClick={openInNewTab}>
                View Resume
              </Button>
              <p className="text-muted-foreground text-sm mt-2">
                This file format cannot be previewed directly. Please click to open in a new tab.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
