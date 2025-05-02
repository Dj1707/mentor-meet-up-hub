
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { sessionTypes } from "@/data/sessionTypes";

interface AddAvailabilityDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const AddAvailabilityDialog = ({ open, setOpen }: AddAvailabilityDialogProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedSessionTypes, setSelectedSessionTypes] = useState<string[]>([]);
  const [recurringSchedule, setRecurringSchedule] = useState("none");
  
  const toggleSessionType = (id: string) => {
    setSelectedSessionTypes(prev => 
      prev.includes(id) 
        ? prev.filter(type => type !== id) 
        : [...prev, id]
    );
  };
  
  const handleSave = () => {
    if (!selectedDate || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Availability Added",
      description: `Your availability for ${selectedDate} has been added successfully.`
    });
    
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
    setSelectedSessionTypes([]);
    setRecurringSchedule("none");
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Available Time Slots</DialogTitle>
          <DialogDescription>
            Create time slots when you're available to mentor students
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input 
              id="date" 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time *</Label>
              <Input 
                id="start-time" 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time *</Label>
              <Input 
                id="end-time" 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Session Types *</Label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {sessionTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <input 
                    id={`type-${type.id}`} 
                    type="checkbox" 
                    className="h-4 w-4"
                    checked={selectedSessionTypes.includes(type.id)}
                    onChange={() => toggleSessionType(type.id)}
                  />
                  <Label htmlFor={`type-${type.id}`} className="text-sm cursor-pointer">
                    {type.name} ({type.duration} min)
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Recurring Schedule</Label>
            <Select value={recurringSchedule} onValueChange={setRecurringSchedule}>
              <SelectTrigger>
                <SelectValue placeholder="None (one-time only)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (one-time only)</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
