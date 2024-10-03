import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
}

const Hint = ({
  label,
  children,
  side = "right",
  align = "center",
  sideOffset = 10,
  alignOffset = 10,
}: HintProps) => {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="border-zinc-400/80 dark:border-zinc-300/40 bg-background text-zinc-800  dark:text-zinc-300"
        alignOffset={alignOffset}
      >
        <p className="font-normal capitalize">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default Hint;
