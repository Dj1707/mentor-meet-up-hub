import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus, FileText, FileSpreadsheet, File, Link, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SessionType, SessionTypeResource, SubmissionType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sessionTypes as initialSessionTypes } from "@/data/sessionTypes";

const ManageSessionTypes = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<SessionType | null>(null);
  
  // Use the centralized session types as initial data
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>(initialSessionTypes);
  
  const handleOpenDialog = (sessionType?: SessionType) => {
    if (sessionType) {
      setEditingType(sessionType);
    } else {
      setEditingType(null);
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingType(null);
  };
  
  const handleDeleteType = (id: string) => {
    setSessionTypes(sessionTypes.filter(type => type.id !== id));
    toast({
      title: "Session type deleted",
      description: "The session type has been removed."
    });
  };
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    duration: number;
    price: number;
    color: string;
    submissionType: SubmissionType;
    resources: SessionTypeResource[];
  }>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    color: "#7c3aed",
    submissionType: "none",
    resources: []
  });

  React.useEffect(() => {
    if (editingType) {
      setFormData({
        name: editingType.name,
        description: editingType.description,
        duration: editingType.duration,
        price: editingType.price,
        color: editingType.color,
        submissionType: editingType.submissionType || "none",
        resources: editingType.resources || []
      });
    } else {
      setFormData({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        color: "#7c3aed",
        submissionType: "none",
        resources: []
      });
    }
  }, [editingType]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddResource = () => {
    const newResource: SessionTypeResource = {
      id: `resource-${Date.now()}`,
      name: "",
      url: "",
      type: "pdf"
    };
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }));
  };

  const handleResourceChange = (index: number, field: keyof SessionTypeResource, value: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const handleRemoveResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingType) {
      setSessionTypes(sessionTypes.map(type => 
        type.id === editingType.id 
          ? { ...type, ...formData } 
          : type
      ));
      toast({
        title: "Session type updated",
        description: "The session type and its resources have been updated successfully."
      });
    } else {
      const newType: SessionType = {
        id: `type-${Date.now()}`,
        ...formData
      };
      setSessionTypes([...sessionTypes, newType]);
      toast({
        title: "Session type created",
        description: "The new session type has been created successfully."
      });
    }
    
    // In a real application, we would update our centralized data source here
    // For example: updateCentralSessionTypes(sessionTypes);
    
    handleCloseDialog();
  };

  const getResourceIcon = (type: 'pdf' | 'csv' | 'spreadsheet') => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'csv':
        return <File className="h-4 w-4" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4" />;
    }
  };

  const getSubmissionTypeLabel = (type?: SubmissionType) => {
    switch (type) {
      case 'resume':
        return <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Resume</span>;
      case 'portfolio':
        return <span className="flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Portfolio</span>;
      case 'collateral':
        return <span className="flex items-center gap-1"><File className="h-3 w-3" /> Collateral</span>;
      case 'link':
        return <span className="flex items-center gap-1"><Link className="h-3 w-3" /> Link</span>;
      case 'none':
      default:
        return <span>None</span>;
    }
  };
  
  return (
    <MainLayout title="Manage Session Types">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session Types</CardTitle>
          <CardDescription>
            Create and manage different types of mentoring sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Session Type
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Submission Type</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell className="max-w-md truncate">{type.description}</TableCell>
                  <TableCell>{type.duration} min</TableCell>
                  <TableCell>₹{type.price}</TableCell>
                  <TableCell>
                    {getSubmissionTypeLabel(type.submissionType)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {type.resources?.map(resource => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          {getResourceIcon(resource.type)}
                          <span className="sr-only">{resource.name}</span>
                        </a>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className="w-6 h-6 rounded-full mr-2"
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <span>{type.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenDialog(type)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteType(type.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Session Type" : "Add Session Type"}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? "Update the details and resources of this session type"
                : "Create a new type of mentoring session with resources"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Resume Review 1:1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this session type offers"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="5"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.color}
                    onChange={handleChange}
                    name="color"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="submissionType">Submission Type</Label>
                <Select
                  value={formData.submissionType}
                  onValueChange={(value) => handleSelectChange("submissionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select submission type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="resume">Resume</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                    <SelectItem value="collateral">Collateral</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.submissionType === "resume" && "Students can upload their resume before the session"}
                  {formData.submissionType === "portfolio" && "Students can share their portfolio link before the session"}
                  {formData.submissionType === "collateral" && "Students can upload collateral materials before the session"}
                  {formData.submissionType === "link" && "Students can share relevant links before the session"}
                  {formData.submissionType === "none" && "No pre-session submission required from students"}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Resource Kits</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddResource}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Resource
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.resources.map((resource, index) => (
                    <div key={resource.id} className="flex gap-2">
                      <Input
                        placeholder="Resource name"
                        value={resource.name}
                        onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="URL"
                        value={resource.url}
                        onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                        className="flex-1"
                      />
                      <select
                        value={resource.type}
                        onChange={(e) => handleResourceChange(index, 'type', e.target.value as 'pdf' | 'csv' | 'spreadsheet')}
                        className="px-2 py-1 border rounded-md"
                      >
                        <option value="pdf">PDF</option>
                        <option value="csv">CSV</option>
                        <option value="spreadsheet">Spreadsheet</option>
                      </select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveResource(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingType ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ManageSessionTypes;
