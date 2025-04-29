
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { MentorRate } from "@/types";

interface MentorSessionRatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorId: string;
  mentorName: string;
  initialRates?: MentorRate[];
  sessionTypes: { id: string; name: string; price: number }[];
  onSave: (rates: MentorRate[]) => void;
}

const MentorSessionRatesDialog = ({
  open,
  onOpenChange,
  mentorId,
  mentorName,
  initialRates = [],
  sessionTypes,
  onSave,
}: MentorSessionRatesDialogProps) => {
  const { toast } = useToast();
  const [rates, setRates] = useState<MentorRate[]>([]);
  const [isNewMentor] = useState(mentorId === "new");

  useEffect(() => {
    if (open) {
      // Initialize with existing rates or create default ones based on session types
      if (initialRates.length > 0) {
        setRates(initialRates);
      } else {
        setRates(
          sessionTypes.map((type) => ({
            mentorId,
            sessionTypeId: type.id,
            rate: type.price,
            isEligible: false,
          }))
        );
      }
    }
  }, [open, mentorId, initialRates, sessionTypes]);

  const handleRateChange = (sessionTypeId: string, value: number) => {
    setRates((prevRates) =>
      prevRates.map((rate) =>
        rate.sessionTypeId === sessionTypeId
          ? { ...rate, rate: value }
          : rate
      )
    );
  };

  const handleEligibilityChange = (sessionTypeId: string, isEligible: boolean) => {
    setRates((prevRates) =>
      prevRates.map((rate) =>
        rate.sessionTypeId === sessionTypeId
          ? { ...rate, isEligible }
          : rate
      )
    );
  };

  const handleSave = () => {
    onSave(rates);
    toast({
      title: isNewMentor ? "Mentor Invitation Prepared" : "Session rates updated",
      description: isNewMentor 
        ? `${mentorName} will be invited with configured session eligibility` 
        : `Updated session rates and eligibility for ${mentorName}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isNewMentor ? "Configure Session Eligibility" : "Manage Session Rates"}
          </DialogTitle>
          <DialogDescription>
            {isNewMentor 
              ? `Set which session types ${mentorName} will be eligible to offer`
              : `Set which session types ${mentorName} is eligible for and their rates`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session Type</TableHead>
                <TableHead>Eligible</TableHead>
                <TableHead>Rate (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate) => {
                const sessionType = sessionTypes.find(
                  (type) => type.id === rate.sessionTypeId
                );
                return (
                  <TableRow key={rate.sessionTypeId}>
                    <TableCell>{sessionType?.name || "Unknown Session Type"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={rate.isEligible}
                        onCheckedChange={(checked) =>
                          handleEligibilityChange(rate.sessionTypeId, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={rate.rate}
                        onChange={(e) =>
                          handleRateChange(rate.sessionTypeId, Number(e.target.value))
                        }
                        disabled={!rate.isEligible}
                        className="w-24"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isNewMentor ? "Complete & Invite" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MentorSessionRatesDialog;
