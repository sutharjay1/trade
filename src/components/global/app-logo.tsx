import { cn } from "@/lib/utils";
import { H4 } from "../ui/typography";
import { geistSans } from "@/lib/font";

export const AppLogo = () => {
  return (
    <H4 className={cn(geistSans.className, "text-2xl tracking-wider")}>
      Trade
    </H4>
  );
};
