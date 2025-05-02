
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Link, File, ExternalLink } from "lucide-react";
import { SessionType, SubmissionType, SessionSubmission } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ViewSubmissionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sessionType: SessionType;
  submission?: Partial<SessionSubmission>;
  studentName: string;
}

export const ViewSubmission: React.FC<ViewSubmissionProps> = ({
  open,
  setOpen,
  sessionType,
  submission,
  studentName
}) => {
  const submissionType = sessionType.submissionType || "none";

  if (!submission || submissionType === "none") {
    return null;
  }

  const getSubmissionIcon = (type: SubmissionType) => {
    switch (type) {
      case "resume":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "portfolio":
        return <ExternalLink className="h-6 w-6 text-purple-500" />;
      case "collateral":
        return <File className="h-6 w-6 text-orange-500" />;
      case "link":
        return <Link className="h-6 w-6 text-green-500" />;
      default:
        return null;
    }
  };

  const getSubmissionTitle = (type: SubmissionType) => {
    switch (type) {
      case "resume":
        return "Resume";
      case "portfolio":
        return "Portfolio";
      case "collateral":
        return "Collateral Materials";
      case "link":
        return "Shared Link";
      default:
        return "Submission";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSubmissionIcon(submissionType)}
            <span>{studentName}'s {getSubmissionTitle(submissionType)}</span>
          </DialogTitle>
          <DialogDescription>
            Submitted for your review before the session
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {(submissionType === "resume" || submissionType === "collateral") && submission.fileUrl && (
            <div>
              <h4 className="font-medium mb-2">Uploaded File</h4>
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>Document</span>
                </div>
                <a 
                  href={submission.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <Button variant="outline" size="sm">
                    View File
                  </Button>
                </a>
              </div>
            </div>
          )}
          
          {(submissionType === "portfolio" || submissionType === "link") && submission.linkUrl && (
            <div>
              <h4 className="font-medium mb-2">Shared Link</h4>
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Link className="h-5 w-5 shrink-0 text-blue-500" />
                  <span className="truncate">{submission.linkUrl}</span>
                </div>
                <a 
                  href={submission.linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button variant="outline" size="sm">
                    Open Link <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
          )}
          
          {submission.notes && (
            <div>
              <h4 className="font-medium mb-2">Additional Notes</h4>
              <div className="p-3 border rounded-md bg-gray-50">
                <p className="whitespace-pre-wrap text-sm">{submission.notes}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-2">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
