
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Link, File, Upload, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SubmissionType, SessionType } from "@/types";

interface SessionSubmissionUploadProps {
  sessionType: SessionType;
  sessionId: string;
  onSubmit: (data: {
    submissionType: SubmissionType;
    fileUrl?: string;
    linkUrl?: string;
    notes?: string;
  }) => void;
  existingSubmission?: {
    fileUrl?: string;
    linkUrl?: string;
    notes?: string;
  };
}

export const SessionSubmissionUpload: React.FC<SessionSubmissionUploadProps> = ({
  sessionType,
  sessionId,
  onSubmit,
  existingSubmission
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState(existingSubmission?.linkUrl || "");
  const [notes, setNotes] = useState(existingSubmission?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submissionType = sessionType.submissionType || "none";

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Get upload instructions based on submission type
  const getUploadInstructions = () => {
    switch (submissionType) {
      case "resume":
        return "Upload your resume in PDF, DOC, or DOCX format for the mentor to review before your session.";
      case "portfolio":
        return "Share your portfolio link for the mentor to review before your session.";
      case "collateral":
        return "Upload any relevant materials (presentations, documents, etc.) for the mentor to review before your session.";
      case "link":
        return "Share any relevant links (GitHub, Figma, etc.) for the mentor to review before your session.";
      default:
        return "No submission required for this session type.";
    }
  };

  // Get icon based on submission type
  const getSubmissionIcon = () => {
    switch (submissionType) {
      case "resume":
        return <FileText className="h-10 w-10 text-blue-500" />;
      case "portfolio":
        return <ExternalLink className="h-10 w-10 text-purple-500" />;
      case "collateral":
        return <File className="h-10 w-10 text-orange-500" />;
      case "link":
        return <Link className="h-10 w-10 text-green-500" />;
      default:
        return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For file types, we would typically upload the file to a server/storage here
      // This is a simplified version that simulates the upload
      let fileUrl = existingSubmission?.fileUrl || "";
      
      if (file) {
        // In a real implementation, upload the file to server/storage
        // and get back a URL
        fileUrl = URL.createObjectURL(file);
        
        // This is just for demo purposes - in real app, you'd upload to server
        console.log("Uploaded file:", file.name);
      }

      // Submit the data
      onSubmit({
        submissionType,
        fileUrl: (submissionType === "resume" || submissionType === "collateral") ? fileUrl : undefined,
        linkUrl: (submissionType === "portfolio" || submissionType === "link") ? linkUrl : undefined,
        notes,
      });

      toast({
        title: "Submission successful",
        description: "Your submission has been saved and will be available to the mentor.",
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your materials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionType === "none") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getSubmissionIcon()}
          <span>Session Submission</span>
        </CardTitle>
        <CardDescription>
          {getUploadInstructions()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(submissionType === "resume" || submissionType === "collateral") && (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload {submissionType === "resume" ? "Resume" : "Materials"}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  {file ? file.name : `Drag and drop your ${submissionType === "resume" ? "resume" : "files"}, or click to select`}
                </p>
                <Input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept={submissionType === "resume" ? ".pdf,.doc,.docx" : ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Select File
                </Button>
              </div>
              {existingSubmission?.fileUrl && !file && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>Existing file uploaded</span>
                </div>
              )}
            </div>
          )}
          
          {(submissionType === "portfolio" || submissionType === "link") && (
            <div className="space-y-2">
              <Label htmlFor="link-url">{submissionType === "portfolio" ? "Portfolio URL" : "Resource URL"}</Label>
              <div className="flex space-x-2">
                <span className="flex items-center px-3 bg-gray-100 border border-gray-300 rounded-l-md">
                  <Link className="h-4 w-4 text-gray-500" />
                </span>
                <Input
                  id="link-url"
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://"
                  className="rounded-l-none flex-1"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or context for the mentor..."
              className="min-h-[100px]"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || (
            (submissionType === "resume" || submissionType === "collateral") && 
            !file && 
            !existingSubmission?.fileUrl
          )}
        >
          {existingSubmission ? "Update Submission" : "Submit"} 
        </Button>
      </CardFooter>
    </Card>
  );
};
