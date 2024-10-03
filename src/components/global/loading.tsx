import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  className?: string;
};

const Loading = (props: Props) => {
  return <Loader2 className={cn("h-4 w-4 animate-spin", props.className)} />;
};

export default Loading;
