import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getConfidenceDisplay } from "@/utils/advancedCategorization";

interface ConfidenceIndicatorProps {
  confidence: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ConfidenceIndicator({ 
  confidence, 
  showLabel = true,
  size = "md" 
}: ConfidenceIndicatorProps) {
  const { label, textClass, bgClass } = getConfidenceDisplay(confidence);
  
  // Format confidence as percentage
  const percentage = Math.round(confidence * 100);
  
  // Determine size class
  const sizeClass = size === "sm" 
    ? "h-1.5" 
    : size === "lg" 
    ? "h-3" 
    : "h-2";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`${bgClass} ${sizeClass}`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            {showLabel && (
              <Badge 
                variant="outline" 
                className={`${bgClass} ${textClass} text-xs whitespace-nowrap`}
              >
                {label}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI Confidence: {percentage}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ConfidenceIndicator; 