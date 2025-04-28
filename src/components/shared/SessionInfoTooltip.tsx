
import React from "react";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface SessionInfoDetail {
  student: string;
  date: string;
  count: number;
}

export interface SessionTypeInfo {
  sessionTypeName: string;
  totalCount: number;
  details: SessionInfoDetail[];
}

interface SessionInfoTooltipProps {
  sessionTypeInfo: SessionTypeInfo;
  useHoverCard?: boolean;
}

export const SessionInfoTooltip = ({ 
  sessionTypeInfo, 
  useHoverCard = false 
}: SessionInfoTooltipProps) => {
  if (useHoverCard) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="inline-flex items-center ml-1 cursor-help">
            <Info className="h-4 w-4 text-muted-foreground" />
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">{sessionTypeInfo.sessionTypeName} Sessions</h4>
            <p className="text-sm">Total: {sessionTypeInfo.totalCount} sessions</p>
            <div className="text-sm">
              <p className="font-medium mb-1">Students:</p>
              <ul className="space-y-1">
                {sessionTypeInfo.details.map((detail, index) => (
                  <li key={index}>
                    <span className="font-medium">{detail.student}</span>
                    <span className="text-muted-foreground"> - {detail.date}</span>
                    {detail.count > 1 && (
                      <span className="text-muted-foreground"> ({detail.count} sessions)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center ml-1 cursor-help">
            <Info className="h-4 w-4 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium">{sessionTypeInfo.sessionTypeName}</p>
          <p className="text-xs">Total: {sessionTypeInfo.totalCount} sessions</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
