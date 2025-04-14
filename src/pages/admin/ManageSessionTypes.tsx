
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SessionType } from "@/types";

const ManageSessionTypes = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<SessionType | null>(null);
  
  // Sample session types
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([
    {
      id: "1",
      name: "Career Guidance",
      description: "Get professional advice on career paths, job opportunities, and professional development strategies.",
      duration: 45,
      price: 30,
      color: "#7c3aed"
    },
    {
      id: "2",
      name: "Technical Interview Prep",
      description: "Practice technical interview questions and receive feedback on your approach and solutions.",
      duration: 60,
      price: 40,
      color: "#0ea5e9"
    },
    {
      id: "3",
      name: "Resume Review",
      description: "Get your resume reviewed by a professional who will provide feedback and suggestions for improvement.",
      duration: 30,
      price: 25,
      color: "#f97316"
    },
    {
      id: "4",
      name: "Job Search Strategy",
      description: "Develop a personalized job search strategy tailored to your skills, experience, and career goals.",
      duration: 45,
      price: 30,
      color: "#10b981"
    }
  ]);
  
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
  }>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    color: "#7c3aed"
  });
  
  React.useEffect(() => {
    if (editingType) {
      setFormData({
        name: editingType.name,
        description: editingType.description,
        duration: editingType.duration,
        price: editingType.price,
        color: editingType.color
      });
    } else {
      setFormData({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        color: "#7c3aed"
      });
    }
  }, [editingType]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingType) {
      // Update existing type
      setSessionTypes(sessionTypes.map(type => 
        type.id === editingType.id 
          ? { ...type, ...formData } 
          : type
      ));
      toast({
        title: "Session type updated",
        description: "The session type has been updated successfully."
      });
    } else {
      // Add new type
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
    
    handleCloseDialog();
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
                  <TableCell>${type.price}</TableCell>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Session Type" : "Add Session Type"}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? "Update the details of this session type"
                : "Create a new type of mentoring session"}
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
                  placeholder="e.g. Career Guidance"
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
                  <Label htmlFor="price">Price ($)</Label>
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
