
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Edit, FileText, Pencil, Plus, PlusCircle, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FeedbackTemplate, FeedbackQuestion } from "@/types";

const ManageFeedback = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<FeedbackTemplate[]>([
    {
      id: "1",
      name: "General Session Feedback",
      description: "Standard feedback form for all types of sessions",
      sessionTypeIds: ["1", "2", "3", "4"],
      questions: [
        {
          id: "q1-1",
          text: "How would you rate the overall quality of the session?",
          type: "rating",
          required: true
        },
        {
          id: "q1-2",
          text: "Was the mentor knowledgeable about the topic?",
          type: "rating",
          required: true
        },
        {
          id: "q1-3",
          text: "Would you recommend this mentor to others?",
          type: "rating",
          required: true
        },
        {
          id: "q1-4",
          text: "What did you like most about the session?",
          type: "text",
          required: false
        },
        {
          id: "q1-5",
          text: "What could be improved?",
          type: "text",
          required: false
        }
      ]
    },
    {
      id: "2",
      name: "Technical Interview Feedback",
      description: "Specific feedback for technical interview preparation sessions",
      sessionTypeIds: ["2"],
      questions: [
        {
          id: "q2-1",
          text: "How would you rate the technical expertise of the mentor?",
          type: "rating",
          required: true
        },
        {
          id: "q2-2",
          text: "Was the practice interview realistic?",
          type: "rating",
          required: true
        },
        {
          id: "q2-3",
          text: "How helpful was the feedback provided?",
          type: "rating",
          required: true
        },
        {
          id: "q2-4",
          text: "What specific technical areas were covered?",
          type: "multiple-choice",
          options: ["Data Structures", "Algorithms", "System Design", "Language-specific", "Database", "Other"],
          required: true
        },
        {
          id: "q2-5",
          text: "Additional comments or feedback",
          type: "text",
          required: false
        }
      ]
    },
    {
      id: "3",
      name: "Resume Review Feedback",
      description: "Feedback for resume review sessions",
      sessionTypeIds: ["3"],
      questions: [
        {
          id: "q3-1",
          text: "How helpful was the resume review?",
          type: "rating",
          required: true
        },
        {
          id: "q3-2",
          text: "Did the mentor provide actionable suggestions?",
          type: "rating",
          required: true
        },
        {
          id: "q3-3",
          text: "Which areas of your resume were improved the most?",
          type: "multiple-choice",
          options: ["Layout/Design", "Content", "Skills Section", "Experience Descriptions", "Overall Impact", "Other"],
          required: true
        },
        {
          id: "q3-4",
          text: "Additional comments about the resume review",
          type: "text",
          required: false
        }
      ]
    }
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FeedbackTemplate | null>(null);
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Template Deleted",
      description: "The feedback template has been deleted."
    });
  };
  
  const handleEditTemplate = (template: FeedbackTemplate) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };
  
  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTemplate(null);
  };
  
  const handleSaveTemplate = (template: FeedbackTemplate) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(t => t.id === template.id ? template : t));
      toast({
        title: "Template Updated",
        description: "The feedback template has been updated."
      });
    } else {
      // Create new template
      const newTemplate = {
        ...template,
        id: `template-${Date.now()}`
      };
      setTemplates([...templates, newTemplate]);
      toast({
        title: "Template Created",
        description: "The new feedback template has been created."
      });
    }
    
    handleCloseDialog();
  };
  
  return (
    <MainLayout title="Manage Feedback Forms">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Feedback Templates</CardTitle>
            <CardDescription>
              Create and manage feedback forms for different session types
            </CardDescription>
          </div>
          <Button onClick={handleCreateTemplate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Session Types</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.description}</TableCell>
                    <TableCell>{template.questions.length}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="mr-1">
                        {template.sessionTypeIds.length} types
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {templates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No templates found. Create your first feedback template.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <FeedbackFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={handleCloseDialog}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Feedback Responses</CardTitle>
          <CardDescription>
            View feedback submitted by students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
            <p>No feedback responses available yet</p>
            <p className="text-sm">Feedback will appear here once students complete their sessions</p>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

interface FeedbackFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: FeedbackTemplate | null;
  onSave: (template: FeedbackTemplate) => void;
  onCancel: () => void;
}

const FeedbackFormDialog = ({ open, onOpenChange, template, onSave, onCancel }: FeedbackFormDialogProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    sessionTypeIds: string[];
    questions: FeedbackQuestion[];
  }>({
    name: "",
    description: "",
    sessionTypeIds: [],
    questions: []
  });
  
  // Session types (in a real app, these would come from your API)
  const sessionTypes = [
    { id: "1", name: "Career Guidance" },
    { id: "2", name: "Technical Interview Prep" },
    { id: "3", name: "Resume Review" },
    { id: "4", name: "Job Search Strategy" }
  ];
  
  // Initialize form data when template changes
  React.useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        sessionTypeIds: template.sessionTypeIds,
        questions: template.questions
      });
    } else {
      setFormData({
        name: "",
        description: "",
        sessionTypeIds: [],
        questions: [
          {
            id: `q-${Date.now()}-1`,
            text: "How would you rate the session?",
            type: "rating",
            required: true
          }
        ]
      });
    }
  }, [template, open]);
  
  const handleAddQuestion = () => {
    const newQuestion: FeedbackQuestion = {
      id: `q-${Date.now()}-${formData.questions.length + 1}`,
      text: "",
      type: "text",
      required: false
    };
    
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };
  
  const handleRemoveQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== questionId)
    });
  };
  
  const handleQuestionChange = (questionId: string, field: keyof FeedbackQuestion, value: any) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
          return { ...q, [field]: value };
        }
        return q;
      })
    });
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: template?.id || `template-${Date.now()}`,
      ...formData
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Feedback Template" : "Create Feedback Template"}</DialogTitle>
          <DialogDescription>
            {template 
              ? "Update this feedback template with your changes" 
              : "Create a new feedback form for session evaluations"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Template Name</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. General Session Feedback"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Types</label>
              <div className="flex flex-wrap gap-2 border p-2 rounded-md">
                {sessionTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type.id}`}
                      checked={formData.sessionTypeIds.includes(type.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            sessionTypeIds: [...formData.sessionTypeIds, type.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            sessionTypeIds: formData.sessionTypeIds.filter(id => id !== type.id)
                          });
                        }
                      }}
                    />
                    <label htmlFor={`type-${type.id}`} className="text-sm">
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Briefly describe this feedback template's purpose"
              rows={2}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium">Questions</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion}>
                <Plus className="mr-2 h-3 w-3" />
                Add Question
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="flex flex-col space-y-2 p-4 border rounded-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <Select
                        value={question.type}
                        onValueChange={(value: "text" | "rating" | "multiple-choice") => 
                          handleQuestionChange(question.id, "type", value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Question Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Answer</SelectItem>
                          <SelectItem value="rating">Rating (1-5)</SelectItem>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`required-${question.id}`}
                          checked={question.required}
                          onCheckedChange={(checked) => 
                            handleQuestionChange(question.id, "required", !!checked)
                          }
                        />
                        <label htmlFor={`required-${question.id}`} className="text-xs">
                          Required
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveQuestion(question.id)}
                        disabled={formData.questions.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Input
                    value={question.text}
                    onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                    placeholder="Enter your question here"
                    className="w-full"
                  />
                  
                  {question.type === "multiple-choice" && (
                    <div className="space-y-2 pl-4">
                      <label className="text-xs font-medium">Options (comma separated)</label>
                      <Input
                        value={question.options?.join(", ") || ""}
                        onChange={(e) => {
                          const options = e.target.value.split(",").map(o => o.trim()).filter(Boolean);
                          handleQuestionChange(question.id, "options", options);
                        }}
                        placeholder="Option 1, Option 2, Option 3"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {template ? "Update Template" : "Create Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageFeedback;
